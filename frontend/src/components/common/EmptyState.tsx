import React from "react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import { FileText, Plus } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-12 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-primary-100 p-4 dark:bg-primary-900/30">
        {icon || <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={<Plus className="h-4 w-4" />}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;