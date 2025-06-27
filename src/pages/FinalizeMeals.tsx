import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { meals } from "../data/meals";
import { supabase } from "../utils/supabaseClient";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const categories = [
  "all",
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
  "desserts",
];
const filters = ["high-protein", "low-carb", "popular"];

const zigzagKJ = (base: number) => {
  const variation = [1.1, 0.95, 1.05, 1.0, 0.9, 1.08, 0.92];
  return variation.map((v) => Math.round(base * v));
};

export default function FinalizeMeals() {
  const [activeDay, setActiveDay] = useState(0);
  const [weeklyMeals, setWeeklyMeals] = useState<
    Record<number, Record<number, number>>
  >({});
  const [targets, setTargets] = useState<number[]>([]);
  const [dietPref, setDietPref] = useState("No preference");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("Please log in again.");
        return;
      }

      const { data, error } = await supabase
        .from("user_details")
        .select("dietary_preference, calculated_daily_calories")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user details:", error);
        alert("Failed to load plan details.");
        return;
      }

      if (!data) {
        alert("No personalized plan found. Please complete your plan first.");
        return navigate("/personalized-plan");
      }

      setDietPref(
        data.dietary_preference?.charAt(0).toUpperCase() +
          data.dietary_preference?.slice(1) || "No preference"
      );

      const kj = Number(data.calculated_daily_calories);
      setTargets(zigzagKJ(kj));
    };

    fetchUserDetails();
  }, []);

  const addMeal = (mealId: number) => {
    const meal = meals.find((m) => m.id === mealId);
    if (!meal) return;

    const currentMeals = weeklyMeals[activeDay] || {};
    const currentTotal = Object.entries(currentMeals).reduce(
      (sum, [id, count]) => {
        const m = meals.find((meal) => meal.id === Number(id));
        return m ? sum + m.kj * count : sum;
      },
      0
    );

    if (currentTotal + meal.kj > targets[activeDay]) return;

    setWeeklyMeals((prev) => {
      const dayMeals = prev[activeDay] || {};
      const count = dayMeals[mealId] || 0;
      return {
        ...prev,
        [activeDay]: { ...dayMeals, [mealId]: count + 1 },
      };
    });
  };

  const removeMeal = (mealId: number) => {
    setWeeklyMeals((prev) => {
      const dayMeals = prev[activeDay] || {};
      const count = dayMeals[mealId] || 0;
      if (count === 0) return prev;
      return {
        ...prev,
        [activeDay]: { ...dayMeals, [mealId]: count - 1 },
      };
    });
  };

  const filterByDiet = (meal: any) => {
    if (dietPref === "Vegetarian") return meal.tags?.includes("veg");
    if (dietPref === "Vegan") return meal.tags?.includes("vegan");
    if (dietPref === "Non-Vegetarian") return meal.tags?.includes("non-veg");
    return true;
  };

  const filterByTags = (meal: any) => {
    if (selectedFilters.length === 0) return true;
    return selectedFilters.every((filter) =>
      filter === "popular" ? meal.popular : meal.tags?.includes(filter)
    );
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const saveMealsToSupabase = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Please log in again.");
      return;
    }

    await supabase.from("weekly_meal_plan").delete().eq("user_id", user.id);

    const inserts = Object.entries(weeklyMeals).flatMap(([dayIndex, meals]) =>
      Object.entries(meals)
        .filter(([, quantity]) => quantity > 0) // ✅ Only insert if quantity > 0
        .map(([mealId, quantity]) => ({
          user_id: user.id,
          day_index: Number(dayIndex),
          meal_id: Number(mealId),
          quantity,
        }))
    );

    if (inserts.length === 0) {
      alert("Please select at least one meal per day before saving.");
      return;
    }

    const { error: insertError, data } = await supabase
      .from("weekly_meal_plan")
      .insert(inserts);

    if (insertError) {
      console.error(
        "❌ Error saving meals:",
        insertError.message,
        insertError.details
      );
      console.log("Inserts attempted:", inserts);
      alert("Failed to save your meals.");
      return;
    } else {
      console.log("✅ Meals saved successfully!", data);
    }

    navigate("/plan");
  };

  const currentMeals = weeklyMeals[activeDay] || {};
  const currentTarget = targets[activeDay] || 0;
  const totalKJ = Object.entries(currentMeals).reduce((sum, [id, count]) => {
    const meal = meals.find((m) => m.id === Number(id));
    return meal ? sum + meal.kj * count : sum;
  }, 0);

  const allDaysSelected = days.every((_, idx) => {
    const mealsForDay = weeklyMeals[idx];
    return mealsForDay && Object.values(mealsForDay).some((count) => count > 0);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Choose Your Meals
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Customize your meals for each day of the week
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Dietary Preference */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600 py-2">
              Diet:
            </span>
            {["No preference", "Vegetarian", "Vegan", "Non-Vegetarian"].map(
              (pref) => (
                <button
                  key={pref}
                  onClick={() => setDietPref(pref)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    dietPref === pref
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {pref}
                </button>
              )
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600 py-2">
              Categories:
            </span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-orange-100 text-orange-700 border border-orange-300"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600 py-2">
              Filters:
            </span>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFilters.includes(filter)
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {filter === "high-protein"
                  ? "High Protein"
                  : filter === "low-carb"
                  ? "Low Carb"
                  : "Popular"}
              </button>
            ))}
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {days.map((label, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                i === activeDay
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-red-900 text-white rounded-xl px-6 py-4 mb-6">
          <p className="font-semibold text-lg">{days[activeDay]} Target</p>
          <p className="text-xl font-bold">
            {totalKJ} / {currentTarget} kJ
          </p>
          <div className="w-full h-3 bg-red-700 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-orange-300"
              style={{
                width: `${Math.min((totalKJ / currentTarget) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Meals Display */}
        {categories
          .filter(
            (cat) => selectedCategory === "all" || cat === selectedCategory
          )
          .map((cat) => (
            <div key={cat} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 capitalize mb-6">
                {cat}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {meals
                  .filter((meal) => meal.category === cat)
                  .filter(filterByDiet)
                  .filter(filterByTags)
                  .map((meal) => (
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
                          {meal.kj} kJ
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {meal.name}
                        </h3>
                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                          <span>Protein: {meal.protein}g</span>
                          <span>Carbs: {meal.carbs}g</span>
                          <span>Fat: {meal.fat}g</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(meal.tags || []).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => removeMeal(meal.id)}
                            className="px-3 py-1 bg-gray-200 rounded-lg text-lg font-bold"
                          >
                            −
                          </button>
                          <span className="text-xl font-semibold">
                            {currentMeals[meal.id] || 0}
                          </span>
                          <button
                            onClick={() => addMeal(meal.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-lg font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

        {/* Footer */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={() => {
              setActiveDay((activeDay + 1) % 7);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-6 py-3 rounded-lg font-semibold"
          >
            Next Day →
          </button>

          <button
            disabled={!allDaysSelected}
            onClick={saveMealsToSupabase}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              allDaysSelected
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue to Pricing
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { meals } from "../data/meals";

const FinalizeMeals = () => {
  const [selectedMeals, setSelectedMeals] = useState<{[key: string]: any[]}>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });

  const [currentCategory, setCurrentCategory] = useState("breakfast");

  const categories = [
    { id: "breakfast", name: "Breakfast", icon: "🌅", limit: 7 },
    { id: "lunch", name: "Lunch", icon: "☀️", limit: 7 },
    { id: "dinner", name: "Dinner", icon: "🌙", limit: 7 },
    { id: "snack", name: "Snacks", icon: "🥨", limit: 3 }
  ];

  const categoryMeals = meals.filter(meal => meal.category === currentCategory);

  const toggleMealSelection = (meal: any) => {
    const category = meal.category;
    const categoryLimit = categories.find(cat => cat.id === category)?.limit || 7;
    
    setSelectedMeals(prev => {
      const currentSelection = prev[category] || [];
      const isSelected = currentSelection.find(m => m.id === meal.id);
      
      if (isSelected) {
        // Remove meal
        return {
          ...prev,
          [category]: currentSelection.filter(m => m.id !== meal.id)
        };
      } else if (currentSelection.length < categoryLimit) {
        // Add meal if under limit
        return {
          ...prev,
          [category]: [...currentSelection, meal]
        };
      }
      
      return prev;
    });
  };

  const getTotalSelectedMeals = () => {
    return Object.values(selectedMeals).reduce((total, meals) => total + meals.length, 0);
  };

  const isReadyToFinalize = () => {
    return selectedMeals.breakfast.length >= 7 && 
           selectedMeals.lunch.length >= 7 && 
           selectedMeals.dinner.length >= 7;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Finalize Your{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Meal Selection
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Choose your favorite meals for each category. You can always change these later in your profile.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="bg-white rounded-full px-4 py-2 shadow-md">
                <span className="font-semibold text-orange-600">{getTotalSelectedMeals()}</span>
                <span className="text-gray-600"> meals selected</span>
              </div>
              <div className="bg-white rounded-full px-4 py-2 shadow-md">
                <span className="font-semibold text-green-600">21</span>
                <span className="text-gray-600"> meals recommended</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCurrentCategory(category.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  currentCategory === category.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <div className="bg-white bg-opacity-20 rounded-full px-2 py-1 text-xs">
                  {selectedMeals[category.id]?.length || 0}/{category.limit}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Meals Grid */}
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Select Your {categories.find(c => c.id === currentCategory)?.name} Meals
            </h2>
            <p className="text-gray-600">
              Choose {categories.find(c => c.id === currentCategory)?.limit} meals for your weekly {currentCategory} rotation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryMeals.map((meal, index) => {
              const isSelected = selectedMeals[currentCategory]?.find(m => m.id === meal.id);
              const categoryLimit = categories.find(cat => cat.id === currentCategory)?.limit || 7;
              const canSelect = selectedMeals[currentCategory]?.length < categoryLimit;
              
              return (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'ring-4 ring-orange-500 shadow-xl transform scale-105' 
                      : 'hover:shadow-xl hover:scale-102'
                  } ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => (canSelect || isSelected) && toggleMealSelection(meal)}
                >
                  <div className="relative">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-64 object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full px-3 py-1">
                      <span className="text-sm font-semibold text-gray-700">{meal.calories} cal</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{meal.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{meal.description}</p>
                    
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
                      {meal.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(meal.rating) ? 'text-orange-500' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-500 ml-1">({meal.rating})</span>
                      </div>
                      <span className="text-sm text-gray-500">{meal.prepTime}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selection Summary & CTA */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Meal Selection Summary</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {categories.map((category) => (
                <div key={category.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-gray-900">{category.name}</div>
                  <div className="text-sm text-gray-600">
                    {selectedMeals[category.id]?.length || 0} / {category.limit} selected
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((selectedMeals[category.id]?.length || 0) / category.limit) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {isReadyToFinalize() ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center text-green-700">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Great! You've selected all required meals. Ready to proceed?
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-full font-bold text-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Proceed to Checkout
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="text-orange-700">
                    Please select at least 7 meals for breakfast, lunch, and dinner to continue.
                  </div>
                </div>
                <button
                  disabled
                  className="inline-block bg-gray-300 text-gray-500 px-12 py-4 rounded-full font-bold text-xl cursor-not-allowed"
                >
                  Select More Meals to Continue
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FinalizeMeals;
