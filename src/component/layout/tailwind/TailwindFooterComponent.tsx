import React from 'react';
import {LayoutComponentDetail} from "xingine";

interface TailwindFooterComponentProps {
  renderer?: LayoutComponentDetail;
  panelControl: any;
}

export const TailwindFooterComponent: React.FC<TailwindFooterComponentProps> = ({ 
  renderer, 
  panelControl 
}) => {
  const { darkMode } = panelControl;

  return (
    <div className={`h-16 px-6 flex items-center justify-between ${
      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
    }`}>
      {/* Left side - Copyright */}
      <div className="flex items-center space-x-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Xingine. All rights reserved.
        </p>
      </div>

      {/* Center - Links */}
      <div className="hidden md:flex items-center space-x-6">
        <a
          href="#"
          className={`text-sm hover:${
            darkMode ? 'text-white' : 'text-gray-900'
          } transition-colors`}
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className={`text-sm hover:${
            darkMode ? 'text-white' : 'text-gray-900'
          } transition-colors`}
        >
          Terms of Service
        </a>
        <a
          href="#"
          className={`text-sm hover:${
            darkMode ? 'text-white' : 'text-gray-900'
          } transition-colors`}
        >
          Support
        </a>
      </div>

      {/* Right side - Version */}
      <div className="flex items-center space-x-4">
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          v1.0.8
        </span>
      </div>
    </div>
  );
};