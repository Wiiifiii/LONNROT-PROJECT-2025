// src/app/profile/tabs/AccountTab.jsx
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Notification from "@/app/components/Notification";

export default function AccountTab() {
  // Get current user session data
  const { data: session } = useSession();
  const user = session.user;

  // Form state for updating profile information
  const [form, setForm] = useState({
    displayName: user.name || "",
    email: user.email || "",
    avatarUrl: user.profileImage || "",
    currentPassword: "",
    newPassword: "",
  });
  // Notification, loading, and file uploading states
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Handle profile image change and upload
  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/users/me/avatar", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        setForm((f) => ({ ...f, avatarUrl: json.publicUrl }));
      } else {
        setNotif({ type: "error", message: json.error });
      }
    } catch (err) {
      setNotif({ type: "error", message: err.message });
    }
    setUploading(false);
  };

  // Handle form submission for updating profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      setNotif({ type: "success", message: "Profile updated!" });
      window.location.reload();
    } catch (err) {
      setNotif({ type: "error", message: err.message });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display notification if available */}
      {notif && (
        <Notification type={notif.type} message={notif.message} onClose={() => setNotif(null)} />
      )}
      {/* Avatar section with upload input */}
      <div className="flex items-center gap-4">
        {form.avatarUrl ? (
          <img src={form.avatarUrl} alt="Avatar" className="h-10 w-10 rounded-full object-cover border" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
            {(user.name || user.email)[0].toUpperCase()}
          </div>
        )}
        <input type="file" accept="image/*" onChange={onFileChange} disabled={uploading} className="text-sm text-gray-300" />
      </div>
      {/* Display Name field */}
      <div>
        <label className="block text-sm text-gray-300">Display Name</label>
        <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
      </div>
      {/* Email field */}
      <div>
        <label className="block text-sm text-gray-300">Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
      </div>
      <hr className="border-gray-600" />
      {/* Current Password field */}
      <div>
        <label className="block text-sm text-gray-300">Current Password</label>
        <input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
      </div>
      {/* New Password field */}
      <div>
        <label className="block text-sm text-gray-300">New Password</label>
        <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
      </div>
      {/* Submit button */}
      <button type="submit" disabled={loading} className="flex items-center bg-[#374151] hover:bg-[#111827] text-white py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
        {loading ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
