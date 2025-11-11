"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CartCopilotPage() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [insight, setInsight] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  // 🧩 1. Fetch abandoned carts
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const res = await fetch("/api/shopify/checkouts");
        const data = await res.json();
        if (res.ok) setCheckouts(data.checkouts ?? []);
      } catch (err) {
        console.error("Error fetching carts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCarts();
  }, []);

  // 📧 2. Send recovery email
  const sendRecoveryEmail = async (cart) => {
    if (!cart.email) {
      alert("No email found for this checkout");
      return;
    }

    setSending(true);
    try {
      const products = cart.line_items?.map((item) => ({
        title: item.title,
        price: item.price,
      }));

      const res = await fetch("/api/email/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cart.email,
          products,
          total: cart.total_price,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Email sent to ${cart.email}`);
      } else {
        alert(`❌ Failed: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // 🤖 3. Analyze carts with AI
  const analyzeCarts = async () => {
    if (checkouts.length === 0) {
      alert("No carts to analyze!");
      return;
    }

    setAnalyzing(true);
    setInsight("");

    try {
      const res = await fetch("/api/ai/cart-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carts: checkouts }),
      });

      const data = await res.json();
      if (res.ok && data.insight) {
        setInsight(data.insight);
      } else {
        setInsight(data.error ?? "AI analysis failed.");
      }
    } catch (err) {
      console.error("AI analysis error:", err);
      setInsight("AI analysis failed to connect.");
    } finally {
      setAnalyzing(false);
    }
  };

  // 🖥 4. Render UI
  return (
    <div className="p-8 min-h-screen bg-blue-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        🛒 Cart Abandonment Co-Pilot
      </h1>
      <p className="text-gray-700 mb-6">
        Track and recover abandoned carts using real Shopify data and AI insights.
      </p>

      {loading ? (
        <div>Loading carts...</div>
      ) : checkouts.length === 0 ? (
        <div>No abandoned carts found.</div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow grid sm:grid-cols-2 gap-4"
          >
            {checkouts.map((cart) => (
              <div
                key={cart.id}
                className="p-4 border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                  🧍‍♂️ {cart.email ?? "Guest"}
                </h2>
                <p>Items: {cart.line_items?.length ?? 0}</p>
                <p>Total: ${cart.total_price}</p>
                <button
                  onClick={() => sendRecoveryEmail(cart)}
                  disabled={sending}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {sending ? "Sending..." : "📧 Send Recovery Email"}
                </button>
              </div>
            ))}
          </motion.div>

          {/* 🤖 Analyze button */}
          <div className="text-center mt-10">
            <button
              onClick={analyzeCarts}
              disabled={analyzing}
              className={`px-6 py-3 rounded-xl text-white font-semibold ${
                analyzing ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              } transition`}
            >
              {analyzing ? "Analyzing with AI..." : "🤖 Analyze Carts with AI"}
            </button>
          </div>

          {/* 💡 AI insight display */}
          {insight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-xl font-semibold mb-3 text-center text-indigo-700">
                💡 AI Insight
              </h2>
              <p className="text-gray-700 leading-relaxed text-center">
                {insight}
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
