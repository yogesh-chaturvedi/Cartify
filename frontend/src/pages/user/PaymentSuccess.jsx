import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PaymentSuccess = () => {


  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | failed
  const [orderId, setOrderId] = useState(null);

  const intervalRef = useRef(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id");

    if (!sessionId) {
      navigate("/");
      return;
    }

    verifyPayment(sessionId);
    intervalRef.current = setInterval(() => verifyPayment(sessionId), 2000);

    return () => clearInterval(intervalRef.current);

  }, []);


  const verifyPayment = async (sessionId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/orders/verify-payment`,
        {
          params: { sessionId },
          withCredentials: true,
        }
      );

      const paymentStatus = res.data.paymentStatus;

      if (paymentStatus === "PAID") {
        setOrderId(res.data.orderId);
        setStatus("success");
        clearInterval(intervalRef.current); // stop polling
      } else if (paymentStatus === "PENDING") {
        setStatus("loading");
      } else {
        setStatus("pending");
      }
    } catch (error) {
      console.error("Payment verification failed", error);
      setStatus("failed");
    }
  };


  return (

    <div>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        {status === "loading" && (
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-600" />
            <h2 className="text-xl font-semibold">Confirming your payment...</h2>
            <p className="text-gray-500">
              Please wait, this may take a few seconds.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center max-w-md">
            <CheckCircle className="w-14 h-14 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-700">
              Payment Successful 🎉
            </h1>
            <p className="text-gray-600 mt-2">
              Your order has been placed successfully.
            </p>

            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={() => navigate(`/myorders`)}
                className="px-6 py-2 bg-black text-white rounded-xl"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 border rounded-xl"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}


        {status === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center max-w-md">
            <XCircle className="w-14 h-14 text-yellow-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-yellow-700">
              Still confirming your payment
            </h1>
            <p className="text-gray-600 mt-2">
              Payment confirmation is taking longer than usual. Please stay on this page.
            </p>
          </div>
        )}


        {status === "failed" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
            <XCircle className="w-14 h-14 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-700">Payment Verification Failed</h1>
            <p className="text-gray-600 mt-2">There was a problem verifying your payment. Please try refreshing the page.</p>
          </div>
        )}

        <Footer />
      </div>
    </div>
  )
}

export default PaymentSuccess