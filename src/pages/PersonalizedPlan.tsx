
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout";

const PersonalizedPlan = () => {
  const location = useLocation();
  const formData = location.state?.formData;
  const [selectedPlan, setSelectedPlan] = useState("premium");

  // Calculate nutritional needs based on form data
  const calculateDailyCalories = () => {
    if (!formData) return 1500;
    
    // Simplified BMR calculation (Mifflin-St Jeor Equation)
    let bmr;
    if (formData.gender === "male") {
      bmr = 88.362 + (13.397 * formData.currentWeight) + (4.799 * formData.height) - (5.677 * formData.age);
    } else {
      bmr = 447.593 + (9.247 * formData.currentWeight) + (3.098 * formData.height) - (4.330 * formData.age);
    }
    
    // Activity level multiplier
    const activityMultipliers = {
      "sedentary": 1.2,
      "lightly-active": 1.375,
      "moderately-active": 1.55,
      "very-active": 1.725
    };
    
    const tdee = bmr * activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers];
    
    // Adjust for weight loss goal (create deficit)
    if (formData.goal === "weight-loss") {
      return Math.round(tdee - 500); // 500 calorie deficit for ~1 pound/week loss
    } else if (formData.goal === "muscle-gain") {
      return Math.round(tdee + 300); // 300 calorie surplus
    }
    
    return Math.round(tdee);
  };

  const dailyCalories = calculateDailyCalories();
  const weeklyProtein = Math.round(formData?.currentWeight * 2.2 * 7) || 840; // 2.2g per kg body weight per day
  const estimatedWeightLoss = formData?.currentWeight && formData?.goalWeight 
    ? Math.abs(formData.currentWeight - formData.goalWeight) 
    : 8;

  const plans = [
    {
      id: "basic",
      name: "Essential Plan",
      price: 89,
      originalPrice: 119,
      description: "Perfect for getting started with healthy Indian meals",
      features: [
        "14 meals per week (2 meals/day)",
        "Breakfast + Lunch OR Lunch + Dinner",
        "Basic meal customization",
        "Weekly nutrition tracking",
        "Email support",
        "Free delivery in metro areas"
      ],
      badge: "Good Value",
      badgeColor: "bg-blue-500"
    },
    {
      id: "premium",
      name: "Complete Plan",
      price: 129,
      originalPrice: 179,
      description: "Our most popular plan with full meal coverage",
      features: [
        "21 meals per week (3 meals/day)",
        "Breakfast + Lunch + Dinner",
        "Full meal customization",
        "Daily nutrition tracking",
        "Priority phone & chat support",
        "Free delivery nationwide",
        "Weekly nutritionist consultation",
        "Progress tracking app"
      ],
      badge: "Most Popular",
      badgeColor: "bg-gradient-to-r from-orange-500 to-red-500",
      recommended: true
    },
    {
      id: "premium-plus",
      name: "Transformation Plan",
      price: 179,
      originalPrice: 249,
      description: "Maximum support for serious transformation goals",
      features: [
        "21 meals per week + 7 snacks",
        "All meals + healthy snacks",
        "Premium meal customization",
        "Real-time nutrition tracking",
        "24/7 support hotline",
        "Same-day delivery available",
        "Weekly nutritionist consultation",
        "Monthly fitness coaching call",
        "Supplement recommendations",
        "Weight loss guarantee"
      ],
      badge: "Best Results",
      badgeColor: "bg-purple-500"
    }
  ];

  const sampleMeals = [
    {
      meal: "Breakfast",
      name: "Masala Oats with Vegetables",
      calories: 320,
      protein: "12g",
      image: "/masalaoats.jpg"
    },
    {
      meal: "Lunch", 
      name: "Quinoa Chole with Roti",
      calories: 450,
      protein: "18g",
      image: "/chole-quinoa.jpg"
    },
    {
      meal: "Dinner",
      name: "Paneer Tikka with Brown Rice",
      calories: 380,
      protein: "22g",
      image: "/pannertikka.jpg"
    }
  ];

  if (!formData) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No plan data found</h1>
            <p className="text-gray-600 mb-6">Please complete the onboarding form first.</p>
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
              Hi {formData.fullName.split(' ')[0]}! 👋
            </h1>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Your{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Personalized Plan
              </span>{" "}
              is Ready
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Based on your goals and preferences, we've created a customized meal plan 
              designed specifically for your {formData.goal.replace('-', ' ')} journey.
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
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Your Personal Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-orange-600">{estimatedWeightLoss}kg</div>
                <div className="text-sm text-gray-600">Target Weight Loss</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-2xl font-bold text-orange-600">{dailyCalories}</div>
                <div className="text-sm text-gray-600">Daily Calories</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">💪</div>
                <div className="text-2xl font-bold text-orange-600">{weeklyProtein}g</div>
                <div className="text-sm text-gray-600">Weekly Protein</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-bold text-orange-600">{formData.timeline}</div>
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Your Daily Meals</h3>
            <p className="text-xl text-gray-600">
              Here's a sample of what your {formData.dietaryPreference} meal plan looks like
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
                  <div className="text-sm font-medium text-orange-600 mb-2">{meal.meal}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{meal.name}</h4>
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

      {/* Pricing Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h3>
            <p className="text-xl text-gray-600">
              Select the plan that best fits your lifestyle and goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.recommended ? 'border-orange-500 scale-105' : 'border-gray-200'
                }`}
              >
                {plan.badge && (
                  <div className={`${plan.badgeColor} text-white px-4 py-2 rounded-full text-sm font-medium absolute -top-3 left-1/2 transform -translate-x-1/2`}>
                    {plan.badge}
                  </div>
                )}
                
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-lg text-gray-500 ml-2">/week</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="line-through">${plan.originalPrice}</span>
                      <span className="text-green-600 ml-2 font-medium">
                        Save ${plan.originalPrice - plan.price}
                      </span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                      selectedPlan === plan.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                    }`}
                  >
                    {selectedPlan === plan.id ? 'Selected Plan' : 'Select Plan'}
                  </button>
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
              Your personalized meal plan is waiting. Let's begin your journey to a healthier you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/checkout"
                state={{ 
                  selectedPlan: plans.find(p => p.id === selectedPlan),
                  formData 
                }}
                className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/meals"
                className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300"
              >
                View All Meals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PersonalizedPlan;
