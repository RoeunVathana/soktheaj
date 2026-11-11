import React, { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, MapPin } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const fallbackExperiences = [
  {
    id: 1,
    job_title: 'Full Stack Web Developer',
    company_name: 'Freelance / Local Clients',
    location: 'Phnom Penh, Cambodia',
    description: 'Developed custom web applications and websites for various clients using Laravel, React, and Tailwind CSS. Delivered high-quality solutions meeting client requirements and deadlines.',
    start_date: '2022-01',
    end_date: null,
    is_current: true,
  },
  {
    id: 2,
    job_title: 'UI/UX Designer',
    company_name: 'Digital Creative Studio',
    location: 'Phnom Penh, Cambodia',
    description: 'Designed user interfaces and experiences for web and mobile applications. Created wireframes, prototypes, and conducted user testing to improve product usability.',
    start_date: '2020-06',
    end_date: '2021-12',
    is_current: false,
  },
  {
    id: 3,
    job_title: 'Graphic Designer',
    company_name: 'Media Agency Co.',
    location: 'Phnom Penh, Cambodia',
    description: 'Created visual designs for branding, marketing materials, and digital content. Collaborated with the marketing team to produce engaging visual assets.',
    start_date: '2018-09',
    end_date: '2020-05',
    is_current: false,
  },
  {
    id: 4,
    job_title: 'Junior Web Developer',
    company_name: 'Startup Hub',
    location: 'Phnom Penh, Cambodia',
    description: 'Built and maintained front-end features using Vue.js and Tailwind CSS. Collaborated with design team to implement responsive UI components.',
    start_date: '2016-01',
    end_date: '2018-08',
    is_current: false,
  },
];

const fallbackEducation = [
  {
    id: 1,
    degree: 'Master of Science in Information Technology',
    institution: 'Prince of Songkhla University',
    field_of_study: 'Information Technology',
    location: 'Thailand',
    description: 'Focused on advanced software engineering, data analytics, and IT project management. Completed thesis on web application performance optimization.',
    start_date: '2020',
    end_date: '2022',
  },
  {
    id: 2,
    degree: 'Bachelor of Science in Mathematics',
    institution: 'Royal University of Phnom Penh',
    field_of_study: 'Mathematics',
    location: 'Phnom Penh, Cambodia',
    description: 'Studied pure and applied mathematics with a focus on statistical analysis and computational mathematics.',
    start_date: '2016',
    end_date: '2020',
  },
  {
    id: 3,
    degree: 'High School Diploma',
    institution: 'Sisowath High School',
    field_of_study: 'Science',
    location: 'Phnom Penh, Cambodia',
    description: 'Graduated with honors in the science track, with strong foundation in mathematics and physics.',
    start_date: '2013',
    end_date: '2016',
  },
];

const formatYearRange = (start, end, isCurrent) => {
  const startYear = start ? start.substring(0, 4) : '';
  if (isCurrent) return `${startYear} - Present`;
  const endYear = end ? end.substring(0, 4) : '';
  return `${startYear} - ${endYear}`;
};

const TimelineCard = ({ item, type }) => {
  const isExperience = type === 'experience';
  const title = isExperience ? item.job_title : item.degree;
  const subtitle = isExperience ? item.company_name : item.institution;
  // Backend returns localized fields directly (based on Accept-Language header)
  const description = item.description || '';
  const startDate = item.start_date;
  const endDate = item.end_date;
  const isCurrent = item.is_current;
  const yearRange = formatYearRange(startDate, endDate, isCurrent);

  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      <div className="absolute left-[11px] top-3 bottom-0 w-0.5 bg-purple-500/30 last:hidden" />
      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-purple-600 border-4 border-purple-200 dark:border-purple-900/40 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
      <div className="bg-white dark:bg-purple-900/40 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 border border-purple-200 dark:border-purple-500/20">
        <span className="inline-block bg-purple-600 text-white text-xs font-semibold rounded-full px-4 py-1 mb-3">
          {yearRange}
        </span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-purple-700 dark:text-purple-300 font-medium mb-2">
          {isExperience ? <Briefcase size={14} /> : <GraduationCap size={14} />}
          <span>{subtitle}</span>
        </div>
        {item.location && (
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-500 mb-2">
            <MapPin size={12} />
            <span>{item.location}</span>
          </div>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const ExperienceEducation = () => {
  const { t } = useLanguage();
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, eduRes] = await Promise.all([
          api.get('/experiences'),
          api.get('/education'),
        ]);
        const expData = expRes.data?.data || expRes.data || [];
        const eduData = eduRes.data?.data || eduRes.data || [];
        setExperiences(Array.isArray(expData) ? expData : []);
        setEducation(Array.isArray(eduData) ? eduData : []);
      } catch (err) {
        console.warn('Backend API unavailable, using fallback data:', err.message);
        setExperiences(fallbackExperiences);
        setEducation(fallbackEducation);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
    <section id="experience" className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-8 flex items-center gap-2">
              <Briefcase size={24} />
              {t('experience_title')}
            </h2>
            <div className="space-y-0">
              {experiences.map((exp) => (
                <TimelineCard key={exp.id} item={exp} type="experience" />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-8 flex items-center gap-2">
              <GraduationCap size={24} />
              {t('education_title')}
            </h2>
            <div className="space-y-0">
              {education.map((edu) => (
                <TimelineCard key={edu.id} item={edu} type="education" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceEducation;