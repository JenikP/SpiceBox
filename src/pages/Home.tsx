import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

const Home = () => {
  const features = [
    {
      icon: "🍛",
      title: "Authentic Indian Flavors",
      description:
        "Traditional recipes with a healthy twist, using aromatic spices and fresh ingredients.",
    },
    {
      icon: "⚖️",
      title: "Weight Loss Guaranteed",
      description:
        "Scientifically planned meals to help you lose weight while enjoying delicious food.",
    },
    {
      icon: "🚚",
      title: "Fresh Daily Delivery",
      description:
        "Meals prepared fresh every morning and delivered to your door.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Choose Your Plan",
      description:
        "Tell us your goals and we'll create a personalized meal plan",
    },
    {
      step: "02",
      title: "Fresh Daily Delivery",
      description:
        "Healthy Indian meals delivered fresh to your door every day",
    },
    {
      step: "03",
      title: "See Real Results",
      description: "Follow the plan and watch the transformation happen",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Melbourne",
      date: "Jan 2025",
      text: "Lost 8kg in 12 weeks! Finally found Indian food that helps me lose weight instead of gaining it.",
      rating: 5,
    },
    {
      name: "Raj Patel",
      location: "Melbourne",
      date: "Feb 2025",
      text: "The flavours are incredible. I don't feel like I'm on a diet at all. Down 12kg and counting!",
      rating: 5,
    },
    {
      name: "Abdul",
      location: "Melbourne",
      date: "Mayy 2025",
      text: "SpiceFit changed my relationship with food. Healthy Indian meals that actually taste amazing.",
      rating: 4.5,
    },
  ];

  const featuredMeals = [
    {
      name: "Protein Dal Bowl",
      calories: "320 kcal",
      protein: "22g protein",
      image:
        "https://images.pexels.com/photos/6544379/pexels-photo-6544379.jpeg?auto=compress&cs=tinysrgb&h=350",
    },
    {
      name: "Spiced Lentil Curry",
      calories: "285 kcal",
      protein: "18g protein",
      image:
        "https://images.pexels.com/photos/20004800/pexels-photo-20004800.jpeg?auto=compress&cs=tinysrgb&h=350",
    },
    {
      name: "Turmeric Rice Bowl",
      calories: "340 kcal",
      protein: "15g protein",
      image:
        "https://images.pexels.com/photos/28674705/pexels-photo-28674705.jpeg?auto=compress&cs=tinysrgb&h=350",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Healthy Indian Meals
                <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Delivered Fresh
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Lose weight without sacrificing the authentic Indian flavors you
                love. Fresh, nutritious meals crafted by expert chefs and
                delivered daily.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/plan"
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-xl text-center"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg border-2 border-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 text-center"
                >
                  How It Works
                </Link>
              </div>
              <div className="flex items-center mt-8 space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No contracts
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cancel anytime
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  100% satisfaction
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="/homepage.png"
                alt="Delicious Indian meals"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    Fresh & Hot
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                SpiceBox?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine traditional Indian cooking with modern nutrition
              science to deliver meals that are both delicious and healthy.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to transform your health
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/how-it-works"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-semibold border-2 border-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* What's Cooking Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What's Cooking?
            </h2>
            <p className="text-xl text-gray-600">
              Featured meals crafted for your goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMeals.map((meal, index) => (
              <motion.div
                key={meal.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold text-orange-600">
                    {meal.calories}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {meal.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{meal.protein}</p>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                    Add to Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/meals"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
            >
              View All Meals
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real people.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex mb-4">
                  {Array.from({ length: Math.floor(testimonial.rating) }).map(
                    (_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-orange-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ),
                  )}

                  {testimonial.rating % 1 !== 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-orange-500"
                    >
                      <defs>
                        <linearGradient id="half-grad">
                          <stop offset="50%" stopColor="currentColor" />
                          <stop offset="50%" stopColor="lightgray" />
                        </linearGradient>
                      </defs>
                      <path
                        fill="url(#half-grad)"
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  )}
                  <div style={{ marginLeft: 'auto' }}>
                    <span className="text-gray-500 text-sm">
                      {testimonial.date}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold">{testimonial.name}</span>
                  </div>
                  <span className="text-gray-500">{testimonial.location}</span>
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
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of Indian Australians who've already started their
              journey
            </p>
            <Link
              to="/enter-details"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Start Your Plan Today
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
