// "use client";
// import React, { useState } from "react";

// export default function SecurityTab() {
//   // TODO: implement TOTP enable/disable
//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-semibold text-white">Security</h3>
//       <p className="text-gray-300">Change Password</p>
//       {/* reuse your floating‑label form for current/new password */}
//       {/* TOTP section */}
//       <div className="mt-6">
//         <h4 className="text-lg font-semibold text-white">Two‑Factor Authentication</h4>
//         <p className="text-gray-400">Enable or disable via your authenticator app.</p>
//         {/* placeholder toggle */}
//         <button className="mt-2 px-4 py-2 bg-blue-600 rounded text-white">Configure 2FA</button>
//       </div>
//     </div>
//   );
// }



"use client";


import ComingSoon from "@/app/components/ComingSoon";

export default function FooBarPage() {
  return <ComingSoon featureName="Foo / Bar" />;
}
