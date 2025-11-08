import { Link } from 'react-router';
import { ArrowRight, Truck, MapPin, Star, Users, Zap, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Nutritious Meals,
                </span>
                <br />
                Anytime, Anywhere.
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl">
                Affordable, protein-rich, and delicious meals designed for busy students and young professionals. 
                Never compromise on nutrition again.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/nutrition"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  AI Nutrition Assistant
                </Link>
                <Link
                  to="/menu"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  View Menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://mocha-cdn.com/01997fbd-bd23-780d-8243-cddb7e4b15bb/tandoori_paneer_quinoa_bowl.png"
                  alt="Tandoori Paneer Quinoa Bowl"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">High Protein</p>
                    <p className="text-sm text-gray-600">25g+ per meal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose <span className="text-green-600">Grains&Gains</span>?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We understand the needs of students and young professionals. That's why we've built something special.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Assistant</h3>
              <p className="text-gray-600">
                Get personalized nutrition plans, protein targets, and meal recommendations powered by AI.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Campus Kiosks</h3>
              <p className="text-gray-600">
                Pick up fresh meals from convenient campus locations. Quick, easy, and always on your way.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">City Delivery</h3>
              <p className="text-gray-600">
                Can't make it to campus? Get fresh meals delivered from our cloud kitchens across the city.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-yellow-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Nutrition First</h3>
              <p className="text-gray-600">
                Every meal is carefully crafted with optimal macros. High protein, balanced nutrition, great taste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">25g+</div>
              <div className="text-green-100">Protein Per Meal</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-green-100">Campus Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to fuel your success?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students who've made nutrition a priority without breaking the bank.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/delivery"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Truck className="mr-2 h-5 w-5" />
              Order for Delivery
            </Link>
            <Link
              to="/schedule"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl border-2 border-green-600 hover:bg-green-50 transition-all transform hover:scale-105"
            >
              <Users className="mr-2 h-5 w-5" />
              Schedule Pickup
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
