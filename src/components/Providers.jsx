"use client";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

function SupabaseSync() {
  const { user, isLoaded } = useUser();
  useEffect(() => {
    async function sync() {
      if (isLoaded && user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          username: user.username || user.firstName || "Writer",
          avatar_url: user.imageUrl,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      }
    }
    sync();
  }, [user, isLoaded]);
  return null;
}

export default function Providers({ children }) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#000000", colorText: "#000000", fontFamily: "inherit" },
        elements: {
          card: { boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb" },
          userButtonPopoverCard: { border: "1px solid #e5e7eb", borderRadius: "1.5rem" },
          userButtonPopoverFooter: { display: "none" },
        },
      }}
    >
      <SupabaseSync />
      {children}
    </ClerkProvider>
  );
}