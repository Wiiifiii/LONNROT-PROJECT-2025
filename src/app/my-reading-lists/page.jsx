import React from "react";
import Navbar from "@/app/components/Layout/Navbar";
import BackgroundWrapper from "@/app/components/Layout/BackgroundWrapper";
import MyReadingListsClient from "./MyReadingListsClient";

export const dynamic = "force-dynamic";

export default function MyReadingListsPage() {
  return (
    <>
      <Navbar />
      <BackgroundWrapper>
        <div className="container mx-auto pt-24 px-4">
          <MyReadingListsClient />
        </div>
      </BackgroundWrapper>
    </>
  );
}
