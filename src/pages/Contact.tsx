
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  // Chat functionality
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your SpiceBox AI assistant. How can I help you today? 🌶️",
      isAI: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // AI response generator
  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("meal") || message.includes("food") || message.includes("diet")) {
      return "Our meals are freshly prepared daily with authentic Indian spices and designed for weight loss. We offer vegetarian, non-vegetarian, vegan, and keto options. Would you like to know more about our meal plans?";
    }
    
    if (message.includes("price") || message.includes("cost") || message.includes("subscription")) {
      return "Our plans start from $89/week for 14 meals. We offer flexible subscriptions with no lock-in contracts. You can pause or cancel anytime. Would you like me to help you choose the right plan?";
    }
    
    if (message.includes("delivery") || message.includes("shipping")) {
      return "We deliver fresh meals every morning to your doorstep across major Australian cities. Delivery is free on all plans and we use insulated packaging to keep your meals fresh.";
    }
    
    if (message.includes("weight loss") || message.includes("lose weight")) {
      return "Our meals are scientifically designed for weight loss with controlled calories and high protein. Many customers lose 2-4kg in their first month! Each meal includes nutritional information to track your progress.";
    }
    
    if (message.includes("ingredients") || message.includes("allergen") || message.includes("allergy")) {
      return "We use fresh, authentic Indian ingredients and spices. During signup, you can specify any allergies or dietary restrictions. All our meals include detailed ingredient lists and allergen information.";
    }
    
    if (message.includes("cancel") || message.includes("pause") || message.includes("subscription")) {
      return "You can pause or cancel your subscription anytime through your profile page or by contacting us. There are no cancellation fees or lock-in contracts. We're here to support your journey!";
    }
    
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! Welcome to SpiceBox! I'm here to help you with any questions about our healthy Indian meal delivery service. What would you like to know?";
    }
    
    if (message.includes("thank") || message.includes("thanks")) {
      return "You're welcome! Is there anything else I can help you with regarding SpiceBox meals or your health journey?";
    }
    
    // Default response
    return "I'm here to help with any questions about SpiceBox! You can ask me about our meals, pricing, delivery, weight loss programs, or anything else. If you need more detailed assistance, feel free to fill out our contact form or call us at 1800 SPICEBOX.";
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      isAI: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(newMessage),
        isAI: true,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 seconds delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: "📞",
      title: "Phone Support",
      description: "Speak with our customer service team",
      contact: "1800 SPICEBOX",
      hours: "Mon-Fri 9AM-6PM AEST"
    },
    {
      icon: "✉️",
      title: "Email Support",
      description: "Send us your questions or feedback",
      contact: "hello@spicebox.com.au",
      hours: "We reply within 24 hours"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Get instant help from our team",
      contact: "Chat widget (bottom right)",
      hours: "Mon-Fri 9AM-6PM AEST"
    }
  ];

  const faqs = [
    {
      question: "How does the meal delivery work?",
      answer: "We deliver fresh, pre-prepared meals to your door every morning. Simply heat and enjoy authentic Indian flavors designed for your weight loss goals."
    },
    {
      question: "Can I customize my meal plan?",
      answer: "Yes! During onboarding, you'll specify dietary preferences (vegetarian, non-vegetarian, vegan, keto, etc.) and any allergies. We'll tailor your meals accordingly."
    },
    {
      question: "What if I don't lose weight?",
      answer: "We offer a weight loss guarantee. If you follow the plan and don't see results, we'll work with you to adjust your meals or provide a refund."
    },
    {
      question: "How fresh are the meals?",
      answer: "All meals are prepared fresh daily in our commercial kitchen using traditional Indian cooking methods and delivered within hours of preparation."
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
              Get in{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about our meal plans? Need help with your order? 
              Our friendly customer service team is here to help you succeed on your health journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className="font-semibold text-orange-600 mb-2">{method.contact}</div>
                <div className="text-sm text-gray-500">{method.hours}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Send Us a Message
            </h2>
            <p className="text-xl text-gray-600">
              We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find quick answers to common questions about SpiceBox
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Our team is ready to help you start your health journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:1800742336"
                className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300"
              >
                Call Us Now
              </a>
              <a
                href="mailto:hello@spicebox.com.au"
                className="inline-block bg-transparent text-white border-2 border-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-orange-600 transition-all duration-300"
              >
                Send Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="mb-4 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-orange-500 font-bold text-sm">AI</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">SpiceBox Assistant</h3>
                      <p className="text-xs text-orange-100">Online now</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-white hover:text-orange-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-2xl ${
                        message.isAI
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isAI ? 'text-gray-500' : 'text-orange-100'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 ${
            isChatOpen 
              ? 'bg-gray-600 hover:bg-gray-700' 
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
          } text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="chat"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </motion.svg>
            )}
          </AnimatePresence>
          
          {/* Notification dot for new messages */}
          {!isChatOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </motion.button>
      </div>
    </Layout>
  );
};

export default Contact;
