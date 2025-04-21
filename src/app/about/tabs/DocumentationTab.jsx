// "use client";
// import React from "react";
// import Image from "next/image";

// export default function DocumentationTab() {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-semibold"> Documentation</h2>
//       <p>Full details coming soon…</p>
//       {/* We'll drop in all auth, books, reviews, lists, users, logs, etc. here */}
//     </div>
//   );
// }

"use client";


import ComingSoon from "@/app/components/ComingSoon";

export default function FooBarPage() {
  return <ComingSoon featureName="Foo / Bar" />;
}
