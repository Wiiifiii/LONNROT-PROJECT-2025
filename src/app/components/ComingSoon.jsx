"use client";

import React from "react";
import BackgroundWrapper from "./BackgroundWrapper";
import Link from "next/link";

export default function ComingSoon({ featureName = "This page" }) {
  return (
    <BackgroundWrapper>
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 text-white p-4">
        <h1 className="text-4xl font-bold">🎉 {featureName} Coming Soon! 🎉</h1>
        <p className="text-lg text-gray-300">
          We’re hard at work building out this feature. Check back soon!
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-medium transition"
        >
          ← Back to Home
        </Link>
      </div>
    </BackgroundWrapper>
  );
}
