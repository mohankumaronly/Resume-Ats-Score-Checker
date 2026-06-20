import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, rows = 4, className, disabled, ...props }, ref) => {
    const baseStyles =
      "w-full rounded-lg border bg-white px-4 py-2.5 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 resize-y";

    const stateStyles = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20"
      : "border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-gray-700 dark:focus:border-primary-400 dark:focus:ring-primary-400/20";

    const disabledStyles =
      "cursor-not-allowed bg-gray-100 opacity-60 dark:bg-gray-800";

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            baseStyles,
            stateStyles,
            disabled && disabledStyles,
            className
          )}
          disabled={disabled}
          {...props}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;