// Summary: Renders the navigation bar with the brand logo, desktop and mobile navigation links (including conditional login/logout), and mobile menu support using the MenuOverlay component.

"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { AiFillHome } from 'react-icons/ai';
import { FiLogIn, FiUser, FiLogOut } from 'react-icons/fi';
import { MdAccountCircle } from 'react-icons/md';
import { SiBackendless, SiCodeproject } from "react-icons/si";
import MenuOverlay from './MenuOverlay';
import { useSession, signOut } from "next-auth/react";
import { PiBooksDuotone } from "react-icons/pi";
import { SiAboutdotme } from "react-icons/si";
import { BsFiletypeDoc } from "react-icons/bs";
import { ImList2 } from "react-icons/im";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user = session ? session.user : null;

  const navLinks = [
    { href: "/", title: "Home", Icon: AiFillHome },
    { href: "/books", title: "All Books", Icon: PiBooksDuotone },
    { href: "/my-reading-lists", title: "My Lists", Icon: ImList2 },
    { href: "/about", title: "About", Icon: SiAboutdotme },
    { href: "/documentation", title: "Doc", Icon: BsFiletypeDoc },
    { href: "/documentation/api-doc", title: "API", Icon: SiBackendless },
  ];

  const mobileLinks = [
    { href: "/", title: "Home", Icon: AiFillHome },
    { href: "/books", title: "All Books", Icon: PiBooksDuotone },
    { href: "/my-reading-lists", title: "My Lists", Icon: ImList2 },
    { href: "/about", title: "About", Icon: SiAboutdotme },
    { href: "/documentation", title: "Doc", Icon: BsFiletypeDoc },
    { href: "/documentation/api-doc", title: "API", Icon: SiBackendless },
    !user
      ? { href: "/auth/login", title: "Login", Icon: FiLogIn }
      : { href: "#", title: "Logout", Icon: FiLogOut, action: () => signOut() },
  ];

  return (
    <nav className='fixed top-0 left-0 right-0 z-10 bg-[#111827]'>
      <div className="flex items-center justify-between mx-auto px-4 py-4">
        <div className="flex-shrink-0 flex items-center">
          <SiCodeproject className="text-blue-400 mr-2" size={24} />
          <Link href="/" className='text-2xl md:text-4xl font-semibold text-white hover:text-blue-400'>
            PROJECT LÖNNROT
          </Link>
        </div>
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link, index) => {
            const Icon = link.Icon;
            return (
              <Link key={index} href={link.href} className="flex items-center text-slate-200 hover:text-blue-400">
                <Icon className="mr-1" />
                {link.title}
              </Link>
            );
          })}
        </div>
        <div className="hidden md:flex items-center">
          {!user ? (
            <Link href="/auth/login" className="flex items-center text-slate-200 hover:text-blue-400">
              <FiLogIn className="mr-1" />
              Login
            </Link>
          ) : (
            <>
              <span className="flex items-center text-slate-200 mr-2">
                <FiUser className="mr-1" />
                {user.name || user.email}
              </span>
              <Link 
                href="/profile" 
                className="flex items-center text-slate-200 hover:text-blue-400 mr-4"
              >
                <MdAccountCircle className="h-6 w-6" />
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/auth/login' })} 
                className="flex items-center text-slate-200 hover:text-blue-400"
              >
                <FiLogOut className="mr-1" />
                Logout
              </button>
            </>
          )}
        </div>
        <div className="md:hidden">
          {!isOpen ? (
            <button
              onClick={() => setIsOpen(true)}
              className='text-slate-200 flex items-center px-3 py-2 border rounded border-slate-200 hover:text-blue-400 hover:border-blue-400'
            >
              <Bars3Icon className='h-5 w-5' />
            </button>
          ) : (
            <button
              onClick={() => setIsOpen(false)}
              className='text-slate-200 flex items-center px-3 py-2 border rounded border-slate-200 hover:text-blue-400 hover:border-blue-400'
            >
              <XMarkIcon className='h-5 w-5' />
            </button>
          )}
        </div>
      </div>
      {isOpen && <MenuOverlay links={mobileLinks} />}
    </nav>
  );
};

export default Navbar;
