// // src/app/community/page.client.jsx
// "use client";

// import ClientCommunity from "@/app/components/Community/ClientCommunity.client";

// export default function CommunityPage() {
//   return (
//     <div className="mx-auto max-w-3xl p-6">
//       <h1 className="text-4xl font-bold">Community Discussion</h1>
//       <ClientCommunity />
//     </div>
//   );
// }



"use client";


import ComingSoon from "@/app/components/Sections/ComingSoon";

export default function FooBarPage() {
  return <ComingSoon featureName="Foo / Bar" />;
}