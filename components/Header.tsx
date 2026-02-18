
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        <div className="bg-yellow-400 p-2 rounded-lg rotate-12">
          <i className="fas fa-magic text-gray-900 text-xl"></i>
        </div>
        <h1 className="text-2xl font-black tracking-tighter text-white">
          BANANA<span className="text-yellow-400 italic">EDIT</span>
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-full text-xs font-semibold text-gray-300">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Gemini 2.5 Flash Image Ready</span>
        </div>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <i className="fab fa-github text-xl"></i>
        </a>
      </div>
    </header>
  );
};

export default Header;
