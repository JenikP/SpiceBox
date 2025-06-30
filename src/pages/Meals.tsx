
import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { meals } from "../data/meals";

const Meals = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Meals", icon: "🍽️" },
    { id: "breakfast", name: "Breakfast", icon: "🌅" },
    { id: "lunch", name: "Lunch", icon: "☀️" },
    { id: "dinner", name: "Dinner", icon: "🌙" },
    { id: "snack", name: "Snacks", icon: "🥨" }
  ];

  const dietaryFilters = [
    { id: "vegetarian", name: "Vegetarian", icon: "🥬" },
    { id: "vegan", name: "Vegan", icon: "🌱" },
    { id: "keto", name: "Keto", icon: "🥑" },
    { id: "high-protein", name: "High Protein", icon: "💪" }
  ];

 const filteredMeals = meals.filter(meal => {
  const categoryMatch = selectedCategory === "all" || meal.category === selectedCategory;
  const searchMatch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
  return categoryMatch && searchMatch;
}).slice(0, 10); // Limits the result to the first 10 meals

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Delicious
              </span>{" "}
              Meals
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Authentic Indian flavors crafted by expert chefs using traditional recipes and the finest spices. 
              Each meal is carefully portioned and nutritionally balanced for your weight loss goals.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Fresh Daily</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Calorie Controlled</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Authentic Spices</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg pl-12"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Browse by Meal Type</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Dietary Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Dietary Preferences</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {dietaryFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full text-sm font-medium text-orange-700"
                >
                  <span>{filter.icon}</span>
                  <span>{filter.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meals Grid */}
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedCategory === "all" ? "All Our Meals" : `${categories.find(c => c.id === selectedCategory)?.name} Meals`}
            </h2>
            <p className="text-gray-600">
              Showing {filteredMeals.length} delicious meal{filteredMeals.length !== 1 ? 's' : ''}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMeals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {meal.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-gray-700">{meal.calories} cal</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{meal.name}</h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-orange-600">{meal.protein}g</div>
                      <div className="text-xs text-gray-500">Protein</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-orange-600">{meal.carbs}g</div>
                      <div className="text-xs text-gray-500">Carbs</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-orange-600">{meal.fat}g</div>
                      <div className="text-xs text-gray-500">Fat</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {meal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                   <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors">
                  Add to Plan
                </button>
                
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Taste the Difference?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Start your personalized meal plan today and enjoy authentic Indian flavors while achieving your weight loss goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/enter-details"
                className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Get My Meal Plan
              </a>
              <a
                href="/plan"
                className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300"
              >
                View Pricing
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Meals;
