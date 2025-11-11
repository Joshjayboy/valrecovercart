"use client";

import { useState } from "react";

export default function CommandEdgePage() {
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState(null);

  const handleRunCommandEdge = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/commandedge");
      const data = await res.json();
      if (res.ok) {
        setDecision(data.decision);
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to CommandEdge API");
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    alert("⚙️ Executing AI actions (demo mode — will trigger EngageX + Discounts soon)");
  };

  return (
    <div className="p-8 min-h-screen bg-indigo-50">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">
        🧠 CommandEdge — Central AI Brain
      </h1>

      <p className="text-gray-700 mb-6">
        The central engine that unifies all your data and AI insights into
        one actionable strategy.
      </p>

      <button
        onClick={handleRunCommandEdge}
        disabled={loading}
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "🚀 Run CommandEdge"}
      </button>

      {decision && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow text-gray-700">
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">
            💬 AI Decision Report
          </h2>
          <pre className="whitespace-pre-wrap">{decision}</pre>

          <div className="mt-6 text-center">
            <button
              onClick={handleExecute}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
            >
              ⚡ Execute AI Actions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
