"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";  // Correct import for useSession
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import StatsCard from "@/app/components/StatsCard";

// tabs...
import OverviewTab from "./tabs/OverviewTab";
import ActivityTab from "./tabs/ActivityTab";
import AccountTab from "./tabs/AccountTab";
import SecurityTab from "./tabs/SecurityTab";
import NotificationsTab from "./tabs/NotificationsTab";
import AppearanceTab from "./tabs/AppearanceTab";
import DangerTab from "./tabs/DangerTab";

const TABS = [
  "Overview",
  "Activity",
  "Account",
  "Security",
  "Notifications",
  "Appearance",
  "Danger Zone",
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [active, setActive] = useState("Overview");

  if (status === "loading") {
    return <p className="pt-20 text-center text-white">Loading…</p>;
  }
  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const { user } = session;
  const avatarUrl = user.profileImage; // from authOptions callback

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col pt-16"
      style={{ backgroundImage: "url('/images/baseImage.png')" }}
    >
      <Navbar />

      {/* ─── HEADER WITH AVATAR ───────────────── */}
      <div className="container mx-auto flex items-center space-x-4 px-4 py-6">
        <img
          src={user.profileImage}
          alt={user.name || user.email}
          className="h-16 w-16 rounded-full"
        />
        <div className="text-white">
          <h1 className="text-2xl font-semibold">{user.name || user.email}</h1>
          <p className="text-gray-300 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-grow items-start justify-center mt-4">
        <div className="max-w-5xl w-full flex">
          {/* Tabs */}
          <ul className="w-1/4 bg-gray-800 rounded-l-lg overflow-hidden">
            {TABS.map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setActive(tab)}
                  className={`w-full px-4 py-3 text-left text-sm ${
                    active === tab
                      ? "bg-gray-700 text-white font-semibold"
                      : "text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>

          {/* Tab content */}
          <div className="w-3/4 bg-gray-800 rounded-r-lg p-6">
            {active === "Overview" && <OverviewTab />}
            {active === "Activity" && <ActivityTab />}
            {active === "Account"       && <AccountTab />}
            {active === "Security" && <SecurityTab />}
            {active === "Notifications" && <NotificationsTab />}
            {active === "Appearance" && <AppearanceTab />}
            {active === "Danger Zone" && <DangerTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
