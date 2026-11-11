import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, LogOut, Shield, User, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggleButton from './ThemeToggleButton';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from '../assets/img/Logo.png';
import logoProfile from '../assets/img/logoProfile.jpg';

const Navbar = ({ onOpenAuth, onOpenSecurity, onOpenProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken, logout } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Localized navigation links
  const navLinks = [
    { name: t('nav_home'), href: '#home' },
    { name: t('nav_about'), href: '#about' },
    { name: t('nav_skills'), href: '#skills' },
    { name: t('nav_education'), href: '#education' },
    { name: t('nav_work'), href: '#work' },
    { name: t('nav_experience'), href: '#experience' },
    { name: t('nav_contact'), href: '#contact' },
  ];

  const handleClick = (name) => {
    setActiveLink(name);
    setIsOpen(false);
  };

  /**
   * Scroll to a section by its ID smoothly.
   * @param {string} sectionId - The element ID to scroll to (without '#').
   */
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Handle navigation link clicks.
   * - If already on the home page, scroll to the section directly.
   * - If on another page (e.g. ProjectDetail), navigate home first,
   *   then scroll to the section after the home page renders.
   *
   * @param {Event} e - Click event
   * @param {string} name - Link name
   * @param {string} sectionId - Target section ID
   */
  const handleNavClick = (e, name, sectionId) => {
    e.preventDefault();
    handleClick(name);

    if (location.pathname === '/') {
      // Already on home page — scroll to the section
      scrollToSection(sectionId);
    } else {
      // Navigate to home page, then scroll after render
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  // Handle scrolling after navigation to the home page
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      // Wait for the home page sections to render before scrolling
      setTimeout(() => {
        scrollToSection(location.state.scrollTo);
        // Clear the state so the scroll doesn't repeat
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location.pathname, location.state]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get the user's avatar URL from the profile data
  const userAvatar = user?.avatar || user?.avatars?.[0] || null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0a0a1a]/90 backdrop-blur-md border-b border-gray-200 dark:border-purple-900/30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, t('nav_home'), 'home')}
              className="flex items-center group"
            >
              <img 
                src={Logo} 
                alt="Logo" 
                className="w-32 h-auto object-contain transition-all duration-300 transform group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" 
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.name, link.href.replace('#', ''))}
                className={`relative px-3.5 py-2 text-sm font-medium transition-all duration-300 ${
                  activeLink === link.name
                    ? 'text-yellow-400 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {link.name}
                {activeLink === link.name && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-yellow-400 rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* Theme Toggle + Language Switcher + Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Switcher */}
            <ThemeToggleButton />

            {accessToken ? (
              /* Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-purple-900/40"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500/50 hover:border-purple-400 transition-all flex items-center justify-center bg-purple-800/60">
                    <img
                      src={userAvatar || logoProfile}
                      alt={user?.name || 'User'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = logoProfile;
                      }}
                    />
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#15082b] border border-gray-200 dark:border-purple-500/30 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-purple-900/30 py-2 z-50 backdrop-blur-md">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-purple-500/20">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
                    </div>

                    <button
                      onClick={() => { setDropdownOpen(false); onOpenProfile(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-purple-900/40 transition bg-transparent border-none cursor-pointer text-left"
                    >
                      <User size={18} className="text-purple-400" />
                      {t('profile')}
                    </button>

                    <button
                      onClick={() => { setDropdownOpen(false); onOpenSecurity(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-purple-900/40 transition bg-transparent border-none cursor-pointer text-left"
                    >
                      <Shield size={18} className="text-purple-400" />
                      {t('security')}
                    </button>

                    {user?.role === 'admin' && (
                      <button
                        onClick={() => { setDropdownOpen(false); navigate('/admin/dashboard'); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-purple-900/40 transition bg-transparent border-none cursor-pointer text-left"
                      >
                        <LayoutDashboard size={18} className="text-purple-400" />
                        {t('dashboard')}
                      </button>
                    )}

                    <div className="my-1 border-t border-gray-200 dark:border-purple-500/20" />

                    <button
                      onClick={async () => { setDropdownOpen(false); await logout(); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-red-400 hover:bg-gray-100 dark:hover:bg-purple-900/40 transition bg-transparent border-none cursor-pointer text-left"
                    >
                      <LogOut size={18} className="text-purple-400" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-yellow-400 text-sm font-medium transition px-3 py-2 bg-transparent border-none cursor-pointer"
                >
                  <LogIn size={16} />
                  {t('login')}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-yellow-300 transition border-none cursor-pointer"
                >
                  <UserPlus size={16} />
                  {t('register')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher size="sm" />
            <ThemeToggleButton size={20} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-[#0a0a1a]/95 backdrop-blur-md border-t border-gray-200 dark:border-purple-900/30">
          <div className="px-6 py-3 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.name, link.href.replace('#', ''))}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeLink === link.name
                    ? 'text-yellow-400 bg-purple-900/40 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-purple-900/20'
                }`}
              >
                {link.name}
              </a>
            ))}
            <div className="border-t border-gray-200 dark:border-purple-900/30 pt-3 mt-3">
              {accessToken ? (
                <>
                  <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">{t('signed_in_as')} <span className="text-gray-900 dark:text-gray-300">{user?.name}</span></div>
                  <button onClick={() => { setIsOpen(false); onOpenProfile(); }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-purple-900/20 transition bg-transparent border-none cursor-pointer">
                    <User size={16} className="inline mr-2" />{t('edit_profile')}
                  </button>
                  <button onClick={() => { setIsOpen(false); onOpenSecurity(); }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-purple-900/20 transition bg-transparent border-none cursor-pointer">
                    <Shield size={16} className="inline mr-2" />{t('security_settings')}
                  </button>
                  {user?.role === 'admin' && (
                    <button onClick={() => { setIsOpen(false); navigate('/admin/dashboard'); }}
                      className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-purple-900/20 transition bg-transparent border-none cursor-pointer">
                      <LayoutDashboard size={16} className="inline mr-2" />{t('dashboard')}
                    </button>
                  )}
                  <button onClick={async () => { await logout(); setIsOpen(false); navigate('/'); }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-400 hover:bg-gray-100 dark:hover:bg-purple-900/20 transition">
                    <LogOut size={16} className="inline mr-2" />{t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setIsOpen(false); onOpenAuth('login'); }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-purple-900/20 transition bg-transparent border-none cursor-pointer">
                    <LogIn size={16} className="inline mr-2" />{t('login')}
                  </button>
                  <button onClick={() => { setIsOpen(false); onOpenAuth('register'); }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-yellow-400 hover:bg-gray-100 dark:hover:bg-purple-900/20 transition bg-transparent border-none cursor-pointer">
                    <UserPlus size={16} className="inline mr-2" />{t('register')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;