"use client";

export default function ConnectShopifyPage() {
  const handleConnect = async () => {
    // When user clicks the button, this sends them to the Shopify connect route
    window.location.href = "/api/shopify/connect";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">🛍️ Connect Your Shopify Store</h1>
      <p className="text-gray-600 text-center max-w-md mb-6">
        Connect your Shopify store so Recover Card can analyze your products,
        abandoned carts, and customer insights.
      </p>
      <button
        onClick={handleConnect}
        className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition"
      >
        Connect My Shopify Store
      </button>
    </div>
  );
}
