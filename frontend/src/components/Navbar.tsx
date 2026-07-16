import React, { useState } from 'react';
import { FiAward, FiLogIn, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Navbar: React.FC = () => {
    const { isAuthenticated, email, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    const openAuthModal = () => {
        setShowAuthModal(true);
        setIsMenuOpen(false);
    };

    const closeAuthModal = () => {
        setShowAuthModal(false);
    };

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        {/* Logo - Scroll to top */}
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <FiAward className="w-6 h-6 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">
                                Resume<span className="text-blue-600">Analyzer</span>
                            </span>
                        </button>

                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection('how-it-works')}
                                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                            >
                                How It Works
                            </button>
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-700">
                                        {email}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        <FiLogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={openAuthModal}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    <FiLogIn className="w-4 h-4" />
                                    Get Started
                                </button>
                            )}
                        </div>

                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <FiX className="w-6 h-6 text-gray-700" />
                            ) : (
                                <FiMenu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>

                    <div
                        className={`
                            md:hidden overflow-hidden transition-all duration-300 ease-in-out
                            ${isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}
                        `}
                    >
                        <div className="flex flex-col space-y-3 pb-4">
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2 px-3 hover:bg-gray-50 rounded-lg text-left"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection('how-it-works')}
                                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2 px-3 hover:bg-gray-50 rounded-lg text-left"
                            >
                                How It Works
                            </button>
                            <hr className="border-gray-200" />
                            {isAuthenticated ? (
                                <>
                                    <div className="text-sm text-gray-700 py-2 px-3">
                                        Signed in as: {email}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg"
                                    >
                                        <FiLogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={openAuthModal}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    <FiLogIn className="w-4 h-4" />
                                    Get Started
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {showAuthModal && <AuthModal onClose={closeAuthModal} />}
        </>
    );
};

export default Navbar;