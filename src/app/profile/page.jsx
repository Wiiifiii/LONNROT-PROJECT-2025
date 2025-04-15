// Summary: Client-rendered profile page that manages user authentication and profile editing using NextAuth, fetching user data and providing UI for profile updates.

"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { FiEdit, FiX, FiCheck } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (status !== "authenticated") {
      return;
    }
    async function fetchUserData() {
      try {
        setLoadingUserData(true);
        setErrorMessage("");
        setSuccessMessage("");
        const userId = session?.user?.id;
        if (!userId) {
          setErrorMessage("No user ID found in session.");
          return;
        }
        const res = await fetch(`/api/users/${userId}`);
        const json = await res.json();
        if (!json.success) {
          setErrorMessage(json.error || "Unable to fetch user data");
        } else {
          const userData = json.data;
          setUserName(userData.username || "");
          setUserEmail(userData.email || "");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setErrorMessage("Something went wrong fetching user data.");
      } finally {
        setLoadingUserData(false);
      }
    }
    fetchUserData();
  }, [session, status]);

  if (status === "loading") {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen pt-20 bg-gray-900 flex justify-center items-center">
          <p className="text-white text-2xl">Loading session...</p>
        </div>
      </div>
    );
  }
  if (!session) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen pt-20 bg-gray-900 flex justify-center items-center">
          <div className="max-w-md w-full bg-gray-800 text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-center mb-6">
              Please log in to view your profile.
            </h2>
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full p-3 bg-[#374151] hover:bg-[#111827] rounded-full transition text-white font-semibold text-sm"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          {session.user.role === "admin" && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <a
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-[#374151] text-white hover:bg-[#111827] rounded-full transition text-sm"
              >
                <MdDashboard size={20} />
                <span>Admin Dashboard</span>
              </a>
            </div>
          )}
          <div className="mt-8 w-full sm:w-2/3 mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            {loadingUserData ? (
              <p className="text-center">Loading profile...</p>
            ) : (
              <>
                <h2 className="text-3xl font-semibold text-center mb-4">
                  Welcome, {userEmail}
                </h2>
                <p className="text-lg mb-4">Role: {session.user.role}</p>
                {successMessage && (
                  <div className="mb-4 text-green-400 font-semibold">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="mb-4 text-red-400 font-semibold">
                    {errorMessage}
                  </div>
                )}
                {isEditing ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setErrorMessage("");
                      setSuccessMessage("");
                      if (newPassword && newPassword !== confirmPassword) {
                        setErrorMessage(
                          "New password and confirm password do not match."
                        );
                        return;
                      }
                      try {
                        const userId = session.user.id;
                        const res = await fetch(`/api/users/${userId}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            username: userName,
                            email: userEmail,
                            oldPassword,
                            newPassword,
                          }),
                        });
                        const json = await res.json();
                        if (!json.success) {
                          setErrorMessage(
                            json.error || "Failed to update profile."
                          );
                        } else {
                          setSuccessMessage("Profile updated successfully!");
                          setIsEditing(false);
                          setOldPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }
                      } catch (error) {
                        console.error("Error updating profile:", error);
                        setErrorMessage("Error updating profile: " + error.message);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Current Name:
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="w-full p-2 rounded bg-gray-200 text-black focus:outline-none"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">
                        Current Password:
                      </label>
                      <input
                        id="oldPassword"
                        type="password"
                        className="w-full p-2 rounded bg-gray-200 text-black focus:outline-none"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                        New Password:
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        className="w-full p-2 rounded bg-gray-200 text-black focus:outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                        Confirm New Password:
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        className="w-full p-2 rounded bg-gray-200 text-black focus:outline-none"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setErrorMessage("");
                          setSuccessMessage("");
                          setOldPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        className="px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition flex items-center text-sm"
                      >
                        <FiX className="mr-2" size={18} />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition flex items-center text-sm"
                      >
                        <FiCheck className="mr-2" size={18} />
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center px-4 py-2 mt-4 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition font-semibold text-sm"
                  >
                    <FiEdit className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}