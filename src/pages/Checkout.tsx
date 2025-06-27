
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../utils/supabaseClient";
import { meals } from "../data/meals";
import Layout from "../components/Layout";

// Validation schema
const checkoutSchema = z.object({
  cardName: z.string().min(1, "Name on card is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Expiry must be MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  specialInstructions: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedMeals, setSelectedMeals] = useState<any[]>([]);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [saveCard, setSaveCard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const watchedCardNumber = watch("cardNumber");
  const watchedExpiry = watch("expiry");

  // Format card number with spaces
  useEffect(() => {
    if (watchedCardNumber) {
      const formatted = watchedCardNumber.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      if (formatted !== watchedCardNumber) {
        setValue("cardNumber", formatted.replace(/\s/g, ""));
      }
    }
  }, [watchedCardNumber, setValue]);

  // Format expiry date
  useEffect(() => {
    if (watchedExpiry) {
      const cleaned = watchedExpiry.replace(/\D/g, "");
      if (cleaned.length >= 2) {
        const formatted = cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
        if (formatted !== watchedExpiry) {
          setValue("expiry", formatted);
        }
      }
    }
  }, [watchedExpiry, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user details
      const { data: userDetails } = await supabase
        .from("user_details")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setUser(userDetails);

      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setUserProfile(profile);

      // Fetch weekly meal plan
      const { data: weeklyMeals } = await supabase
        .from("weekly_meal_plan")
        .select("*")
        .eq("user_id", user.id);

      if (weeklyMeals) {
        const mealsWithDetails = weeklyMeals.map((wm) => {
          const meal = meals.find((m) => m.id === wm.meal_id);
          return { ...meal, ...wm };
        });
        setSelectedMeals(mealsWithDetails);
      }

      // Fetch meal plan
      const { data: plan } = await supabase
        .from("meal_plans")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setMealPlan(plan);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const calculateNutrition = () => {
    const totalKJ = selectedMeals.reduce((sum, meal) => sum + (meal?.kj || 0), 0);
    const totalProtein = selectedMeals.reduce((sum, meal) => sum + (meal?.protein || 0), 0);
    const averageDailyKJ = Math.round(totalKJ / 7);
    const weeklyProtein = Math.round(totalProtein);
    
    return { averageDailyKJ, weeklyProtein, totalKJ };
  };

  const calculatePricing = () => {
    const basePrice = mealPlan?.price_per_week * mealPlan?.duration || 0;
    const discount = basePrice * 0.15; // 15% discount
    const subtotal = basePrice;
    const total = subtotal - discount;
    
    return { basePrice, discount, subtotal, total };
  };

  const onSubmit = async (data: CheckoutFormData) => {
    const orderId = `SF${Date.now()}`;
    setOrderNumber(orderId);

    const { error } = await supabase.from("orders").insert({
      user_id: user?.user_id,
      meal_plan_id: mealPlan?.id,
      order_number: orderId,
      card_name: data.cardName,
      card_number: data.cardNumber,
      expiry: data.expiry,
      cvv: data.cvv,
      save_card: saveCard,
      special_instructions: data.specialInstructions || "",
      total_amount: calculatePricing().total,
    });

    if (!error) {
      setOrderConfirmed(true);
      setShowConfirmDialog(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

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

  const nutrition = calculateNutrition();
  const pricing = calculatePricing();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1); // Start tomorrow

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Complete Your Order
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Details */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Delivery Address
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p className="font-semibold">{userProfile?.full_name}</p>
                  <p>{userProfile?.address}</p>
                  <p>{userProfile?.phone}</p>
                </div>
              </div>

              {/* Meal Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Your Weekly Meals
                </h2>
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {selectedMeals.slice(0, 6).map((meal, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={meal?.image || "/placeholder-meal.jpg"}
                        alt={meal?.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{meal?.name}</p>
                        <p className="text-xs text-gray-500">{meal?.kj} kJ • {meal?.protein}g protein</p>
                      </div>
                    </div>
                  ))}
                  {selectedMeals.length > 6 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      +{selectedMeals.length - 6} more meals...
                    </p>
                  )}
                </div>
              </div>

              {/* Nutrition Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Nutrition Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{nutrition.averageDailyKJ}</p>
                    <p className="text-sm text-gray-600">Daily kJ Average</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{nutrition.weeklyProtein}g</p>
                    <p className="text-sm text-gray-600">Weekly Protein</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment & Order Summary */}
            <div className="space-y-6">
              {/* Payment Details */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6V8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-2zM6 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z" clipRule="evenodd" />
                  </svg>
                  Payment Details
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <input
                      {...register("cardName")}
                      type="text"
                      placeholder="Name on Card"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {errors.cardName && (
                      <p className="text-sm text-red-600 mt-1">{errors.cardName.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      {...register("cardNumber")}
                      type="text"
                      placeholder="Card Number"
                      maxLength={19}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {errors.cardNumber && (
                      <p className="text-sm text-red-600 mt-1">{errors.cardNumber.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        {...register("expiry")}
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      {errors.expiry && (
                        <p className="text-sm text-red-600 mt-1">{errors.expiry.message}</p>
                      )}
                    </div>
                    <div>
                      <input
                        {...register("cvv")}
                        type="text"
                        placeholder="CVV"
                        maxLength={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      {errors.cvv && (
                        <p className="text-sm text-red-600 mt-1">{errors.cvv.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-600">
                      Save this card for future orders
                    </label>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      {...register("specialInstructions")}
                      rows={3}
                      placeholder="e.g., Leave at door, allergic to nuts, extra spicy..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{mealPlan?.name} ({mealPlan?.duration} weeks)</span>
                        <span>${pricing.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Early Bird Discount (15%)</span>
                        <span>-${pricing.discount.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${pricing.total.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Starting {startDate.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Processing..." : `Complete Order - $${pricing.total.toFixed(2)}`}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-4">
                Your SpiceFit journey begins on <br />
                <span className="font-semibold">
                  {startDate.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Order #{orderNumber} <br />
                Confirmation email sent to {userProfile?.email}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Print Receipt
                </button>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
