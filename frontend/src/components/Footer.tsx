// src/components/Footer.tsx

import React from 'react';
import { FiHeart, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 flex items-center gap-1">
            Made with <FiHeart className="w-4 h-4 text-red-500" /> by Resume Analyzer Team
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Twitter"
            >
              <FiTwitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-gray-400">
          © 2026 Resume Analyzer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;