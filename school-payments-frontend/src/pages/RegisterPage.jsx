import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register({ email, password });
    } catch (err) {
      setError("Failed to register. This email may already be in use.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm dark:bg-slate-800">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md bg-white dark:bg-slate-700 dark:border-slate-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md bg-white dark:bg-slate-700 dark:border-slate-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
