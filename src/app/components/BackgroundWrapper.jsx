'use client'
import React from 'react';

export default function BackgroundWrapper({ children }) {
    return (
      // h-screen = exactly 100vh, so the image covers only one viewport
      <div className="h-screen bg-[url('/images/baseImage.png')] bg-cover bg-center">
        {children}
      </div>
    )
  }