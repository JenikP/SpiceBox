
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { meals } from "../data/meals";
import { supabase } from "../utils/supabaseClient";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const categories = ["breakfast", "lunch", "dinner", "snacks", "desserts"];
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
  const [userDetails, setUserDetails] = useState<any>(null);
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

      const { data: userDetails, error: detailsError } = await supabase
        .from("user_details")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (detailsError) {
        console.error("Error fetching user details:", detailsError);
        alert("Failed to load plan details.");
        return navigate("/personalized-plan");
      }

      if (!userDetails) {
        alert("No personalized plan found.");
        return navigate("/personalized-plan");
      }

      setUserDetails(userDetails);
      
      // Auto-select diet preference from backend
      const backendDietPref = userDetails.dietary_preference;
      if (backendDietPref && backendDietPref !== "no-preference") {
        const formattedPref = backendDietPref.charAt(0).toUpperCase() + backendDietPref.slice(1);
        setDietPref(formattedPref);
      } else {
        setDietPref("No preference");
      }

      // Use calculated_daily_calories directly from database
      const dailyKJ = Number(userDetails.calculated_daily_calories) || 2000;
      setTargets(zigzagKJ(dailyKJ));
      await fetchSavedMeals(user.id);
    };

    const fetchSavedMeals = async (userId: string) => {
      const { data: savedMeals, error: mealsError } = await supabase
        .from("weekly_meal_plan")
        .select("*")
        .eq("user_id", userId);

      if (mealsError) {
        console.error("Error fetching saved meals:", mealsError);
        return;
      }

      const mealsMap: Record<number, Record<number, number>> = {};
      if (savedMeals && savedMeals.length > 0) {
        savedMeals.forEach((meal) => {
          const dayIndex = meal.day_index;
          const mealId = meal.meal_id;
          const quantity = meal.quantity;

          if (!mealsMap[dayIndex]) {
            mealsMap[dayIndex] = {};
          }
          mealsMap[dayIndex][mealId] = quantity;
        });
      }

      setWeeklyMeals(mealsMap);
    };

    fetchUserDetails();
  }, [navigate]);

  const addMeal = (mealId: number) => {
    const meal = meals.find((m) => m.id === mealId);
    if (!meal) return;

    const currentMeals = weeklyMeals[activeDay] || {};
    const currentTotal = Object.entries(currentMeals).reduce(
      (sum, [id, count]) => {
        const m = meals.find((meal) => meal.id === Number(id));
        return m ? sum + (m.kj ?? 0) * count : sum;
      },
      0,
    );

    // Check if adding this meal would exceed the daily target
    if (currentTotal + (meal.kj ?? 0) > targets[activeDay]) {
      alert(`Adding this meal would exceed your daily target of ${targets[activeDay]} kJ for ${days[activeDay]}`);
      return;
    }

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
      
      const newCount = count - 1;
      const updatedDayMeals = { ...dayMeals };
      
      if (newCount === 0) {
        delete updatedDayMeals[mealId];
      } else {
        updatedDayMeals[mealId] = newCount;
      }
      
      return {
        ...prev,
        [activeDay]: updatedDayMeals,
      };
    });
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

    // Delete existing meal plan for user
    await supabase.from("weekly_meal_plan").delete().eq("user_id", user.id);

    const inserts = Object.entries(weeklyMeals).flatMap(([dayIndex, meals]) =>
      Object.entries(meals)
        .filter(([, quantity]) => quantity > 0)
        .map(([mealId, quantity]) => ({
          user_id: user.id,
          day_index: Number(dayIndex),
          meal_id: Number(mealId),
          quantity,
        })),
    );

    if (inserts.length === 0) {
      alert("Please select at least one meal per day before saving.");
      return;
    }

    const { error: insertError } = await supabase
      .from("weekly_meal_plan")
      .insert(inserts);

    if (insertError) {
      console.error("❌ Error saving meals:", insertError);
      alert("Failed to save your meals.");
      return;
    }

    console.log("✅ Meals saved successfully!");
    navigate("/pricing");
  };

  const currentMeals = weeklyMeals[activeDay] || {};
  const currentTarget = targets[activeDay] || 0;
  const totalKJ = Object.entries(currentMeals).reduce((sum, [id, count]) => {
    const meal = meals.find((m) => m.id === Number(id));
    return meal ? sum + (meal.kj ?? 0) * count : sum;
  }, 0);

  const allDaysSelected = days.every((_, idx) => {
    const mealsForDay = weeklyMeals[idx];
    return mealsForDay && Object.values(mealsForDay).some((count) => count > 0);
  });

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters.includes(filter)) {
        return prevFilters.filter((f) => f !== filter);
      }
      return [...prevFilters, filter];
    });
  };

  const filterByDiet = (meal: any) => {
    return (
      dietPref === "No preference" || meal.tags.includes(dietPref.toLowerCase())
    );
  };

  const filterByTags = (meal: any) => {
    return selectedFilters.every((filter) => meal.tags.includes(filter));
  };

  // Get selected meals for current day with details
  const getSelectedMealsForDay = (dayIndex: number) => {
    const dayMeals = weeklyMeals[dayIndex] || {};
    return Object.entries(dayMeals)
      .filter(([, quantity]) => quantity > 0)
      .map(([mealId, quantity]) => {
        const meal = meals.find(m => m.id === Number(mealId));
        return meal ? { ...meal, quantity } : null;
      })
      .filter(Boolean);
  };

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
              ),
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600 py-2">
              Categories:
            </span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-orange-100 text-orange-700 border border-orange-300"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              All
            </button>
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
          {days.map((label, i) => {
            const hasSelection = Object.keys(weeklyMeals[i] || {}).length > 0;
            
            return (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all relative ${
                  i === activeDay
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {label}
                {hasSelection && (
                  <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                    i === activeDay ? "bg-orange-400" : "bg-green-500"
                  }`}></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="bg-red-900 text-white rounded-xl px-6 py-4 mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-lg">{days[activeDay]} Target</p>
              <p className="text-xl font-bold">
                {totalKJ} / {currentTarget} kJ
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">Remaining</p>
              <p className="font-bold">{Math.max(0, currentTarget - totalKJ)} kJ</p>
            </div>
          </div>
          <div className="w-full h-3 bg-red-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                totalKJ > currentTarget ? 'bg-orange-400' : 'bg-orange-300'
              }`}
              style={{
                width: `${Math.min((totalKJ / currentTarget) * 100, 100)}%`,
              }}
            />
          </div>
          {totalKJ > currentTarget && (
            <p className="text-orange-300 text-sm mt-1">⚠️ Over target - consider removing some meals</p>
          )}
        </div>

        {/* Selected Meals for Current Day */}
        {Object.keys(currentMeals).length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-3">Selected for {days[activeDay]}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(currentMeals)
                .filter(([, quantity]) => quantity > 0)
                .map(([mealId, quantity]) => {
                  const meal = meals.find(m => m.id === Number(mealId));
                  return meal ? (
                    <div key={`selected-${mealId}`} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{meal.name}</p>
                        <p className="text-xs text-green-600 font-medium">Qty: {quantity} • {(meal.kj || 0) * quantity} kJ</p>
                      </div>
                    </div>
                  ) : null;
                })}
            </div>
          </div>
        )}

        {/* Meals Display */}
        {categories
          .filter(
            (cat) => selectedCategory === "all" || cat === selectedCategory,
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
                      key={`${cat}-${meal.id}`}
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
                          {meal.kj ?? 0} kJ
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {meal.name}
                        </h3>
                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                          <span>Protein: {meal.protein}</span>
                          <span>Carbs: {meal.carbs}</span>
                          <span>Fat: {meal.fat}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(meal.tags || []).map((tag, tagIndex) => (
                            <span
                              key={`${meal.id}-tag-${tagIndex}`}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => removeMeal(meal.id)}
                            disabled={!currentMeals[meal.id] || currentMeals[meal.id] === 0}
                            className="px-3 py-1 bg-gray-200 rounded-lg text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                          >
                            −
                          </button>
                          <span className="text-xl font-semibold px-4">
                            {currentMeals[meal.id] || 0}
                          </span>
                          <button
                            onClick={() => addMeal(meal.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-lg font-bold hover:bg-red-600 transition-colors"
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
            Continue to Pricing ({Object.keys(weeklyMeals).length}/7 days)
          </button>
        </div>
      </div>
    </div>
  );
}
