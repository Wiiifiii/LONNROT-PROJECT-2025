// "use client";
// import { useEffect, useState } from "react";

// export default function NotificationsTab() {
//   const [prefs, setPrefs] = useState(null);

//   useEffect(() => {
//     fetch("/api/users/me/settings")
//       .then((r) => r.json())
//       .then((data) => setPrefs(data.notifications))
//       .catch(console.error);
//   }, []);

//   if (!prefs) return <p>Loading settings…</p>;

//   const toggle = (field) => {
//     const updated = { ...prefs, [field]: !prefs[field] };
//     setPrefs(updated);
//     fetch("/api/users/me/settings", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ notifications: updated }),
//     }).catch(console.error);
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-semibold text-white">Notification Settings</h3>
//       <label className="flex items-center gap-2 text-gray-300">
//         <input
//           type="checkbox"
//           checked={prefs.emailDigest}
//           onChange={() => toggle("emailDigest")}
//         />
//         Email Digest
//       </label>
//       <label className="flex items-center gap-2 text-gray-300">
//         <input
//           type="checkbox"
//           checked={prefs.newBookAlerts}
//           onChange={() => toggle("newBookAlerts")}
//         />
//         New‑Book Alerts
//       </label>
//     </div>
//   );
// }



"use client";


import ComingSoon from "@/app/components/ComingSoon";

export default function FooBarPage() {
  return <ComingSoon featureName="Foo / Bar" />;
}
