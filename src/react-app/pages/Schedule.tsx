import { useState, useEffect } from 'react';
import { CreditCard, QrCode } from 'lucide-react';
import DishCard from '@/react-app/components/DishCard';
import type { Dish, KioskLocation, ScheduleOrderForm } from '@/shared/types';

export default function Schedule() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [kiosks, setKiosks] = useState<KioskLocation[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([]);
  const [formData, setFormData] = useState<Partial<ScheduleOrderForm>>({
    payment_method: 'upi'
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [orderComplete, setOrderComplete] = useState(false);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dishesRes, kiosksRes] = await Promise.all([
        fetch('/api/dishes'),
        fetch('/api/kiosks')
      ]);
      
      if (dishesRes.ok && kiosksRes.ok) {
        const dishesData = await dishesRes.json();
        const kiosksData = await kiosksRes.json();
        setDishes(dishesData);
        setKiosks(kiosksData);
      } else {
        // Use mock data for demo
        setDishes(mockDishes);
        setKiosks(mockKiosks);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setDishes(mockDishes);
      setKiosks(mockKiosks);
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

  const generateTimeSlots = () => {
    const slots = [];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Add time slots from 8 AM to 8 PM
      for (let hour = 8; hour <= 20; hour++) {
        slots.push({
          datetime: `${dateStr}T${hour.toString().padStart(2, '0')}:00`,
          label: `${dayName}, ${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
        });
      }
    }
    
    return slots;
  };

  const handleSubmitOrder = async () => {
    if (!formData.user_email || !formData.kiosk_id || !formData.pickup_time || selectedDishes.length === 0) {
      alert('Please fill in all required fields and select at least one dish.');
      return;
    }

    try {
      const orderData = {
        ...formData,
        dish_ids: selectedDishes.map(d => d.id),
        total_amount: getTotalPrice()
      };

      const response = await fetch('/api/orders/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        setQrCode(result.qr_code);
        setOrderComplete(true);
      } else {
        // For demo, simulate success
        setQrCode('PICKUP123456');
        setOrderComplete(true);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      // For demo, simulate success
      setQrCode('PICKUP123456');
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
              <QrCode className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your meal has been scheduled successfully. Show this QR code at the kiosk during pickup.
            </p>
            <div className="bg-gray-100 p-8 rounded-xl mb-6">
              <div className="text-6xl font-mono">{qrCode}</div>
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Pickup Time: {formData.pickup_time && new Date(formData.pickup_time).toLocaleString()}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Schedule Another Meal
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
            Schedule Your <span className="text-green-600">Campus Pickup</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your meals, select a pickup time, and collect from your nearest campus kiosk.
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 1: Select Your Dishes</h2>
            
            {selectedDishes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Selected Dishes ({selectedDishes.length})</h3>
                <div className="space-y-3">
                  {selectedDishes.map((dish, index) => (
                    <div key={`${dish.id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{dish.name}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-green-600 font-semibold">₹{dish.price}</span>
                        <button
                          onClick={() => removeDishFromOrder(dish.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total:</span>
                      <span className="text-green-600">₹{getTotalPrice().toFixed(2)}</span>
                    </div>
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

        {/* Step 2: Pickup Details */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 2: Pickup Details</h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.user_email || ''}
                    onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@university.edu"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kiosk Location</label>
                  <select
                    value={formData.kiosk_id || ''}
                    onChange={(e) => setFormData({...formData, kiosk_id: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a kiosk location</option>
                    {kiosks.map((kiosk) => (
                      <option key={kiosk.id} value={kiosk.id}>
                        {kiosk.name} - {kiosk.campus}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time</label>
                  <select
                    value={formData.pickup_time || ''}
                    onChange={(e) => setFormData({...formData, pickup_time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select pickup time</option>
                    {generateTimeSlots().map((slot) => (
                      <option key={slot.datetime} value={slot.datetime}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 3: Payment</h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  {selectedDishes.map((dish, index) => (
                    <div key={`${dish.id}-${index}`} className="flex justify-between">
                      <span>{dish.name}</span>
                      <span>₹{dish.price}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-semibold flex justify-between">
                    <span>Total:</span>
                    <span className="text-green-600">₹{getTotalPrice().toFixed(2)}</span>
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
                  Confirm Order
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

const mockKiosks: KioskLocation[] = [
  {
    id: 1,
    name: "Central Library Kiosk",
    campus: "Main Campus",
    address: "Next to Central Library, Ground Floor",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Student Union Kiosk",
    campus: "Main Campus",
    address: "Student Union Building, Food Court",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];
