import React, { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-full touch-target";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-neon-green text-[#0b0b0b] hover:bg-neon-green-dark hover:scale-[1.02] active:scale-[0.98] shadow-sm font-bold",
      secondary:
        "bg-[#1f1f1f] text-foreground hover:bg-[#2a2a2a] border border-white/10 hover:border-white/20 active:scale-[0.98]",
      ghost:
        "bg-transparent text-foreground hover:bg-white/5 active:bg-white/10",
      outline:
        "bg-transparent border border-white/15 text-foreground hover:border-neon-green/80 hover:text-neon-green active:scale-[0.98]",
      danger:
        "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98]",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "text-xs px-3.5 py-1.5 min-h-[36px] md:min-h-[38px] gap-1.5",
      md: "text-sm px-5 py-2.5 min-h-[44px] gap-2",
      lg: "text-base px-7 py-3.5 min-h-[48px] md:min-h-[52px] gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
