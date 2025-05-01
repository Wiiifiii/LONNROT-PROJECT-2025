// src/app/components/Navbar.jsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import { GiLion, GiMagicPortal, GiMagicGate, GiMagicLamp } from "react-icons/gi";
import { SiMagic } from "react-icons/si";
import { FaComments } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import MenuOverlay from "@/app/components/Layout/MenuOverlay";
import { useSession, signOut } from "next-auth/react";

const supabaseLoader = ({ src, width, quality }) =>
  `${src}?width=${width}&quality=${quality || 75}`;

const DESKTOP_LINKS = [
  { href: "/dashboard", title: "Realm’s Echo", Icon: AiOutlineDashboard },
  { href: "/", title: "Kalevala’s Gate", Icon: GiMagicPortal },
  { href: "/books", title: "Saga Haven", Icon: GiMagicGate },
  { href: "/my-reading-lists", title: "My Saga Lists", Icon: SiMagic },
  { href: "/about", title: "Kantele’s Guide", Icon: GiMagicLamp },
  { href: "/community", title: "Kalevala Kantele", Icon: FaComments },
  { href: "/contact", title: "Contact", Icon: HiOutlineMail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const mobileLinks = [
    ...DESKTOP_LINKS.map(({ href, title, Icon }) => ({ href, title, Icon })),
    ...(user
      ? [{ href: "/profile", title: user.name || "Profile", Icon: GiLion }]
      : []),
    !user
      ? { href: "/auth/login", title: "Login", Icon: FiLogIn }
      : {
          href: "#",
          title: "Logout",
          Icon: FiLogOut,
          action: () => signOut({ callbackUrl: "/" }),
        },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-10">
      <nav className="bg-[#0b1c2c] shadow">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GiLion className="text-white" size={24} />
            <span className="text-xl font-semibold text-white">PROJECT LÖNNROT</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-4">
            {DESKTOP_LINKS.map(({ href, title, Icon }, idx) => {
              const isActive = pathname === href;
              return (
                <li key={idx}>
                  <Link
                    href={href}
                    className={`
                      flex items-center gap-1 px-2 py-1 rounded
                      ${isActive
                        ? "text-yellow-300 font-semibold"
                        : "text-white hover:text-gray-300"}
                      focus:outline-none focus:ring-2 focus:ring-yellow-300
                    `}
                  >
                    <Icon />
                    <span className="text-sm">{title}</span>
                  </Link>
                </li>
              );
            })}
            {!user && (
              <Link
                href="/auth/login"
                className="flex items-center gap-1 px-2 py-1 rounded text-white hover:text-gray-300"
              >
                <FiLogIn />
                <span>Login</span>
              </Link>
            )}
          </ul>

          {/* Profile / Mobile toggle */}
          <div className="flex items-center gap-4">
            {user && (
              <Menu as="div" className="relative">
                <Menu.Button className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 hover:border-yellow-300 transition-all duration-300 bg-gradient-to-br from-gray-700 to-gray-900">
                  {user.profileImage ? (
                    <Image
                      loader={supabaseLoader}
                      src={user.profileImage}
                      alt={user.name || user.email}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-white font-bold text-lg">
                      {(user.name || user.email)[0].toUpperCase()}
                    </div>
                  )}
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-40 bg-[#375c6c] rounded shadow-lg overflow-hidden">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`block px-4 py-2 text-sm ${
                          active ? "bg-gray-700 text-white" : "text-gray-200"
                        }`}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/settings"
                        className={`block px-4 py-2 text-sm ${
                          active ? "bg-gray-700 text-white" : "text-gray-200"
                        }`}
                      >
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          active ? "bg-gray-700 text-white" : "text-gray-200"
                        }`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            )}

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen((o) => !o)}
                aria-label="Toggle menu"
                className="text-white p-2 border rounded border-white hover:text-yellow-300 hover:border-yellow-300"
              >
                {isOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isOpen && <MenuOverlay links={mobileLinks} />}
      </nav>
    </div>
  );
}
