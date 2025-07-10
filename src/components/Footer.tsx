import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="text-2xl font-bold">SpiceFit</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Healthy Indian meals delivered fresh to help you achieve your
              weight loss goals. Traditional flavours, modern nutrition science.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <img src="/facebook.png" alt="Facebook" className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <img
                  src="../instagram.png"
                  alt="instagram"
                  className="w-6 h-6 bg-white rounded-full"
                />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/how-it-works"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/meals"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Our Meals
                </Link>
              </li>
              <li>
                <Link
                  to="/plan"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="tel:1800-SPICEFIT"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  1800-SPICEFIT
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-center mb-4">
            © 2025 SpiceFit. All rights reserved. Made with ❤️ for the South
            Asian community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
