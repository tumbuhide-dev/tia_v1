"use client";
import React from "react";
import Link from "next/link";
import DarkModeToggleClient from "@/components/ui/DarkModeToggleClient";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalHeaderClient({ APP_LOGO_URL }: { APP_LOGO_URL?: string }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/features", label: "Fitur" },
    { href: "/about", label: "Tentang" },
    { href: "/contact", label: "Kontak" },
  ];

  // Prevent background scroll when menu is open
  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavigate = (url: string) => {
    setLoading(true);
    setMenuOpen(false);
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  };

  return (
    <header className="w-full bg-white dark:bg-[#18181B] border-b border-gray-100 dark:border-gray-800 shadow-lg sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-bold text-2xl md:text-3xl text-purple-700 dark:text-yellow-400">
          {APP_LOGO_URL ? (
            <img src={APP_LOGO_URL} alt="Logo" className="w-10 h-10 object-contain rounded-full bg-gradient-to-tr from-purple-500 to-yellow-400" />
          ) : (
            <span className="inline-block w-10 h-10 bg-gradient-to-tr from-purple-500 to-yellow-400 rounded-full" />
          )}
          {process.env.NEXT_PUBLIC_APP_NAME || "LinkHub"}
        </Link>
        <nav className="hidden md:flex gap-8 text-base font-semibold">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavigate(link.href)}
              className={
                "hover:text-purple-600 dark:hover:text-yellow-400 transition bg-transparent border-0 outline-none cursor-pointer " +
                (pathname === link.href ? "text-purple-600 dark:text-yellow-400 underline underline-offset-4" : "")
              }
              aria-current={pathname === link.href ? "page" : undefined}
              style={{ background: "none" }}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <button
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded hover:bg-purple-100 dark:hover:bg-yellow-100 focus:outline-none transition"
          >
            {menuOpen ? (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
            )}
          </button>
          <DarkModeToggleClient />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <DarkModeToggleClient />
        </div>
      </div>
      {/* Mobile nav overlay with animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex flex-col"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <motion.nav
              initial={{ y: -32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -32, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="relative bg-white dark:bg-[#18181B] w-full shadow-lg px-8 py-8 flex flex-col gap-6 text-lg font-semibold"
              style={{ maxWidth: 420, margin: '0 auto', borderRadius: 24, marginTop: 32 }}
            >
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigate(link.href)}
                  className={
                    "hover:text-purple-600 dark:hover:text-yellow-400 transition bg-transparent border-0 outline-none cursor-pointer " +
                    (pathname === link.href ? "text-purple-600 dark:text-yellow-400 underline underline-offset-4" : "")
                  }
                  aria-current={pathname === link.href ? "page" : undefined}
                  style={{ background: "none" }}
                >
                  {link.label}
                </button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full border-4 border-purple-400 border-t-yellow-300 animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 