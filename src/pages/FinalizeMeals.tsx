import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { meals } from "../data/meals";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const categories = ["all", "breakfast", "lunch", "dinner"];
const filters = ["veg", "high-protein", "low-carb", "popular"];

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
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userDetails");
    if (userData) {
      const parsed = JSON.parse(userData);
      setDietPref(parsed.dietaryPreference || "No preference");
    }
    const confirmed = localStorage.getItem("confirmedPlan");
    if (confirmed) {
      const parsed = JSON.parse(confirmed);
      const daily = Number(parsed.kilojoules);
      setTargets(zigzagKJ(daily));
    }
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
    return true;
  };

  const filterByTab = (meal: any) => {
    if (activeTab === "top-10") return meal.popular;
    if (activeTab === "new") return meal.tags?.includes("new");
    if (activeTab === "limited") return meal.tags?.includes("limited");
    return true;
  };

  const filterByCategory = (meal: any, cat: string) => {
    if (selectedCategory === "all") return meal.category === cat;
    return meal.category === cat && selectedCategory === cat;
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

        {/* Day Tabs */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {days.map((label, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveDay(i);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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

        {/* Category & Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
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
                {filter === "veg"
                  ? "Vegetarian"
                  : filter === "high-protein"
                  ? "High Protein"
                  : filter === "low-carb"
                  ? "Low Carb"
                  : "Popular"}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
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

        {/* Meals Grid */}
        {["breakfast", "lunch", "dinner", "snack"].map((cat) => (
          <div key={cat} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 capitalize mb-6">
              {cat}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {meals
                .filter((meal) => filterByCategory(meal, cat))
                .filter(filterByDiet)
                .filter(filterByTab)
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
                            {tag === "veg"
                              ? "🌱 Veg"
                              : tag === "high-protein"
                              ? "💪 High Protein"
                              : tag === "low-carb"
                              ? "🥗 Low Carb"
                              : tag}
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
        {/* <div className="flex justify-between items-center mt-12">
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
            onClick={() => {
              localStorage.setItem(
                "selectedWeeklyMeals",
                JSON.stringify(weeklyMeals)
              );
              localStorage.setItem("zigzagPlan", JSON.stringify(targets));
              navigate("/plan");
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              allDaysSelected
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue to Pricing
          </button>
        </div> */}

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
            onClick={() => {
              // ✅ Save weekly meals and zigzag plan to localStorage
              localStorage.setItem(
                "selectedWeeklyMeals",
                JSON.stringify(weeklyMeals)
              );
              localStorage.setItem("zigzagPlan", JSON.stringify(targets));

              // Navigate to plan selection page
              navigate("/plan");
            }}
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
