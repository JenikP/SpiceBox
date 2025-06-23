import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
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
          navigate("/enter-details");
        }
      } else {
        const { fullName, phone, address } = formData;
        if (!fullName.trim() || !phone.trim() || !address.trim()) {
          alert("Please fill in all required fields");
          return;
        }

        const { error } = await signUp(formData.email, formData.password, {
          full_name: fullName,
          phone,
          address,
        });

        if (error) {
          alert("Account already exists or error signing up.");
        } else {
          alert("Account created successfully!");
          navigate("/enter-details");
        }
      }
    } catch (err: unknown) {
      console.error("Unexpected error:", err);
      alert("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          {isLogin ? "Sign In" : "Create Account"}
        </h2>
        <p className="text-white text-center mb-6">
          {isLogin ? "Welcome back to SpiceFit" : "Join SpiceFit today"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2"
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-white text-orange-700 font-semibold hover:bg-white/90 transition"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white underline text-sm"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
