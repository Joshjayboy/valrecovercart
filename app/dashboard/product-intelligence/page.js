"use client";

import { useState, useEffect } from "react";

export default function ProductIntelligencePage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // 🧩 Auto-load latest saved Product Intelligence report
  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await fetch("/api/ai/product-intelligence");
        const data = await res.json();
        if (res.ok) {
          setData(data);
        } else {
          console.error("Error loading report:", data.error);
        }
      } catch (err) {
        console.error("Failed to load latest report:", err);
      }
    }
    loadLatest();
  }, []);

  // 🧠 Manual re-analyze function
  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/product-intelligence");
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        alert("❌ " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to Product Intelligence API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-orange-50">
      <h1 className="text-3xl font-bold text-orange-700 mb-4">
        🧠 Product Intelligence
      </h1>

      <p className="text-gray-700 mb-6">
        Track your top-performing and underperforming products. AI will analyze
        sales patterns and recommend next actions automatically.
      </p>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "📊 Re-Analyze Products"}
      </button>

      {data ? (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow text-gray-700">
          <h2 className="text-xl font-semibold text-orange-700 mb-2">
            🏆 Top-Selling Products
          </h2>
          <ul className="list-disc ml-6 mb-4">
            {data.topProducts && data.topProducts.length > 0 ? (
              data.topProducts.map((p, i) => <li key={i}>{p}</li>)
            ) : (
              <li>No data yet.</li>
            )}
          </ul>

          <h2 className="text-xl font-semibold text-orange-700 mb-2">
            ⚠️ Low-Selling / Abandoned Products
          </h2>
          <ul className="list-disc ml-6 mb-4">
            {data.lowProducts && data.lowProducts.length > 0 ? (
              data.lowProducts.map((p, i) => <li key={i}>{p}</li>)
            ) : (
              <li>No data yet.</li>
            )}
          </ul>

          <h2 className="text-xl font-semibold text-orange-700 mb-2">
            💬 AI Insights
          </h2>
          <pre className="whitespace-pre-wrap">{data.insights || "No insights available yet."}</pre>

          <div className="mt-6 flex gap-4">
            <button
              onClick={async () => {
                await fetch("/api/shopify/create-discount", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ title: "Low Seller Promo", percentage: 10 }),
                });
                alert("✅ Discount created for low sellers!");
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
            >
              💸 Discount Low Sellers
            </button>

            <button
              onClick={() => alert("🚚 Restock request sent!")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
            >
              🔄 Request Restock
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-gray-500">Loading your latest insights...</p>
      )}
    </div>
  );
}
