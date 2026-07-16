import React, { useState } from 'react';
import { FiMail, FiX, FiCheck, FiLoader } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/authApi';

interface AuthModalProps {
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await authApi.sendOtp(email);
            if (response.success) {
                setSuccess(response.message);
                setStep('otp');
                setError('');
            } else {
                setError(response.message || 'Failed to send OTP');
            }
        } catch (err: any) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await authApi.verifyOtp(email, otp);
            if (response.success && response.token) {
                setSuccess(response.message);
                login(email, response.token);
                onClose();
            } else {
                setError(response.message || 'Invalid OTP. Please try again.');
            }
        } catch (err: any) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await authApi.resendOtp(email);
            if (response.success) {
                setSuccess(response.message);
            } else {
                setError(response.message || 'Failed to resend OTP');
            }
        } catch (err: any) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStep('email');
        setEmail('');
        setOtp('');
        setError('');
        setSuccess('');
        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-slide-up">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FiX className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {step === 'email' ? 'Get Started' : 'Verify OTP'}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        {step === 'email'
                            ? 'Enter your email to receive a one-time password'
                            : `We sent a 6-digit code to ${email}`}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                        {success}
                    </div>
                )}

                {step === 'email' && (
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send OTP'
                            )}
                        </button>
                    </form>
                )}
                {step === 'otp' && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setOtp(value.slice(0, 6));
                                }}
                                placeholder="123456"
                                maxLength={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
                                disabled={isLoading}
                                autoFocus
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter the 6-digit code sent to your email</p>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <FiCheck className="w-5 h-5" />
                                    Verify & Login
                                </>
                            )}
                        </button>
                        <div className="mt-3 text-center">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isLoading}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </form>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default AuthModal;