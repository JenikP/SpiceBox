// src/pages/Checkout.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { meals } from "../data/meals";
import Layout from "../components/Layout";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Always use VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "***REMOVED***51RfckJE6vfmHs239tTjsBILgAAg5ubIDm1lzGzwendUxW5MbRO8l3VJprWhFwebqfIQQ8Q9LNm3sOZHX8u3eWiM3006O1uHom1",
);

// Validation schema for email and special instructions
const checkoutSchema = z.object({
  specialInstructions: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
});
type CheckoutFormData = z.infer<typeof checkoutSchema>;

// --- Payment Form Content ---
function PaymentFormContent({
  pricing,
  userProfile,
  specialInstructions,
}: {
  pricing: any;
  userProfile: any;
  specialInstructions: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: userProfile?.email || "",
      specialInstructions: specialInstructions || "",
    },
  });

  useEffect(() => {
    if (userProfile?.email) setValue("email", userProfile.email);
    setValue("specialInstructions", specialInstructions);
  }, [userProfile, specialInstructions, setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded yet.");
      setMessage("Payment system not ready. Please wait and try again.");
      return;
    }
    setIsProcessingPayment(true);
    setMessage(null);
    console.log("Submitting payment with data:", data);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
        receipt_email: data.email,
      },
    });
    if (error) {
      console.error("Payment error:", error);
      setMessage(error.message || "Payment failed. Please try another card.");
    }
    setIsProcessingPayment(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="your@email.com"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <PaymentElement />
      {message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{message}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={isProcessingPayment || !stripe || !elements}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessingPayment ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          `Pay Securely - $${pricing?.total?.toFixed(2) || "0.00"}`
        )}
      </button>
    </form>
  );
}

// --- Main Checkout Page ---
export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlan = location.state?.selectedPlan;
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedMeals, setSelectedMeals] = useState<any[]>([]);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [userPlanSelection, setUserPlanSelection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [clientSecretError, setClientSecretError] = useState<string>("");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) {
          console.log("User not authenticated, redirecting to /auth");
          navigate("/auth");
          return;
        }

        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        setUserProfile(profile);

        // Get user plan selection from database
        const { data: planSelection, error: planError } = await supabase
          .from("user_plan_selections")
          .select("*")
          .eq("user_id", authUser.id)
          .single();

        if (planSelection && !planError) {
          setUserPlanSelection(planSelection);
        }

        // Get weekly meals
        const { data: weeklyMeals } = await supabase
          .from("weekly_meal_plan")
          .select("*")
          .eq("user_id", authUser.id);
        if (weeklyMeals && weeklyMeals.length > 0) {
          const mealsWithDetails = weeklyMeals.map((wm) => {
            const meal = meals.find((m) => m.id === wm.meal_id);
            return { ...meal, ...wm };
          });
          setSelectedMeals(mealsWithDetails);
        }

        // Get meal plan
        const { data: plan } = await supabase
          .from("meal_plans")
          .select("*")
          .eq("user_id", authUser.id)
          .single();
        setMealPlan(plan);

        // Calculate pricing using database plan selection
        const pricing = calculatePricing(planSelection || selectedPlan, plan);

        // Fetch payment intent clientSecret
        const planToUse = planSelection ||
          selectedPlan ||
          plan || { name: "Custom Plan", id: "custom" };

        console.log("Attempting to create payment intent...");
        console.log("Plan data:", planToUse);
        console.log("Pricing data:", pricing);

        try {
          const response = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              planName:
                planToUse?.plan_name || planToUse?.name || "Custom Plan",
              amount: Math.round((pricing?.total || 50) * 100),
              planId: planToUse?.plan_id || planToUse?.id || "custom",
              customerEmail: profile?.email || authUser.email,
              userId: authUser.id,
              mealCount: weeklyMeals?.length || 0,
            }),
          });
          console.log("Payment intent response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Payment intent response data:", data);

            if (data.clientSecret) {
              setClientSecret(data.clientSecret);
              setClientSecretError("");
              console.log("✅ Client Secret received:", data.clientSecret);
            } else {
              setClientSecretError("No clientSecret in response from server.");
              console.error(
                "❌ No clientSecret in payment intent response:",
                data,
              );
            }
          } else {
            const errorText = await response.text();
            setClientSecretError(
              `Failed to fetch payment intent: ${response.status} - ${errorText}`,
            );
            console.error(
              "❌ Failed to fetch payment intent:",
              response.status,
              response.statusText,
              errorText,
            );
          }
        } catch (fetchError) {
          setClientSecretError(`Network error: ${fetchError.message}`);
          console.error(
            "❌ Network error creating payment intent:",
            fetchError,
          );
        }
      } catch (error) {
        setClientSecretError("Error occurred in fetchData: " + error.message);
        console.error("Checkout fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate, selectedPlan]);

  const calculateNutrition = () => {
    const totalKJ = selectedMeals.reduce(
      (sum, meal) => sum + (meal?.kj || 0),
      0,
    );
    const totalProtein = selectedMeals.reduce(
      (sum, meal) => sum + (meal?.protein || 0),
      0,
    );
    const averageDailyKJ = Math.round(totalKJ / 7);
    const weeklyProtein = Math.round(totalProtein);
    return { averageDailyKJ, weeklyProtein, totalKJ };
  };

  const calculatePricing = (planData?: any, mealPlan?: any) => {
    let basePrice, subtotal, total;

    // Use database plan selection first, then fallback to other sources
    if (planData && planData.plan_price) {
      basePrice = Number(planData.plan_price);
      subtotal = basePrice;
      const discount = basePrice * 0.15;
      total = subtotal - discount;
      return { basePrice, discount, subtotal, total };
    } else if (selectedPlan) {
      basePrice =
        selectedPlan.price ||
        selectedPlan.weeklyPrice ||
        selectedPlan.monthlyPrice ||
        50;
      subtotal = basePrice;
      const discount = basePrice * 0.15;
      total = subtotal - discount;
      return { basePrice, discount, subtotal, total };
    } else if (mealPlan) {
      basePrice = (mealPlan.price_per_week || 50) * (mealPlan.duration || 1);
      const discount = basePrice * 0.15;
      subtotal = basePrice;
      total = subtotal - discount;
      return { basePrice, discount, subtotal, total };
    } else {
      basePrice = 50;
      const discount = basePrice * 0.15;
      subtotal = basePrice;
      total = subtotal - discount;
      return { basePrice, discount, subtotal, total };
    }
  };

  const nutrition = calculateNutrition();
  const pricing = calculatePricing(userPlanSelection, mealPlan);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your order...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Complete Your Order
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delivery Address
                </h2>
                <div className="space-y-2 text-gray-600 mb-4">
                  <p className="font-semibold">
                    {userProfile?.full_name || "Name not provided"}
                  </p>
                  <p>{userProfile?.address || "Address not provided"}</p>
                  <p>{userProfile?.phone || "Phone not provided"}</p>
                </div>

                {/* Special Instructions in Delivery Section */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Delivery Instructions (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Any special instructions for delivery (e.g., gate code, preferred delivery time, etc.)"
                  />
                </div>
              </div>

              {/* Meal Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Your Weekly Meals ({selectedMeals.length} meals)
                </h2>
                {selectedMeals.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                    {selectedMeals.slice(0, 6).map((meal, index) => (
                      <div
                        key={`meal-${meal.id}-${index}`}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={meal?.image || "/placeholder-meal.jpg"}
                          alt={meal?.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">
                            {meal?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {meal?.kj} kJ • {meal?.protein}g protein
                          </p>
                        </div>
                      </div>
                    ))}
                    {selectedMeals.length > 6 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        +{selectedMeals.length - 6} more meals...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No meals selected yet.</p>
                    <button
                      onClick={() => navigate("/finalize-meals")}
                      className="mt-2 text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Select your meals →
                    </button>
                  </div>
                )}
              </div>

              {/* Nutrition Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Nutrition Overview
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {nutrition.averageDailyKJ || 0}
                    </p>
                    <p className="text-sm text-gray-600">Daily kJ Average</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {nutrition.weeklyProtein || 0}g
                    </p>
                    <p className="text-sm text-gray-600">Weekly Protein</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {userPlanSelection?.plan_name ||
                        selectedPlan?.name ||
                        mealPlan?.name ||
                        "Custom Plan"}{" "}
                      (
                      {userPlanSelection?.billing_cycle ||
                        selectedPlan?.duration ||
                        mealPlan?.duration ||
                        "1 week"}
                      )
                    </span>
                    <span>${pricing?.subtotal?.toFixed(2) || "50.00"}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Early Bird Discount (15%)</span>
                    <span>-${pricing?.discount?.toFixed(2) || "7.50"}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${pricing?.total?.toFixed(2) || "42.50"}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Starting{" "}
                    {startDate.toLocaleDateString("en-AU", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6V8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-2zM6 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure Payment
                </h2>
                {clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: { colorPrimary: "#f97316" },
                      },
                    }}
                  >
                    <PaymentFormContent
                      pricing={pricing}
                      userProfile={userProfile}
                      specialInstructions={specialInstructions}
                    />
                  </Elements>
                ) : clientSecretError ? (
                  <div className="py-8 text-center text-red-500 font-medium">
                    Error loading payment form:
                    <br />
                    {clientSecretError}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-400">
                    Loading payment form…
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
