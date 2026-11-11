import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext(null);

// ─────────────────────────────────────────────
//  Translation Dictionary (i18n)
// ─────────────────────────────────────────────
export const translations = {
  en: {
    // Navbar
    nav_home: 'Home',
    nav_about: 'About',
    nav_skills: 'Skills',
    nav_education: 'Education',
    nav_work: 'Work',
    nav_experience: 'Experience',
    nav_contact: 'Contact',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    security: 'Security',
    dashboard: 'Dashboard',
    edit_profile: 'Edit Profile',
    security_settings: 'Security Settings',
    signed_in_as: 'Signed in as',
    hero_greeting: "Hi There, I'm",

    // Projects
    my_recent_work: 'My Recent Work',
    projects_subtitle: 'Showcasing my latest projects and technical achievements',
    view_all_projects: 'View All Projects',
    all_projects: 'All Projects',
    browse_projects: 'Browse every project — featured and more',
    back_to_home: 'Back to Home',
    search_placeholder: 'Search by title, description, or technology...',
    no_projects_found: 'No projects found.',
    no_projects_match: 'No projects found matching your search',
    clear_search: 'Clear Search',
    found_projects: (count, term) => `Found ${count} project${count === 1 ? '' : 's'} matching "${term}"`,
    showing_all: (count) => `Showing all ${count} project${count === 1 ? '' : 's'}`,

    // Project Card
    live_demo: 'Live Demo',
    source_code: 'Source Code',
    download: 'Download',
    login_required_download: 'Login required to download',
    download_auth_message: 'Please register an account to download projects.',
    views: 'views',
    downloads: 'downloads',

    // Partners
    partners_badge: 'Partners & Collaborations',
    partners_title: 'Trusted by Leading Organizations',
    partners_subtitle: 'Proud to collaborate with industry leaders and innovative companies worldwide.',
    no_partners: 'No partners available at the moment.',
    tools_badge: 'Tools & Technologies',
    software_title: 'Software I Use',
    software_subtitle: 'Powered by industry-standard tools and cutting-edge technologies.',

    // About / FAQ
    faq_badge: 'FAQ',
    faq_title: 'Frequently Asked Questions',
    faq_not_found: "Can't find what you are looking for?",
    faq_chat_invite: 'I would like to chat with you',
    faq_chat_telegram: 'Chat on Telegram',

    // Skills
    skills_badge: 'TOP SKILLS',
    skills_title: 'See my expertise',

    // Experience / Education
    experience_title: 'My Expertise',
    education_title: 'Education Background',

    // Achievements
    achievements_title: 'Achievements',
    achievements_subtitle: 'Milestones and recognitions earned throughout my career journey.',
    achievements_empty: 'No achievements to display yet.',

    // Auth pages
    welcome_back: 'Welcome Back',
    email_address: 'Email address',
    password: 'Password',
    forgot_password: 'Forgot password?',
    logging_in: 'Logging in...',
    dont_have_account: "Don't have an account?",
    create_account: 'Create Account',
    full_name: 'Full Name',
    confirm_password: 'Confirm Password',
    creating_account: 'Creating account...',
    already_have_account: 'Already have an account?',
    invalid_credentials: 'Invalid email or password',
    account_not_found_notice: 'No account found with that email. Please register to continue.',
  },
  kh: {
    // Navbar
    nav_home: 'ទំព័រដើម',
    nav_about: 'អំពីខ្ញុំ',
    nav_skills: 'ជំនាញ',
    nav_education: 'ការអប់រំ',
    nav_work: 'ការងារ',
    nav_experience: 'បទពិសោធន៍',
    nav_contact: 'ទំនាក់ទំនង',
    login: 'ចូលគណនី',
    register: 'ចុះឈ្មោះ',
    logout: 'ចាកចេញ',
    profile: 'ប្រវត្តិរូប',
    security: 'សុវត្ថិភាព',
    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    edit_profile: 'កែប្រវត្តិរូប',
    security_settings: 'ការកំណត់សុវត្ថិភាព',
    signed_in_as: 'បានចូលជា',
    hero_greeting: 'សួស្តី ខ្ញុំបាទឈ្មោះ',

    // Projects
    my_recent_work: 'ការងារថ្មីៗរបស់ខ្ញុំ',
    projects_subtitle: 'បង្ហាញពីគម្រោងថ្មីៗ និងសមិទ្ធិផលបច្ចេកទេសរបស់ខ្ញុំ',
    view_all_projects: 'មើលគម្រោងទាំងអស់',
    all_projects: 'គម្រោងទាំងអស់',
    browse_projects: 'រកមើលគម្រោងទាំងអស់ — ជម្រើស និងច្រើនទៀត',
    back_to_home: 'ត្រឡប់ទៅទំព័រដើម',
    search_placeholder: 'ស្វែងរកតាមចំណងជើង ការពិពណ៌នា ឬបច្ចេកវិទ្យា...',
    no_projects_found: 'មិនមានគម្រោងទេ។',
    no_projects_match: 'មិនមានគម្រោងដែលត្រូវនឹងការស្វែងរកទេ',
    clear_search: 'សម្អាតការស្វែងរក',
    found_projects: (count, term) => `រកឃើញ ${count} គម្រោងដែលត្រូវនឹង "${term}"`,
    showing_all: (count) => `បង្ហាញទាំងអស់ ${count} គម្រោង`,

    // Project Card
    live_demo: 'សាកល្បងបន្តផ្ទាល់',
    source_code: 'កូដប្រភព',
    download: 'ទាញយក',
    login_required_download: 'ត្រូវចូលគណនីដើម្បីទាញយក',
    download_auth_message: 'សូមចុះឈ្មោះគណនីដើម្បីទាញយកគម្រោង។',
    views: 'បានមើល',
    downloads: 'បានទាញយក',

    // Partners
    partners_badge: 'ដៃគូ និងកិច្ចសហការ',
    partners_title: 'ទទួលការជឿទុកចិត្តពីអង្គការឈានមុខ',
    partners_subtitle: 'មានមោទនភាពក្នុងការសហការជាមួយអ្នកដឹកនាំឧស្សាហកម្ម និងក្រុមហ៊ុនច្នៃប្រឌិតទូទាំងពិភពលោក។',
    no_partners: 'មិនទាន់មានដៃគូនៅពេលនេះទេ។',
    tools_badge: 'ឧបករណ៍ និងបច្ចេកវិទ្យា',
    software_title: 'កម្មវិធីដែលខ្ញុំប្រើ',
    software_subtitle: 'ដំណើរការដោយឧបករណ៍ស្តង់ដារឧស្សាហកម្ម និងបច្ចេកវិទ្យាទំនើប។',

    // About / FAQ
    faq_badge: 'សំណួរ',
    faq_title: 'សំណួរដែលគេសួរញឹកញាប់',
    faq_not_found: 'មិនអាចរកអ្វីដែលអ្នកកំពុងស្វែងរក?',
    faq_chat_invite: 'ខ្ញុំចង់ជជែកជាមួយអ្នក',
    faq_chat_telegram: 'ជជែកតាម Telegram',

    // Skills
    skills_badge: 'ជំនាញកំពូល',
    skills_title: 'មើលជំនាញរបស់ខ្ញុំ',

    // Experience / Education
    experience_title: 'ជំនាញរបស់ខ្ញុំ',
    education_title: 'ប្រវត្តិនៃការអប់រំ',

    // Achievements
    achievements_title: 'សមិទ្ធិផល',
    achievements_subtitle: 'ព្រឹត្តិការណ៍សំខាន់ៗ និងការទទួលស្គាល់ដែលទទួលបានពេញមួយដំណើរអាជីពរបស់ខ្ញុំ។',
    achievements_empty: 'មិនទាន់មានសមិទ្ធិផលដើម្បីបង្ហាញនៅឡើយទេ។',

    // Auth pages
    welcome_back: 'សូមស្វាគមន៍ត្រឡប់មកវិញ',
    email_address: 'អាសយដ្ឋានអ៊ីមែល',
    password: 'ពាក្យសម្ងាត់',
    forgot_password: 'ភ្លេចពាក្យសម្ងាត់?',
    logging_in: 'កំពុងចូល...',
    dont_have_account: 'មិនទាន់មានគណនី?',
    create_account: 'បង្កើតគណនី',
    full_name: 'ឈ្មោះពេញ',
    confirm_password: 'បញ្ជាក់ពាក្យសម្ងាត់',
    creating_account: 'កំពុងបង្កើតគណនី...',
    already_have_account: 'មានគណនីរួចហើយ?',
    invalid_credentials: 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ',
    account_not_found_notice: 'រកមិនឃើញគណនីដែលមានអ៊ីមែលនេះទេ។ សូមចុះឈ្មោះដើម្បីបន្ត។',
  },
};

export const defaultLang = 'en';

// ─────────────────────────────────────────────
//  getLocalized — Safely parse JSON localized fields
// ─────────────────────────────────────────────
// Handles:
//  - Plain strings → return as-is
//  - Objects ({ en: '...', kh: '...' }) → return the requested lang (fallback en)
//  - JSON strings ('{"en":"...","kh":"..."}') → parse and return the requested lang
//  - null/undefined → return ''
export const getLocalized = (field, lang = 'en') => {
  if (field === null || field === undefined) return '';
  if (typeof field === 'object') return field[lang] || field['en'] || '';

  if (typeof field === 'string') {
    // Trim and check if it looks like JSON
    const trimmed = field.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parsed[lang] || parsed['en'] || trimmed;
      } catch (e) {
        return field; // Invalid JSON — return as plain string
      }
    }
    return field; // Plain string
  }

  return String(field ?? '');
};

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage, fallback to 'en'
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const saved = localStorage.getItem('app_language');
      return saved === 'kh' || saved === 'en' ? saved : defaultLang;
    } catch (e) {
      return defaultLang;
    }
  });

  // Persist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('app_language', currentLang);
    } catch (e) {
      // localStorage unavailable — ignore
    }
  }, [currentLang]);

  const toggleLanguage = useCallback(() => {
    setCurrentLang((prev) => {
      const next = prev === 'en' ? 'kh' : 'en';
      // Persist to localStorage immediately (used by axios interceptor)
      try {
        localStorage.setItem('app_language', next);
      } catch (e) {
        // localStorage unavailable — ignore
      }
      // Reload the page so ALL data is re-fetched from the API
      // with the updated Accept-Language header.
      // setTimeout ensures state updates before reload triggers data refetch.
      setTimeout(() => window.location.reload(), 50);
      return next;
    });
  }, []);

  const setLanguage = useCallback((lang) => {
    if (lang === 'en' || lang === 'kh') {
      setCurrentLang(lang);
      // Persist to localStorage immediately
      try {
        localStorage.setItem('app_language', lang);
      } catch (e) {
        // localStorage unavailable — ignore
      }
      // Reload the page so ALL data is re-fetched from the API
      // with the updated Accept-Language header.
      setTimeout(() => window.location.reload(), 50);
    }
  }, []);

  // Translation lookup helper
  const t = useCallback(
    (key, ...args) => {
      const dict = translations[currentLang] || translations[defaultLang];
      const val = dict[key];
      if (typeof val === 'function') return val(...args);
      return val ?? key; // Fallback to the key itself if missing
    },
    [currentLang]
  );

  const value = {
    currentLang,
    setLanguage,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};

export default LanguageContext;