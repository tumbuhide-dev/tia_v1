"use client";
import React from "react";
import DashboardHeader from "@/components/Header";
import DashboardFooter from "@/components/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">{children}</main>
      <footer className="w-full bg-gray-50 dark:bg-[#18181B] border-t border-gray-100 dark:border-gray-800 py-4 mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4">
          <div>
            &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME || "LinkHub"} &mdash; Powered by <a href="https://tumbuhide.dev" className="underline hover:text-purple-600 dark:hover:text-yellow-400">Tumbuh Ide</a>
          </div>
          <div className="flex gap-4">
            <a href="/" className="hover:underline">Beranda</a>
            <a href="/about" className="hover:underline">Tentang</a>
            <a href="/contact" className="hover:underline">Kontak</a>
            <a href="/terms" className="hover:underline">Syarat</a>
            <a href="/privacy" className="hover:underline">Privasi</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 