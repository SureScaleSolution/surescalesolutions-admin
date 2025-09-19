import LoginForm from "@/components/login/LoginForm";
import React from "react";
import { FiLock } from "react-icons/fi";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-20">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <FiLock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your login key to access the admin panel
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
