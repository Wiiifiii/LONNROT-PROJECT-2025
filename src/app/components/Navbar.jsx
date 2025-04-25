// src/app/components/Navbar.jsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { AiFillHome, AiOutlineDashboard } from "react-icons/ai";
import { PiBooksDuotone } from "react-icons/pi";
import { GiLion, GiMagicGate, GiMagickTrick } from "react-icons/gi";
import { SiMagic } from "react-icons/si";
import MenuOverlay from "./MenuOverlay";
import Tooltip from "./Tooltip";
import { useSession, signOut } from "next-auth/react";

// If you want to tweak how Next/Image loads from Supabase:
const supabaseLoader = ({ src, width, quality }) =>
  `${src}?width=${width}&quality=${quality || 75}`;

const DESKTOP_LINKS = [
  { href: "/dashboard",        title: "Realm’s Echo",     Icon: AiOutlineDashboard },
  { href: "/",                 title: "Kalevala’s Gate",          Icon: AiFillHome },
  { href: "/books",            title: "Saga Haven",     Icon: GiMagicGate },
  { href: "/my-reading-lists", title: "My Saga Lists", Icon: SiMagic },
  { href: "/about",            title: "Kantele’s Guide",Icon: GiMagickTrick },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session }   = useSession();
  const user                = session?.user;

  const mobileLinks = [
    ...DESKTOP_LINKS.map(({ href, title, Icon }) => ({ href, title, Icon })),
    // include profile link when signed in
    ...(user
      ? [{ href: "/profile", title: user.name || "Profile", Icon: GiLion }]
      : []),
    // login or logout
    !user
      ? { href: "/auth/login", title: "Login",  Icon: FiLogIn }
      : { href: "#",            title: "Logout", Icon: FiLogOut, action: () => signOut({ callbackUrl: "/" }) },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-10 group">
      <div className="h-2" />
      <nav className="bg-[#111827] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GiLion className="text-blue-400" size={24} />
            <span className="text-2xl font-semibold text-white hover:text-blue-400">
              PROJECT LÖNNROT
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-6">
            {DESKTOP_LINKS.map(({ href, title, Icon }, idx) => (
              <li key={idx}>
                <Link
                  href={href}
                  className="flex items-center text-slate-200 hover:text-blue-400 gap-1"
                >
                  <Icon />
                  <span>{title}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* User / Auth Controls (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <Link
                href="/auth/login"
                className="flex items-center text-slate-200 hover:text-blue-400 gap-1"
              >
                <FiLogIn />
                <span>Login</span>
              </Link>
            ) : (
              <Menu as="div" className="relative">
                <Menu.Button className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 hover:border-blue-400">
                  {user.profileImage ? (
                    <Image
                      loader={supabaseLoader}
                      src={user.profileImage}
                      alt={user.name || user.email}
                      width={60}
                      height={60}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-500 text-white font-semibold">
                      {(user.name || user.email)[0].toUpperCase()}
                    </div>
                  )}
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-40 bg-gray-800 rounded shadow-lg overflow-hidden">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`block px-4 py-2 text-sm ${active ? "bg-gray-700" : "text-gray-200"}`}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/settings"
                        className={`block px-4 py-2 text-sm ${active ? "bg-gray-700" : "text-gray-200"}`}
                      >
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className={`w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-700" : "text-gray-200"}`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(o => !o)}
              className="text-slate-200 p-2 border rounded border-slate-200 hover:text-blue-400 hover:border-blue-400"
            >
              {isOpen ? (
                <Tooltip text="Close Menu">
                  <XMarkIcon className="h-5 w-5" />
                </Tooltip>
              ) : (
                <Tooltip text="Open Menu">
                  <Bars3Icon className="h-5 w-5" />
                </Tooltip>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isOpen && <MenuOverlay links={mobileLinks} />}
      </nav>
    </div>
)}
// );