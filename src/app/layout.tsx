import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { GameProvider } from "@/lib/GameContext";
import Navbar from "@/components/Navbar";
import A11yControls from "@/components/A11yControls";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "VoteNavigator AI — Bharat ka Election Assistant",
  description:
    "AI-powered interactive election assistant for Indian voters. Get personalized guidance on EPIC registration, Lok Sabha, Vidhan Sabha, polling booths, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground relative grid-overlay">
        {/* Floating orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <AuthProvider>
          <GameProvider>
            <Navbar />
            <A11yControls />
            <main className="flex-1 pt-16">{children}</main>

            <footer className="mt-12 py-6 border-t border-border/30 text-center text-sm text-foreground/50">
              <div className="max-w-5xl mx-auto px-4">
                <p>
                  Disclaimer: VoteNavigator is an AI-powered assistant intended
                  for informational purposes only. It is not affiliated with the
                  Election Commission of India (ECI). Always verify official
                  information on the{" "}
                  <a
                    href="https://voters.eci.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    official ECI Voter Portal
                  </a>
                  .
                </p>
              </div>
            </footer>
          </GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
