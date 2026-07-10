// src/components/BlurredImprovements.tsx

import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface BlurredImprovementsProps {
    children: React.ReactNode;
}

const BlurredImprovements: React.FC<BlurredImprovementsProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <>
            <div className="relative">
                <div className="filter blur-sm select-none pointer-events-none opacity-60">
                    {children}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center max-w-sm mx-4">
                        <FiLock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900">Login to Unlock</h3>
                        <p className="text-sm text-gray-600 mt-1 max-w-xs">
                            Sign in to view detailed improvements, strengths, and personalized suggestions for your resume.
                        </p>
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </>
    );
};

export default BlurredImprovements;