import { motion } from "framer-motion";
import Layout from "../components/Layout";

function Contact() {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Need Help? We're Here For You.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our meals, plans, or delivery? Our friendly team is ready to help you on your weight loss journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="inquiry"
                    name="inquiry"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select inquiry type</option>
                    <option value="general">General Question</option>
                    <option value="meals">About Our Meals</option>
                    <option value="delivery">Delivery & Shipping</option>
                    <option value="billing">Billing & Plans</option>
                    <option value="dietary">Dietary Requirements</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {/* Support Hours */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-500 text-xl">🕒</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 ml-4">Support Hours</h3>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM</p>
                  <p><strong>Saturday:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Sunday:</strong> 10:00 AM - 4:00 PM</p>
                  <p className="text-sm text-orange-600 mt-3">
                    *All times are in Australian Eastern Time (AET)
                  </p>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-lg">📞</span>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">1800-SPICEFIT</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-lg">✉️</span>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">hello@spicefit.com.au</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-lg">💬</span>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">WhatsApp</p>
                      <p className="text-gray-600">+61 400 123 456</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-2">Quick Answers</h3>
                <p className="mb-4">Check our FAQ for instant answers to common questions.</p>
                <button className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  View FAQ
                </button>
              </motion.div>

              {/* Live Chat */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-500 text-2xl">💬</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Chat with our support team in real-time
                  </p>
                  <button className="text-orange-500 font-medium hover:text-orange-600 transition-colors">
                    Start Chat →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

export default Contact;