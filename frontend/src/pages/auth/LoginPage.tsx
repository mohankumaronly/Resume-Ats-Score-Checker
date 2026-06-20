import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";
import ThemeToggle from "../../components/common/ThemeToggle";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { sendOtp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await sendOtp(data.email);
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      // Error is handled in the context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50/30 dark:from-gray-950 dark:via-gray-950 dark:to-primary-950/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="relative overflow-hidden p-8 shadow-xl">
          {/* Decorative gradient */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-500/5 blur-3xl" />

          <div className="relative">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Sign in to continue building your resume
              </p>
            </div>

            {/* Theme Toggle */}
            <div className="absolute right-0 top-0">
              <ThemeToggle />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                disabled={isLoading}
                {...register("email")}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isLoading}
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
              >
                Continue with Email
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By continuing, you agree to our{" "}
                <a href="#" className="text-primary-600 hover:underline dark:text-primary-400">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary-600 hover:underline dark:text-primary-400">
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Back to landing */}
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </Card>

        {/* Features footer */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            Free to build
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            AI-powered
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            ATS-friendly
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;