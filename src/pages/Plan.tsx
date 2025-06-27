import Layout from "../components/Layout";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

function Plan() {
  const plans = [
    {
      name: "Daily Plan",
      price: "$33",
      period: "per day",
      description: "Perfect for trying out SpiceFit",
      features: [
        "3 fresh meal daily",
        "Calorie-controlled portions",
        "Traditional Indian flavors",
        "Same-day delivery",
        "Basic nutrition tracking",
      ],
      color: "from-orange-400 to-orange-500",
    },
    {
      name: "Weekly Plan",
      price: "$189",
      originalPrice: "$231",
      period: "per week",
      description: "Most popular choice for consistent results",
      features: [
        "21 fresh meals weekly",
        "Free delivery all week",
        "Personalized meal selection",
        "Weight loss guarantee*",
        "Dedicated nutrition support",
        "Flexible meal scheduling",
        "Progress tracking app",
      ],
      popular: true,
      color: "from-red-500 to-red-600",
    },
    {
      name: "Monthly Plan",
      price: "$630",
      originalPrice: "$1000",
      period: "per month",
      description: "Best value for serious transformation",
      features: [
        "92 fresh meals monthly",
        "Free delivery all month",
        "Premium meal variety",
        "Weight loss guarantee*",
        "1-on-1 nutrition coaching",
        "Custom meal planning",
        "Priority customer support",
        "Exclusive recipe access",
      ],
      bestValue: true,
      color: "from-green-500 to-green-600",
    },
  ];

  const sellingPoints = [
    {
      iconColor: "from-orange-500 to-red-500",
      iconPath:
        "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      title: "Authentic Flavors",
      text: "Traditional Indian spices and cooking methods, just healthier",
    },
    {
      iconColor: "from-green-500 to-green-600",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Proven Results",
      text: "Weight loss guarantee when you follow our meal plans",
    },
    {
      iconColor: "from-blue-500 to-blue-600",
      iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Fresh Daily",
      text: "Prepared fresh every morning and delivered to your door",
    },
  ];

  const navigate = useNavigate();

  const handleSelectPlan = async (planName: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const planDetails = plans.find((p) => p.name === planName);
    if (!planDetails) return;

    await supabase.from("meal_plans").upsert({
      user_id: user.id,
      name: planDetails.name,
      price_per_week: parseFloat(planDetails.price.replace("$", "")), // you can adjust per logic
      duration:
        planDetails.name === "Daily Plan"
          ? 1
          : planDetails.name === "Weekly Plan"
          ? 1
          : 4,
    });

    navigate("/checkout");
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                SpiceBox
              </span>{" "}
              Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Start your weight loss journey with authentic Indian flavors. All
              plans include calorie-controlled meals, fresh ingredients, and the
              traditional spices you love.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                No contracts • Cancel anytime • 100% satisfaction guarantee
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map(
              ({
                name,
                price,
                period,
                originalPrice,
                description,
                features,
                color,
                popular,
                bestValue,
              }) => (
                <div
                  key={name}
                  className={`relative bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 ${
                    popular ? "ring-4 ring-red-500 ring-opacity-50" : ""
                  }`}
                >
                  {popular && (
                    <div className="absolute -top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                      Most Popular
                    </div>
                  )}
                  {bestValue && (
                    <div className="absolute -top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                      Best Value
                    </div>
                  )}

                  <div className="p-8 flex flex-col h-full">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {name}
                      </h3>
                      <p className="text-gray-600 mb-4">{description}</p>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span
                          className={`text-5xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
                        >
                          {price}
                        </span>
                        <div className="text-left">
                          <div className="text-gray-600 text-sm">{period}</div>
                          {originalPrice && (
                            <div className="text-gray-400 text-sm line-through">
                              {originalPrice}
                            </div>
                          )}
                        </div>
                      </div>
                      {originalPrice && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Save $
                          {parseInt(originalPrice.slice(1)) -
                            parseInt(price.slice(1))}
                        </div>
                      )}
                    </div>

                    <ul className="space-y-4 mb-8 flex-grow">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <svg
                            className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleSelectPlan(name)}
                      className={`w-full block text-center py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${color} hover:shadow-lg transform hover:scale-105 transition-all duration-200 mt-auto`}
                    >
                      Select Plan
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Why Choose Us */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why Choose SpiceFit?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sellingPoints.map(({ iconColor, iconPath, title, text }) => (
                  <div key={title} className="text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={iconPath}
                        />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {title}
                    </h4>
                    <p className="text-gray-600 text-sm">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h3>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  q: "What's included in the weight loss guarantee?",
                  a: "If you eat only SpiceFit meals for your chosen plan duration and don't see results, we'll refund your money. Terms and conditions apply.",
                },
                {
                  q: "Can I customize my meals?",
                  a: "Yes! During onboarding, you'll specify your dietary preferences (veg, non-veg, vegan, keto, halal) and we'll tailor your meals accordingly.",
                },
                {
                  q: "How fresh are the meals?",
                  a: "All meals are prepared fresh daily in our commercial kitchen using traditional Indian cooking methods and delivered within hours.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white rounded-xl shadow-md p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{q}</h4>
                  <p className="text-gray-600">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-4">
                Ready to Start Your Transformation?
              </h3>
              <p className="text-xl mb-6 opacity-90">
                Join thousands of Indian Australians who've already transformed
                their health with SpiceFit
              </p>
              <button
                onClick={() => handleSelectPlan(name)}
                className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Plan;
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Plan = () => {
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("weekly");

  const plans = [
    {
      id: "essential",
      name: "Essential Plan",
      description: "Perfect for getting started with healthy Indian meals",
      weeklyPrice: 89,
      monthlyPrice: 319,
      originalWeeklyPrice: 119,
      originalMonthlyPrice: 429,
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
      id: "complete",
      name: "Complete Plan",
      description: "Our most popular plan with full meal coverage",
      weeklyPrice: 129,
      monthlyPrice: 459,
      originalWeeklyPrice: 179,
      originalMonthlyPrice: 639,
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
      id: "transformation",
      name: "Transformation Plan",
      description: "Maximum support for serious transformation goals",
      weeklyPrice: 179,
      monthlyPrice: 639,
      originalWeeklyPrice: 249,
      originalMonthlyPrice: 889,
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

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can pause or cancel your subscription anytime with no cancellation fees or lock-in contracts."
    },
    {
      question: "How does delivery work?",
      answer: "We deliver fresh meals every morning to your doorstep. All deliveries are free and use insulated packaging to keep meals fresh."
    },
    {
      question: "Can I customize my meals?",
      answer: "Absolutely! During onboarding, you'll specify dietary preferences (vegetarian, vegan, keto, etc.) and any allergies or restrictions."
    },
    {
      question: "What if I don't like a meal?",
      answer: "We have a 100% satisfaction guarantee. If you're not happy with any meal, we'll replace it or provide a credit."
    },
    {
      question: "Do you cater to dietary restrictions?",
      answer: "Yes! We accommodate vegetarian, vegan, keto, gluten-free, and other dietary needs. Just let us know during signup."
    },
    {
      question: "How fresh are the meals?",
      answer: "All meals are prepared fresh daily in our commercial kitchen and delivered within hours of preparation."
    }
  ];

  const testimonials = [
    {
      name: "Priya S.",
      location: "Melbourne",
      plan: "Complete Plan",
      quote: "Lost 8kg in 3 months while eating the most delicious Indian food. The convenience is unmatched!",
      rating: 5
    },
    {
      name: "Rahul M.",
      location: "Sydney", 
      plan: "Transformation Plan",
      quote: "The nutritionist consultations were game-changing. Finally found a sustainable way to eat healthy.",
      rating: 5
    },
    {
      name: "Anjali K.",
      location: "Brisbane",
      plan: "Essential Plan",
      quote: "Perfect for my busy lifestyle. Authentic flavors without the guilt or cooking time.",
      rating: 5
    }
  ];

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
              Choose Your{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Flexible meal plans designed to fit your lifestyle and budget. 
              All plans include authentic Indian meals, free delivery, and no contracts.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No contracts</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button
                onClick={() => setBillingCycle("weekly")}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  billingCycle === "weekly"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                Monthly
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 10%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        ${billingCycle === "weekly" ? plan.weeklyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-lg text-gray-500 ml-2">
                        /{billingCycle === "weekly" ? "week" : "month"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="line-through">
                        ${billingCycle === "weekly" ? plan.originalWeeklyPrice : plan.originalMonthlyPrice}
                      </span>
                      <span className="text-green-600 ml-2 font-medium">
                        Save ${billingCycle === "weekly" 
                          ? plan.originalWeeklyPrice - plan.weeklyPrice 
                          : plan.originalMonthlyPrice - plan.monthlyPrice}
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
                  
                  <Link
                    to="/enter-details"
                    className={`w-full block text-center py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
                      plan.recommended
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700 border-2 border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real people on their SpiceBox journey
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                  <div className="text-sm text-orange-600 font-medium">{testimonial.plan}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about SpiceBox plans
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Choose your plan and start your journey to a healthier, happier you
            </p>
            <Link
              to="/enter-details"
              className="inline-block bg-white text-orange-600 px-12 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105 shadow-xl"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Plan;
