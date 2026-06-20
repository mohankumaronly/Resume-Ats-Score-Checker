import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        className
      )}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 180 : 0,
          scale: 1,
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        {theme === "dark" ? (
          <Moon className="h-5 w-5 text-gray-100" />
        ) : (
          <Sun className="h-5 w-5 text-gray-700" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;