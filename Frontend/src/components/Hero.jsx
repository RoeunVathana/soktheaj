import React, { useState, useEffect, useCallback } from 'react';
import Typewriter from 'typewriter-effect';
import { ChevronDown, ArrowRight, Send } from 'lucide-react';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';
import { FaDev, FaTelegramPlane, FaGlobe, FaYoutube, FaFacebook, FaDribbble, FaBehance, FaMedium, FaStackOverflow, FaTiktok, FaSnapchatGhost, FaPinterestP, FaRedditAlien, FaWhatsapp, FaDiscord } from 'react-icons/fa';
import { SiUpwork, SiThreads, SiX } from 'react-icons/si';
import { fetchSocials } from '../services/api';
import useProfileData from '../hooks/useProfileData';
import profiles from '../data/static';
import { Particles, initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useLanguage, getLocalized } from '../context/LanguageContext';

const iconMap = {
  FiGithub, FiLinkedin, FiTwitter, FiInstagram,
  FaDev, FaTelegramPlane, FaGlobe, FaYoutube, FaFacebook,
  FaDribbble, FaBehance, FaMedium, FaStackOverflow, FaTiktok,
  FaSnapchatGhost, FaPinterestP, FaRedditAlien, FaWhatsapp, FaDiscord,
  SiUpwork, SiThreads, SiX,
  github: FiGithub, linkedin: FiLinkedin, twitter: FiTwitter,
  instagram: FiInstagram, dev: FaDev, telegram: FaTelegramPlane,
  globe: FaGlobe, youtube: FaYoutube, facebook: FaFacebook,
  dribbble: FaDribbble, behance: FaBehance, medium: FaMedium,
  stackoverflow: FaStackOverflow, upwork: SiUpwork, threads: SiThreads,
  tiktok: FaTiktok, snapchat: FaSnapchatGhost, pinterest: FaPinterestP,
  reddit: FaRedditAlien, whatsapp: FaWhatsapp, discord: FaDiscord,
  'tiktok-icon': FaTiktok, 'snapchat-icon': FaSnapchatGhost,
  'pinterest-icon': FaPinterestP, 'reddit-icon': FaRedditAlien,
  'whatsapp-icon': FaWhatsapp, 'discord-icon': FaDiscord,
  'threads-icon': SiThreads, 'x-icon': SiX,
  'github-icon': FiGithub, 'linkedin-icon': FiLinkedin,
  'twitter-icon': FiTwitter, 'instagram-icon': FiInstagram,
  'facebook-icon': FaFacebook, 'youtube-icon': FaYoutube,
  'devto-icon': FaDev, 'stackoverflow-icon': FaStackOverflow,
  'telegram-icon': FaTelegramPlane, 'globe-icon': FaGlobe,
  'dribbble-icon': FaDribbble, 'behance-icon': FaBehance,
  'medium-icon': FaMedium, 'upwork-icon': SiUpwork,
};

const getIcon = (iconName) => {
  if (!iconName) return FiGithub;
  const lower = iconName.toLowerCase();
  return iconMap[lower] || iconMap[iconName] || FiGithub;
};

const Hero = () => {
  const { profile: profileData, loading: profileLoading } = useProfileData();
  const { t, currentLang } = useLanguage();
  const fallbackProfile = profiles[0];
  const [engineReady, setEngineReady] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [socialsLoading, setSocialsLoading] = useState(true);

  const getText = (val) => getLocalized(val, currentLang);

  useEffect(() => {
    const loadSocials = async () => {
      try {
        const data = await fetchSocials();
        if (data && data.length > 0) {
          setSocialLinks(data);
        }
      } catch (err) {
        console.warn('Could not load socials from API:', err.message);
      } finally {
        setSocialsLoading(false);
      }
    };
    loadSocials();
  }, []);

  const profile = profileData
    ? {
        name: getText(profileData.name || fallbackProfile.name),
        title: getText(profileData.title || profileData.role || fallbackProfile.title),
        headline: getText(profileData.headline || fallbackProfile.headline),
        description: getText(profileData.description || fallbackProfile.description),
        tagline: getText(profileData.tagline || fallbackProfile.tagline),
        bio: getText(profileData.bio || fallbackProfile.bio),
        hireMeDescription: getText(profileData.hireMeDescription || fallbackProfile.hireMeDescription),
        avatar: profileData.avatar || fallbackProfile.avatar,
        avatars: Array.isArray(profileData.avatars) && profileData.avatars.length > 0
          ? profileData.avatars
          : fallbackProfile.avatars,
        initials: getText(profileData.name || fallbackProfile.name)
          .split(' ').map((n) => n[0]).join('').toUpperCase(),
        typewriterStrings: fallbackProfile.typewriterStrings,
        socials: fallbackProfile.socials,
      }
    : {
        ...fallbackProfile,
        name: getText(fallbackProfile.name),
        title: getText(fallbackProfile.title),
        headline: getText(fallbackProfile.headline),
        description: getText(fallbackProfile.description),
        tagline: getText(fallbackProfile.tagline),
        bio: getText(fallbackProfile.bio),
        hireMeDescription: getText(fallbackProfile.hireMeDescription),
      };

  const avatarSrc = profile.avatars[0];
  const [showHireMe, setShowHireMe] = useState(false);

  const socials = socialLinks.length > 0
    ? socialLinks.map((s, idx) => ({
        icon: getIcon(s.icon || s.platform_name),
        href: s.url,
        label: getText(s.platform_name || s.label),
        platform: s.platform || s.platform_name,
        name: s.name,
      }))
    : profile.socials.map((s, idx) => ({
        icon: iconMap[s.icon] || FiGithub,
        href: s.href,
        label: getText(s.label),
        platform: s.platform,
        name: s.name,
      }));

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setEngineReady(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  const particlesOptions = {
    fpsLimit: 60,
    fullScreen: false,
    background: { color: 'transparent' },
    particles: {
      number: { value: 100, density: { enable: true } },
      color: { value: ['#ffffff', '#d8b4fe', '#c084fc'] },
      opacity: { value: { min: 0.15, max: 0.4 }, animation: { enable: true, speed: 0.3, sync: false } },
      size: { value: { min: 1, max: 3 } },
      links: { enable: true, distance: 150, color: '#a855f7', opacity: 0.2, width: 0.8 },
      move: { enable: true, speed: 0.6, direction: 'none', random: true, straight: false, outModes: { default: 'bounce' }, attract: { enable: false } },
    },
    interactivity: {
      events: { onHover: { enable: true, mode: 'grab' }, onClick: { enable: false } },
      modes: { grab: { distance: 180, links: { opacity: 0.5, color: '#c084fc' } }, repulse: { distance: 100 } },
    },
    detectRetina: true,
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
      {/* Particle Network - only visible in dark mode */}
      {engineReady && (
        <div className="absolute inset-0 z-0 hidden dark:block">
          <Particles id="hero-particles" options={particlesOptions} particlesLoaded={particlesLoaded} />
        </div>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side - Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-lg sm:text-xl text-gray-900 dark:text-gray-300 mb-2">{t('hero_greeting')}</p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              <span className="text-yellow-400">{profile.name}</span>
            </h1>

            <div className="text-xl sm:text-2xl lg:text-3xl text-purple-700 dark:text-purple-300 mb-4 min-h-[40px]">
              <Typewriter
                options={{
                  strings: profile.typewriterStrings,
                  autoStart: true,
                  loop: true,
                  delay: 75,
                  deleteSpeed: 50,
                }}
              />
            </div>

            <p className="text-base sm:text-lg text-gray-900 dark:text-gray-400 italic mb-4">
              &ldquo;{profile.headline || profile.tagline}&rdquo;
            </p>

            <p className="text-sm sm:text-base text-gray-900 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6">
              {profile.description}
            </p>

            {showHireMe && (
              <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-purple-300 dark:border-purple-500/30 rounded-xl p-4 sm:p-5 mb-6 max-w-xl mx-auto lg:mx-0 text-left transition-all duration-300">
                <p className="text-sm sm:text-base text-gray-900 dark:text-gray-200 leading-relaxed">
                  {profile.bio || profile.hireMeDescription}
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mb-8">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-300 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/50"
              >
                View My Work
                <ArrowRight size={18} />
              </a>
              <button
                onClick={() => setShowHireMe(!showHireMe)}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full border-2 border-purple-500 text-purple-600 dark:text-purple-300 hover:bg-purple-600 hover:text-white font-medium transition-all duration-300"
              >
                {showHireMe ? 'Hide Details' : 'Why Hire Me?'}
                <Send size={16} />
              </button>
            </div>

            <div className="flex justify-center lg:justify-start gap-3">
              {socials.map((social, idx) => (
                <a
                  key={`${social.platform || social.name}-${idx}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-purple-600 flex items-center justify-center text-gray-900 dark:text-gray-300 hover:text-white transition-all duration-300 border border-gray-300 dark:border-gray-700 hover:border-purple-500"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Side - Large Portrait */}
          <div className="flex-shrink-0 relative w-[320px] h-[420px] sm:w-[400px] sm:h-[520px] md:w-[500px] md:h-[620px] lg:w-[650px] lg:h-[750px] xl:w-[700px] xl:h-[800px] -mb-16 lg:-mb-24">
            {/* Purple glow - only in dark mode */}
            <div className="hidden dark:block absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] xl:w-[550px] xl:h-[550px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(88,28,135,0.15) 40%, transparent 70%)' }} />
            <div className="hidden dark:block absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 60%)' }} />

            <img
              src={avatarSrc}
              alt="User Avatar"
              className="absolute left-1/2 -translate-x-1/2 z-10"
              style={{
                height: '100%',
                width: 'auto',
                maxWidth: 'none',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 80px rgba(88,28,135,0.5)) drop-shadow(0 8px 32px rgba(0,0,0,0.4))',
                background: 'transparent',
                bottom: '0',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = profile.avatar;
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-[#0a0a1a] to-transparent z-10" />
    </section>
  );
};

export default Hero;