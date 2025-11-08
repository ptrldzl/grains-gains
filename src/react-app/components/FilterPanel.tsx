import { X } from 'lucide-react';
import type { DishFilter } from '@/shared/types';

interface FilterPanelProps {
  filters: DishFilter;
  onFiltersChange: (filters: DishFilter) => void;
  onClearFilters: () => void;
}

export default function FilterPanel({ filters, onFiltersChange, onClearFilters }: FilterPanelProps) {
  const updateFilter = (key: keyof DishFilter, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vegetarian Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Diet</label>
          <select
            value={filters.isVegetarian === undefined ? '' : filters.isVegetarian ? 'true' : 'false'}
            onChange={(e) => {
              const value = e.target.value;
              updateFilter('isVegetarian', value === '' ? undefined : value === 'true');
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Diets</option>
            <option value="true">Vegetarian</option>
            <option value="false">Non-Vegetarian</option>
          </select>
        </div>
      </div>
    </div>
  );
}
