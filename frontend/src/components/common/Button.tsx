import React from "react";
import { cn } from "../../utils/cn";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children?: React.ReactNode; // Made optional
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-950",
    ghost:
      "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const loadingSizes: Record<ButtonSize, string> = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  // If there's no children, adjust padding for icon-only buttons
  const isIconOnly = !children && icon;
  const iconOnlyStyles = isIconOnly ? "px-2.5" : "";

  return (
    <motion.button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        iconOnlyStyles,
        className
      )}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className={cn("animate-spin", loadingSizes[size])} />
          {children && <span>Loading...</span>}
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;