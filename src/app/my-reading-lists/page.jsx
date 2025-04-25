import React, { Suspense } from "react";
import Navbar from "@/app/components/Navbar";

export const dynamic = "force-dynamic";

export default function MyReadingListsPage() {
  const MyReadingListsClient = React.lazy(
    () => import("./MyReadingListsClient")
  );

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/baseImage.png')" }}
      >
        <div className="container mx-auto pt-24 px-4">
          <Suspense
            fallback={<p className="text-white">Loading your Saga lists…</p>}
          >
            <MyReadingListsClient />
          </Suspense>
        </div>
      </div>
    </>
  );
}
