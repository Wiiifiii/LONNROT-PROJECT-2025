/**
 * session.js
 *
 * Provides a helper function to manage session IDs.
 * The getSessionId function retrieves a session ID from the "lo_sid" cookie.
 * If the cookie is missing, it generates a new session ID using random bytes and SHA-256 hashing,
 * sets the cookie on the response with appropriate options, and returns the session ID.
 *
 * Dependencies: Node's built-in crypto module.
 */

import crypto from "crypto";

export function getSessionId(req, res) {
  const cookie = req.cookies.get("lo_sid");
  if (cookie?.value) return cookie.value;
  const rand = crypto.randomBytes(16).toString("hex");
  const sid = crypto.createHash("sha256").update(rand).digest("hex");
  res.cookies.set("lo_sid", sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return sid;
}
