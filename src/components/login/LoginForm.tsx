"use client";

import { AUTH_CONSTANTS } from "@/constants/auth";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function LoginForm() {
  const [loginKey, setLoginKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!loginKey.trim()) {
      setError("Please enter the login key");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await authService.login(loginKey.trim());

      if (result.success) {
        setIsAuthenticated(true);
        router.refresh();
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "Login failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="loginKey" className="sr-only">
            Login Key
          </label>
          <div className="relative">
            <input
              id="loginKey"
              name="loginKey"
              type={showKey ? "text" : "password"}
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter login key"
              value={loginKey}
              onChange={(e) => setLoginKey(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowKey(!showKey)}
              disabled={isSubmitting}>
              {showKey ? (
                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors">
            {isSubmitting ? (
              <>
                <FiLoader className="h-4 w-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Session will remain active for{" "}
            {AUTH_CONSTANTS.TOKEN_EXPIRY_SECONDS / 60 / 60} hours
          </p>
        </div>
      </form>
    </>
  );
}
