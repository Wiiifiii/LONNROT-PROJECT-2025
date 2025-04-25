// src/app/components/Footer.jsx
'use client';

import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-300 text-sm mt-16 py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Lönnrot Library — Made with ❤️ by <a href="https://github.com/Wiiifiii" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Wiiifii</a>
        </p>
        <div className="flex space-x-4">
          <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link>
          <a href="https://github.com/Wiiifiii" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white">
            <FaGithub className="mr-1" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
