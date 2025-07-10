import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Plan = () => {
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">(
    "weekly",
  );

  const plans = [
    {
      id: "kickstart",
      name: "14-Day Kickstart Plan",
      description: "Perfect for getting started with healthy Indian meals",
      weeklyPrice: 189,
      monthlyPrice: 819,
      originalWeeklyPrice: 231,
      originalMonthlyPrice: 1001,
      price: 189,
      duration: "14 days",
      meals: 42,
      perMeal: "$9.00",
      notes: "Required to begin",
      features: [
        "42 meals (3 meals/day for 14 days)",
        "Same-day delivery",
        "Basic progress tracking",
        "Access to nutrition support",
      ],
      badge: "Required Start",
      badgeColor: "bg-orange-500",
    },
    {
      id: "monthly",
      name: "Monthly Plan",
      description: "Our most popular plan with full meal coverage",
      weeklyPrice: 187,
      monthlyPrice: 810,
      originalWeeklyPrice: 231,
      originalMonthlyPrice: 1001,
      price: 810,
      duration: "30 days",
      meals: 90,
      perMeal: "$9.00",
      notes: "Flexible after 14 days",
      features: [
        "90 meals (3/day for 30 days)",
        "Flexible subscription",
        "Pause or cancel anytime",
        "Progress tracking + nutrition support",
      ],
      badge: "Most Flexible",
      badgeColor: "bg-green-500",
      recommended: true,
    },
    {
      id: "full-journey",
      name: "Full Journey Plan",
      description: "Maximum support for serious transformation goals",
      weeklyPrice: 170,
      monthlyPrice: 735,
      originalWeeklyPrice: 231,
      originalMonthlyPrice: 1001,
      price: 2205,
      duration: "3 months",
      meals: 360,
      perMeal: "$8.17",
      notes: "Best value — pay upfront",
      features: [
        "273 meals total",
        "Upfront 3-month journey",
        "Priority support",
        "1-on-1 nutrition check-in",
        "Exclusive recipe access",
      ],
      badge: "Best Value",
      badgeColor: "bg-blue-600",
    },
  ];

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes! You can pause or cancel your subscription anytime with no cancellation fees or lock-in contracts.",
    },
    {
      question: "How does delivery work?",
      answer:
        "We deliver fresh meals every morning to your doorstep. All deliveries are free and use insulated packaging to keep meals fresh.",
    },
    {
      question: "Can I customize my meals?",
      answer:
        "Absolutely! During onboarding, you'll specify dietary preferences (vegetarian, vegan, keto, etc.) and any allergies or restrictions.",
    },
    {
      question: "What if I don't like a meal?",
      answer:
        "We have a 100% satisfaction guarantee. If you're not happy with any meal, we'll replace it or provide a credit.",
    },
    {
      question: "Do you cater to dietary restrictions?",
      answer:
        "Yes! We accommodate vegetarian, vegan, keto, gluten-free, and other dietary needs. Just let us know during signup.",
    },
    {
      question: "How fresh are the meals?",
      answer:
        "All meals are prepared fresh daily in our commercial kitchen and delivered within hours of preparation.",
    },
  ];

  const testimonials = [
    {
      name: "Priya S.",
      location: "Melbourne",
      plan: "Complete Plan",
      quote:
        "Lost 8kg in 3 months while eating the most delicious Indian food. The convenience is unmatched!",
      rating: 5,
    },
    {
      name: "Rahul M.",
      location: "Sydney",
      plan: "Transformation Plan",
      quote:
        "The nutritionist consultations were game-changing. Finally found a sustainable way to eat healthy.",
      rating: 5,
    },
    {
      name: "Anjali K.",
      location: "Brisbane",
      plan: "Essential Plan",
      quote:
        "Perfect for my busy lifestyle. Authentic flavors without the guilt or cooking time.",
      rating: 5,
    },
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
              Flexible meal plans designed to fit your lifestyle and budget. All
              plans include authentic Indian meals, free delivery, and no
              contracts.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
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
                <span>No contracts</span>
              </div>
              <div className="flex items-center space-x-2">
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
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
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
                  plan.recommended
                    ? "border-orange-500 scale-105"
                    : "border-gray-200"
                }`}
              >
                {plan.badge && (
                  <div
                    className={`${plan.badgeColor} text-white px-4 py-2 rounded-full text-sm font-medium absolute -top-3 left-1/2 transform -translate-x-1/2`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        $
                        {billingCycle === "weekly"
                          ? plan.weeklyPrice
                          : plan.monthlyPrice}
                      </span>
                      <span className="text-lg text-gray-500 ml-2">
                        /{billingCycle === "weekly" ? "week" : "month"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="line-through">
                        $
                        {billingCycle === "weekly"
                          ? plan.originalWeeklyPrice
                          : plan.originalMonthlyPrice}
                      </span>
                      <span className="text-green-600 ml-2 font-medium">
                        Save $
                        {billingCycle === "weekly"
                          ? plan.originalWeeklyPrice - plan.weeklyPrice
                          : plan.originalMonthlyPrice - plan.monthlyPrice}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Total Plan Price: </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${plan.price}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/enter-details"
                    className={`w-full block text-center py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
                      plan.recommended
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700 border-2 border-gray-200 hover:border-orange-300"
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
                    <svg
                      key={i}
                      className="w-5 h-5 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.location}
                    </div>
                  </div>
                  <div className="text-sm text-orange-600 font-medium">
                    {testimonial.plan}
                  </div>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
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
              Choose your plan and start your journey to a healthier, happier
              you
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
