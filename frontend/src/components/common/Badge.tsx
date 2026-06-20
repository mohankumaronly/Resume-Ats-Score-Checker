import React from "react";
import { cn } from "../../utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "premium";
  size?: "sm" | "md";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
}) => {
  const variants = {
    default:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    success:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    error:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    info:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    premium:
      "bg-gradient-to-r from-amber-400 to-yellow-500 text-white dark:from-amber-500 dark:to-yellow-600",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        variant === "premium" && "shadow-sm",
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;