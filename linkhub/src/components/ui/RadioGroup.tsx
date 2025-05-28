import React from "react";

type RadioGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, ...props }, ref) => (
    <div ref={ref} className="flex gap-4" {...props}>
      {children}
    </div>
  )
);
RadioGroup.displayName = "RadioGroup";

type RadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, ...props }, ref) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="radio"
        className="form-radio text-blue-600 focus:ring-blue-500"
        {...props}
      />
      <span>{label || props.value}</span>
    </label>
  )
);
Radio.displayName = "Radio"; 