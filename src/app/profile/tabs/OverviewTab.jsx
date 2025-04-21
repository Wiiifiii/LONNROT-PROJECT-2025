// "use client";
// import { useEffect, useState } from "react";
// import StatsCard from "@/app/components/StatsCard";

// export default function OverviewTab() {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     fetch("/api/users/me/stats")
//       .then((r) => r.json())
//       .then(setStats)
//       .catch(console.error);
//   }, []);

//   if (!stats) return <p className="text-gray-300">Loading stats…</p>;

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-semibold text-white">Your Reading Stats</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <StatsCard title="Books Read" value={stats.booksRead} />
//         <StatsCard title="Bookmarks" value={stats.bookmarks} />
//         <StatsCard title="Time Saved" value={stats.timeSaved} unit="hrs" />
//       </div>
//     </div>
//   );
// }


"use client";


import ComingSoon from "@/app/components/ComingSoon";

export default function FooBarPage() {
  return <ComingSoon featureName="Foo / Bar" />;
}
