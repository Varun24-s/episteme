"use client";
import { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Search from "./Search";
import Link from "next/link";
import { User, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 md:p-6">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter">
          EPISTEME.
        </Link>
        
        {/* Desktop Search - Hidden on mobile */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <Search />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-bold border-2 border-black px-5 py-2 rounded-full hover:bg-black hover:text-white transition-all">
                Join
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/studio" className="text-sm font-bold text-gray-500 hover:text-black transition">
              Write
            </Link>
            <UserButton afterSignOutUrl="/">
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Profile"
                  labelIcon={<User size={16} />}
                  href={`/profile/${user?.id}`}
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/">
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Profile"
                  labelIcon={<User size={16} />}
                  href={`/profile/${user?.id}`}
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 bg-white flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <div className="w-full">
            <Search />
          </div>
          <div className="flex flex-col gap-4 pb-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full text-center font-bold border-2 border-black py-3 rounded-xl">
                  Join Episteme
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link 
                href="/studio" 
                onClick={() => setIsMenuOpen(false)}
                className="font-bold text-lg border-b pb-2"
              >
                Write a Story
              </Link>
              <Link 
                href={`/profile/${user?.id}`} 
                onClick={() => setIsMenuOpen(false)}
                className="font-bold text-lg border-b pb-2"
              >
                View Profile
              </Link>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}