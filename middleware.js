// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { nextUrl: url, method, headers } = request;
  const { pathname } = url;

  // 1) Public dashboard: let all GETs to /dashboard through immediately
  if (pathname.startsWith("/dashboard") && method === "GET") {
    return NextResponse.next();
  }

  // 2) Admin routes: require an admin JWT
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access to admin route" }, { status: 401 });
    }
    const reqHeaders = new Headers(headers);
    reqHeaders.set("X-User-Id",   token.id);
    reqHeaders.set("X-User-Role", token.role);
    return NextResponse.next({ request: { headers: reqHeaders } });
  }

  // 3) API & non-GET writes: require any authenticated user
  if (method !== "GET") {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", url));
    }
    const reqHeaders = new Headers(headers);
    reqHeaders.set("X-User-Id",   token.id);
    reqHeaders.set("X-User-Role", token.role);

    // lock down destructive verbs
    if ((method === "PUT" || method === "DELETE") && token.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }
    return NextResponse.next({ request: { headers: reqHeaders } });
  }

  // 4) All other GETs (e.g. your public pages): pass through
  return NextResponse.next();
}

export const config = {
  // only run on admin & API routes (dashboard isn't listed, so it never runs here)
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/books/:path*",
  ],
};
