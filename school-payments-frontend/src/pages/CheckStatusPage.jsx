import React, { useState } from "react";
import { checkTransactionStatus } from "../services/transactionService";

export default function CheckStatusPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await checkTransactionStatus(orderId);
      setResult(data);
    } catch (err) {
      setError("Failed to fetch status. Please check the Order ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Check Transaction Status</h1>
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-1">
            Custom Order ID
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter custom_order_id"
            required
            className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            disabled={loading || !orderId}
            className="mt-4 w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Checking..." : "Check Status"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {result && (
          <div className="mt-6">
            <h3 className="font-semibold">Result:</h3>
            <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
