// // src/app/components/Footer.jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaGithub } from 'react-icons/fa'

export default function Footer() {
  const pathname = usePathname()

  // Don’t show footer on PDF‐reader pages
  if (pathname.includes('/read')) {
    return null
  }

  return (
    <footer className="text-center text-gray-500 text-sm py-4 space-y-2">
      <div>© {new Date().getFullYear()} Project Lönnrot by Wiiifiii</div>
      <div className="flex justify-center space-x-4">
        <Link href="/privacy-policy" className="hover:text-white">
          Privacy Policy
        </Link>
        <Link href="/terms-of-service" className="hover:text-white">
          Terms of Service
        </Link>
        <a
          href="https://github.com/Wiiifiii"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center hover:text-white"
        >
          <FaGithub className="mr-1" /> GitHub
        </a>
      </div>
    </footer>
  )
}
