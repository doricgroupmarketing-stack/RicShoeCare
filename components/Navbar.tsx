import React, { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();
  const { settings, loading } = useSettings();

  React.useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Helper to check active state
  const isActive = (path: string, query?: string) => {
    if (query) {
      return location.pathname === path && location.search.includes(query) 
        ? 'text-primary-600 font-bold' 
        : 'text-gray-600 hover:text-primary-600';
    }
    return location.pathname === path ? 'text-primary-600 font-bold' : 'text-gray-600 hover:text-primary-600';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-28">
          <div className="flex items-center">
            <Link to="/" className={`flex-shrink-0 flex items-center gap-2 fouc-hidden logo-container ${isReady ? 'fouc-ready' : ''}`}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.brand_name} className="h-24 w-auto object-contain" />
              ) : (
                <div className="bg-primary-600 p-1.5 rounded-lg text-white">
                  <Sparkles size={48} />
                </div>
              )}
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/product/prod-1" className={`flex flex-col items-center justify-center leading-tight transition-colors ${isActive('/product/prod-1')}`}>
              <span>Polish</span>
            </Link>
            <Link to="/product/prod-7" className={`flex flex-col items-center justify-center leading-tight transition-colors ${isActive('/product/prod-7')}`}>
              <span>Cream</span>
            </Link>
            <Link to="/product/prod-8" className={`flex flex-col items-center justify-center leading-tight transition-colors ${isActive('/product/prod-8')}`}>
              <span>Suede Cleaner</span>
            </Link>
            <Link to="/product/prod-9" className={`flex flex-col items-center justify-center leading-tight transition-colors ${isActive('/product/prod-9')}`}>
              <span>Leather Dye</span>
            </Link>

            <Link to="/calculator" className={`flex flex-col items-center justify-center leading-tight transition-colors ${isActive('/calculator')}`}>
              <span>Container Loading Calculator</span>
            </Link>

            
            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            <Link to="/ai-analysis" className="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center gap-2">
              <Sparkles size={18} /> Scan Shoe
            </Link>
          </div>

          <div className="flex items-center md:hidden">
             <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/product/prod-1" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md hover:bg-gray-50 ${isActive('/product/prod-1')}`}>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-medium">Polish</span>
              </div>
            </Link>
            <Link to="/product/prod-7" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md hover:bg-gray-50 ${isActive('/product/prod-7')}`}>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-medium">Cream</span>
              </div>
            </Link>
            <Link to="/product/prod-8" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md hover:bg-gray-50 ${isActive('/product/prod-8')}`}>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-medium">Suede Cleaner</span>
              </div>
            </Link>
            <Link to="/product/prod-9" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md hover:bg-gray-50 ${isActive('/product/prod-9')}`}>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-medium">Leather Dye</span>
              </div>
            </Link>
            <Link to="/calculator" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md hover:bg-gray-50 ${isActive('/calculator')}`}>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-medium">Container Loading Calculator</span>
              </div>
            </Link>

            <div className="pt-2">
              <Link to="/ai-analysis" onClick={() => setIsOpen(false)} className="w-full bg-primary-600 text-white px-5 py-3 rounded-lg font-medium block text-center flex items-center justify-center gap-2"><Sparkles size={18} /> Scan Shoe</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;