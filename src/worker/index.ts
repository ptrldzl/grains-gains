import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import OpenAI from "openai";
import { 
  ScheduleOrderSchema,
  DeliveryOrderSchema,
  UserProfileSchema,
  type UserProfile
} from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for all routes
app.use("*", cors());

// Dishes API
app.get("/api/dishes", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare("SELECT * FROM dishes WHERE available = 1").all();
    
    // Convert SQLite integer booleans to JavaScript booleans
    const dishes = (result.results || []).map((dish: any) => ({
      ...dish,
      is_vegetarian: Boolean(dish.is_vegetarian),
      available: Boolean(dish.available)
    }));
    
    return c.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return c.json({ error: "Failed to fetch dishes" }, 500);
  }
});

// Kiosk locations API
app.get("/api/kiosks", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare("SELECT * FROM kiosk_locations WHERE is_active = 1").all();
    return c.json(result.results || []);
  } catch (error) {
    console.error("Error fetching kiosks:", error);
    return c.json({ error: "Failed to fetch kiosks" }, 500);
  }
});

// Cloud kitchens API
app.get("/api/cloud-kitchens", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare("SELECT * FROM cloud_kitchens WHERE is_active = 1").all();
    return c.json(result.results || []);
  } catch (error) {
    console.error("Error fetching cloud kitchens:", error);
    return c.json({ error: "Failed to fetch cloud kitchens" }, 500);
  }
});

// Schedule order (kiosk pickup)
app.post("/api/orders/schedule", zValidator("json", ScheduleOrderSchema), async (c) => {
  try {
    const db = c.env.DB;
    const data = c.req.valid("json");
    
    // Calculate total amount based on selected dishes
    const dishesQuery = await db.prepare(
      `SELECT SUM(price) as total FROM dishes WHERE id IN (${data.dish_ids.map(() => '?').join(',')})`
    ).bind(...data.dish_ids).first();
    
    const totalAmount = dishesQuery?.total || 0;
    
    // Generate QR code (in real app, this would be more sophisticated)
    const qrCode = `PICKUP${Date.now().toString().slice(-6)}`;
    
    // Insert order
    const orderResult = await db.prepare(`
      INSERT INTO orders (
        user_email, user_phone, order_type, location_id, total_amount, 
        payment_method, pickup_time, qr_code, created_at, updated_at
      ) VALUES (?, ?, 'kiosk', ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      data.user_email,
      data.user_phone || null,
      data.kiosk_id,
      totalAmount,
      data.payment_method,
      data.pickup_time,
      qrCode
    ).run();
    
    const orderId = orderResult.meta.last_row_id;
    
    // Insert order items
    for (const dishId of data.dish_ids) {
      const dish = await db.prepare("SELECT price FROM dishes WHERE id = ?").bind(dishId).first();
      if (dish) {
        await db.prepare(`
          INSERT INTO order_items (order_id, dish_id, quantity, price, created_at, updated_at)
          VALUES (?, ?, 1, ?, datetime('now'), datetime('now'))
        `).bind(orderId, dishId, dish.price).run();
      }
    }
    
    return c.json({ 
      success: true, 
      order_id: orderId,
      qr_code: qrCode,
      total_amount: totalAmount
    });
  } catch (error) {
    console.error("Error creating schedule order:", error);
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Delivery order
app.post("/api/orders/delivery", zValidator("json", DeliveryOrderSchema), async (c) => {
  try {
    const db = c.env.DB;
    const data = c.req.valid("json");
    
    // Calculate total amount based on selected dishes
    const dishesQuery = await db.prepare(
      `SELECT SUM(price) as total FROM dishes WHERE id IN (${data.dish_ids.map(() => '?').join(',')})`
    ).bind(...data.dish_ids).first();
    
    const totalAmount = Number(dishesQuery?.total) || 0;
    const deliveryFee = totalAmount > 500 ? 0 : 50;
    const finalTotal = totalAmount + deliveryFee;
    
    // Insert order
    const orderResult = await db.prepare(`
      INSERT INTO orders (
        user_email, user_phone, order_type, location_id, total_amount, 
        payment_method, delivery_address, created_at, updated_at
      ) VALUES (?, ?, 'delivery', ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      data.user_email,
      data.user_phone || null,
      data.cloud_kitchen_id,
      finalTotal,
      data.payment_method,
      data.delivery_address
    ).run();
    
    const orderId = orderResult.meta.last_row_id;
    
    // Insert order items
    for (const dishId of data.dish_ids) {
      const dish = await db.prepare("SELECT price FROM dishes WHERE id = ?").bind(dishId).first();
      if (dish) {
        await db.prepare(`
          INSERT INTO order_items (order_id, dish_id, quantity, price, created_at, updated_at)
          VALUES (?, ?, 1, ?, datetime('now'), datetime('now'))
        `).bind(orderId, dishId, dish.price).run();
      }
    }
    
    return c.json({ 
      success: true, 
      order_id: orderId,
      total_amount: finalTotal,
      delivery_fee: deliveryFee
    });
  } catch (error) {
    console.error("Error creating delivery order:", error);
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Get order details
app.get("/api/orders/:id", async (c) => {
  try {
    const db = c.env.DB;
    const orderId = c.req.param("id");
    
    const order = await db.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    const items = await db.prepare(`
      SELECT oi.*, d.name, d.image_url 
      FROM order_items oi 
      JOIN dishes d ON oi.dish_id = d.id 
      WHERE oi.order_id = ?
    `).bind(orderId).all();
    
    return c.json({
      ...order,
      items: items.results || []
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return c.json({ error: "Failed to fetch order" }, 500);
  }
});

// Nutrition Assistant API
app.post("/api/nutrition/generate-plan", zValidator("json", UserProfileSchema), async (c) => {
  try {
    if (!c.env.OPENAI_API_KEY) {
      return c.json({ error: "OpenAI API key not configured" }, 500);
    }

    const openai = new OpenAI({
      apiKey: c.env.OPENAI_API_KEY,
    });

    const profile: UserProfile = c.req.valid("json");
    const db = c.env.DB;

    // Get available dishes from database
    const dishesResult = await db.prepare("SELECT * FROM dishes WHERE available = 1").all();
    const availableDishes = (dishesResult.results || []).map((dish: any) => {
      // Normalize protein values - handle both string and numeric formats
      let proteinValue = 0;
      if (typeof dish.protein === 'string') {
        // Extract numeric value from strings like "15-18g" or "35g"
        const match = dish.protein.match(/(\d+)/);
        proteinValue = match ? parseInt(match[1]) : 0;
      } else if (typeof dish.protein === 'number') {
        proteinValue = dish.protein;
      }

      // Normalize calories - handle string formats like "250-290 kcal"
      let caloriesValue = 0;
      if (typeof dish.calories === 'string') {
        const match = dish.calories.match(/(\d+)/);
        caloriesValue = match ? parseInt(match[1]) : 0;
      } else if (typeof dish.calories === 'number') {
        caloriesValue = dish.calories;
      }

      // Normalize carbs - handle string formats like "40-45g"
      let carbsValue = 0;
      if (typeof dish.carbs === 'string') {
        const match = dish.carbs.match(/(\d+)/);
        carbsValue = match ? parseFloat(match[1]) : 0;
      } else if (typeof dish.carbs === 'number') {
        carbsValue = dish.carbs;
      }

      // Normalize fats - handle string formats like "5-7g"
      let fatsValue = 0;
      if (typeof dish.fats === 'string') {
        const match = dish.fats.match(/(\d+)/);
        fatsValue = match ? parseFloat(match[1]) : 0;
      } else if (typeof dish.fats === 'number') {
        fatsValue = dish.fats;
      }

      return {
        ...dish,
        protein: proteinValue,
        calories: caloriesValue,
        carbs: carbsValue,
        fats: fatsValue,
        is_vegetarian: Boolean(dish.is_vegetarian),
        available: Boolean(dish.available)
      };
    });

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    let tdee = bmr * activityMultipliers[profile.activityLevel];

    // Adjust based on goal
    let dailyCalories: number;
    switch (profile.goal) {
      case 'weight_loss':
        dailyCalories = Math.round(tdee - 500); // 500 calorie deficit
        break;
      case 'weight_gain':
        dailyCalories = Math.round(tdee + 500); // 500 calorie surplus
        break;
      case 'muscle_gain':
        dailyCalories = Math.round(tdee + 300); // 300 calorie surplus
        break;
      default:
        dailyCalories = Math.round(tdee);
    }

    // Calculate macros
    let proteinMultiplier: number;
    switch (profile.goal) {
      case 'muscle_gain':
        proteinMultiplier = 2.2; // 2.2g per kg body weight
        break;
      case 'weight_loss':
        proteinMultiplier = 2.0; // Higher protein for muscle preservation
        break;
      default:
        proteinMultiplier = 1.6; // General recommendation
    }

    const protein = Math.round(profile.weight * proteinMultiplier);
    const proteinCalories = protein * 4;
    const fatsCalories = dailyCalories * 0.25; // 25% of calories from fat
    const fats = Math.round(fatsCalories / 9);
    const carbsCalories = dailyCalories - proteinCalories - fatsCalories;
    const carbs = Math.round(carbsCalories / 4);

    // Create AI prompt for personalized recommendations
    const dietaryInfo = profile.dietaryRestrictions?.length 
      ? `Dietary restrictions: ${profile.dietaryRestrictions.join(', ')}` 
      : 'No dietary restrictions';
    
    const healthInfo = profile.healthConditions 
      ? `Health considerations: ${profile.healthConditions}` 
      : 'No specific health conditions mentioned';

    const prompt = `Create personalized nutrition recommendations for a ${profile.age}-year-old ${profile.gender} who is ${profile.height}cm tall, weighs ${profile.weight}kg, has ${profile.activityLevel} activity level, and wants ${profile.goal.replace('_', ' ')}. 

${dietaryInfo}
${healthInfo}

Their calculated daily nutrition targets are:
- Calories: ${dailyCalories}
- Protein: ${protein}g (TARGET FOR STUDENT/PROFESSIONAL)
- Carbs: ${carbs}g  
- Fats: ${fats}g

Provide exactly 4 key nutrition insights/recommendations as an array of strings. Focus on practical advice for students and young professionals. Include emphasis on their protein target being crucial for their goals.

Then create a sample daily meal plan with specific meal ideas (not from any menu, just general meal types) organized into breakfast, lunch, dinner, and snacks arrays.

Format as JSON with this structure:
{
  "recommendations": ["insight1", "insight2", "insight3", "insight4"],
  "mealPlan": {
    "breakfast": ["meal1", "meal2"],
    "lunch": ["meal1", "meal2"], 
    "dinner": ["meal1", "meal2"],
    "snacks": ["snack1", "snack2"]
  }
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a nutrition expert helping students and young professionals. Provide practical, science-based advice focused on their busy lifestyle and budget constraints. Always format responses as valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');

    // Filter dishes based on dietary restrictions and recommend high-protein options
    let suggestedDishes = availableDishes;

    // Apply dietary filters
    if (profile.dietaryRestrictions?.includes('Vegetarian')) {
      suggestedDishes = suggestedDishes.filter((dish: any) => dish.is_vegetarian);
    }

    // Prioritize high-protein dishes for muscle gain and weight loss goals
    if (profile.goal === 'muscle_gain' || profile.goal === 'weight_loss') {
      suggestedDishes = suggestedDishes
        .filter((dish: any) => dish.protein && dish.protein >= 15)
        .sort((a: any, b: any) => (b.protein || 0) - (a.protein || 0));
    }

    // Limit to 6 suggestions
    suggestedDishes = suggestedDishes.slice(0, 6);

    const nutritionPlan = {
      dailyCalories,
      protein,
      carbs,
      fats,
      recommendations: aiResponse.recommendations || [
        `Your target of ${protein}g protein daily is crucial for your ${profile.goal.replace('_', ' ')} goal`,
        "Distribute protein evenly across meals for optimal absorption",
        "Stay hydrated and aim for 8-10 glasses of water daily",
        "Consider meal prep on weekends to stay consistent with your nutrition goals"
      ],
      mealPlan: aiResponse.mealPlan || {
        breakfast: ["Greek yogurt with berries", "Oatmeal with protein powder"],
        lunch: ["Grilled chicken salad", "Quinoa power bowl"],
        dinner: ["Lean protein with vegetables", "Fish with brown rice"],
        snacks: ["Mixed nuts", "Protein smoothie"]
      },
      suggestedDishes
    };

    return c.json(nutritionPlan);
  } catch (error) {
    console.error("Error generating nutrition plan:", error);
    
    // Return a fallback response with basic calculations even if OpenAI fails
    const db = c.env.DB;
    const profile: UserProfile = c.req.valid("json");

    // Basic BMR calculation
    let bmr: number;
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    let tdee = bmr * activityMultipliers[profile.activityLevel];
    let dailyCalories = Math.round(tdee);

    switch (profile.goal) {
      case 'weight_loss':
        dailyCalories = Math.round(tdee - 500);
        break;
      case 'weight_gain':
      case 'muscle_gain':
        dailyCalories = Math.round(tdee + 300);
        break;
    }

    const protein = Math.round(profile.weight * 2.0);
    const fats = Math.round(dailyCalories * 0.25 / 9);
    const carbs = Math.round((dailyCalories - (protein * 4) - (fats * 9)) / 4);

    // Get dishes from database as fallback
    const dishesResult = await db.prepare("SELECT * FROM dishes WHERE available = 1 LIMIT 6").all();
    const fallbackDishes = (dishesResult.results || []).map((dish: any) => ({
      ...dish,
      protein: typeof dish.protein === 'string' ? parseInt(dish.protein.match(/(\d+)/)?.[1] || '0') : dish.protein || 0,
      calories: typeof dish.calories === 'string' ? parseInt(dish.calories.match(/(\d+)/)?.[1] || '0') : dish.calories || 0,
      carbs: typeof dish.carbs === 'string' ? parseFloat(dish.carbs.match(/(\d+)/)?.[1] || '0') : dish.carbs || 0,
      fats: typeof dish.fats === 'string' ? parseFloat(dish.fats.match(/(\d+)/)?.[1] || '0') : dish.fats || 0,
      is_vegetarian: Boolean(dish.is_vegetarian),
      available: Boolean(dish.available)
    }));

    const fallbackPlan = {
      dailyCalories,
      protein,
      carbs,
      fats,
      recommendations: [
        `Your target of ${protein}g protein daily is crucial for your ${profile.goal.replace('_', ' ')} goal`,
        "Distribute protein evenly across meals for optimal absorption and muscle synthesis",
        "Stay hydrated with 8-10 glasses of water daily to support your metabolism",
        "Consider meal prep on weekends to stay consistent with your nutrition goals"
      ],
      mealPlan: {
        breakfast: ["High-protein oats with Greek yogurt", "Protein smoothie with fruits"],
        lunch: ["Grilled chicken with quinoa", "Protein-rich salad bowl"],
        dinner: ["Lean protein with vegetables", "Fish with complex carbs"],
        snacks: ["Mixed nuts and seeds", "Protein shake", "Greek yogurt"]
      },
      suggestedDishes: fallbackDishes
    };

    return c.json(fallbackPlan);
  }
});

export default app;
