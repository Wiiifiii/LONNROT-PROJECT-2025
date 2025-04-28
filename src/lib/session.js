// Import Node's built-in crypto module to generate random bytes and compute hashes.
import crypto from "crypto"

// This function returns a hex‑encoded sessionId, setting a cookie if it's missing.
export function getSessionId(req, res) {
  // Get the "lo_sid" cookie from the incoming request.
  const cookie = req.cookies.get("lo_sid");
  // If the cookie exists and has a value, return it as the session ID.
  if (cookie?.value) return cookie.value;
  // Generate 16 random bytes, convert them to a hexadecimal string.
  const rand = crypto.randomBytes(16).toString("hex");
  // Create a SHA‑256 hash of the random hex string, then convert it to a hex string.
  const sid = crypto.createHash("sha256").update(rand).digest("hex");
  // Set a cookie named "lo_sid" with the computed session ID.
  // The cookie expires in 365 days, is HTTP‑only, uses SameSite "lax", is secure in production, and is available on all paths.
  res.cookies.set("lo_sid", sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  // Return the new session ID.
  return sid;
}
