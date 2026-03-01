import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers"; // Import what we just made
import "./globals.css";

// ✅ This will now work perfectly because this is a Server Component
export const metadata = {
  title: "EPISTEME. | Share Your Knowledge",
  description: "A minimalist space for deep thinkers and storytellers.",
  applicationName: "EPISTEME.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* The favicon is handled automatically by Next.js if placed in /app */}
      </head>
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}