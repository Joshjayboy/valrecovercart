"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// ✅ Define what a Shopify product looks like
type ShopifyProduct = {
  id: string | number;
  title: string;
  variants?: { price?: string }[];
};

export default function DashboardHome() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);

  // 🧠 Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 🧠 Fetch Shopify data only if authenticated
  useEffect(() => {
    if (status === "authenticated") {
      const fetchShopifyData = async () => {
        try {
          const response = await fetch("/api/shopify/products");
          if (response.ok) {
            const data = await response.json();
            setShopifyProducts(data.products || []);
          }
        } catch (error) {
          console.error("Error fetching Shopify data:", error);
        }
      };
      fetchShopifyData();
    }
  }, [status]);

  // 🔄 Loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Checking authentication...
      </div>
    );
  }

  // 🧭 Dashboard modules (same as yours)
  const modules = [
    {
      id: 1,
      name: "Cart Co-Pilot",
      icon: "🛒",
      color: "bg-blue-100",
      path: "/dashboard/cart-copilot",
      description: "Recover and analyze abandoned carts with AI suggestions.",
    },
    {
      id: 2,
      name: "Market Recon",
      icon: "📊",
      color: "bg-green-100",
      path: "/dashboard/market-recon",
      description: "Monitor competitors and detect new campaigns instantly.",
    },
    {
      id: 3,
      name: "EngageX",
      icon: "💬",
      color: "bg-yellow-100",
      path: "/dashboard/engagex",
      description: "Get AI-powered marketing campaign recommendations.",
    },
    {
      id: 4,
      name: "Product Intelligence",
      icon: "🏷",
      color: "bg-pink-100",
      path: "/dashboard/product-intelligence",
      description: "Track top-performing and abandoned products.",
    },
    {
      id: 5,
      name: "Inventory Intelligence",
      icon: "📦",
      color: "bg-purple-100",
      path: "/dashboard/inventory-intelligence",
      description: "Monitor stock health and automate reorder alerts.",
    },
    {
      id: 6,
      name: "CommandEdge",
      icon: "🧠",
      color: "bg-indigo-100",
      path: "/dashboard/commandedge",
      description: "Central AI brain connecting all modules for action.",
    },
  ];

  return (
    <div className="p-8">
      {/* 🌟 Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          🧭 Recover Cart Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Overview of your business performance and AI recommendations.
        </p>
      </motion.div>

      {/* 💡 Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15 }}
      >
        {modules.map((mod) => (
          <motion.div
            key={mod.id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`p-6 rounded-2xl shadow cursor-pointer hover:shadow-lg ${mod.color}`}
            onClick={() => router.push(mod.path)}
          >
            <div className="text-4xl mb-3">{mod.icon}</div>
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              {mod.name}
            </h2>
            <p className="text-gray-700 text-sm mb-4">{mod.description}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition text-sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(mod.path);
              }}
            >
              Go to Module →
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* 🟢 Connect Shopify */}
      <div className="text-center mt-10">
        <a
          href="/dashboard/connect-shopify"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
        >
          🛍 Connect My Shopify Store
        </a>
      </div>

      {/* 📊 Quick Snapshot */}
      <motion.div
        className="mt-10 bg-white rounded-2xl p-6 shadow text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-blue-600 mb-2">
          📊 Quick Snapshot
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>🛒 34 abandoned carts recovered in the past 24 hours.</li>
          <li>📦 2 low-stock products need attention.</li>
          <li>💬 3 marketing campaigns running successfully.</li>
          <li>🧠 CommandEdge AI is monitoring all modules in real time.</li>
        </ul>
      </motion.div>

      {/* 🧩 Shopify Data Preview */}
      {shopifyProducts.length > 0 && (
        <div className="mt-10 bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            🛍 Shopify Products (Example)
          </h2>
          <ul className="space-y-2">
            {shopifyProducts.map((product) => (
              <li key={product.id} className="border-b pb-2">
                <span className="font-semibold">{product.title}</span> —{" "}
                <span className="text-gray-500">
                  {product.variants?.[0]?.price
                    ? `$${product.variants[0].price}`
                    : "No price"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
