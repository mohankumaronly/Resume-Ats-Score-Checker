import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PublicNavbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;