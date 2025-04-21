// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";  // Import NextAuth's getToken

// Middleware for handling authentication and authorization
export async function middleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Check if the route is an admin route or requires authentication
  const isAdminRoute = pathname.startsWith("/admin");
  
  // For admin routes, we need a valid JWT token with admin role
  if (isAdminRoute) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access to admin route" },
        { status: 401 }
      );
    }

    // Proceed with custom headers for admin
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("X-User-Id", token.id);
    requestHeaders.set("X-User-Role", token.role);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // For non-admin routes, allow GET requests without authentication
  if (request.method === "GET") {
    return NextResponse.next();
  }

  // For POST, PUT, DELETE (and other non-GET) methods, ensure the user is authenticated
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // If no token exists, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Add user details to the request headers for further use in the API
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("X-User-Id", token.id);
  requestHeaders.set("X-User-Role", token.role);

  // For PUT/DELETE, check if the user is an admin
  if ((request.method === "PUT" || request.method === "DELETE") && token.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  // If everything is fine, proceed with the request
  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Define the paths to apply this middleware (e.g., for `/api/*`, `/books/*`, etc.)
export const config = {
  matcher: [
    "/api/books/:path*",
    "/admin/:path*",
    "/api/:path*",
    "/books/:path*",
  ],
};
