// Authentication Constants
export const AUTH_CONSTANTS = {
  // Token expiration time (24 hours in milliseconds)
  TOKEN_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 hours

  // Token expiry in seconds for JWT
  TOKEN_EXPIRY_SECONDS: 24 * 60 * 60, // 24 hours

  TOKEN_EXPIRY_HOURS: "24h",

  // Cookie name for storing the auth token
  AUTH_COOKIE_NAME: "admin_auth_token",
} as const;

// Auth-related API endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  VERIFY: "/api/auth/verify",
  LOGOUT: "/api/auth/logout",
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  "/",
  "/case-studies/*",
  "/api/case-study/*",
] as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  "/login",
  "/api/auth/login",
  "/api/auth/verify",
] as const;
