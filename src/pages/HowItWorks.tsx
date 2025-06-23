import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Healthy Indian Meals, Reimagined",
      description: "We've taken traditional Indian recipes and transformed them using modern nutrition science. Every meal is carefully crafted to be high in protein, rich in authentic spices, and perfectly portioned for weight loss.",
      features: [
        "Traditional recipes with a healthy twist",
        "High-protein ingredients in every meal",
        "Authentic spices for maximum flavour",
        "Calorie-controlled portions"
      ],
      image: "https://images.pexels.com/photos/6220707/pexels-photo-6220707.jpeg?auto=compress&cs=tinysrgb&h=600"
    },
    {
      step: "02", 
      title: "Delivered to Your Door",
      description: "Fresh meals prepared daily in our commercial kitchen and delivered straight to your doorstep. No meal prep, no shopping, no cooking - just delicious, healthy Indian food ready when you are.",
      features: [
        "Fresh meals prepared daily",
        "Insulated packaging keeps food fresh",
        "Flexible delivery schedule",
        "Free delivery on all plans"
      ],
      image: "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&h=600"
    },
    {
      step: "03",
      title: "Follow the Plan. See Results",
      description: "Stick to your personalized meal plan and watch the transformation happen. Our scientifically-designed portions and balanced nutrition make weight loss sustainable and enjoyable.",
      features: [
        "Personalized calorie targets",
        "Balanced macronutrients",
        "Progress tracking support",
        "Sustainable weight loss"
      ],
      image: "https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&h=600"
    }
  ];

  const guaranteeFeatures = [
    {
      icon: "🎯",
      title: "Weight Loss Guarantee",
      description: "Follow our meal plan exclusively and see results, or get your money back"
    },
    {
      icon: "🥗",
      title: "Only SpiceFit Meals",
      description: "Eat only our carefully portioned meals for maximum effectiveness"
    },
    {
      icon: "📱",
      title: "Progress Tracking",
      description: "Weekly check-ins and progress monitoring to keep you on track"
    },
    {
      icon: "💪",
      title: "Proven Results",
      description: "Join thousands who've successfully lost weight with our system"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              How{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                SpiceFit
              </span>{" "}
              Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transform your health with delicious Indian meals 
              designed for sustainable weight loss
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        {steps.map((step, index) => (
          <div key={step.step} className={`py-16 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className={index % 2 === 1 ? 'lg:col-start-2' : ''}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      {step.step}
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {step.title}
                    </h2>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-4">
                    {step.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                        className="flex items-center"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-4"></div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={index % 2 === 1 ? 'lg:col-start-1' : ''}
                >
                  <div className="relative">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="rounded-2xl shadow-2xl w-full"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                      <div className="text-2xl font-bold text-orange-500">Step {step.step}</div>
                      <div className="text-sm text-gray-600">Simple & Effective</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Weight Loss Guarantee Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Our Weight Loss Guarantee
            </h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              We're so confident in our system that we guarantee results when you eat only SpiceFit meals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guaranteeFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-orange-100">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Fix the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Indian Gene
                </span>
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                For generations, our ancestors were strong, lean, and healthy. They ate traditional Indian foods 
                that nourished their bodies and fueled their active lifestyles.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Modern life has changed how we eat, but our genetics haven't. SpiceFit brings back the ancestral 
                strength by combining traditional Indian flavours with modern nutrition science. We're not just 
                helping you lose weight - we're helping you reclaim your heritage of health.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">5000+</div>
                  <div className="text-sm text-gray-400">Lives Transformed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">50kg+</div>
                  <div className="text-sm text-gray-400">Average Weight Lost</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">98%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="https://images.pexels.com/photos/20004800/pexels-photo-20004800.jpeg?auto=compress&cs=tinysrgb&h=600"
                alt="Traditional Indian healthy meal"
                className="rounded-2xl shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Transformation?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join the SpiceFit family and discover how delicious healthy eating can be
            </p>
            <Link
              to="/enter-details"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-xl mr-4"
            >
              Start My Plan Now
            </Link>
            <Link
              to="/meals"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg border-2 border-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300"
            >
              View Our Meals
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;