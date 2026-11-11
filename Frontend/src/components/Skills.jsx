import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../utils/helpers';

const fallbackSkills = [
  { id: 1, name: { en: 'ReactJS', kh: 'ReactJS' }, icon: 'reactjs', proficiency: 90, category: 'frontend' },
  { id: 2, name: { en: 'Laravel', kh: 'Laravel' }, icon: 'laravel', proficiency: 85, category: 'backend' },
  { id: 3, name: { en: 'PHP', kh: 'PHP' }, icon: 'php', proficiency: 82, category: 'backend' },
  { id: 4, name: { en: 'NodeJS', kh: 'NodeJS' }, icon: 'nodejs', proficiency: 80, category: 'backend' },
  { id: 5, name: { en: 'MySQL', kh: 'MySQL' }, icon: 'mysql', proficiency: 78, category: 'database' },
  { id: 6, name: { en: 'Kotlin', kh: 'Kotlin' }, icon: 'kotlin', proficiency: 75, category: 'mobile' },
  { id: 7, name: { en: 'Python', kh: 'Python' }, icon: 'python', proficiency: 72, category: 'backend' },
  { id: 8, name: { en: 'JavaScript', kh: 'JavaScript' }, icon: 'javascript', proficiency: 88, category: 'frontend' },
  { id: 9, name: { en: 'Firebase', kh: 'Firebase' }, icon: 'firebase', proficiency: 76, category: 'backend' },
  { id: 10, name: { en: 'TailwindCSS', kh: 'TailwindCSS' }, icon: 'tailwindcss', proficiency: 85, category: 'frontend' },
  { id: 11, name: { en: 'MongoDB', kh: 'MongoDB' }, icon: 'mongodb', proficiency: 74, category: 'database' },
  { id: 12, name: { en: 'Bootstrap', kh: 'Bootstrap' }, icon: 'bootstrap', proficiency: 82, category: 'frontend' },
  { id: 13, name: { en: 'Java', kh: 'Java' }, icon: 'java', proficiency: 70, category: 'backend' },
  { id: 14, name: { en: 'AWS', kh: 'AWS' }, icon: 'aws', proficiency: 68, category: 'devops' },
  { id: 15, name: { en: 'HTML5', kh: 'HTML5' }, icon: 'html5', proficiency: 95, category: 'frontend' },
  { id: 16, name: { en: 'CSS3', kh: 'CSS3' }, icon: 'css3', proficiency: 92, category: 'frontend' },
  { id: 17, name: { en: 'C++', kh: 'C++' }, icon: 'c++', proficiency: 65, category: 'backend' },
  { id: 18, name: { en: 'PostgreSQL', kh: 'PostgreSQL' }, icon: 'postgresql', proficiency: 72, category: 'database' },
  { id: 19, name: { en: 'Android', kh: 'Android' }, icon: 'android', proficiency: 70, category: 'mobile' },
  { id: 20, name: { en: 'Sass', kh: 'Sass' }, icon: 'sass', proficiency: 78, category: 'frontend' },
  { id: 21, name: { en: 'Redux', kh: 'Redux' }, icon: 'redux', proficiency: 76, category: 'frontend' },
  { id: 22, name: { en: 'ExpressJS', kh: 'ExpressJS' }, icon: 'expressjs', proficiency: 80, category: 'backend' },
  { id: 23, name: { en: 'Heroku', kh: 'Heroku' }, icon: 'heroku', proficiency: 65, category: 'devops' },
  { id: 24, name: { en: 'ChakraUI', kh: 'ChakraUI' }, icon: 'chakraui', proficiency: 72, category: 'frontend' },
];

// Backend returns the localized skill name directly (based on Accept-Language header).
// The object branch only handles the static fallback data below.
const getSkillName = (name) => {
  if (!name) return '';
  if (typeof name === 'object' && name !== null) {
    return name.en || name.kh || '';
  }
  return name;
};

const getDeviconSlug = (str) => {
  if (!str) return '';
  const clean = str.toLowerCase().replace(/-icon|_icon|-logo|_logo/g, '').trim();
  const map = {
    'reactjs': 'react', 'react': 'react', 'nodejs': 'nodejs', 'node': 'nodejs',
    'javascript': 'javascript', 'js': 'javascript', 'typescript': 'typescript', 'ts': 'typescript',
    'aws': 'amazonwebservices', 'c++': 'cplusplus', 'csharp': 'csharp', 'c#': 'csharp',
    'expressjs': 'express', 'express': 'express', 'tailwind': 'tailwindcss', 'tailwindcss': 'tailwindcss',
    'postgres': 'postgresql', 'postgresql': 'postgresql', 'mysql': 'mysql', 'laravel': 'laravel',
    'php': 'php', 'python': 'python', 'kotlin': 'kotlin', 'firebase': 'firebase',
    'mongodb': 'mongodb', 'bootstrap': 'bootstrap', 'java': 'java', 'html': 'html5',
    'html5': 'html5', 'css': 'css3', 'css3': 'css3', 'android': 'android', 'sass': 'sass',
    'redux': 'redux', 'heroku': 'heroku', 'docker': 'docker', 'git': 'git',
    'github': 'github', 'vscode': 'vscode', 'chakraui': 'chakraui',
  };
  return map[clean] || clean;
};

const getDeviconUrl = (iconStr, skillName) => {
  const slug = getDeviconSlug(iconStr) || getDeviconSlug(skillName);
  if (!slug) return '';
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
};

const getInitialImgSrc = (icon, skillName) => {
  if (!icon) return getDeviconUrl(null, skillName);
  if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('data:image/')) {
    return icon;
  }
  if (icon.includes('/') || icon.endsWith('.svg') || icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.jpeg')) {
    return getImageUrl(icon);
  }
  return getDeviconUrl(icon, skillName);
};

const Skills = () => {
  const { t } = useLanguage();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/skills');
        const data = response.data?.data || response.data || [];
        const skillsList = Array.isArray(data) ? data : [];
        setSkills(skillsList.map((s) => ({
          id: s.id,
          name: s.name,
          icon: s.icon || s.name,
          proficiency: s.proficiency || Math.floor(Math.random() * 30) + 65,
          category: s.category || 'general',
        })));
      } catch (err) {
        console.warn('Backend API unavailable, using fallback data:', err.message);
        setSkills(fallbackSkills);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <section id="skills" className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 border border-purple-600/30 shadow-sm">
            {t('skills_badge')}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-center text-yellow-400 mb-12">
          {t('skills_title')}
        </h2>

        <div className="flex flex-wrap justify-center items-end gap-6">
          {skills.map((skill) => {
            const skillName = getSkillName(skill.name);
            const initialSrc = getInitialImgSrc(skill.icon, skillName);

            return (
              <div
                key={skill.id}
                className="flex flex-col items-center bg-white dark:bg-purple-900/40 backdrop-blur-sm rounded-[100px] shadow-lg shadow-purple-500/10 py-10 px-8 w-[120px] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/30 border border-purple-500/20"
              >
                <div className="w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-800/60 flex items-center justify-center mb-4 text-xl overflow-hidden relative">
                  <img
                    src={initialSrc}
                    alt={skillName}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      const currentSrc = e.target.src;
                      const deviconFallback = getDeviconUrl(skill.icon, skillName);
                      if (!currentSrc.includes('cdn.jsdelivr.net') && deviconFallback && currentSrc !== deviconFallback) {
                        e.target.src = deviconFallback;
                      } else {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent) {
                          const span = parent.querySelector('span');
                          if (span) {
                            span.style.display = 'flex';
                          }
                        }
                      }
                    }}
                  />
                  <span
                    className="text-purple-700 dark:text-purple-300 font-bold text-lg hidden"
                  >
                    {skillName?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>

                <span className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {skill.proficiency}%
                </span>

                <span className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium uppercase tracking-wide">
                  {skillName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;