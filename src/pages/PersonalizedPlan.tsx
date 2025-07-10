import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { supabase } from "../utils/supabaseClient";

const PersonalizedPlan = () => {
  const location = useLocation();
  const formData = location.state?.formData;
  const [databaseDailyCalories, setDatabaseDailyCalories] = useState<number | null>(null);

  // Calculate nutritional needs based on form data
  const calculateDailyCalories = () => {
    if (!formData) return 1500;

    // Simplified BMR calculation (Mifflin-St Jeor Equation)
    let bmr;
    if (formData.gender === "male") {
      bmr =
        88.362 +
        13.397 * formData.currentWeight +
        4.799 * formData.height -
        5.677 * formData.age;
    } else {
      bmr =
        447.593 +
        9.247 * formData.currentWeight +
        3.098 * formData.height -
        4.33 * formData.age;
    }

    // Activity level multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      "lightly-active": 1.375,
      "moderately-active": 1.55,
      "very-active": 1.725,
    };

    const tdee =
      bmr *
      activityMultipliers[
        formData.activityLevel as keyof typeof activityMultipliers
      ];

    // Adjust for weight loss goal (create deficit)
    if (formData.goal === "weight-loss") {
      return Math.round(tdee - 500); // 500 calorie deficit for ~1 pound/week loss
    } else if (formData.goal === "muscle-gain") {
      return Math.round(tdee + 300); // 300 calorie surplus
    }

    return Math.round(tdee);
  };

  // Fetch daily calories from database
  useEffect(() => {
    const fetchDailyCalories = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error("User not authenticated");
          return;
        }

        const { data, error } = await supabase
          .from("user_details")
          .select("calculated_daily_calories")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching daily calories:", error);
          // Fallback to calculated value
          setDatabaseDailyCalories(calculateDailyCalories());
        } else if (data) {
          setDatabaseDailyCalories(data.calculated_daily_calories);
        }
      } catch (error) {
        console.error("Error in fetchDailyCalories:", error);
        // Fallback to calculated value
        setDatabaseDailyCalories(calculateDailyCalories());
      }
    };

    fetchDailyCalories();
  }, []);

  // Use database value if available, otherwise fallback to calculated
  const dailyCalories = databaseDailyCalories ?? calculateDailyCalories();
  const estimatedWeightLoss =
    formData?.currentWeight && formData?.goalWeight
      ? Math.abs(formData.currentWeight - formData.goalWeight)
      : 8;

  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedTimeline, setSelectedTimeline] = useState(4); // weeks

  const sampleMeals = [
    {
      meal: "Breakfast",
      name: "Masala Oats with Vegetables",
      calories: 320,
      protein: "12g",
      image: "/masalaoats.jpg",
    },
    {
      meal: "Lunch",
      name: "Quinoa Chole with Roti",
      calories: 450,
      protein: "18g",
      image: "/chole-quinoa.jpg",
    },
    {
      meal: "Dinner",
      name: "Paneer Tikka with Brown Rice",
      calories: 380,
      protein: "22g",
      image: "/pannertikka.jpg",
    },
  ];

  if (!formData) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No plan data found
            </h1>
            <p className="text-gray-600 mb-6">
              Please complete the onboarding form first.
            </p>
            <Link
              to="/enter-details"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              Start Onboarding
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Hi {formData.fullName.split(" ")[0]}! 👋
            </h1>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Your{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Personalized Plan
              </span>{" "}
              is Ready
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Based on your goals and preferences, we've created a customized
              meal plan described specifically for your weight loss journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Your Goals Summary */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Personalized Plan
              </h1>
              <p className="text-xl text-gray-600">
                Based on your goals and preferences
              </p>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Your Personal Goals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-orange-600">
                  {estimatedWeightLoss}kg
                </div>
                <div className="text-sm text-gray-600">Target Weight Loss</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-2xl font-bold text-orange-600">
                  {dailyCalories}
                </div>
                <div className="text-sm text-gray-600">Daily Kilojoules</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-bold text-orange-600">
                  {formData.timeline}
                </div>
                <div className="text-sm text-gray-600">Timeline</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sample Meals */}
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Your Daily Meals
            </h3>
            <p className="text-xl text-gray-600">
              Here's a sample of what your {formData.dietaryPreference} meal
              plan looks like
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleMeals.map((meal, index) => (
              <motion.div
                key={meal.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm font-medium text-orange-600 mb-2">
                    {meal.meal}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {meal.name}
                  </h4>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{meal.calories} calories</span>
                    <span>{meal.protein} protein</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Transformation?
            </h3>
            <p className="text-xl text-orange-100 mb-8">
              Your personalized meal plan is waiting. Let's begin your journey
              to a healthier you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/finalize-meals"
                className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Proceed to Meals
              </Link>
              <Link
                to="/meals"
                className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300"
              >
                View Sample Meals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PersonalizedPlan;
