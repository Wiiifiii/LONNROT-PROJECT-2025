import crypto from "crypto";

/* Returns a hex‑encoded sessionId and sets the cookie if missing */
export function getSessionId(req, res) {
  const cookie = req.cookies.get("lo_sid");
  if (cookie?.value) return cookie.value;

  /* Create 16 random bytes → SHA‑256 → hex */
  const rand = crypto.randomBytes(16).toString("hex");
  const sid  = crypto.createHash("sha256").update(rand).digest("hex");

  /* 365‑day expiry, SameSite Lax so it survives navigation */
  res.cookies.set("lo_sid", sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return sid;
}
