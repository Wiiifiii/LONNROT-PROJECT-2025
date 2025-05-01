
'use client'

export default function BackgroundWrapper({ children }) {
  return (
   
    <div className="min-h-screen bg-[url('/images/baseImage.png')] bg-cover bg-center bg-fixed">
      {children}
    </div>
  )
}
