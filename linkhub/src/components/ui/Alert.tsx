import React from "react";

interface AlertProps {
  type?: "success" | "error" | "info" | "loading";
  children: React.ReactNode;
}

const iconMap = {
  success: (
    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" /></svg>
  ),
  loading: (
    <svg className="w-5 h-5 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
  ),
};

export const Alert = ({ type = "info", children }: AlertProps) => {
  const color =
    type === "success"
      ? "bg-green-50 border-green-400 text-green-800"
      : type === "error"
      ? "bg-red-50 border-red-400 text-red-800"
      : type === "loading"
      ? "bg-gray-50 border-gray-400 text-gray-800"
      : "bg-blue-50 border-blue-400 text-blue-800";
  return (
    <div
      className={`flex items-center gap-2 border-l-4 rounded px-3 py-2 mb-2 ${color}`}
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {iconMap[type]}
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
};

export default Alert; 