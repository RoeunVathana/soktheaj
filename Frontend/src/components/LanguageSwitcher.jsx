import React from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * LanguageSwitcher — A modern toggle button in the Navbar
 * to switch between English (🇬🇧 EN) and Khmer (🇰🇭 KH).
 *
 * The current language is persisted in localStorage via LanguageContext.
 */
const LanguageSwitcher = ({ size = 'md' }) => {
  const { currentLang, toggleLanguage } = useLanguage();

  const isKh = currentLang === 'kh';
  const isSmall = size === 'sm';

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 rounded-lg border font-medium transition-all duration-200 bg-transparent cursor-pointer ${
        isSmall ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'
      } ${
        isKh
          ? 'border-amber-400/50 text-amber-600 dark:text-amber-400 hover:bg-amber-400/10'
          : 'border-gray-300 dark:border-purple-500/30 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-purple-900/40'
      }`}
      title={isKh ? 'Switch to English' : 'ប្តូរទៅជាភាសាខ្មែរ'}
      aria-label={isKh ? 'Switch to English' : 'Switch to Khmer'}
    >
      {isKh ? (
        <>
          <span className="text-base leading-none">🇰🇭</span>
          <span className="font-semibold">KH</span>
        </>
      ) : (
        <>
          <span className="text-base leading-none">🇬🇧</span>
          <span className="font-semibold">EN</span>
        </>
      )}
    </button>
  );
};

export default LanguageSwitcher;