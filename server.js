import express from "express";
import cors from "cors";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from "url";
import createPaymentIntentHandler from "./api/create-payment-intent.js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "***REMOVED***51QYuE7Kt5CDCQ1bVGJOCp96xhKGcq6LLcaL8wRsIfKYcPZrq2FNS0Tr0seBuOwR0z1FtF3MuFxNKQoQQEmpHYCx000Y2zKlE7v",
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health-check", (req, res) => {
  res.json({ success: true, message: "Backend is working!" });
});

// API Routes
app.post("/api/create-payment-intent", async (req, res) => {
  console.log("Payment intent route hit with body:", req.body);
  try {
    await createPaymentIntentHandler(req, res);
  } catch (error) {
    console.error("Error in payment intent handler:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

app.use(express.static("dist"));

// Create checkout session endpoint
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const {
      planName,
      amount,
      planId,
      customerEmail,
      specialInstructions,
      userId,
      mealCount,
    } = req.body;

    // Get the base URL dynamically
    const baseUrl =
      process.env.VITE_APP_URL || `${req.protocol}://${req.get("host")}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud", // Australian dollars
            product_data: {
              name: planName,
              description: `SpiceFit ${planName} - Healthy meal delivery (${mealCount} meals)`,
              images: [`${baseUrl}/logo.png`],
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: customerEmail,
      metadata: {
        planId: planId || "",
        planName: planName,
        userId: userId || "",
        specialInstructions: specialInstructions || "",
        mealCount: mealCount || "0",
      },
      // Collect billing address for tax calculation
      billing_address_collection: "required",
      // Enable email receipts
      receipt_email: customerEmail,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Webhook endpoint for Stripe
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Payment successful:", session.id);
      console.log("Customer email:", session.customer_email);
      console.log("Metadata:", session.metadata);

      // Here you would typically:
      // 1. Save the order to your database
      // 2. Send confirmation email
      // 3. Update user's meal plan status
      // 4. Trigger fulfillment process
    }

    // Handle payment intent succeeded
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log("PaymentIntent succeeded:", paymentIntent.id);
    }

    // Handle payment intent failed
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      console.log("PaymentIntent failed:", paymentIntent.id);
    }

    res.json({ received: true });
  },
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API endpoint to verify payment status
app.get("/api/payment-status/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error("Error retrieving payment status:", error);
    res.status(500).json({ error: "Failed to retrieve payment status" });
  }
});

// Serve React app for all other routes
// app.get('*', (req, res) => {
//   // Avoid serving for API routes
//   if (req.path.startsWith('/api/')) {
//     return res.status(404).json({ error: 'API endpoint not found' });
//   }
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Access at: http://0.0.0.0:${PORT}`);
  console.log(`💳 Stripe webhook endpoint: http://0.0.0.0:${PORT}/webhook`);
});
