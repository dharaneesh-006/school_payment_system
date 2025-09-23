import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Page Imports
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TransactionsPage from "./pages/TransactionsPage";
import SchoolTransactionsPage from "./pages/SchoolTransactionsPage";
import CheckStatusPage from "./pages/CheckStatusPage";

function App() {
  return (
    // FIX: Removed specific background colors to allow body background to show
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 md:p-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/transactions" replace />} />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/by-school"
            element={
              <ProtectedRoute>
                <SchoolTransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/check-status"
            element={
              <ProtectedRoute>
                <CheckStatusPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
