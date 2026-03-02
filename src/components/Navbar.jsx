"use client";
import { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Search from "./Search";
import Link from "next/link";
import { User, Search as SearchIcon, X, Feather } from "lucide-react";

export default function Navbar() {
    const { user } = useUser();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        // Don't hide navbar if search is open
        if (latest > previous && latest > 150 && !isSearchOpen) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-[100]"
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-70 transition-opacity">
                        EPISTEME<span className="text-blue-600">.</span>
                    </Link>

                    {/* Desktop Search (Static) */}
                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <Search />
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Mobile Search Toggle */}
                        <button 
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            {isSearchOpen ? <X size={22} /> : <SearchIcon size={22} />}
                        </button>

                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-black border-2 border-black text-[11px] md:text-[13px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-all shadow-lg shadow-black/5">
                                    Join
                                </button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <Link href="/studio" className="flex items-center gap-2 text-sm font-bold text-black md:text-gray-400 hover:text-black transition-colors group">
                                <Feather size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                                <span className="hidden sm:inline">Write</span>
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
                </div>

                {/* Mobile Search Bar Expansion */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "circOut" }}
                            className="md:hidden overflow-hidden pb-4"
                        >
                            <Search />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}