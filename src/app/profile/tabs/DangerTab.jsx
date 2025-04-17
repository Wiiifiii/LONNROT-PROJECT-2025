"use client";
import { useState } from "react";

import { signOut } from "next-auth/react";
import Button from "../../components/Button";

export default function DangerTab() {
  const [confirm, setConfirm] = useState("");
  const deleteAccount = () => {
    fetch("/api/users/me", { method: "DELETE" })
      .then(() => {
        // NextAuth sign out to clear session
        signOut({ callbackUrl: "/" });
      })
      .catch(console.error);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-red-500">⚠️ Danger Zone</h3>
      <p className="text-gray-300">
        Permanently delete your account and all data. This action cannot be undone.
      </p>
      <input
        type="text"
        placeholder="Type DELETE to confirm"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
      />
      <Button
        text="Delete My Account"
        onClick={deleteAccount}
        className="w-full bg-red-600 disabled:opacity-50"
        disabled={confirm !== "DELETE"}
      />
    </div>
  );
}
