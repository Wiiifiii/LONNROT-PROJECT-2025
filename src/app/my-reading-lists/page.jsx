// src/app/my-reading-lists/page.jsx
import React, { Suspense } from "react";
import Navbar from "@/app/components/Navbar";

// ensure this page is always dynamic
export const dynamic = "force-dynamic";

export default function MyReadingListsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cover bg-center text-white"
           style={{ backgroundImage: "url('/images/LogInPage.png')" }}>
        <div className="container mx-auto pt-24 px-4">
          <Suspense fallback={<p className="text-white">Loading your saga lists…</p>}>
            {/* This loads the client‑only UI */}
            <MyReadingListsClient />
          </Suspense>
        </div>
      </div>
    </>
  );
}

// Note: We import the client component lazily
const MyReadingListsClient = React.lazy(() =>
  import("./MyReadingListsClient")
);
