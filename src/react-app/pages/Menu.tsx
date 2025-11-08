import { useState, useEffect } from 'react';
import { Filter, Search, Leaf } from 'lucide-react';
import DishCard from '@/react-app/components/DishCard';
import FilterPanel from '@/react-app/components/FilterPanel';
import type { Dish, DishFilter } from '@/shared/types';

// Hard-coded dish data as requested
const allDishes: Dish[] = [
  {
    id: 1,
    name: "Mango Lassi Protein Shake (Seasonal)",
    description: "Authentic Lassi blended with fresh mango pulp, high-protein yogurt/curd (minimal sugar).",
    calories: "250-290 kcal",
    protein: "15-18g",
    carbs: "40-45g",
    fats: "5-7g",
    price: 80,
    category: null,
    is_vegetarian: true,
    is_high_protein: false,
    is_low_calorie: false,
    image_url: "https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/mango_lassi_protein_shake.png",
    available: true,
    created_at: "2025-09-30 10:32:04",
    updated_at: "2025-09-30 10:32:04"
  },
  {
    id: 14,
    name: "Paneer Stuffed Omelette",
    description: "2 Whole Eggs + 1 Egg White stuffed with seasoned, shredded Paneer and herbs.",
    calories: "290-330 kcal",
    protein: "25-28g",
    carbs: "20-25g",
    fats: "10-12g",
    price: 60,
    category: null,
    is_vegetarian: true,
    is_high_protein: true,
    is_low_calorie: true,
    image_url: "https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/paneer_stuffed_omelette.png",
    available: true,
    created_at: "2025-10-02 22:09:03",
    updated_at: "2025-10-02 22:09:03"
  },
  {
    id: 15,
    name: "Tandoori Paneer Quinoa Bowl",
    description: "Grilled Paneer in Tandoori spices, served on Quinoa with roasted veggies.",
    calories: "390-430 kcal",
    protein: "25-28g",
    carbs: "35-40g",
    fats: "10-12g",
    price: 120,
    category: null,
    is_vegetarian: true,
    is_high_protein: true,
    is_low_calorie: true,
    image_url: "https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/tandoori_paneer_quinoa_bowl.png",
    available: true,
    created_at: "2025-10-02 22:15:06",
    updated_at: "2025-10-02 22:15:06"
  },
  {
    id: 16,
    name: "Paneer Tikka Whole Wheat Wrap",
    description: "Paneer Tikka pieces, mint chutney, and raw veggies, all rolled in a whole wheat wrap.",
    calories: "330-370 kcal",
    protein: "26-31g",
    carbs: "30-35g",
    fats: "10-12g",
    price: 100,
    category: null,
    is_vegetarian: true,
    is_high_protein: true,
    is_low_calorie: true,
    image_url: "https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/paneer_tikka_wrap.png",
    available: true,
    created_at: "2025-10-02 22:18:24",
    updated_at: "2025-10-02 22:18:24"
  },
  {
    id: 17,
    name: "Crispy Chili Paneer Bites",
    description: "Small, air-fried Paneer cubes tossed in a dry, zesty chilli and capsicum seasoning.",
    calories: "230-270 kcal",
    protein: "16-20g",
    carbs: "10-14g",
    fats: "12-15g",
    price: 90,
    category: null,
    is_vegetarian: true,
    is_high_protein: false,
    is_low_calorie: true,
    image_url: "https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/crispy_chili_paneer_bites.png",
    available: true,
    created_at: "2025-10-02 22:21:28",
    updated_at: "2025-10-02 22:21:28"
  },
  {
    id: 18,
    name: "Mini Tandoori Paneer and Veggie Whole Wheat Pizza",
    description: "Mini whole wheat crust topped with Tandoori spices, bell peppers, and a touch of cheese.",
    calories: "300-340 kcal",
    protein: "15-18g",
    carbs: "40-45g",
    fats: "8-10g",
    price: 140,
    category: null,
    is_vegetarian: true,
    is_high_protein: false,
    is_low_calorie: true,
    image_url: "https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/mini_tandoori_pizza.png",
    available: true,
    created_at: "2025-10-02 22:27:47",
    updated_at: "2025-10-02 22:27:47"
  },
  {
    id: 19,
    name: "Peanut Butter Banana Power Shake",
    description: "Creamy shake with banana, milk, and high-protein peanut butter. (Add ₹30 for 1/2 scoop whey)",
    calories: "290-330 kcal",
    protein: "20-25g",
    carbs: "35-40g",
    fats: "8-10g",
    price: 80,
    category: null,
    is_vegetarian: true,
    is_high_protein: true,
    is_low_calorie: true,
    image_url: "https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/peanut_butter_banana_power_shake.png",
    available: true,
    created_at: "2025-10-02 22:34:59",
    updated_at: "2025-10-02 22:34:59"
  },
  {
    id: 20,
    name: "Chicken Stuffed Omelette",
    description: "2 Whole Eggs + 1 Egg White stuffed with seasoned, shredded Chicken and a touch of cheese.",
    calories: "290-330 kcal",
    protein: "32-35g",
    carbs: "20-25g",
    fats: "8-10g",
    price: 80,
    category: null,
    is_vegetarian: false,
    is_high_protein: true,
    is_low_calorie: true,
    image_url: "https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/chicken_stuffed_omelette.png",
    available: true,
    created_at: "2025-10-02 22:36:54",
    updated_at: "2025-10-02 22:36:54"
  },
  {
    id: 21,
    name: "Chicken Tikka Whole Wheat Wrap",
    description: "Succulent Chicken Tikka pieces, mint chutney, and raw veggies, all rolled in a whole wheat wrap.",
    calories: "330-370 kcal",
    protein: "25-30g",
    carbs: "30-35g",
    fats: "10-12g",
    price: 130,
    category: null,
    is_vegetarian: false,
    is_high_protein: true,
    is_low_calorie: true,
    image_url: "https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/chicken_tikka_wrap.png",
    available: true,
    created_at: "2025-10-02 22:40:04",
    updated_at: "2025-10-02 22:40:04"
  },
  {
    id: 22,
    name: "Tandoori Chicken Quinoa Bowl",
    description: "Grilled Chicken in Tandoori spices, served on Quinoa with roasted veggies.",
    calories: "390-430 kcal",
    protein: "32-37g",
    carbs: "35-40g",
    fats: "10-12g",
    price: 150,
    category: null,
    is_vegetarian: false,
    is_high_protein: true,
    is_low_calorie: true,
    image_url: "https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/tandoori_chicken_quinoa_bowl.png",
    available: true,
    created_at: "2025-10-02 22:44:13",
    updated_at: "2025-10-02 22:44:13"
  },
  {
    id: 23,
    name: "Crispy Chicken Chilli Bites (Air-Fried)",
    description: "Small, air-fried Chicken cubes tossed in a dry, zesty chilli and capsicum seasoning.",
    calories: "230-270 kcal",
    protein: "16-20g",
    carbs: "10-14g",
    fats: "10-12g",
    price: 120,
    category: null,
    is_vegetarian: false,
    is_high_protein: false,
    is_low_calorie: true,
    image_url: "https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/crispy_chicken_chilli_bites.png",
    available: true,
    created_at: "2025-10-02 22:46:06",
    updated_at: "2025-10-02 22:46:06"
  }
];


export default function Menu() {
  const [dishes] = useState<Dish[]>(allDishes); // Removed unused setDishes
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DishFilter>({});

  useEffect(() => {
    applyFilters();
  }, [dishes, searchTerm, filters]);

  const applyFilters = () => {
    let filtered = dishes;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(dish =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.isVegetarian !== undefined) {
      filtered = filtered.filter(dish => {
        const dishIsVeg = Boolean(dish.is_vegetarian);
        return dishIsVeg === filters.isVegetarian;
      });
    }

    setFilteredDishes(filtered);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-green-600">Menu</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our range of nutritious, protein-rich meals crafted specifically for students and young professionals.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          )}
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilters({ isVegetarian: true })}
            className="flex items-center px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full transition-colors"
          >
            <Leaf className="h-4 w-4 mr-1" />
            Vegetarian
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDishes.length} of {dishes.length} dishes
          </p>
        </div>

        {/* Dishes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No dishes found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}