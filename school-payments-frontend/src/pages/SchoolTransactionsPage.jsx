import React, { useState, useEffect } from "react";
import { getSchools } from "../services/schoolService";
import { getTransactionsBySchool } from "../services/transactionService";

export default function SchoolTransactionsPage() {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolList = await getSchools();
        setSchools(schoolList);
      } catch (err) {
        console.error("Failed to fetch schools", err);
      }
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    if (!selectedSchool) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getTransactionsBySchool(selectedSchool);
        setTransactions(data);
      } catch (err) {
        setError("Failed to fetch transactions for this school.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedSchool]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Transactions by School</h1>
      <div className="mb-6">
        <label
          htmlFor="school-select"
          className="block text-sm font-medium mb-1"
        >
          Select a School
        </label>
        <select
          id="school-select"
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="w-full max-w-xs border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">-- Choose a School --</option>
          {schools.map((school) => (
            <option key={school._id} value={school._id}>
              {school.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
        {/* Transaction Table similar to TransactionsPage can be rendered here */}
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : error ? (
          <p className="p-4 text-red-500">{error}</p>
        ) : transactions.length > 0 ? (
          <p className="p-4">{transactions.length} transactions found.</p>
        ) : (
          // You would render the full table here
          <p className="p-4">No transactions found for the selected school.</p>
        )}
      </div>
    </div>
  );
}
