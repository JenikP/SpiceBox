import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

const Home = () => {
  const features = [
    {
      title: "High Protein",
      description: "Every meal packed with quality protein to fuel your fitness goals",
      icon: "💪"
    },
    {
      title: "Desi Spices",
      description: "Authentic Indian flavours that make healthy eating enjoyable",
      icon: "🌶️"
    },
    {
      title: "Calorie Counted",
      description: "Precisely portioned meals designed for sustainable weight loss",
      icon: "📊"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Choose Your Plan",
      description: "Tell us your goals and we'll create a personalized meal plan"
    },
    {
      step: "02",
      title: "Fresh Daily Delivery",
      description: "Healthy Indian meals delivered fresh to your door every day"
    },
    {
      step: "03",
      title: "See Real Results",
      description: "Follow the plan and watch the transformation happen"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Melbourne",
      text: "Lost 8kg in 12 weeks! Finally found Indian food that helps me lose weight instead of gaining it.",
      rating: 5
    },
    {
      name: "Raj Patel",
      location: "Sydney",
      text: "The flavours are incredible. I don't feel like I'm on a diet at all. Down 12kg and counting!",
      rating: 5
    },
    {
      name: "Anita Kumar",
      location: "Brisbane",
      text: "SpiceFit changed my relationship with food. Healthy Indian meals that actually taste amazing.",
      rating: 5
    }
  ];

  const featuredMeals = [
    {
      name: "Protein Dal Bowl",
      calories: "320 kcal",
      protein: "22g protein",
      image: "https://images.pexels.com/photos/6544379/pexels-photo-6544379.jpeg?auto=compress&cs=tinysrgb&h=350"
    },
    {
      name: "Spiced Lentil Curry",
      calories: "285 kcal",
      protein: "18g protein",
      image: "https://images.pexels.com/photos/20004800/pexels-photo-20004800.jpeg?auto=compress&cs=tinysrgb&h=350"
    },
    {
      name: "Turmeric Rice Bowl",
      calories: "340 kcal",
      protein: "15g protein",
      image: "https://images.pexels.com/photos/28674705/pexels-photo-28674705.jpeg?auto=compress&cs=tinysrgb&h=350"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Healthy Indian.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Delivered.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Personalised weight-loss meals inspired by traditional Indian flavours — 
                fresh, calorie-smart, and delivered to your door.
              </p>
              <Link
                to="/enter-details"
                className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Start Your Plan
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/6544379/pexels-photo-6544379.jpeg?auto=compress&cs=tinysrgb&h=600"
                alt="Healthy Indian meal bowl"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-orange-500">320</div>
                <div className="text-sm text-gray-600">calories per meal</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to transform your health</p>
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What's Cooking?</h2>
            <p className="text-xl text-gray-600">Featured meals crafted for your goals</p>
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{meal.name}</h3>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real results from real people</p>
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
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
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
              Join thousands of Indian Australians who've already started their journey
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