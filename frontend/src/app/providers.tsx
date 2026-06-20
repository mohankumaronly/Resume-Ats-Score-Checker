import React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { router } from "./router";
import Toaster from "../components/common/Toast";

const Providers: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Providers;