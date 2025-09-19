import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { AUTH_CONSTANTS } from "@/constants/auth";

export async function GET(request: NextRequest) {
  try {
    // Try to get token from cookie first, then from Authorization header
    const token = request.cookies.get(AUTH_CONSTANTS.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token is valid",
      user: {
        userId: payload.userId,
      },
      expiresAt: payload.exp * 1000,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
