"use client";

import { useState } from "react";

export default function EngageXPage() {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/engagex");
      const data = await res.json();
      if (res.ok) {
        setInsight(data.insight);
      } else {
        alert("Failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to EngageX API");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscount = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/shopify/create-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "AI Weekend Promo",
          percentage: 15,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Discount created: ${data.code}`);
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error creating discount");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-purple-50">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        💬 EngageX — AI Marketing Assistant
      </h1>

      <p className="text-gray-700 mb-6">
        Get personalized AI-powered marketing campaign ideas based on your
        Shopify products and customer orders.
      </p>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? "Thinking..." : "🤖 Generate Campaign Ideas"}
      </button>

      {/* Show AI results */}
      {insight && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow text-gray-700">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            💡 AI Campaign Ideas
          </h2>
          <pre className="whitespace-pre-wrap">{insight}</pre>

          {/* Discount creation button (✅ inside component now) */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCreateDiscount}
              disabled={creating}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
            >
              {creating ? "Creating..." : "🎟️ Create Shopify Discount"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
