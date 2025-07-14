import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import { supabase } from "../utils/supabaseClient";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          alert("Invalid email or password");
        } else {
          // Check if user has already completed details
          const {
            data: { user: authUser },
          } = await supabase.auth.getUser();
          if (authUser) {
            const { data: userDetails } = await supabase
              .from("user_details")
              .select("id")
              .eq("user_id", authUser.id)
              .single();

            if (userDetails) {
              navigate("/enter-details");
            } else {
              navigate("/enter-details");
            }
          } else {
            navigate("/enter-details");
          }
        }
      } else {
        const { fullName, phone, address, email, password } = formData;

        if (!fullName || !phone || !address) {
          alert("Please fill in all required fields.");
          return;
        }

        if (!agreed) {
          alert("You must agree to the Terms and Conditions.");
          return;
        }

        const { error } = await signUp(email, password, {
          full_name: fullName,
          phone,
          address,
        });

        if (error) {
          alert("Account already exists or error signing up.");
        } else {
          alert("Account created successfully! Please complete your profile.");
          navigate("/enter-details");
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email to reset password:");
    if (!email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert("Error sending reset email. Check your email.");
    } else {
      alert("Password reset link sent to your email.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <div className="relative w-full max-w-md bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl shadow-xl text-white">
          <button
            className="absolute top-2 right-3 cursor-pointer text-white hover:text-gray-200 transition-colors"
            onClick={() => navigate("/")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Join SpiceBox"}
            </h2>
            <p className="text-orange-100">
              {isLogin
                ? "Continue your healthy journey"
                : "Start your healthy journey today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  required
                />
              </>
            )}

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              required
            />

            {!isLogin && (
              <label className="flex items-center space-x-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="accent-white"
                />
                <span>
                  I agree to the{" "}
                  <a href="/terms" className="underline">
                    Terms & Conditions
                  </a>
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-orange-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white hover:text-orange-200 transition-colors underline"
            >
              {isLogin
                ? "Need an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>

          {isLogin && (
            <div className="mt-2 text-center">
              <button
                onClick={handleForgotPassword}
                className="text-orange-200 hover:text-white transition-colors text-sm"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white border-opacity-30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gradient-to-br from-orange-500 to-red-500 px-2 text-white">
                Or
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button className="w-full py-2 rounded bg-[#4267B2] text-white flex items-center justify-center">
              <img
                src="/facebook.png"
                alt="Facebook"
                className="h-7 w-7 mr-2"
              />
              Login with Facebook
            </button>
            <button className="w-full py-2 rounded border bg-white border-gray-300 text-gray-700 flex items-center justify-center">
              <img src="/google.png" alt="Google" className="h-5 w-5 mr-2" />
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
