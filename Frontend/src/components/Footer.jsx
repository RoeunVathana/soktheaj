import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { fetchSocials } from '../services/api';
import Avatar from '../assets/img/Logo.png';
import {
  FaTiktok,
  FaTelegramPlane,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaGithub,
  FaDiscord,
  FaWhatsapp,
  FaSnapchatGhost,
  FaPinterestP,
  FaRedditAlien,
  FaLink
} from 'react-icons/fa';
import { SiThreads, SiX } from 'react-icons/si';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [socialLinks, setSocialLinks] = useState([]);

  /**
   * Handle portfolio link clicks.
   * - If already on the home page, scroll to the section directly.
   * - If on another page (e.g. ProjectDetail), navigate home first,
   *   then scroll to the section after the home page renders.
   */
  const handlePortfolioClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  // Fetch social links from database
  useEffect(() => {
    const loadSocials = async () => {
      try {
        const data = await fetchSocials();
        if (data && data.length > 0) {
          setSocialLinks(data);
        }
      } catch (err) {
        console.warn('Could not load socials from API:', err.message);
      }
    };
    loadSocials();
  }, []);

  // Map icon names from database to React icons
  const getSocialIcon = (iconName) => {
    const name = iconName?.toLowerCase() || '';
    if (name.includes('tiktok')) return <FaTiktok size={18} />;
    if (name.includes('telegram')) return <FaTelegramPlane size={18} />;
    if (name.includes('facebook')) return <FaFacebookF size={18} />;
    if (name.includes('instagram')) return <FaInstagram size={18} />;
    if (name.includes('twitter') || name.includes('x')) return <SiX size={18} />;
    if (name.includes('linkedin')) return <FaLinkedinIn size={18} />;
    if (name.includes('youtube')) return <FaYoutube size={18} />;
    if (name.includes('github')) return <FaGithub size={18} />;
    if (name.includes('discord')) return <FaDiscord size={18} />;
    if (name.includes('whatsapp')) return <FaWhatsapp size={18} />;
    if (name.includes('snapchat')) return <FaSnapchatGhost size={18} />;
    if (name.includes('pinterest')) return <FaPinterestP size={18} />;
    if (name.includes('reddit')) return <FaRedditAlien size={18} />;
    if (name.includes('threads')) return <SiThreads size={18} />;
    return <FaLink size={18} />;
  };

  // Build social links for the footer
  const socialItems = socialLinks.length > 0
    ? socialLinks.filter((s) => s.is_visible !== false).map((s) => ({
        name: s.platform_name,
        url: s.url,
        icon: getSocialIcon(s.icon),
      }))
    : [
        { name: 'TikTok', url: 'https://tiktok.com', icon: <FaTiktok size={18} /> },
        { name: 'Telegram', url: 'https://telegram.org', icon: <FaTelegramPlane size={18} /> },
        { name: 'Instagram', url: 'https://instagram.com', icon: <FaInstagram size={18} /> },
      ];

  return (
    <footer className="bg-gray-50 dark:bg-[#0a0a1a] border-t border-gray-200 dark:border-purple-900/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1 - Profile & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={Avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/50"
              />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Let's Chat
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              I'm passionate about creating beautiful, functional components that make your projects shine. Let's work together to bring your vision to life.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 text-sm">
              Schedule a call
            </button>
          </div>

          {/* Column 2 - PORTFOLIO */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest text-gray-700 dark:text-gray-500 mb-4 uppercase">
              Portfolio
            </h4>
            <ul className="space-y-3">
              {['Overview', 'Projects', 'Pricing', 'About'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => handlePortfolioClick(e, item.toLowerCase())}
                    className="text-gray-600 dark:text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - SOCIAL */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest text-gray-500 mb-4 uppercase">
              Social
            </h4>
            <ul className="space-y-3">
              {socialItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm flex items-center gap-2"
                  >
                    <span className="text-yellow-400/70">{item.icon}</span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - CONTACT */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest text-gray-500 mb-4 uppercase">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Phone size={14} className="text-gray-500 dark:text-gray-500 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Mail size={14} className="text-gray-500 dark:text-gray-500 flex-shrink-0" />
                <span>hello@artiststudio.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <MapPin size={14} className="text-gray-500 dark:text-gray-500 flex-shrink-0" />
                <span>NYC • EST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-900/30 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 dark:text-gray-500 text-sm">
            &copy; 2026 Shadcnblocks.com. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#terms"
            className="text-gray-600 dark:text-gray-500 hover:text-yellow-400 transition-colors duration-300 text-sm"
            >
              Terms and Conditions
            </a>
            <a
              href="#privacy"
              className="text-gray-600 dark:text-gray-500 hover:text-yellow-400 transition-colors duration-300 text-sm"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;