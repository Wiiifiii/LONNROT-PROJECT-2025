// middleware.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function middleware(request) {
  const { nextUrl: url, method, headers } = request;
  const { pathname } = url;

  // 1) Public dashboard: let all GETs to /dashboard through immediately
  if (pathname.startsWith("/dashboard") && method === "GET") {
    return NextResponse.next();
  }

  // 2) Admin routes: require an admin session
  if (pathname.startsWith("/admin")) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const reqHeaders = new Headers(headers);
    reqHeaders.set("X-User-Id", userId);
    reqHeaders.set("X-User-Role", session.user.role);
    return NextResponse.next({ request: { headers: reqHeaders } });
  }

  // 3) API & non-GET writes: require any authenticated user
  if (method !== "GET") {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/auth/login", url));
    }
    const reqHeaders = new Headers(headers);
    reqHeaders.set("X-User-Id", session.user.id);
    reqHeaders.set("X-User-Role", session.user.role);

    // lock down destructive verbs
    if ((method === "PUT" || method === "DELETE") && session.user.role !== "admin") {
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
