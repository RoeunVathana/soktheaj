import React, { useState, useEffect } from 'react';
import { Plus, Minus, Send } from 'lucide-react';
import { fetchSocials } from '../services/api';
import useProfileData from '../hooks/useProfileData';
import profiles from '../data/static';
import { useLanguage, getLocalized } from '../context/LanguageContext';

const About = () => {
  const { t, currentLang } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);
  const { profile: profileData, loading: profileLoading } = useProfileData();
  const fallbackProfile = profiles[0];
  const [socialLinks, setSocialLinks] = useState([]);

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

  const profile = profileData
    ? {
        name: getLocalized(profileData.name || fallbackProfile.name, currentLang),
        title: getLocalized(profileData.title || profileData.role || fallbackProfile.title, currentLang),
        avatars: Array.isArray(profileData.avatars) && profileData.avatars.length > 0
          ? profileData.avatars
          : fallbackProfile.avatars,
        initials: (profileData.name || fallbackProfile.name)
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
        contact: profileData.contact || fallbackProfile.contact,
        faqs: (fallbackProfile.faqs || []).map(faq => ({
          question: getLocalized(faq.question, currentLang),
          answer: getLocalized(faq.answer, currentLang)
        })),
      }
    : {
        ...fallbackProfile,
        name: getLocalized(fallbackProfile.name, currentLang),
        title: getLocalized(fallbackProfile.title, currentLang),
        faqs: (fallbackProfile.faqs || []).map(faq => ({
          question: getLocalized(faq.question, currentLang),
          answer: getLocalized(faq.answer, currentLang)
        }))
      };

  const avatars = profile.avatars;
  const faqs = profile.faqs;

  const telegramUrl = socialLinks.length > 0
    ? (() => {
        const telegramSocial = socialLinks.find(
          (s) => s.platform_name?.toLowerCase() === 'telegram' || s.icon?.toLowerCase() === 'telegram'
        );
        return telegramSocial?.url || profile.contact?.telegram || fallbackProfile.contact.telegram;
      })()
    : profile.contact?.telegram || fallbackProfile.contact.telegram;

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="about" className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-md mb-4">
              <div
                className="w-full aspect-[4/3] relative flex items-end justify-center border border-purple-500/20"
                style={
                  avatars.length > 1
                    ? {
                        backgroundImage: `url('${avatars[1]}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 20%',
                      }
                    : {
                        background: 'linear-gradient(135deg, rgba(88,28,135,0.5), rgba(30,58,138,0.5))',
                      }
                }
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 text-center pb-6">
                  {avatars.length <= 1 && (
                    <div className="w-16 h-16 rounded-full bg-purple-900/80 mx-auto mb-3 flex items-center justify-center border-2 border-purple-500/40">
                      <span className="text-2xl font-bold text-yellow-400">{profile.initials}</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-gray-200 mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    {profile.title}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-purple-900/40 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-sm border border-purple-500/20">
              <div className="flex-1 mr-3">
                <p className="text-xs text-gray-500">{t('faq_not_found')}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{t('faq_chat_invite')}</p>
              </div>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#229ED9] hover:bg-[#1d89bd] text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors whitespace-nowrap"
              >
                <Send size={14} />
                {t('faq_chat_telegram')}
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-3">
              <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 border border-purple-600/30 shadow-sm">
                {t('faq_badge')}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-yellow-400 mb-6">
              {t('faq_title')}
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    openIndex === index
                      ? 'bg-purple-100 dark:bg-purple-900/60 shadow-lg border border-purple-500/30'
                      : 'bg-white dark:bg-purple-900/40 backdrop-blur-sm shadow-sm border border-purple-500/20'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span
                      className={`text-sm font-semibold pr-4 ${
                        openIndex === index ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        openIndex === index
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-200 dark:bg-purple-800/60 text-purple-600 dark:text-purple-300'
                      }`}
                    >
                      {openIndex === index ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </button>
                  {openIndex === index && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-purple-700/30 pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;