import React from "react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "glass" | "outline";
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  variant = "default",
  onClick,
}) => {
  const variants = {
    default:
      "bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800",
    glass: "glass-effect border border-white/20 dark:border-gray-800/50",
    outline: "bg-transparent border-2 border-gray-200 dark:border-gray-800",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        "rounded-xl p-6 shadow-sm transition-all duration-200",
        variants[variant],
        hover && "hover:shadow-xl",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;