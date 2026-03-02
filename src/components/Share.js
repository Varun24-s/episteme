"use client";
import { useState } from "react";
import { 
  Share2, 
  Link as LinkIcon, 
  Check, 
  Instagram, 
  Twitter, 
  MessageCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Share({ title, url }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const handleShare = async () => {
        // Trigger Native Share for Mobile (iOS/Android)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out this story on Episteme: ${title}`,
                    url: url,
                });
            } catch (err) {
                console.log("Share cancelled or failed", err);
            }
        } else {
            // Fallback for Desktop: Open Custom Tray
            setIsMenuOpen(!isMenuOpen);
        }
    };

    return (
        <div className="relative border-t border-black pt-12 ">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="max-w-xs">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 block mb-2">
                        Discourse Distribution
                    </span>
                    <h4 className="text-2xl font-serif italic text-black leading-tight">
                        Thought deserves to be shared.
                    </h4>
                </div>

                <div className="flex items-center gap-3">
                    {/* Primary Native Share Button */}
                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-bold hover:bg-gray-800 transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/5"
                    >
                        <Share2 size={18} strokeWidth={2.5} />
                        <span className="text-sm uppercase tracking-widest">Share Story</span>
                    </button>

                    {/* Quick Copy Button */}
                    <button 
                        onClick={handleCopy}
                        className="w-16 h-16 flex items-center justify-center cursor-pointer rounded-full border-2 border-gray-100 hover:border-black transition-all bg-white"
                        title="Copy Link"
                    >
                        {copied ? <Check size={20} className="text-black" /> : <LinkIcon size={20} />}
                    </button>
                </div>
            </div>

            {/* --- DESKTOP TRAY FALLBACK --- */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Click Outside to Close */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 bottom-full mb-6 w-full max-w-sm bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-8 z-50"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Platform</span>
                                <button onClick={() => setIsMenuOpen(false)}><X size={16} /></button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <ShareOption 
                                    icon={<MessageCircle size={20} />} 
                                    label="WhatsApp" 
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`} 
                                />
                                <ShareOption 
                                    icon={<Twitter size={20} />} 
                                    label="Twitter / X" 
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} 
                                />
                                {/* Instagram on desktop is usually a link copy for stories */}
                                <button 
                                    onClick={handleCopy}
                                    className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-black"
                                >
                                    <Instagram size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Instagram</span>
                                </button>
                                
                                <button 
                                    onClick={handleCopy}
                                    className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-black"
                                >
                                    {copied ? <Check size={20} /> : <LinkIcon size={20} />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {copied ? "Copied" : "Copy Link"}
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function ShareOption({ icon, label, href }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-black border border-transparent hover:border-gray-100"
        >
            {icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </a>
    );
}