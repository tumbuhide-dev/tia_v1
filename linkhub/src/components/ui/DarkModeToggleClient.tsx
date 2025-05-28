"use client";
import React from "react";

export default function DarkModeToggleClient() {
  const [isDark, setIsDark] = React.useState(false);
  // On mount, always set to light
  React.useEffect(() => {
    document.documentElement.classList.remove("dark");
    setIsDark(false);
  }, []);

  const toggle = () => {
    setIsDark((d) => {
      if (!d) {
        document.documentElement.classList.add("dark");
        return true;
      } else {
        document.documentElement.classList.remove("dark");
        return false;
      }
    });
  };

  return (
    <button
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      onClick={toggle}
      className="ml-2 p-2 rounded-full hover:bg-purple-100 dark:hover:bg-yellow-100 transition"
      type="button"
    >
      <span className="inline-block transition-transform duration-200" style={{ transform: isDark ? "scale(1.1)" : "scale(1)" }}>
        {isDark ? (
          // Sun icon
          <svg className="w-6 h-6 text-yellow-400 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="5" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34l-1.41-1.41m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" /></svg>
        ) : (
          // Moon icon
          <svg className="w-6 h-6 text-purple-600 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
        )}
      </span>
    </button>
  );
} 