"use client";

import { useState } from "react";

export default function MarketReconPage() {
  const [competitors, setCompetitors] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧩 Add competitor to the list
  const addCompetitor = () => {
    if (!name || !url) return alert("Please enter both name and URL");
    setCompetitors([...competitors, { name, url }]);
    setName("");
    setUrl("");
  };

  // 🧠 Run Market Recon AI
  const runRecon = async () => {
    if (competitors.length === 0)
      return alert("Please add at least one competitor");

    setLoading(true);
    try {
      const res = await fetch("/api/ai/market-recon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitors }),
      });
      const data = await res.json();
      if (res.ok) setReports(data.reports);
      else alert(data.error || "Recon failed");
    } catch (err) {
      console.error(err);
      alert("Error fetching competitor data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-orange-50">
      <h1 className="text-3xl font-bold text-orange-700 mb-4">
        📊 Market Recon — Competitor Monitoring
      </h1>

      <p className="text-gray-700 mb-6">
        Track competitor websites and detect new campaigns or product updates
        instantly. Add competitors below and run recon anytime.
      </p>

      {/* 🧱 Input Section */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          ➕ Add Competitor
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            type="text"
            placeholder="Competitor Name (e.g., Nike)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-3 border rounded-xl"
          />
          <input
            type="text"
            placeholder="Website URL (e.g., https://www.nike.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-3 border rounded-xl"
          />
        </div>

        <button
          onClick={addCompetitor}
          className="bg-orange-600 text-white px-6 py-2 rounded-xl hover:bg-orange-700"
        >
          ➕ Add to Watchlist
        </button>
      </div>

      {/* 🧩 Current Competitor List */}
      {competitors.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">
            Watching these competitors:
          </h3>
          <ul className="list-disc ml-6 text-gray-800">
            {competitors.map((c, i) => (
              <li key={i}>
                <strong>{c.name}</strong> — {c.url}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🚀 Run Recon Button */}
      <button
        onClick={runRecon}
        disabled={loading}
        className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 disabled:opacity-50"
      >
        {loading ? "Scanning..." : "🚀 Run Recon Now"}
      </button>

      {/* 🧠 AI Reports */}
      {reports.length > 0 && (
        <div className="mt-8 space-y-4">
          {reports.map((r) => (
            <div
              key={r.url}
              className="bg-white p-5 rounded-xl shadow border-l-4 border-orange-500"
            >
              <h2 className="text-xl font-semibold">{r.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{r.url}</p>
              <p className="text-gray-800">{r.insight}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
