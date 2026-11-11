import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import api from '../services/api';
import { getImageUrl } from '../utils/helpers';
import { useLanguage, getLocalized } from '../context/LanguageContext';

const Achievements = () => {
  const { t, currentLang, currentLanguage = currentLang } = useLanguage();
  const lang = currentLanguage || currentLang || 'en';
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await api.get('/achievements');
        const data = res.data?.data || res.data || [];
        setAchievements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Backend API unavailable:', err.message);
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const getText = (val) => {
    if (!val) return '';
    return getLocalized(val, lang);
  };

  if (loading) {
    return (
      <section id="achievements" className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4 flex items-center justify-center gap-3">
            <Trophy size={32} />
            {t('achievements_title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('achievements_subtitle')}
          </p>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t('achievements_empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement) => {
              const title = getText(achievement.title);
              const description = getText(achievement.description);
              const thumbnailUrl = getImageUrl(achievement.thumbnail);

              return (
                <div
                  key={achievement.id}
                  className="group bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 border border-purple-200 dark:border-purple-500/10 hover:border-purple-500/30 flex flex-col"
                >
                  {/* Large rectangular image at the top */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-purple-800/50 to-blue-900/50">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/600x400?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Trophy size={48} className="text-yellow-400/70" />
                      </div>
                    )}
                    {/* Gradient overlay for polish */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Text content below the image */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Achievements;
