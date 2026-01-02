import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-mash-600 to-mash-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">MASH AI</h1>
              <p className="text-xs text-mash-200">Character Trust Layer</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#demo" className="text-mash-100 hover:text-white transition">Demo</a>
            <a href="#docs" className="text-mash-100 hover:text-white transition">Docs</a>
            <a href="#api" className="text-mash-100 hover:text-white transition">API</a>
            <button className="bg-white text-mash-700 px-4 py-2 rounded-lg font-medium hover:bg-mash-50 transition">
              Request Access
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
