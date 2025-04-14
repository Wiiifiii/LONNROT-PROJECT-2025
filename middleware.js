// Path (dev): lonnrot-project/middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

/**
 * Middleware for handling authentication and authorization.
 * - For admin routes (paths starting with '/admin'):
 *    * Requires a valid JWT in the Authorization header.
 *    * Checks that the token includes an admin role.
 *    * If valid, adds custom headers and proceeds.
 * - For non-admin routes:
 *    * GET requests are allowed publicly.
 *    * Non-GET requests require a valid JWT; for PUT/DELETE, admin role is required.
 */
export function middleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Check if this is an admin route
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized access to admin route" },
        { status: 401 }
      );
    }
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      if (decoded.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden: Admins only" },
          { status: 403 }
        );
      }
      // Create new headers based on the original request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("X-User-Id", decoded.userId);
      requestHeaders.set("X-User-Role", decoded.role);
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
  }

  // For non-admin routes, GET requests are allowed
  if (request.method === "GET") {
    return NextResponse.next();
  }

  // For non-GET requests, require a valid JWT token
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 }
    );
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    // For POST requests, any valid token is acceptable
    if (request.method === "POST") {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("X-User-Id", decoded.userId);
      requestHeaders.set("X-User-Role", decoded.role);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // For PUT or DELETE requests, require an admin role
    if (request.method === "PUT" || request.method === "DELETE") {
      if (decoded.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden: Admins only" },
          { status: 403 }
        );
      }
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("X-User-Id", decoded.userId);
      requestHeaders.set("X-User-Role", decoded.role);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // For any other methods, proceed normally.
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}

// Apply this middleware to routes matching the patterns.
export const config = {
  matcher: ["/api/books/:path*", "/admin/:path*"],
};
