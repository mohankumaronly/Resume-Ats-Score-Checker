import React from "react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "We couldn't load the data. Please try again.",
  onRetry,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl bg-red-50/50 dark:bg-red-950/20 p-8 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/30">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mb-6 text-gray-500 dark:text-gray-400">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} icon={<RefreshCw className="h-4 w-4" />}>
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;