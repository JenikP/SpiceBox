import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "***REMOVED***51QYuE7Kt5CDCQ1bVGJOCp96xhKGcq6LLcaL8wRsIfKYcPZrq2FNS0Tr0seBuOwR0z1FtF3MuFxNKQoQQEmpHYCx000Y2zKlE7v",
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("Received payment intent request:", req.body);
    const { planName, amount, planId, customerEmail, userId, mealCount } =
      req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    console.log("Creating payment intent with Stripe...");

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "aud",
      description: `SpiceFit ${planName} - Healthy meal delivery`,
      receipt_email: customerEmail,
      metadata: {
        planId: planId || "",
        planName: planName || "",
        userId: userId || "",
        mealCount: (mealCount || 0).toString(),
      },
    });

    console.log("Payment intent created successfully:", paymentIntent.id);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      error: "Failed to create payment intent",
      details: error.message,
    });
  }
}
