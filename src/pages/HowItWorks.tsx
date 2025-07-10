import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Tell Us About You",
      description:
        "Share your health goals, dietary preferences, and lifestyle. Our smart algorithm creates a personalized meal plan just for you.",
      features: [
        "Quick 5-minute health assessment",
        "Dietary preference customization",
        "Goal-specific meal planning",
        "Allergy and restriction consideration",
      ],
      image: "/homepage.png",
    },
    {
      step: "02",
      title: "Healthy Indian Meals, Reimagined",
      description:
        "We've taken traditional Indian recipes and transformed them using modern nutrition science. Every meal is carefully crafted to be high in protein, rich in authentic spices, and perfectly portioned for weight loss.",
      features: [
        "Traditional recipes with a healthy twist",
        "High-protein ingredients in every meal",
        "Authentic spices for maximum flavour",
        "Calorie-controlled portions",
      ],
      image: "/masalaoats.jpg",
    },
    {
      step: "03",
      title: "Delivered to Your Door",
      description:
        "Fresh meals prepared daily in our commercial kitchen and delivered straight to your doorstep. No meal prep, no shopping, no cooking - just delicious, healthy Indian food ready when you are.",
      features: [
        "Fresh meals prepared daily",
        "Insulated packaging keeps food fresh",
        "Flexible delivery schedule",
        "Free delivery on all plans",
      ],
      image: "/chole-quinoa.jpg",
    },
    {
      step: "04",
      title: "Follow the Plan. See Results",
      description:
        "Enjoy your meals, track your progress, and watch the transformation happen. Our nutrition team is always available to support your journey.",
      features: [
        "Easy meal tracking and progress monitoring",
        "Weekly check-ins with nutrition experts",
        "Flexible plan adjustments",
        "24/7 customer support",
      ],
      image: "/pannertikka.jpg",
    },
  ];

  const benefits = [
    {
      icon: "🎯",
      title: "Personalized for You",
      description:
        "Every meal plan is customized based on your specific goals, preferences, and dietary requirements.",
    },
    {
      icon: "👨‍🍳",
      title: "Chef-Prepared Meals",
      description:
        "Our expert Indian chefs prepare every meal using traditional techniques and the finest ingredients.",
    },
    {
      icon: "📱",
      title: "Easy to Track",
      description:
        "Monitor your progress with our intuitive app and get insights into your health journey.",
    },
    {
      icon: "🚀",
      title: "Proven Results",
      description:
        "Join thousands who've successfully achieved their weight loss goals with SpiceBox.",
    },
    {
      icon: "🚀",
      title: "Made Fresh Locally",
      description:
        "Prepared daily in our local kitchens using the freshest ingredients sourced from trusted suppliers.",
    },
    {
      icon: "🚀",
      title: "No Preservatives",
      description:
        "Pure, natural ingredients with no artificial preservatives, chemicals, or additives for your health and wellness.",
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
              How{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                SpiceBox
              </span>{" "}
              Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From personalized meal planning to doorstep delivery, we've made
              healthy eating simple, delicious, and authentically Indian.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 ${
                index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                <div className="flex items-center mb-6">
                  <span className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mr-4">
                    {step.step}
                  </span>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                <ul className="space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0"
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
              </div>
              <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
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
              We're not just another meal delivery service. We're your partners
              in achieving sustainable weight loss with authentic Indian
              flavors.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of satisfied customers who've transformed their
              health with SpiceBox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/enter-details"
                className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Get My Personalized Plan
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

export default HowItWorks;
