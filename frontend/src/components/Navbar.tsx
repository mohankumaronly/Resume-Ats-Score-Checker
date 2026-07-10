// src/components/Navbar.tsx

import React, { useState } from 'react';
import { FiAward, FiUser, FiLogIn, FiMenu, FiX } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FiAward className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Resume<span className="text-blue-600">Analyzer</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Features
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              How It Works
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              <FiUser className="w-4 h-4" />
              Sign In
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <FiLogIn className="w-4 h-4" />
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Navigation */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="flex flex-col space-y-3 pb-4">
            <button 
              onClick={closeMenu}
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2 px-3 hover:bg-gray-50 rounded-lg"
            >
              Features
            </button>
            <button 
              onClick={closeMenu}
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2 px-3 hover:bg-gray-50 rounded-lg"
            >
              How It Works
            </button>
            <hr className="border-gray-200" />
            <button 
              onClick={closeMenu}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg"
            >
              <FiUser className="w-4 h-4" />
              Sign In
            </button>
            <button 
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <FiLogIn className="w-4 h-4" />
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;