import express from "express";
import cors from "cors";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from "url";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "***REMOVED***51RfckJE6vfmHs239tTjsBILgAAg5ubIDm1lzGzwendUxW5MbRO8l3VJprWhFwebqfIQQ8Q9LNm3sOZHX8u3eWiM3006O1uHom1",
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

app.use((req, res, next) => {
  console.log("API call:", req.method, req.originalUrl);
  next();
});

// API Routes
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { planName, amount, planId, customerEmail, userId, mealCount } =
      req.body;
    if (!amount || amount < 50)
      return res.status(400).json({ error: "Invalid amount" });

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
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create payment intent", details: err.message });
  }
});

app.get("/api/health-check", (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res
    .status(500)
    .json({ error: "Internal server error", details: err.message });
});

// Chat endpoint for Google Gemini integration
app.post("/api/chat", async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const apiKey =
      process.env.GEMINI_API_KEY || "AIzaSyCcCwYJO7hSbdkDqj2g0mMOZPL5jv2H-o8";
    console.log("Using Gemini API key:", apiKey.substring(0, 10) + "...");

    const systemPrompt =
      context ||
      "You are a helpful assistant for SpiceBox, a healthy Indian meal delivery service. Answer questions about meal plans, nutrition, diet preferences, and general health. Keep responses friendly, informative, and under 150 words. Focus on our authentic Indian cuisine designed for weight loss, flexible subscription plans, fresh daily delivery across Australia, and personalized meal options for vegetarian, non-vegetarian, vegan, and keto diets.";

    console.log("Sending message to Gemini:", message);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser question: ${message}\n\nPlease provide a helpful response about SpiceBox:`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 150,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    );

    console.log("Gemini API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error response:", errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini API response data:", JSON.stringify(data, null, 2));

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, but I could not generate a response. Please try asking about our meal plans, pricing, or how SpiceBox can help you with your health goals!";

    console.log("Sending reply:", reply);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);

    // Provide a more helpful fallback response based on the user's message
    let fallbackResponse =
      "I'm here to assist with any questions you may have about SpiceBox! Please feel free to ask about our meal plans, delivery, or any other inquiries.";

    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("plan") || lowerMessage.includes("price")) {
      fallbackResponse =
        "We offer three main plans: Essential ($149/week), Complete ($187/week), and Transformation ($219/week). Each includes fresh Indian meals delivered daily, with the Complete and Transformation plans offering additional nutrition support. Would you like to know more about any specific plan?";
    } else if (
      lowerMessage.includes("delivery") ||
      lowerMessage.includes("deliver")
    ) {
      fallbackResponse =
        "We deliver fresh, healthy Indian meals daily across Australia! Our meals are prepared in the morning and delivered to your door, so you always get the freshest food. Delivery is included in all our plans.";
    } else if (lowerMessage.includes("diet") || lowerMessage.includes("food")) {
      fallbackResponse =
        "Our meals cater to all dietary preferences including vegetarian, non-vegetarian, vegan, and keto options. Each meal is authentically Indian, nutritionally balanced, and designed to support your weight loss goals. What dietary preference would you like to know more about?";
    }

    res.status(200).json({ reply: fallbackResponse });
  }
});

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

      // Save order to Supabase
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.VITE_SUPABASE_URL ||
            "https://hwwrzlxgnhsawxaswqjm.supabase.co",
          process.env.VITE_SUPABASE_ANON_KEY ||
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3d3J6bHhnbmhzYXd4YXN3cWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODI4ODQsImV4cCI6MjA2NzM1ODg4NH0.i9zCJFHoI_wR2VBZGNXwdHKPSmYG0tY6oexKN64c5cw",
        );

        const orderData = {
          user_id: session.metadata?.userId || null,
          order_number: `SPB-${Date.now()}`,
          stripe_session_id: session.id,
          status: "confirmed",
          total_amount: session.amount_total / 100, // Convert cents to dollars
          currency: session.currency.toUpperCase(),
          plan_name: session.metadata?.planName || "Unknown Plan",
          plan_id: session.metadata?.planId || null,
          plan_duration: session.metadata?.planDuration || null,
          billing_cycle: session.metadata?.billingCycle || "one-time",
          meal_count: parseInt(session.metadata?.mealCount || "0"),
          customer_email: session.customer_email,
          special_instructions: session.metadata?.specialInstructions || null,
        };

        const { error } = await supabase.from("orders").insert([orderData]);

        if (error) {
          console.error("Error saving order to database:", error);
        } else {
          console.log("Order saved successfully:", orderData.order_number);
        }
      } catch (dbError) {
        console.error("Database connection error:", dbError);
      }
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

// Serve static files from dist directory
app.use(express.static("dist"));

// Serve React app for all other non-API routes
app.get("/*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Access at: http://0.0.0.0:${PORT}`);
  console.log(`💳 Stripe webhook endpoint: http://0.0.0.0:${PORT}/webhook`);
});
