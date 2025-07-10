
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import Layout from "../components/Layout";

interface PaymentDetails {
  status: string;
  customer_email: string;
  amount_total: number;
  currency: string;
  metadata: {
    planName: string;
    planId: string;
    userId: string;
    specialInstructions: string;
    mealCount: string;
  };
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      navigate('/');
      return;
    }

    const processPaymentSuccess = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          navigate('/auth');
          return;
        }

        // Fetch payment details from our backend
        const paymentResponse = await fetch(`/api/payment-status/${sessionId}`);
        
        if (!paymentResponse.ok) {
          throw new Error('Failed to verify payment');
        }

        const paymentData = await paymentResponse.json();
        setPaymentDetails(paymentData);

        // Only create order if payment was successful
        if (paymentData.status === 'paid') {
          // Generate order number
          const orderId = `SF${Date.now()}`;
          
          // Create order record in database
          const orderData = {
            user_id: user.id,
            order_number: orderId,
            stripe_session_id: sessionId,
            status: 'confirmed',
            total_amount: paymentData.amount_total / 100, // Convert from cents
            plan_name: paymentData.metadata.planName,
            plan_id: paymentData.metadata.planId,
            special_instructions: paymentData.metadata.specialInstructions,
            meal_count: parseInt(paymentData.metadata.mealCount) || 0,
            customer_email: paymentData.customer_email,
            currency: paymentData.currency,
            created_at: new Date().toISOString()
          };

          const { error: orderError } = await supabase.from("orders").insert(orderData);

          if (orderError) {
            console.error("Error creating order:", orderError);
            setError("Payment successful but failed to create order record. Please contact support.");
          } else {
            setOrderData(orderData);
            
            // Update user's meal plan status if applicable
            if (paymentData.metadata.planId && paymentData.metadata.planId !== 'custom') {
              await supabase
                .from("meal_plans")
                .update({ 
                  status: 'active',
                  payment_status: 'paid',
                  stripe_session_id: sessionId 
                })
                .eq("user_id", user.id)
                .eq("id", paymentData.metadata.planId);
            }
          }
        } else {
          setError("Payment was not completed successfully. Please try again.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error processing payment success:", error);
        setError("An error occurred while processing your payment. Please contact support.");
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your payment...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Error
              </h1>
              
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful! 🎉
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your SpiceFit journey starts now! Your meals will be delivered starting tomorrow.
            </p>
            
            {orderData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-bold text-gray-900">{orderData.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-bold text-gray-900">
                    ${orderData.total_amount.toFixed(2)} {orderData.currency?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="font-bold text-gray-900">{orderData.plan_name}</p>
                </div>
                {orderData.meal_count > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Meals</p>
                    <p className="font-bold text-gray-900">{orderData.meal_count} meals selected</p>
                  </div>
                )}
              </div>
            )}

            {paymentDetails && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-600">Confirmation email sent to:</p>
                <p className="font-medium text-blue-800">{paymentDetails.customer_email}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={handlePrint}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Print Receipt
              </button>
              
              <button
                onClick={() => navigate("/profile")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              >
                View My Profile
              </button>
              
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
