import { Leaf, Plus } from 'lucide-react';
import type { Dish } from '@/shared/types';

interface DishCardProps {
  dish: Dish;
  onAddToCart?: (dish: Dish) => void;
}

export default function DishCard({ dish, onAddToCart }: DishCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {dish.image_url ? (
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            crossOrigin="anonymous"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&q=80";
            }}
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&q=80"
            alt={dish.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {dish.is_vegetarian && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Leaf className="h-3 w-3 mr-1" />
              Veg
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full">
          <span className="text-lg font-bold text-green-600">₹{dish.price}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{dish.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dish.description}</p>

        {/* Nutrition Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Calories</div>
            <div className="text-lg font-semibold text-gray-900">{dish.calories || 'N/A'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Protein</div>
            <div className="text-lg font-semibold text-gray-900">{dish.protein || 'N/A'}g</div>
          </div>
        </div>

        {/* Macros */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Carbs: {dish.carbs || 'N/A'}g</span>
          <span>Fats: {dish.fats || 'N/A'}g</span>
        </div>

        {/* Add to Cart Button */}
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(dish)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add to Order
          </button>
        )}
      </div>
    </div>
  );
}
