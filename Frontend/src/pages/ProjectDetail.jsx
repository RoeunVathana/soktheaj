import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiExternalLink, FiGithub, FiDownload, FiArrowLeft, FiEye, FiLock } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SoftwareApps from '../components/SoftwareApps';
import api, { getProjectBySlug } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * ProjectDetail - Displays full details of a single project.
 * Fetches the project by slug from the backend, which also increments
 * the view count server-side (ProjectService::showBySlug calls incrementViews).
 */
const ProjectDetail = ({ onOpenAuth, onOpenSecurity, onOpenProfile }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const { showToast } = useToast();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectBySlug(slug);
        setProject(data);
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setError(err.response?.status === 404 ? 'Project not found' : 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProject();
  }, [slug]);

  /**
   * Handle the download button click:
   *  1. Check if the user is authenticated — only logged-in users can download.
   *  2. Open the Google Drive direct download link in a new tab.
   *  3. Fire the API call to increment the download count.
   *  4. Update the local state with the new count returned by the backend.
   */
  const handleDownloadClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // ── Authentication guard: only logged-in users can download ──
    if (!accessToken || !user) {
      showToast('Please register an account to download projects.', 'error', 4000);
      // Direct to the Register page
      navigate('/register');
      return;
    }

    const projectObj = project || {};
    const match = projectObj.file_path?.match(/[-\w]{25,}/);
    const downloadUrl = match
      ? `https://drive.usercontent.google.com/download?id=${match[0]}&export=download&confirm=t`
      : projectObj.file_path;

    if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    }

    try {
      const res = await api.post(`/projects/${projectObj.id}/increment-download`);
      if (res.data?.success) {
        setProject((prev) => prev ? { ...prev, downloads_count: res.data.downloads } : prev);
      }
    } catch (err) {
      console.error('Failed to increment download count:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar onOpenAuth={onOpenAuth} onOpenSecurity={onOpenSecurity} onOpenProfile={onOpenProfile} />
        <section className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </section>
        <Footer />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar onOpenAuth={onOpenAuth} onOpenSecurity={onOpenSecurity} onOpenProfile={onOpenProfile} />
        <section className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex items-center justify-center py-20">
          <div className="max-w-md w-full text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error || 'Project not found'}</h2>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition"
            >
              <FiArrowLeft size={16} /> Back to Home
            </button>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // Backend returns localized title/description directly (based on Accept-Language header)
  const title = project.title || 'Project';
  const description = project.description || '';
  const techStack = Array.isArray(project.technologies) ? project.technologies : [];

  return (
    <>
      <Navbar onOpenAuth={onOpenAuth} onOpenSecurity={onOpenSecurity} onOpenProfile={onOpenProfile} />
      <section className="relative py-16 bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300 min-h-screen">
        {/* Back button */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition text-sm font-medium"
          >
            <FiArrowLeft size={16} /> Back to Projects
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-purple-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-200 dark:border-purple-500/20 shadow-sm">
            {/* Cover Image */}
            <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-purple-800/50 to-blue-900/50">
              {project.thumbnail ? (
                <img
                  src={getImageUrl(project.thumbnail)}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl text-purple-300 font-bold">
                    {title.charAt(0) || 'P'}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {title}
              </h1>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <FiEye size={16} className="text-purple-500" />
                  {project.views_count || 0} views
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FiDownload size={16} className="text-green-500" />
                  {project.downloads_count || 0} downloads
                </span>
                {project.is_featured && (
                  <span className="text-yellow-500 font-medium">★ Featured</span>
                )}
              </div>

              {/* Tech Stack Badges */}
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {techStack.map((tech) => {
                    // Backend returns the localized name directly
                    const name = tech.name || 'Unknown';
                    return (
                      <span
                        key={tech.id || name}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-purple-900/40 text-purple-200 border border-purple-500/30"
                      >
                        <span className="flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center">
                          <SoftwareApps app={tech} className="w-3.5 h-3.5" />
                        </span>
                        {name}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Description */}
              <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 dark:text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap">
                {description}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {project.demo_link && (
                  <a
                    href={project.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                  >
                    <FiExternalLink size={16} /> Live Demo
                  </a>
                )}
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition"
                  >
                    <FiGithub size={16} /> Source Code
                  </a>
                )}
                {project.file_path && (
                  <button
                    onClick={handleDownloadClick}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-lg transition cursor-pointer ${
                      accessToken && user
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {accessToken && user ? <FiDownload size={16} /> : <FiLock size={16} />}
                    {accessToken && user ? 'Download' : 'Login to Download'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProjectDetail;