import React from "react";
import { Toaster as HotToaster } from "react-hot-toast";

const Toaster: React.FC = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--toast-bg, #fff)",
          color: "var(--toast-color, #111)",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "1px solid var(--toast-border, #e5e7eb)",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default Toaster;