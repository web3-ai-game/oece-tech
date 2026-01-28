import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { WebsiteLogo } from '../Icons';
import { authService, User } from '../../services/authService';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-amber-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <WebsiteLogo className="w-8 h-8 text-amber-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Hotel Inistel
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-amber-700 transition-colors font-medium"
            >
              功能特色
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-amber-700 transition-colors font-medium"
            >
              定价方案
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-amber-700 transition-colors font-medium"
            >
              联系我们
            </a>
          </div>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">
                  {user.username}
                </span>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`hover:text-amber-700 transition-colors font-medium ${
                      location.pathname.startsWith('/admin') ? 'text-amber-700' : 'text-gray-700'
                    }`}
                  >
                    管理后台
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-amber-700 transition-colors font-medium"
                >
                  退出
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-amber-700 transition-colors font-medium"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors shadow-lg"
                >
                  注册
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-amber-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-200">
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-700 hover:text-amber-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                功能特色
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-amber-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                定价方案
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-amber-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                联系我们
              </a>
              <div className="pt-4 border-t border-amber-200">
                {user ? (
                  <>
                    <span className="block text-gray-700 mb-2">
                      {user.username}
                    </span>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block text-gray-700 hover:text-amber-700 transition-colors mb-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        管理后台
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block text-gray-700 hover:text-amber-700 transition-colors"
                    >
                      退出
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-gray-700 hover:text-amber-700 transition-colors mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      登录
                    </Link>
                    <Link
                      to="/register"
                      className="inline-block bg-amber-500 text-white px-4 py-2 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      注册
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
