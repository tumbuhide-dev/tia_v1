import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, variant = "primary", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "px-4 py-2 rounded font-medium transition focus:outline-none",
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300",
        loading && "opacity-60 cursor-not-allowed",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 mr-2 align-middle animate-spin border-2 border-t-transparent border-white rounded-full"></span>
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button"; 