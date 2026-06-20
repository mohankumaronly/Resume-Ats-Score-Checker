import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import { Menu, X, FileText, Sparkles, LayoutTemplate, LogIn } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import Button from "../common/Button";

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const PublicNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks: NavLink[] = [
    { label: "Features", href: "#features" },
    { label: "Templates", href: "#templates" },
    { label: "How It Works", href: "#how-it-works" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-lg dark:border-gray-800/80 dark:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
          >
            <div className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 p-1.5">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="hidden sm:inline">ResumeBuilder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/login")}
              icon={<LogIn className="h-4 w-4" />}
              className="hidden md:inline-flex"
            >
              Sign In
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden border-t border-gray-200 dark:border-gray-800 md:hidden"
      >
        <div className="space-y-1 px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/login");
            }}
            icon={<LogIn className="h-4 w-4" />}
          >
            Sign In
          </Button>
        </div>
      </motion.div>
    </nav>
  );
};

export default PublicNavbar;