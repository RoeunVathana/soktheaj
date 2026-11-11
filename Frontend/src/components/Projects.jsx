import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import api from '../services/api';
import ProjectCard from './ProjectCard';
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

const Projects = ({ onOpenAuth }) => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Only fetch featured projects for the Home page
        const response = await api.get('/projects?featured=true');
        const projectsList = response.data?.data || response.data || [];
        // Safety net: filter to featured-only even if the API returns non-featured projects
        const featuredOnly = (Array.isArray(projectsList) ? projectsList : [])
          .filter((p) => p.is_featured !== false && p.is_featured !== 0);
        setProjects(featuredOnly);
      } catch (err) {
        console.warn('Backend API unavailable, using fallback data:', err.message);
        // Only show featured projects in the fallback data
        setProjects(fallbackProjects.filter((p) => p.is_featured));
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  /**
   * Update a single project's stats (views or downloads) in local state.
   * Called by ProjectCard after a successful increment API call.
   */
  const handleUpdateStats = (projectId, updates) => {
    setProjects((prev) => prev.map((p) =>
      p.id === projectId ? { ...p, ...updates } : p
    ));
  };

  if (loading) {
    return (
      <section id="work" className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-yellow-400 mb-12">
            {t('my_recent_work')}
          </h2>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with View All button */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400">
              {t('my_recent_work')}
            </h2>
            <p className="text-gray-400 mt-2 max-w-2xl">
              {t('projects_subtitle')}
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 mt-4 sm:mt-0 px-5 py-2.5 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 transition-colors group"
          >
            {t('view_all_projects')}
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdateStats={handleUpdateStats}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;