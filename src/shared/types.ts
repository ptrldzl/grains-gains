import z from "zod";
export const DishSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  calories: z.string().nullable(),     // Should be string
  protein: z.string().nullable(),    // Should be string
  carbs: z.string().nullable(),      // Should be string
  fats: z.string().nullable(),       // Should be string
  price: z.number(),
  category: z.string().nullable(),   // You added this, which is correct
  is_vegetarian: z.boolean(),
  is_high_protein: z.boolean(), // <-- ADD THIS
  is_low_calorie: z.boolean(),  // <-- ADD THIS
  image_url: z.string().nullable(),
  available: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const KioskLocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  campus: z.string(),
  address: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CloudKitchenSchema = z.object({
  id: z.number(),
  name: z.string(),
  city: z.string(),
  address: z.string().nullable(),
  delivery_radius: z.number().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const OrderSchema = z.object({
  id: z.number(),
  user_email: z.string(),
  user_phone: z.string().nullable(),
  order_type: z.enum(['kiosk', 'delivery']),
  location_id: z.number().nullable(),
  total_amount: z.number(),
  payment_method: z.string().nullable(),
  payment_status: z.string(),
  order_status: z.string(),
  pickup_time: z.string().nullable(),
  delivery_address: z.string().nullable(),
  qr_code: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const OrderItemSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  dish_id: z.number(),
  quantity: z.number(),
  price: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Dish = z.infer<typeof DishSchema>;
export type KioskLocation = z.infer<typeof KioskLocationSchema>;
export type CloudKitchen = z.infer<typeof CloudKitchenSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;

// Filter types for menu
export type DishFilter = {
  isVegetarian?: boolean;
};

// Form schemas
export const ScheduleOrderSchema = z.object({
  user_email: z.string().email(),
  user_phone: z.string().optional(),
  kiosk_id: z.number(),
  pickup_time: z.string(),
  dish_ids: z.array(z.number()),
  payment_method: z.enum(['upi', 'netbanking']),
});

export const DeliveryOrderSchema = z.object({
  user_email: z.string().email(),
  user_phone: z.string().optional(),
  cloud_kitchen_id: z.number(),
  delivery_address: z.string(),
  dish_ids: z.array(z.number()),
  payment_method: z.enum(['upi', 'netbanking']),
});

export type ScheduleOrderForm = z.infer<typeof ScheduleOrderSchema>;
export type DeliveryOrderForm = z.infer<typeof DeliveryOrderSchema>;

// Nutrition Assistant types
export const UserProfileSchema = z.object({
  age: z.number().min(13).max(100),
  weight: z.number().min(30).max(300),
  height: z.number().min(120).max(250),
  gender: z.enum(['male', 'female']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  goal: z.enum(['weight_loss', 'maintenance', 'weight_gain', 'muscle_gain']),
  dietaryRestrictions: z.array(z.string()).optional(),
  healthConditions: z.string().optional(),
});

export const NutritionPlanSchema = z.object({
  dailyCalories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
  recommendations: z.array(z.string()),
  mealPlan: z.object({
    breakfast: z.array(z.string()),
    lunch: z.array(z.string()),
    dinner: z.array(z.string()),
    snacks: z.array(z.string()),
  }),
  suggestedDishes: z.array(DishSchema),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type NutritionPlan = z.infer<typeof NutritionPlanSchema>;
