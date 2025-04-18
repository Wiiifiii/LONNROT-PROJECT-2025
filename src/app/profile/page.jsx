"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";

// import each tab
import OverviewTab from "./tabs/OverviewTab";
import ActivityTab from "./tabs/ActivityTab";
import SecurityTab from "./tabs/SecurityTab";
import NotificationsTab from "./tabs/NotificationsTab";
import AppearanceTab from "./tabs/AppearanceTab";
import DangerTab from "./tabs/DangerTab";

const TABS = [
  "Overview",
  "Activity",
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

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/images/LogInPage.png')" }}
    >
      <Navbar />
      <div className="flex flex-grow items-center justify-center">
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
