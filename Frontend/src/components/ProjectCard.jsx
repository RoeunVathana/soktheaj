import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiExternalLink, FiGithub, FiDownload, FiLock } from 'react-icons/fi';
import { FaLaravel, FaPhp, FaJs, FaReact, FaBootstrap, FaHtml5, FaCss3Alt, FaNodeJs, FaPython, FaJava } from 'react-icons/fa';
import { SiMysql, SiPostgresql, SiMongodb, SiFirebase, SiTailwindcss, SiJquery, SiTypescript, SiDocker, SiGit } from 'react-icons/si';
import api from '../services/api';
import { getImageUrl } from '../utils/helpers';
import SoftwareApps from './SoftwareApps';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

const techIconMap = {
  laravel: <FaLaravel className="text-red-500" />,
  php: <FaPhp className="text-indigo-500" />,
  mysql: <SiMysql className="text-blue-600" />,
  postgresql: <SiPostgresql className="text-blue-400" />,
  mongodb: <SiMongodb className="text-green-600" />,
  firebase: <SiFirebase className="text-yellow-500" />,
  javascript: <FaJs className="text-yellow-500" />,
  react: <FaReact className="text-cyan-500" />,
  'reactjs': <FaReact className="text-cyan-500" />,
  bootstrap: <FaBootstrap className="text-purple-600" />,
  html5: <FaHtml5 className="text-orange-600" />,
  html: <FaHtml5 className="text-orange-600" />,
  css3: <FaCss3Alt className="text-blue-500" />,
  css: <FaCss3Alt className="text-blue-500" />,
  nodejs: <FaNodeJs className="text-green-600" />,
  node: <FaNodeJs className="text-green-600" />,
  python: <FaPython className="text-blue-500" />,
  java: <FaJava className="text-orange-600" />,
  tailwind: <SiTailwindcss className="text-teal-400" />,
  tailwindcss: <SiTailwindcss className="text-teal-400" />,
  jquery: <SiJquery className="text-blue-600" />,
  typescript: <SiTypescript className="text-blue-600" />,
  docker: <SiDocker className="text-blue-500" />,
  git: <SiGit className="text-orange-600" />,
};

/**
 * Extract the list of technologies/tools for a project.
 *
 * Priority:
 *  1. `project.technologies` — array of SoftwareApplication objects from the API
 *     (each has { id, name: {en, kh}, icon, ... }).
 *  2. `project.tech_stack` — plain string array (legacy/fallback data).
 *  3. Text-based keyword detection from title/description (last resort).
 */
const extractTechStack = (project) => {
  if (Array.isArray(project.technologies) && project.technologies.length > 0) {
    return project.technologies;
  }

  if (project.tech_stack) return project.tech_stack;

  // Backend returns localized title/description directly (based on Accept-Language header)
  const text = ((project.title || '') + ' ' + (project.description || '')).toLowerCase();
  const detected = [];
  const keywords = [
    'laravel', 'php', 'mysql', 'postgresql', 'mongodb', 'firebase',
    'react', 'node', 'bootstrap', 'html', 'css', 'javascript',
    'tailwind', 'python', 'java', 'typescript', 'docker', 'jquery', 'git',
  ];
  keywords.forEach((kw) => {
    if (text.includes(kw)) detected.push(kw.charAt(0).toUpperCase() + kw.slice(1));
  });
  return detected.length ? detected.slice(0, 5) : ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'JavaScript'];
};

/**
 * Render a single technology badge.
 */
const TechBadge = ({ tech }) => {
  if (tech && typeof tech === 'object') {
    // Backend returns the localized name directly (based on Accept-Language header)
    const name = tech.name || 'Unknown';
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-purple-900/40 text-purple-200 border border-purple-500/30"
      >
        <span className="flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center">
          <SoftwareApps app={tech} className="w-3.5 h-3.5" />
        </span>
        {name}
      </span>
    );
  }

  const techStr = String(tech);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-purple-900/40 text-purple-200 border border-purple-500/30"
    >
      {techIconMap[techStr.toLowerCase()] && (
        <span className="flex-shrink-0">{techIconMap[techStr.toLowerCase()]}</span>
      )}
      {techStr}
    </span>
  );
};

/**
 * Reusable Project Card — used on the Home page (featured) and the All Projects page.
 *
 * Layout, views, downloads, and software/tech badges are consistent across the site.
 *
 * @param {Object} project - The project object to render
 * @param {Function} onUpdateStats - Optional callback fired after view/download increment
 */
const ProjectCard = ({ project, onUpdateStats }) => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const techStack = extractTechStack(project);

  /**
   * Handle the download button click:
   *  1. Check if the user is authenticated — only logged-in users can download.
   *  2. Open the Google Drive direct download link in a new tab.
   *  3. Fire the API call to increment the download count.
   *  4. Notify the parent via onUpdateStats with the new count.
   */
  const handleDownloadClick = async (e, project) => {
    e.preventDefault();
    e.stopPropagation();

    if (!accessToken || !user) {
      showToast(t('download_auth_message'), 'error', 4000);
      navigate('/register');
      return;
    }

    const match = project.file_path?.match(/[-\w]{25,}/);
    const downloadUrl = match
      ? `https://drive.usercontent.google.com/download?id=${match[0]}&export=download&confirm=t`
      : project.file_path;

    if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    }

    try {
      const res = await api.post(`/projects/${project.id}/increment-download`);
      if (res.data?.success) {
        onUpdateStats?.(project.id, { downloads_count: res.data.downloads });
      }
    } catch (err) {
      console.error('Failed to increment download count:', err);
    }
  };

  /**
   * Handle viewing a project:
   *  1. Navigate to the project detail page immediately.
   *  2. Fire the API call to increment the view count in the background.
   *  3. Notify the parent via onUpdateStats with the new count.
   */
  const handleViewProject = (e, project) => {
    e.stopPropagation();

    if (project.slug) {
      navigate(`/project/${project.slug}`);
    }

    api.post(`/projects/${project.id}/increment-view`)
      .then((res) => {
        if (res.data?.success) {
          onUpdateStats?.(project.id, { views_count: res.data.views });
        }
      })
      .catch((err) => console.error('Failed to increment view count:', err));
  };

  return (
    <div
      onClick={(e) => handleViewProject(e, project)}
      className="group bg-white dark:bg-purple-900/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 border border-purple-200 dark:border-purple-500/20 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-800/50 to-blue-900/50">
        {project.thumbnail ? (
          <img
            src={getImageUrl(project.thumbnail)}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl text-purple-300 font-bold">
              {project.title?.charAt(0) || 'P'}
            </span>
          </div>
        )}
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4 gap-2">
          {project.demo_link && (
            <a
              href={project.demo_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
              title={t('live_demo')}
            >
              <FiExternalLink size={16} />
            </a>
          )}
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center transition-colors"
              title={t('source_code')}
            >
              <FiGithub size={16} />
            </a>
          )}
          {project.file_path && (
            <button
              onClick={(e) => handleDownloadClick(e, project)}
              className={`w-9 h-9 rounded-full text-white flex items-center justify-center transition-colors cursor-pointer ${
                accessToken && user
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title={accessToken && user ? t('download') : t('login_required_download')}
              aria-label={`${t('download')} ${project.title}`}
            >
              {accessToken && user ? <FiDownload size={16} /> : <FiLock size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {techStack.map((tech) => (
            <TechBadge key={tech?.id || tech} tech={tech} />
          ))}
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {project.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-purple-200 dark:border-purple-700/30 text-xs text-gray-600 dark:text-gray-500">
          <span>👁️ {project.views_count || 0} {t('views')}</span>
          <span>⬇️ {project.downloads_count || 0} {t('downloads')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;