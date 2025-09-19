import { AUTH_CONSTANTS } from "@/constants/auth";
import { SignJWT, jwtVerify, decodeJwt } from "jose";

export interface TokenPayload {
  userId: "admin";
  iat: number;
  exp: number;
}

/**
 * Get the JWT secret as a Uint8Array for jose
 */
function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Generate a JWT token for the admin user
 */
export async function generateToken(): Promise<string> {
  const payload = {
    userId: "admin",
  };

  const secret = getJWTSecret();

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(AUTH_CONSTANTS.TOKEN_EXPIRY_HOURS)
    .sign(secret);

  return jwt;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = getJWTSecret();
    const { payload } = await jwtVerify(token, secret);

    return {
      userId: payload.userId as "admin",
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Check if a token is expired (without signature verification)
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) {
      console.log("Token has no expiration:", { payload });
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;

    return isExpired;
  } catch (error) {
    console.log("Error checking token expiry:", error);
    return true;
  }
}
