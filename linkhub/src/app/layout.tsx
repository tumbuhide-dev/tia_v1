import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Link from "next/link";
import DarkModeToggleClient from "@/components/ui/DarkModeToggleClient";
import GlobalHeaderClient from "@/components/ui/GlobalHeaderClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_LOGO_URL = process.env.NEXT_PUBLIC_APP_LOGO_URL || undefined;
const APP_FAVICON_URL = process.env.NEXT_PUBLIC_APP_FAVICON_URL || "/favicon.ico";

function ThemeScript() {
  // Hydrate dark mode from localStorage
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function(){
  try {
    var theme = localStorage.getItem('theme');
    if(theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e){}
})();
        `,
      }}
    />
  );
}

function GlobalFooter() {
  return (
    <footer className="w-full bg-gray-50 dark:bg-[#18181B] border-t border-gray-100 dark:border-gray-800 py-4 mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4">
        <div>
          &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME || "LinkHub"} &mdash; Powered by <a href="https://tumbuhide.dev" className="underline hover:text-purple-600 dark:hover:text-yellow-400">Tumbuh Ide</a>
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline">Tentang</Link>
          <Link href="/contact" className="hover:underline">Kontak</Link>
          <Link href="/terms" className="hover:underline">Syarat</Link>
          <Link href="/privacy" className="hover:underline">Privasi</Link>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="icon" href={APP_FAVICON_URL} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#18181B] text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <GlobalHeaderClient APP_LOGO_URL={APP_LOGO_URL} />
        <main className="min-h-[80vh] flex flex-col items-center justify-center w-full">
          {children}
        </main>
        <GlobalFooter />
      </body>
    </html>
  );
}
