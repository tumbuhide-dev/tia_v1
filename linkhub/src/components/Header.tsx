import React from "react";
import Link from "next/link";

export const DashboardHeader = () => (
  <header className="w-full bg-white border-b shadow-sm sticky top-0 z-30">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-brand">
        <span className="inline-block w-8 h-8 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full" />
        LinkHub
      </Link>
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <Link href="/dashboard" className="hover:text-brand">Dashboard</Link>
        <Link href="/dashboard/links" className="hover:text-brand">Link</Link>
        <Link href="/dashboard/theme" className="hover:text-brand">Tema</Link>
        <Link href="/dashboard/settings" className="hover:text-brand">Pengaturan</Link>
      </nav>
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-brand focus:outline-none">
          {/* Avatar user, ganti src sesuai user */}
          <img src="/default-avatar.svg" alt="Avatar" className="w-full h-full object-cover" />
        </button>
        {/* Dropdown user menu (placeholder) */}
      </div>
    </div>
  </header>
);

export default DashboardHeader; 