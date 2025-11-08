import { useState } from 'react';
import { Brain, Calculator, Target, ChefHat, Loader2 } from 'lucide-react';
import DishCard from '@/react-app/components/DishCard';
import type { Dish } from '@/shared/types';

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'weight_loss' | 'maintenance' | 'weight_gain' | 'muscle_gain';
  dietaryRestrictions: string[];
  healthConditions: string;
}

interface NutritionPlan {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  recommendations: string[];
  mealPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  suggestedDishes: Dish[];
}

export default function NutritionAssistant() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    dietaryRestrictions: []
  });
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProfileChange = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleDietaryRestriction = (restriction: string) => {
    const current = profile.dietaryRestrictions || [];
    const updated = current.includes(restriction)
      ? current.filter(r => r !== restriction)
      : [...current, restriction];
    
    handleProfileChange('dietaryRestrictions', updated);
  };

  const generateNutritionPlan = async () => {
    if (!isProfileComplete()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/nutrition/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to generate nutrition plan');
      }

      const plan = await response.json();
      setNutritionPlan(plan);
      setStep(2);
    } catch (err) {
      setError('Failed to generate your nutrition plan. Please try again.');
      console.error('Error generating nutrition plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const isProfileComplete = () => {
    return profile.age && profile.weight && profile.height && 
           profile.gender && profile.activityLevel && profile.goal;
  };

  const resetAssistant = () => {
    setStep(1);
    setProfile({ dietaryRestrictions: [] });
    setNutritionPlan(null);
    setError('');
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Nutrition Assistant
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get personalized nutrition recommendations, daily protein targets, and custom meal plans 
            designed around our healthy menu items. Let AI optimize your nutrition journey.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNum ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum === 1 ? <Calculator className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                </div>
                {stepNum < 2 && (
                  <div className={`w-16 h-1 mx-4 ${
                    step > stepNum ? 'bg-purple-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: User Profile */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                Tell us about yourself
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    min="13"
                    max="100"
                    value={profile.age || ''}
                    onChange={(e) => handleProfileChange('age', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={profile.weight || ''}
                    onChange={(e) => handleProfileChange('weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="120"
                    max="250"
                    value={profile.height || ''}
                    onChange={(e) => handleProfileChange('height', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="175"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={profile.gender || ''}
                    onChange={(e) => handleProfileChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Activity Level
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
                    { value: 'light', label: 'Light', desc: 'Light exercise 1-3 days/week' },
                    { value: 'moderate', label: 'Moderate', desc: 'Moderate exercise 3-5 days/week' },
                    { value: 'active', label: 'Active', desc: 'Hard exercise 6-7 days/week' },
                    { value: 'very_active', label: 'Very Active', desc: 'Very hard exercise, physical job' },
                  ].map((level) => (
                    <label key={level.value} className="flex items-start p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="activityLevel"
                        value={level.value}
                        checked={profile.activityLevel === level.value}
                        onChange={(e) => handleProfileChange('activityLevel', e.target.value)}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{level.label}</div>
                        <div className="text-sm text-gray-600">{level.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Primary Goal
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { value: 'weight_loss', label: 'Weight Loss', desc: 'Lose body fat' },
                    { value: 'maintenance', label: 'Maintenance', desc: 'Maintain current weight' },
                    { value: 'weight_gain', label: 'Weight Gain', desc: 'Gain healthy weight' },
                    { value: 'muscle_gain', label: 'Muscle Gain', desc: 'Build lean muscle' },
                  ].map((goal) => (
                    <label key={goal.value} className="flex items-start p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="goal"
                        value={goal.value}
                        checked={profile.goal === goal.value}
                        onChange={(e) => handleProfileChange('goal', e.target.value)}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{goal.label}</div>
                        <div className="text-sm text-gray-600">{goal.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Dietary Restrictions (Optional)
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low-Sodium'].map((restriction) => (
                    <button
                      key={restriction}
                      type="button"
                      onClick={() => toggleDietaryRestriction(restriction)}
                      className={`px-4 py-2 rounded-full border transition-colors ${
                        profile.dietaryRestrictions?.includes(restriction)
                          ? 'bg-purple-100 border-purple-300 text-purple-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {restriction}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Conditions (Optional)
                </label>
                <textarea
                  value={profile.healthConditions || ''}
                  onChange={(e) => handleProfileChange('healthConditions', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Any health conditions or medical considerations..."
                />
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="mt-8 text-center">
                <button
                  onClick={generateNutritionPlan}
                  disabled={!isProfileComplete() || loading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <ChefHat className="h-5 w-5 mr-2" />
                      Generate My Nutrition Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Nutrition Plan */}
        {step === 2 && nutritionPlan && (
          <div className="space-y-8">
            {/* Daily Requirements */}
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Your Daily Nutrition Requirements
              </h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {nutritionPlan.dailyCalories}
                  </div>
                  <div className="text-gray-600 font-medium">Calories</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {nutritionPlan.protein}g
                  </div>
                  <div className="text-gray-600 font-medium">Protein</div>
                  <div className="text-xs text-blue-600 mt-1 font-semibold">TARGET</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {nutritionPlan.carbs}g
                  </div>
                  <div className="text-gray-600 font-medium">Carbs</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {nutritionPlan.fats}g
                  </div>
                  <div className="text-gray-600 font-medium">Fats</div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-purple-600" />
                AI Nutrition Insights
              </h3>
              <div className="space-y-3">
                {nutritionPlan.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Personalized Daily Meal Plan
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(nutritionPlan.mealPlan).map(([mealType, items]) => (
                  <div key={mealType} className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 capitalize">
                      {mealType}
                    </h4>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={index} className="text-sm text-gray-700 flex items-start">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Menu Items */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Recommended Menu Items for You
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nutritionPlan.suggestedDishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>

              <div className="text-center mt-8">
                <div className="inline-flex space-x-4">
                  <button
                    onClick={() => window.location.href = '/schedule'}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
                  >
                    Schedule Pickup
                  </button>
                  <button
                    onClick={() => window.location.href = '/delivery'}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Order for Delivery
                  </button>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={resetAssistant}
                className="text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get New Recommendations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
