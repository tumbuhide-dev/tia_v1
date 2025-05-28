import React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        className="form-checkbox text-blue-600 focus:ring-blue-500"
        {...props}
      />
      {label}
    </label>
  )
);
Checkbox.displayName = "Checkbox"; 