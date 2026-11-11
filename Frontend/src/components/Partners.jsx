import React, { useState, useEffect } from 'react';
import api, { fetchSoftwareApplications } from '../services/api';
import SoftwareApps from './SoftwareApps';
import { useLanguage } from '../context/LanguageContext';

const Partners = () => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState([]);
  const [softwareApps, setSoftwareApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partnersRes, apps] = await Promise.all([
          api.get('/partners/visible'),
          fetchSoftwareApplications(),
        ]);
        const partnersData = partnersRes.data?.data || partnersRes.data || [];
        setPartners(Array.isArray(partnersData) ? partnersData : []);
        setSoftwareApps(Array.isArray(apps) ? apps : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setPartners([]);
        setSoftwareApps([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a] overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 backdrop-blur-sm px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] mb-4">
            {t('partners_badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 max-w-2xl mx-auto leading-tight">
            {t('partners_title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            {t('partners_subtitle')}
          </p>
        </div>

        {partners.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">{t('no_partners')}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {partners.map((partner, index) => (
              <a
                key={partner.id || index}
                href={partner.website_url || '#'}
                target={partner.website_url ? '_blank' : '_self'}
                rel={partner.website_url ? 'noopener noreferrer' : ''}
                className="group relative flex flex-col items-center justify-center bg-white dark:bg-purple-900/50 backdrop-blur-sm rounded-2xl border border-purple-200 dark:border-purple-500/25 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/20 px-5 py-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/25 hover:border-purple-400/50"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-purple-800/60 border border-purple-500/20 flex items-center justify-center p-3 mb-4 transition-all duration-300 group-hover:border-purple-400/40 group-hover:shadow-sm group-hover:shadow-purple-500/30">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                      <span className="text-purple-700 text-lg font-bold">
                        {partner.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <span className="relative z-10 text-purple-700 dark:text-purple-200 text-xs sm:text-sm font-semibold text-center leading-snug transition-colors duration-300 group-hover:text-purple-900 dark:group-hover:text-white">
                  {partner.name}
                </span>

                <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-2xl border-t-2 border-r-2 border-transparent group-hover:border-purple-400/40 transition-all duration-300 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-2xl border-b-2 border-l-2 border-transparent group-hover:border-purple-400/40 transition-all duration-300 pointer-events-none" />
              </a>
            ))}
          </div>
        )}

        {/* Software Applications Section */}
        {softwareApps.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-10">
              <span className="inline-block border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 backdrop-blur-sm px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] mb-4">
                {t('tools_badge')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-yellow-400 max-w-2xl mx-auto leading-tight">
                {t('software_title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
                {t('software_subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {softwareApps.map((app, index) => (
                <a
                  key={app.id || index}
                  href={app.url || '#'}
                  target={app.url ? '_blank' : '_self'}
                  rel={app.url ? 'noopener noreferrer' : ''}
                  className="group relative flex flex-col items-center justify-center bg-white dark:bg-purple-900/40 backdrop-blur-sm rounded-xl border border-purple-200 dark:border-purple-500/20 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/15 px-4 py-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-400/40"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Icon */}
                  <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-purple-800/60 border border-purple-500/20 flex items-center justify-center p-2.5 mb-3 transition-all duration-300 group-hover:border-purple-400/40 group-hover:shadow-sm group-hover:shadow-purple-500/30">
                    <SoftwareApps app={app} />
                  </div>

                  {/* App Name — backend returns localized name directly (based on Accept-Language header) */}
                  <span className="relative z-10 text-purple-700 dark:text-purple-200 text-xs sm:text-sm font-semibold text-center leading-snug transition-colors duration-300 group-hover:text-purple-900 dark:group-hover:text-white">
                    {app.name || 'Unknown'}
                  </span>

                  {/* Type Badge */}
                  {app.type && (
                    <span className="relative z-10 mt-1.5 text-[10px] text-purple-500/70 dark:text-purple-400/70 uppercase tracking-wider">
                      {app.type}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Partners;