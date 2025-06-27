import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Checkout() {
  const [user, setUser] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: userDetails } = await supabase
        .from("user_details")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setUser(userDetails);

      const { data: selectedMeals } = await supabase
        .from("selected_meals")
        .select("*")
        .eq("user_id", user.id);
      setMeals(selectedMeals || []);

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

  const validateForm = () => {
    const newErrors: any = {};
    if (!cardName) newErrors.cardName = "Name on card is required";
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, "")))
      newErrors.cardNumber = "Card number must be 16 digits";
    if (!/^\d{2}\/\d{2}$/.test(expiry))
      newErrors.expiry = "Expiry must be MM/YY";
    if (!/^\d{3,4}$/.test(cvv)) newErrors.cvv = "CVV must be 3 or 4 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    const orderId = `SF${Date.now()}`;
    setOrderNumber(orderId);
    const { error } = await supabase.from("orders").insert({
      user_id: user.user_id,
      meal_plan_id: mealPlan?.id,
      order_number: orderId,
      card_name: cardName,
      card_number: cardNumber,
      expiry,
      cvv,
      save_card: saveCard,
      special_instructions: specialInstructions,
    });
    if (!error) setOrderConfirmed(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (orderConfirmed) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold text-orange-600">Order Confirmed!</h1>
        <p className="mt-2">
          Order #{orderNumber} has been placed successfully.
        </p>
        <p className="mt-2">An email confirmation will be sent shortly.</p>
        <button
          onClick={handlePrint}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Print Receipt
        </button>
      </div>
    );
  }

  const total = mealPlan?.price_per_week * mealPlan?.duration;

  return (
    <div className="max-w-4xl mx-auto p-4 print:max-w-full print:p-0">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Checkout</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Delivery Address</h2>
        <p>{user?.full_name}</p>
        <p>{user?.address}</p>
        <p>{user?.phone}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Name on Card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            {errors.cardName && (
              <p className="text-sm text-red-600">{errors.cardName}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="border p-2 rounded w-full"
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="text-sm text-red-600">{errors.cardNumber}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="border p-2 rounded w-full"
              maxLength={5}
            />
            {errors.expiry && (
              <p className="text-sm text-red-600">{errors.expiry}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="border p-2 rounded w-full"
              maxLength={4}
            />
            {errors.cvv && <p className="text-sm text-red-600">{errors.cvv}</p>}
          </div>
        </div>
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className="mr-2"
          />
          Save this card for future use
        </label>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Special Instructions</h2>
        <textarea
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
          placeholder="e.g., Leave at door, allergic to peanuts"
        />
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <p>Plan: {mealPlan?.name}</p>
        <p>Duration: {mealPlan?.duration} weeks</p>
        <p>Total: ${total}</p>
      </section>

      <button
        onClick={handlePlaceOrder}
        className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 w-full md:w-auto"
      >
        Place Order
      </button>
    </div>
  );
}
