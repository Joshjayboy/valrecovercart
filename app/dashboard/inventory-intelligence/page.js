"use client";

import { useState } from "react";

export default function InventoryIntelligencePage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/inventory-intelligence");
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        alert("❌ " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to Inventory Intelligence API");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRestockAlert = async () => {
    alert("📦 Restock alerts have been sent to suppliers! (demo mode)");
  };

  return (
    <div className="p-8 min-h-screen bg-yellow-50">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">
        📦 Inventory Intelligence
      </h1>

      <p className="text-gray-700 mb-6">
        Monitor your inventory health and automatically identify stock issues.
        AI will suggest what to restock or reduce.
      </p>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-yellow-600 text-white px-6 py-3 rounded-xl hover:bg-yellow-700 transition disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "🔍 Check Inventory"}
      </button>

      {data && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow text-gray-700">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">
            ⚠️ Low-Stock Items
          </h2>
          {data.lowStock.length > 0 ? (
            <ul className="list-disc ml-6 mb-4">
              {data.lowStock.map((p, i) => (
                <li key={i}>{p.title} — {p.quantity} left</li>
              ))}
            </ul>
          ) : (
            <p>No low-stock items found ✅</p>
          )}

          <h2 className="text-xl font-semibold text-yellow-700 mb-2">
            ❌ Out-of-Stock
          </h2>
          {data.outOfStock.length > 0 ? (
            <ul className="list-disc ml-6 mb-4">
              {data.outOfStock.map((p, i) => (
                <li key={i}>{p.title}</li>
              ))}
            </ul>
          ) : (
            <p>No out-of-stock products 🎉</p>
          )}

          <h2 className="text-xl font-semibold text-yellow-700 mb-2">
            🏗️ Overstocked Items
          </h2>
          {data.overStock.length > 0 ? (
            <ul className="list-disc ml-6 mb-4">
              {data.overStock.map((p, i) => (
                <li key={i}>{p.title} — {p.quantity} units</li>
              ))}
            </ul>
          ) : (
            <p>No overstock issues 🚀</p>
          )}

          <h2 className="text-xl font-semibold text-yellow-700 mb-2">
            💬 AI Insights
          </h2>
          <pre className="whitespace-pre-wrap">{data.insight}</pre>

          <div className="mt-6 text-center">
            <button
              onClick={handleSendRestockAlert}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
            >
              📧 Send Restock Alerts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
