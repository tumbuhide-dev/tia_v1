import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <input
        ref={ref}
        className={clsx(
          "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2",
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-blue-200",
          className
        )}
        {...props}
      />
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  )
);
Input.displayName = "Input"; 