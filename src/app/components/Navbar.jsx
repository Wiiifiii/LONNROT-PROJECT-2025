"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { AiFillHome } from "react-icons/ai";
import { FiLogIn, FiUser, FiLogOut } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { SiBackendless, SiCodeproject, SiAboutdotme } from "react-icons/si";
import { PiBooksDuotone } from "react-icons/pi";
import { BsFiletypeDoc } from "react-icons/bs";
import { ImList2 } from "react-icons/im";
import MenuOverlay from "./MenuOverlay";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user = session ? session.user : null;

  const navLinks = [
    { href: "/", title: "Home", Icon: AiFillHome },
    { href: "/books", title: "Bookshelf", Icon: PiBooksDuotone },
    { href: "/my-reading-lists", title: "My Lists", Icon: ImList2 },
    { href: "/about", title: "About", Icon: SiAboutdotme },
    { href: "/documentation", title: "Doc", Icon: BsFiletypeDoc },
    { href: "/documentation/api-doc", title: "API", Icon: SiBackendless },
  ];

  const mobileLinks = [
    { href: "/", title: "Home", Icon: AiFillHome },
    { href: "/books", title: "Bookshelf", Icon: PiBooksDuotone },
    { href: "/my-reading-lists", title: "My Lists", Icon: ImList2 },
    { href: "/about", title: "About", Icon: SiAboutdotme },
    { href: "/documentation", title: "Doc", Icon: BsFiletypeDoc },
    { href: "/documentation/api-doc", title: "API", Icon: SiBackendless },
    !user
      ? { href: "/auth/login", title: "Login", Icon: FiLogIn }
      : { href: "#", title: "Logout", Icon: FiLogOut, action: () => signOut() },
  ];

  return (
    // The outer div is a group that will trigger the hover on the navbar.
    <div className="fixed top-0 left-0 right-0 z-10 group">
      {/* An invisible top spacer to trigger hover */}
      <div className="h-2"></div>
      <nav
        className="bg-[#111827] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"
      >
        <div className="flex flex-wrap items-center justify-between mx-auto px-4 py-4">
          <div className="flex-shrink-0 flex items-center gap-2">
            <SiCodeproject className="text-blue-400" size={24} />
            <Link href="/" className="text-2xl md:text-4xl font-semibold text-white hover:text-blue-400">
              PROJECT LÖNNROT
            </Link>
          </div>
          <ul className="hidden md:flex items-center gap-4 flex-wrap">
            {navLinks.map((link, index) => {
              const Icon = link.Icon;
              return (
                <li key={index}>
                  <Link href={link.href} className="flex items-center text-slate-200 hover:text-blue-400 gap-1">
                    <Icon />
                    <span>{link.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <Link href="/auth/login" className="flex items-center text-slate-200 hover:text-blue-400 gap-1">
                <FiLogIn />
                <span>Login</span>
              </Link>
            ) : (
              <>
                <span className="flex items-center text-slate-200 gap-1">
                  <FiUser />
                  <span>{user.name || user.email}</span>
                </span>
                <Link href="/profile" className="flex items-center text-slate-200 hover:text-blue-400">
                  <MdAccountCircle className="h-6 w-6" />
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/auth/login' })} className="flex items-center text-slate-200 hover:text-blue-400 gap-1">
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
          <div className="md:hidden">
            {!isOpen ? (
              <button
                onClick={() => setIsOpen(true)}
                className="text-slate-200 flex items-center p-2 border rounded border-slate-200 hover:text-blue-400 hover:border-blue-400"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-200 flex items-center p-2 border rounded border-slate-200 hover:text-blue-400 hover:border-blue-400"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        {isOpen && <MenuOverlay links={mobileLinks} />}
      </nav>
    </div>
  );
};

export default Navbar;
