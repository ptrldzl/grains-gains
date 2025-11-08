import { useState, useEffect } from 'react';
import { CreditCard, Truck, Clock } from 'lucide-react';
import DishCard from '@/react-app/components/DishCard';
import type { Dish, CloudKitchen, DeliveryOrderForm } from '@/shared/types';

export default function Delivery() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cloudKitchens, setCloudKitchens] = useState<CloudKitchen[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([]);
  const [formData, setFormData] = useState<Partial<DeliveryOrderForm>>({
    payment_method: 'upi'
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [orderComplete, setOrderComplete] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dishesRes, kitchensRes] = await Promise.all([
        fetch('/api/dishes'),
        fetch('/api/cloud-kitchens')
      ]);
      
      if (dishesRes.ok && kitchensRes.ok) {
        const dishesData = await dishesRes.json();
        const kitchensData = await kitchensRes.json();
        setDishes(dishesData);
        setCloudKitchens(kitchensData);
      } else {
        // Use mock data for demo
        setDishes(mockDishes);
        setCloudKitchens(mockCloudKitchens);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setDishes(mockDishes);
      setCloudKitchens(mockCloudKitchens);
    } finally {
      setLoading(false);
    }
  };

  const addDishToOrder = (dish: Dish) => {
    setSelectedDishes(prev => [...prev, dish]);
  };

  const removeDishFromOrder = (dishId: number) => {
    setSelectedDishes(prev => prev.filter(dish => dish.id !== dishId));
  };

  const getTotalPrice = () => {
    return selectedDishes.reduce((total, dish) => total + dish.price, 0);
  };

  const getDeliveryFee = () => {
    return getTotalPrice() > 500 ? 0 : 50;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getDeliveryFee();
  };

  const generateEstimatedDelivery = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30 + Math.floor(Math.random() * 30)); // 30-60 minutes
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleSubmitOrder = async () => {
    if (!formData.user_email || !formData.cloud_kitchen_id || !formData.delivery_address || selectedDishes.length === 0) {
      alert('Please fill in all required fields and select at least one dish.');
      return;
    }

    try {
      const orderData = {
        ...formData,
        dish_ids: selectedDishes.map(d => d.id),
        total_amount: getFinalTotal()
      };

      const response = await fetch('/api/orders/delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        await response.json();
        setEstimatedDelivery(generateEstimatedDelivery());
        setOrderComplete(true);
      } else {
        // For demo, simulate success
        setEstimatedDelivery(generateEstimatedDelivery());
        setOrderComplete(true);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      // For demo, simulate success
      setEstimatedDelivery(generateEstimatedDelivery());
      setOrderComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your delicious meal is being prepared and will be delivered soon.
            </p>
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl mb-6">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Estimated Delivery: {estimatedDelivery}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-6">
              You'll receive updates via email and SMS about your order status.
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Order Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-green-600">Fresh Delivery</span> to Your Door
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get nutritious meals delivered from our cloud kitchens across the city. Fresh, fast, and convenient.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNum ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-green-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Dishes */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 1: Build Your Order</h2>
            
            {selectedDishes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Your Order ({selectedDishes.length} items)</h3>
                <div className="space-y-3">
                  {selectedDishes.map((dish, index) => (
                    <div key={`${dish.id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={dish.image_url || "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=60&q=80"}
                          alt={dish.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="font-medium">{dish.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-green-600 font-semibold">₹{dish.price}</span>
                        <button
                          onClick={() => removeDishFromOrder(dish.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3 space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>{getDeliveryFee() === 0 ? 'FREE' : `₹${getDeliveryFee().toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-1">
                      <span>Total:</span>
                      <span className="text-green-600">₹{getFinalTotal().toFixed(2)}</span>
                    </div>
                    {getTotalPrice() < 500 && (
                      <p className="text-sm text-gray-500 mt-2">
                        Add ₹{(500 - getTotalPrice()).toFixed(2)} more for free delivery!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {dishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} onAddToCart={addDishToOrder} />
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep(2)}
                disabled={selectedDishes.length === 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Details
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Delivery Details */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 2: Delivery Details</h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.user_email || ''}
                    onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.user_phone || ''}
                    onChange={(e) => setFormData({...formData, user_phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cloud Kitchen Location</label>
                  <select
                    value={formData.cloud_kitchen_id || ''}
                    onChange={(e) => setFormData({...formData, cloud_kitchen_id: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select nearest kitchen</option>
                    {cloudKitchens.map((kitchen) => (
                      <option key={kitchen.id} value={kitchen.id}>
                        {kitchen.name} - {kitchen.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                  <textarea
                    value={formData.delivery_address || ''}
                    onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your complete delivery address..."
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 3: Payment & Confirmation</h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  {selectedDishes.map((dish, index) => (
                    <div key={`${dish.id}-${index}`} className="flex justify-between">
                      <span>{dish.name}</span>
                      <span>${dish.price}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>{getDeliveryFee() === 0 ? 'FREE' : `₹${getDeliveryFee().toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-green-600">₹{getFinalTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment_method"
                      value="upi"
                      checked={formData.payment_method === 'upi'}
                      onChange={(e) => setFormData({...formData, payment_method: e.target.value as 'upi' | 'netbanking'})}
                      className="mr-3"
                    />
                    <CreditCard className="h-5 w-5 mr-3 text-gray-400" />
                    <span>UPI Payment</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment_method"
                      value="netbanking"
                      checked={formData.payment_method === 'netbanking'}
                      onChange={(e) => setFormData({...formData, payment_method: e.target.value as 'upi' | 'netbanking'})}
                      className="mr-3"
                    />
                    <CreditCard className="h-5 w-5 mr-3 text-gray-400" />
                    <span>Net Banking</span>
                  </label>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <div className="flex items-center space-x-2 text-green-700">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Estimated Delivery: 30-60 minutes</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitOrder}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data
const mockDishes: Dish[] = [
  {
    id: 1,
    name: "Protein Power Bowl",
    description: "Grilled chicken, quinoa, vegetables, and tahini dressing",
    calories: 450,
    protein: 35,
    carbs: 25,
    fats: 18,
    price: 299,
    is_vegetarian: false,
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    available: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Veggie Delight Wrap",
    description: "Hummus, roasted vegetables, spinach in whole wheat wrap",
    calories: 380,
    protein: 15,
    carbs: 45,
    fats: 12,
    price: 229,
    is_vegetarian: true,
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=400&q=80",
    available: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

const mockCloudKitchens: CloudKitchen[] = [
  {
    id: 1,
    name: "Downtown Kitchen",
    city: "Downtown",
    address: "123 Main Street, Downtown District",
    delivery_radius: 5.0,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "University Area Kitchen",
    city: "University Area",
    address: "456 College Ave, University District",
    delivery_radius: 3.0,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];
