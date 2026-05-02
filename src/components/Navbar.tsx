"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Vote, Menu, X, LogOut, User } from "lucide-react";

const navLinks = [
  { href: "/journey", label: "Journey" },
  { href: "/timeline", label: "Timeline" },
  { href: "/quiz", label: "Quiz" },
  { href: "/faq", label: "AI Assistant" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Vote className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight gradient-text">VoteNavigator</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-primary/15 text-primary"
                    : "text-foreground/60 hover:text-foreground hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm">
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[120px] truncate">{user.displayName || user.email?.split("@")[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary !px-4 !py-2 text-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mt-2 glass rounded-2xl p-4 flex flex-col gap-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "bg-primary/15 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border/30 pt-2 mt-1 flex flex-col gap-2">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-left text-foreground/70 hover:text-foreground hover:bg-white/5 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-white/5">Log in</Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm">Sign up</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
