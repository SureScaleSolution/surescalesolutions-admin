import { AUTH_ENDPOINTS } from "@/constants/auth";

class AuthService {
  async login(loginKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginKey }),
        credentials: "include", // Include cookies in the request
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch {
      return { success: false, error: "Network error occurred" };
    }
  }

  async logout(): Promise<boolean> {
    try {
      // Call logout endpoint to clear server-side cookie
      const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
        method: "POST",
        credentials: "include", // Include cookies in the request
      });
      const data = await response.json();
      return data.success;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
