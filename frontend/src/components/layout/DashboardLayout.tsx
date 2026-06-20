import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import {
  LayoutDashboard,
  FileText,
  Plus,
  LayoutTemplate,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/dashboard" },
    { label: "My Resumes", icon: <FileText className="h-5 w-5" />, href: "/dashboard" },
    { label: "Create Resume", icon: <Plus className="h-5 w-5" />, href: "/resumes/new" },
    { label: "Templates", icon: <LayoutTemplate className="h-5 w-5" />, href: "/templates" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Header */}
      <header className="fixed top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80 lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <span>ResumeBuilder</span>
          </Link>

          <ThemeToggle />
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 transform border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-950 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6 dark:border-gray-800">
            <div className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 p-1.5">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">ResumeBuilder</span>
          </div>

          {/* User Info */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.email || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                )}
              >
                {item.icon}
                {item.label}
                {item.label === "Create Resume" && (
                  <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                    +
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <Button
              variant="ghost"
              fullWidth
              onClick={handleLogout}
              icon={<LogOut className="h-4 w-4" />}
              className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="min-h-screen pt-16 lg:pt-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;