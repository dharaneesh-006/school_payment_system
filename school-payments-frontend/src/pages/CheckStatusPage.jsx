import React, { useState } from "react";
import { checkTransactionStatus } from "../services/transactionService";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {label}
    </dt>
    <dd className="text-sm text-gray-900 dark:text-white">{value}</dd>
  </div>
);

const statusColor = (s) => {
  switch (String(s).toLowerCase()) {
    case "success":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  }
};

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
    <div className="container mx-auto max-w-2xl p-4">
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Check Transaction Status
        </h1>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Custom Order ID
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter custom_order_id"
            required
            className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
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
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              Transaction Details:
            </h3>
            <dl>
              <DetailRow label="Order ID" value={result.collect_id} />
              <DetailRow
                label="Status"
                value={
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(
                      result.status
                    )}`}
                  >
                    {result.status}
                  </span>
                }
              />
              <DetailRow
                label="Order Amount"
                value={`₹${result.order_amount?.toLocaleString() || "0"}`}
              />
              <DetailRow
                label="Transaction Amount"
                value={`₹${result.transaction_amount?.toLocaleString() || "0"}`}
              />
              <DetailRow
                label="Payment Method"
                value={result.payment_mode || "N/A"}
              />
              <DetailRow
                label="Payment Time"
                value={
                  result.payment_time
                    ? new Date(result.payment_time).toLocaleString()
                    : "N/A"
                }
              />
              {result.error_message && (
                <DetailRow label="Error" value={result.error_message} />
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
