// 'use client';

// import React from 'react';

// export default function BackgroundWrapper({ children }) {
//   return (
//     <div
//       className="
//         min-h-screen        /* expand at least to full viewport, but grow with content */
//         w-full
//         bg-[#111827]        /* fallback background color */
//         bg-[url('/images/baseImage.png')]
//         bg-fixed            /* keep it stationary during scroll */
//         bg-cover
//         bg-center
//         flex
//         flex-col
//       "
//     >
//       {children}
//     </div>
//   );
// }


'use client'

export default function BackgroundWrapper({ children }) {
  return (
    // min-h-screen = at least 100vh, so background grows with content
    // bg-fixed keeps the image from scrolling
    <div className="min-h-screen bg-[url('/images/baseImage.png')] bg-cover bg-center bg-fixed">
      {children}
    </div>
  )
}
