import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiX } from 'react-icons/fi';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { useLanguage } from '../context/LanguageContext';

const fallbackProjects = [
  {
    id: 1,
    title: 'E-Pharmacy Platform',
    slug: 'e-pharmacy-platform',
    description: 'A comprehensive pharmacy management system with inventory tracking, prescription management, and online ordering.',
    thumbnail: 'https://picsum.photos/seed/pharmacy/800/600',
    demo_link: 'https://demo-pharmacy.example.com',
    github_link: 'https://github.com/portfolio/e-pharmacy',
    file_path: null,
    views_count: 1200,
    downloads_count: 80,
    is_featured: true,
    tech_stack: ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
  },
  {
    id: 2,
    title: 'ICT Professional Training Center (LMS)',
    slug: 'ict-training-lms',
    description: 'A learning management system for ICT professional training with course creation, quizzes, certificates, and progress tracking.',
    thumbnail: 'https://picsum.photos/seed/lms/800/600',
    demo_link: 'https://demo-lms.example.com',
    github_link: 'https://github.com/portfolio/ict-lms',
    file_path: null,
    views_count: 2300,
    downloads_count: 150,
    is_featured: true,
    tech_stack: ['React', 'Node.js', 'MongoDB', 'TailwindCSS', 'Firebase'],
  },
  {
    id: 3,
    title: 'Pharmacare Management System',
    slug: 'pharmacare-system',
    description: 'An end-to-end pharmaceutical management solution with barcode scanning, expiry tracking, sales reports, and supplier management.',
    thumbnail: 'https://picsum.photos/seed/pharmacare/800/600',
    demo_link: 'https://demo-pharmacare.example.com',
    github_link: 'https://github.com/portfolio/pharmacare',
    file_path: 'downloads/pharmacare-v1.0.zip',
    views_count: 980,
    downloads_count: 45,
    is_featured: true,
    tech_stack: ['PHP', 'Laravel', 'MySQL', 'HTML5', 'CSS3', 'JavaScript'],
  },
  {
    id: 4,
    title: 'Real-Time Chat Application',
    slug: 'chat-application',
    description: 'A real-time messaging app with private chats, group rooms, file sharing, and online status using WebSockets.',
    thumbnail: 'https://picsum.photos/seed/chatapp/800/600',
    demo_link: 'https://demo-chat.example.com',
    github_link: 'https://github.com/portfolio/chat-app',
    file_path: null,
    views_count: 3200,
    downloads_count: 200,
    is_featured: true,
    tech_stack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'TailwindCSS'],
  },
  {
    id: 5,
    title: 'Inventory Management Dashboard',
    slug: 'inventory-dashboard',
    description: 'A dashboard for managing inventory with real-time stock levels, automated alerts, and detailed analytics.',
    thumbnail: 'https://picsum.photos/seed/inventory/800/600',
    demo_link: 'https://demo-inventory.example.com',
    github_link: 'https://github.com/portfolio/inventory-dashboard',
    file_path: null,
    views_count: 750,
    downloads_count: 30,
    is_featured: false,
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Docker'],
  },
  {
    id: 6,
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    description: 'A modern portfolio website with project showcase, blog, contact form, and admin panel built with Laravel and React.',
    thumbnail: 'https://picsum.photos/seed/portfolio/800/600',
    demo_link: 'https://portfolio.example.com',
    github_link: 'https://github.com/portfolio/portfolio',
    file_path: null,
    views_count: 5000,
    downloads_count: 350,
    is_featured: true,
    tech_stack: ['Laravel', 'React', 'MySQL', 'TailwindCSS', 'JavaScript'],
  },
];

const AllProjects = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        // Fetch ALL projects — featured + non-featured
        const response = await api.get('/projects?all=true');
        const projectsList = response.data?.data || response.data || [];
        setProjects(Array.isArray(projectsList) ? projectsList : []);
      } catch (err) {
        console.warn('Backend API unavailable, using fallback data:', err.message);
        // Fallback includes BOTH featured and non-featured projects
        setProjects(fallbackProjects);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProjects();
  }, []);

  /**
   * Client-side search filter.
   * Backend returns localized title/description/tech names directly
   * based on the Accept-Language header, so we search those strings as-is.
   * Matches against:
   *  - Title (localized)
   *  - Description (localized)
   *  - Software / Tech Stack / Tools used (localized)
   */
  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return projects;

    return projects.filter((project) => {
      // Title (localized by backend)
      const titleStr = String(project.title || '').toLowerCase();
      const matchTitle = titleStr.includes(term);

      // Description (localized by backend)
      const descStr = String(project.description || '').toLowerCase();
      const matchDesc = descStr.includes(term);

      // Software / Tech Stack / Tools used (localized by backend)
      const techNames = [];
      if (Array.isArray(project.technologies)) {
        project.technologies.forEach((tech) => {
          techNames.push(String(tech.name || '').toLowerCase());
        });
      }
      if (Array.isArray(project.tech_stack)) {
        project.tech_stack.forEach((tech) => techNames.push(String(tech).toLowerCase()));
      }
      const matchTech = techNames.some((name) => name.includes(term));

      return matchTitle || matchDesc || matchTech;
    });
  }, [projects, searchTerm]);

  /**
   * Update a single project's stats (views or downloads) in local state.
   * Called by ProjectCard after a successful increment API call.
   */
  const handleUpdateStats = (projectId, updates) => {
    setProjects((prev) => prev.map((p) =>
      p.id === projectId ? { ...p, ...updates } : p
    ));
  };

  const clearSearch = () => setSearchTerm('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors mb-4"
          >
            <FiArrowLeft />
            {t('back_to_home')}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t('all_projects')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {t('browse_projects')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full bg-white dark:bg-[#12122a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-xl pl-12 pr-12 py-3.5 focus:border-amber-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Result count */}
        {!loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm
              ? t('found_projects', filteredProjects.length, searchTerm)
              : t('showing_all', projects.length)}
          </p>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Loading spinner */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProjects.length > 0 ? (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdateStats={handleUpdateStats}
              />
            ))}
          </div>
        ) : (
          /* No results state */
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/20 flex items-center justify-center">
              <FiSearch size={28} className="text-purple-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm
                ? t('no_projects_match')
                : t('no_projects_found')}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 transition-colors"
              >
                <FiX size={16} />
                {t('clear_search')}
              </button>
            )}
            {!searchTerm && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 mt-4 text-amber-600 dark:text-amber-400 hover:underline"
              >
                <FiArrowLeft />
                {t('back_to_home')}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;