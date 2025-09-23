import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getTransactions } from "../services/transactionService";
import Pagination from "../components/Pagination";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import {
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

const STATUS_OPTIONS = ["Success", "Pending", "Failed"];

const TABLE_HEADERS = [
  { key: "sr_no", label: "Sr.No", sortable: false },
  { key: "school_id", label: "Institute Name", sortable: true },
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(
    () => parseInt(searchParams.get("page") || "1", 10),
    [searchParams]
  );
  const limit = useMemo(
    () => parseInt(searchParams.get("limit") || "10", 10),
    [searchParams]
  );
  const status = useMemo(() => searchParams.getAll("status"), [searchParams]);
  const q = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const sortBy = useMemo(
    () => searchParams.get("sort_by") || "createdAt",
    [searchParams]
  );
  const sortOrder = useMemo(
    () => searchParams.get("sort_order") || "desc",
    [searchParams]
  );

  useEffect(() => {
    setSearchInput(q);
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page,
          limit,
          status: status.length > 0 ? status : undefined,
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
  }, [page, limit, status, q, sortBy, sortOrder]);

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
    switch (s) {
      case "Success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You can add a toast notification here to show "Copied!"
      alert("OrderID copied to clipboard");
      console.log("Copied to clipboard:", text);
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">History</h1>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded-lg shadow-md mb-6 dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="lg:col-span-2 flex items-center gap-2"
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

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <MultiSelectDropdown
              options={STATUS_OPTIONS}
              selectedValues={status}
              onChange={(newStatus) =>
                updateParams({ status: newStatus, page: "1" })
              }
              placeholder="All Statuses"
            />
          </div>

          {/* Rows Per Page */}
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

      {/* Table */}
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
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      header.sortable ? "cursor-pointer" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {header.label}
                      {sortBy === header.key && (
                        <span className="ml-1 ">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tx.school_id || "N/A"}
                    </td>
                    {/* NOTE: Add 'createdAt' to your backend response for this to work */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tx.custom_order_id || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {tx.collect_id || "N/A"}
                        <DocumentDuplicateIcon
                          onClick={() => copyToClipboard(tx.collect_id)}
                          className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      ₹{tx.order_amount?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      ₹{tx.transaction_amount?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      N/A
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
                    {/* NOTE: The following fields are placeholders as they are not in the current API response */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      s123456
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      test name
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      0000000000
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      N/A
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tx.gateway || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      N/A
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {transactions.length > 0 && (
          <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center">
            <span className="text-sm">
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
