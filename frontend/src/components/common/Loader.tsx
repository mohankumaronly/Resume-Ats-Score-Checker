import React from "react";
import { cn } from "../../utils/cn";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  className,
  fullScreen = false,
}) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const loader = (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary-600 dark:text-primary-400", sizes[size])} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;