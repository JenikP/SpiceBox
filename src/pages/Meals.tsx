import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const meals = [
  {
    id: 1,
    name: "Protein Dal Bowl",
    calories: 320,
    protein: 18,
    carbs: 45,
    fat: 8,
    category: "lunch",
    tags: ["veg", "high-protein"],
    image: "https://images.pexels.com/photos/28674708/pexels-photo-28674708.jpeg?auto=compress&cs=tinysrgb&h=350",
    popular: true
  },
  {
    id: 2,
    name: "Spiced Quinoa Upma",
    calories: 280,
    protein: 12,
    carbs: 38,
    fat: 9,
    category: "breakfast",
    tags: ["veg", "low-carb"],
    image: "https://images.pexels.com/photos/17050759/pexels-photo-17050759.jpeg?auto=compress&cs=tinysrgb&h=350",
    popular: false
  },
  {
    id: 3,
    name: "Tandoori Chicken Bowl",
    calories: 380,
    protein: 32,
    carbs: 25,
    fat: 15,
    category: "dinner",
    tags: ["high-protein"],
    image: "https://images.pexels.com/photos/19781594/pexels-photo-19781594.jpeg?auto=compress&cs=tinysrgb&h=350",
    popular: true
  },
  {
    id: 4,
    name: "Masala Oats",
    calories: 250,
    protein: 10,
    carbs: 35,
    fat: 7,
    category: "breakfast",
    tags: ["veg", "low-carb"],
    image: "https://images.pexels.com/photos/28674705/pexels-photo-28674705.jpeg?auto=compress&cs=tinysrgb&h=350",
    popular: false
  },
  {
    id: 5,
    name: "Paneer Tikka Salad",
    calories: 290,
    protein: 20,
    carbs: 15,
    fat: 18,
    category: "lunch",
    tags: ["veg", "high-protein", "low-carb"],
    image: "https://images.pexels.com/photos/9345670/pexels-photo-9345670.jpeg?auto=compress&cs=tinysrgb&h=350",
    popular: true
  },
  {
    id: 6,
    name: "Fish Curry Bowl",
    calories: 340,
    protein: 28,
    carbs: 20,
    fat: 16,
    category: "dinner",
    tags: ["high-protein"],
    image: "https://images.pexels.com/photos/17050759/pexels-photo-17050759.jpeg?auto=compress&cs=tinysrgb&h=350",
    popular: false
  }
];

export default function Meals() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const categories = ['all', 'breakfast', 'lunch', 'dinner'];
  const filters = ['veg', 'high-protein', 'low-carb', 'popular'];
  const tabs = ['all', 'top-10', 'new', 'limited'];

  const filteredMeals = meals.filter(meal => {
    const categoryMatch = selectedCategory === 'all' || meal.category === selectedCategory;
    const filterMatch = selectedFilters.length === 0 || selectedFilters.every(filter => {
      if (filter === 'popular') return meal.popular;
      return meal.tags.includes(filter);
    });
    const tabMatch = activeTab === 'all' || (activeTab === 'top-10' && meal.popular);
    
    return categoryMatch && filterMatch && tabMatch;
  });

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-yellow-300">Healthy</span> Meals
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Traditional Indian flavours reimagined for your fitness goals. Every meal is calorie-counted and macro-balanced.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              {tab === 'top-10' ? 'Top 10 Meals' : 
               tab === 'new' ? 'New' :
               tab === 'limited' ? 'Limited Time' : 'All Meals'}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600 py-2">Categories:</span>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-100 text-orange-700 border border-orange-300'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600 py-2">Filters:</span>
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFilters.includes(filter)
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter === 'veg' ? 'Vegetarian' :
                 filter === 'high-protein' ? 'High Protein' :
                 filter === 'low-carb' ? 'Low Carb' : 'Popular'}
              </button>
            ))}
          </div>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMeals.map(meal => (
            <div
              key={meal.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {meal.popular && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800">
                  {meal.calories} kcal
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{meal.name}</h3>
                
                {/* Macros */}
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Protein: {meal.protein}g</span>
                  <span>Carbs: {meal.carbs}g</span>
                  <span>Fat: {meal.fat}g</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {meal.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag === 'veg' ? '🌱 Veg' :
                       tag === 'high-protein' ? '💪 High Protein' :
                       tag === 'low-carb' ? '🥗 Low Carb' : tag}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors">
                  Add to Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No meals found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedFilters([]);
                setActiveTab('all');
              }}
              className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-gray-600 mb-6">
            Get a personalized meal plan tailored to your goals and preferences
          </p>
          <Link
            to="/enter-details"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
          >
            Create My Plan
          </Link>
        </div>
      </div>
    </div>
  );
}