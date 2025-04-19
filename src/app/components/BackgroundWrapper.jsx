'use client'
import React from 'react';

export default function BackgroundWrapper({ children }) {
  return (
    <div
      className="min-h-screen text-white bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/images/LogInPage.png')" }}
    >
      {children}
    </div>
  );
}