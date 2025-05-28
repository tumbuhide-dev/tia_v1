import React from "react";
import Link from "next/link";

export const DashboardFooter = () => (
  <footer className="w-full bg-gray-50 border-t py-4 mt-8 text-center text-xs text-gray-500">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4">
      <div>
        &copy; {new Date().getFullYear()} LinkHub &mdash; Powered by <a href="https://tumbuhide.dev" className="underline hover:text-brand">Tumbuh Ide</a>
      </div>
      <div className="flex gap-4">
        <Link href="/about" className="hover:underline">Tentang</Link>
        <Link href="/help" className="hover:underline">Bantuan</Link>
        <Link href="/terms" className="hover:underline">Syarat</Link>
        <Link href="/privacy" className="hover:underline">Privasi</Link>
      </div>
    </div>
  </footer>
);

export default DashboardFooter; 