import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getTransactions } from "../services/transactionService";
import { getSchools } from "../services/schoolService";
import Pagination from "../components/Pagination";
import {
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

const STATUS_OPTIONS = ["Success", "Pending", "Failed"];

const TABLE_HEADERS = [
  { key: "sr_no", label: "Sr.No", sortable: false },
  { key: "school_id", label: "School Name", sortable: true },
  { key: "createdAt", label: "Date & Time", sortable: true },
  { key: "custom_order_id", label: "Order ID", sortable: true },
  { key: "collect_id", label: "Edviron Order ID", sortable: true },
  { key: "order_amount", label: "Order Amt", sortable: true },
  { key: "transaction_amount", label: "Transaction Amt", sortable: true },
  { key: "payment_method", label: "Payment Method", sortable: false },
  { key: "status", label: "Status", sortable: true },
  { key: "student_id", label: "Student ID", sortable: false },
  { key: "student_name", label: "Student Name", sortable: false },
  { key: "phone_no", label: "Phone No.", sortable: false },
  { key: "vendor_amount", label: "Vendor Amount", sortable: false },
  { key: "gateway", label: "Gateway", sortable: true },
  { key: "capture_status", label: "Capture Status", sortable: false },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // Read all filter values from the URL's query parameters
  const page = useMemo(
    () => parseInt(searchParams.get("page") || "1", 10),
    [searchParams]
  );
  const limit = useMemo(
    () => parseInt(searchParams.get("limit") || "10", 10),
    [searchParams]
  );
  const status = useMemo(
    () => searchParams.get("status") || "",
    [searchParams]
  );
  const schoolId = useMemo(
    () => searchParams.get("school_id") || "",
    [searchParams]
  );
  const q = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const sortBy = useMemo(
    () => searchParams.get("sort_by") || "createdAt",
    [searchParams]
  );
  const sortOrder = useMemo(
    () => searchParams.get("sort_order") || "desc",
    [searchParams]
  );

  // Fetch the list of schools for the filter dropdown when the page loads
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolList = await getSchools();
        setSchools(schoolList);
      } catch (err) {
        console.error("Failed to fetch schools:", err);
      }
    };
    fetchSchools();
  }, []);

  // Fetch transactions whenever a filter value (in the dependency array) changes
  useEffect(() => {
    setSearchInput(q);
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page,
          limit,
          status: status || undefined,
          school_id: schoolId || undefined,
          q: q || undefined,
          sort_by: sortBy,
          sort_order: sortOrder,
        };
        const response = await getTransactions(params);
        setTransactions(response.data);
        setTotal(response.total);
        setTotalPages(Math.ceil(response.total / response.limit));
      } catch (err) {
        setError("Failed to fetch transactions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, limit, status, schoolId, q, sortBy, sortOrder]);

  // A utility function to update the URL's query parameters
  const updateParams = useCallback(
    (newParams) => {
      setSearchParams((prev) => {
        for (const key in newParams) {
          if (newParams[key] === undefined || newParams[key] === "") {
            prev.delete(key);
          } else if (Array.isArray(newParams[key])) {
            prev.delete(key);
            newParams[key].forEach((val) => prev.append(key, val));
          } else {
            prev.set(key, newParams[key]);
          }
        }
        return prev;
      });
    },
    [setSearchParams]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ q: searchInput, page: "1" });
  };

  const handleSort = (columnKey) => {
    if (!TABLE_HEADERS.find((h) => h.key === columnKey)?.sortable) return;
    const newSortOrder =
      sortBy === columnKey && sortOrder === "asc" ? "desc" : "asc";
    updateParams({ sort_by: columnKey, sort_order: newSortOrder });
  };

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("OrderID copied to clipboard");
      console.log("Copied to clipboard:", text);
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          History
        </h1>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Export
        </button>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-md mb-6 dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2"
          >
            <div className="w-full">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <input
                id="search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search(Order ID...)"
                className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>

          <div>
            <label className="block text-sm font-medium mb-1">School</label>
            <select
              value={schoolId}
              onChange={(e) =>
                updateParams({ school_id: e.target.value, page: "1" })
              }
              className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Schools</option>
              {schools.map((school) => (
                <option key={school._id} value={school._id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) =>
                updateParams({ status: e.target.value, page: "1" })
              }
              className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Rows per page
            </label>
            <select
              value={limit}
              onChange={(e) =>
                updateParams({ limit: e.target.value, page: "1" })
              }
              className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header.key}
                    scope="col"
                    onClick={() => handleSort(header.key)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                      header.sortable
                        ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {header.label}
                      {sortBy === header.key && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={TABLE_HEADERS.length}
                    className="text-center py-8"
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={TABLE_HEADERS.length}
                    className="text-center py-8 text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_HEADERS.length}
                    className="text-center py-8"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx, index) => (
                  <tr
                    key={tx.collect_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tx.school_id || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tx.custom_order_id || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        {tx.collect_id || "N/A"}
                        <DocumentDuplicateIcon
                          onClick={() => copyToClipboard(tx.collect_id)}
                          className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{tx.order_amount?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{tx.transaction_amount?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tx.payment_method || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(
                          tx.status
                        )}`}
                      >
                        {tx.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tx.student_id || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tx.student_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tx.phone_no || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      N/A
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tx.gateway || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      N/A
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {transactions.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} results
            </span>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => updateParams({ page: newPage })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
