"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { AiFillHome } from "react-icons/ai";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { SiBackendless, SiCodeproject, SiAboutdotme } from "react-icons/si";
import { PiBooksDuotone } from "react-icons/pi";
import { BsFiletypeDoc } from "react-icons/bs";
import { ImList2 } from "react-icons/im";
import { useSession, signOut } from "next-auth/react";
import MenuOverlay from "./MenuOverlay";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const navLinks = [
    { href: "/", title: "Kalevala’s Hearth", Icon: AiFillHome },
    { href: "/books", title: "Saga Haven", Icon: PiBooksDuotone },
    { href: "/my-reading-lists", title: "My Saga Lists", Icon: ImList2 },
    { href: "/about", title: "Lönnrot’s Tale", Icon: SiAboutdotme },
    { href: "/documentation", title: "Kantele’s Guide", Icon: BsFiletypeDoc },
    { href: "/documentation/api-doc", title: "API", Icon: SiBackendless },
  ];

  const mobileLinks = [
    ...navLinks,
    !user
      ? { href: "/auth/login", title: "Login", Icon: FiLogIn }
      : { href: "#", title: "Logout", Icon: FiLogOut, action: () => signOut() },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-10 group">
      <div className="h-2"></div>
      <nav className="bg-[#111827] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <SiCodeproject className="text-blue-400" size={24} />
            <span className="text-2xl font-semibold text-white hover:text-blue-400">
              PROJECT LÖNNROT
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-4">
            {navLinks.map(({ href, title, Icon }, i) => (
              <li key={i}>
                <Link href={href} className="flex items-center text-slate-200 hover:text-blue-400 gap-1">
                  <Icon />
                  <span>{title}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side (avatar or login) */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <Link href="/auth/login" className="flex items-center text-slate-200 hover:text-blue-400 gap-1">
                <FiLogIn />
                <span>Login</span>
              </Link>
            ) : (
              <Menu as="div" className="relative">
                <Menu.Button className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-600 hover:border-blue-400">
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <span className="block w-full h-full bg-gray-500"></span>
                  )}
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-40 bg-gray-800 rounded shadow-lg overflow-hidden">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`block px-4 py-2 text-sm ${active ? "bg-gray-700" : ""}`}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/settings"
                        className={`block px-4 py-2 text-sm ${active ? "bg-gray-700" : ""}`}
                      >
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className={`w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-700" : ""}`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="text-slate-200 p-2 border rounded border-slate-200 hover:text-blue-400 hover:border-blue-400"
            >
              {isOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {isOpen && <MenuOverlay links={mobileLinks} />}
      </nav>
    </div>
  );
}
