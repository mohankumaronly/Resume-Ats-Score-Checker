import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
});

type OtpFormData = z.infer<typeof otpSchema>;

const VerifyOtpPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyOtp, sendOtp } = useAuth();
  const email = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Auto-focus OTP input
  const otpInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, []);

  // Timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const onSubmit = async (data: OtpFormData) => {
    if (!email) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(email, data.otp);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the context
      setValue("otp", "");
      if (otpInputRef.current) {
        otpInputRef.current.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;

    try {
      await sendOtp(email);
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      // Error is handled in the context
    }
  };

  if (!email) {
    navigate("/login");
    return null;
  }

  const { ref, ...registerProps } = register("otp");

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
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Verify Your Email
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-primary-600 dark:text-primary-400">
                  {email}
                </span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="text-center">
                <Input
                  ref={(e) => {
                    ref(e);
                    otpInputRef.current = e;
                  }}
                  label="Enter OTP"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  error={errors.otp?.message}
                  disabled={isLoading}
                  {...registerProps}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isLoading}
                icon={<CheckCircle className="h-4 w-4" />}
              >
                Verify OTP
              </Button>
            </form>

            {/* Resend section */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span>
                    Resend in{" "}
                    <span className="font-medium text-primary-600 dark:text-primary-400">
                      {timeLeft}s
                    </span>
                  </span>
                )}
              </p>
            </div>

            {/* Back to login */}
            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </Card>

        {/* Security notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            <Shield className="inline h-3 w-3 mr-1" />
            This is a secure, one-time verification code
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;