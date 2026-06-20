import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import EditorLayout from "../components/layout/EditorLayout";
import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import DashboardPage from "../pages/app/DashboardPage";
import CreateResumePage from "../pages/app/CreateResumePage";
import ResumeEditorPage from "../pages/app/ResumeEditorPage";
import TemplatesPage from "../pages/app/TemplatesPage";
import ProtectedRoute from "../pages/auth/ProtectedRoute";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtpPage />,
  },
  // Protected routes
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      // Dashboard routes (with sidebar)
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
        ],
      },
      {
        path: "resumes/new",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <CreateResumePage />,
          },
        ],
      },
      {
        path: "templates",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <TemplatesPage />,
          },
        ],
      },
      // Editor routes (FULL PAGE - NO SIDEBAR)
      {
        path: "resumes/:resumeId/edit",
        element: <EditorLayout />,
        children: [
          {
            index: true,
            element: <ResumeEditorPage />,
          },
        ],
      },
    ],
  },
]);

export default router;