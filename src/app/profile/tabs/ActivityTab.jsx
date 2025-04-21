// "use client";
// import { useEffect, useState } from "react";

// export default function ActivityTab() {
//   const [logs, setLogs] = useState(null);

//   useEffect(() => {
//     fetch("/api/users/me/activity")
//       .then((r) => r.json())
//       .then(setLogs)
//       .catch(console.error);
//   }, []);

//   if (!logs) return <p>Loading activity…</p>;

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
//       <ul className="space-y-2 text-gray-300">
//         {logs.map((a) => (
//           <li key={a.id}>
//             [{new Date(a.timestamp).toLocaleString()}] {a.action}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";


import ComingSoon from "@/app/components/ComingSoon";

export default function FooBarPage() {
  return <ComingSoon featureName="Foo / Bar" />;
}
