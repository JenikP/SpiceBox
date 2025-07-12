import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Meals", path: "/meals" },
    { name: "Plans", path: "/plan" },
    { name: "Contact", path: "/contact" },
    { name: "Profile", path: "/profile" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-sm border-b border-orange-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="SpiceFit" className="h-[8rem] w-auto" />
              <span className="text-xs text-orange-600 font-medium">
                Healthy. Results. Delivered.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                  location.pathname === item.path
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Tablet Navigation - Horizontal scrollable */}
          <nav className="hidden md:flex lg:hidden overflow-x-auto scrollbar-hide space-x-4 max-w-md">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-xs font-medium transition-colors hover:text-orange-600 whitespace-nowrap px-2 py-1 ${
                  location.pathname === item.path
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all duration-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/enter-details"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Your Plan
              </Link>
            )}
          </div>
        </div>

        {/* Mobile & Tablet Navigation Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium transition-colors hover:text-orange-600 hover:bg-orange-50 rounded-lg ${
                    location.pathname === item.path
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <div className="mx-4 mt-4 space-y-2">
                  <div className="text-sm text-gray-600 text-center">
                    Welcome, {user.email?.split('@')[0]}
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold text-center hover:bg-gray-300 transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/enter-details"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mx-4 mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold text-center hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                >
                  Start Your Plan
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;