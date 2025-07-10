import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * Default 404 page, displayed when a user attempts to access a non-existent route.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 not found: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl text-gray-600">Page not found</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="px-4 py-2 mt-8 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Return home
      </button>
    </div>
  );
};

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

const NotFoundPage = () => {
  return (
    <Layout>
      <section className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-8xl mb-6">🌶️</div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              Oops! The page you're looking for seems to have gotten lost in our spice cabinet.
            </p>
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Go Back Home
              </Link>
              <div className="text-sm text-gray-500">
                Or try one of these popular pages:
              </div>
              <div className="flex flex-col space-y-2 text-sm">
                <Link to="/meals" className="text-orange-600 hover:text-orange-700 transition-colors">
                  View Our Meals
                </Link>
                <Link to="/plan" className="text-orange-600 hover:text-orange-700 transition-colors">
                  See Pricing Plans
                </Link>
                <Link to="/how-it-works" className="text-orange-600 hover:text-orange-700 transition-colors">
                  How It Works
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFoundPage;