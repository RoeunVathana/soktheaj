import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/helpers';
import {
  LayoutDashboard, FolderKanban, Briefcase, GraduationCap, Handshake,
  Code2, Monitor, MessageSquare, Share2, Trophy, Users, LogOut, X, Home,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Back Home', icon: Home, path: '/' },
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Projects', icon: FolderKanban, path: '/admin/projects' },
  { name: 'Experiences', icon: Briefcase, path: '/admin/experiences' },
  { name: 'Education', icon: GraduationCap, path: '/admin/education' },
  { name: 'Partners', icon: Handshake, path: '/admin/partners' },
  { name: 'Skills', icon: Code2, path: '/admin/skills' },
  { name: 'Software Apps', icon: Monitor, path: '/admin/software-apps' },
  { name: 'Messages', icon: MessageSquare, path: '/admin/messages' },
  { name: 'Socials', icon: Share2, path: '/admin/socials' },
  { name: 'Achievements', icon: Trophy, path: '/admin/achievements' },
  { name: 'Users', icon: Users, path: '/admin/users' },
];

const Sidebar = ({ sidebarOpen, sidebarCollapsed, onClose, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profileData, logout } = useAuth();
  const [avatarError, setAvatarError] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Resolve the profile avatar from the auth context (user.avatar / user.avatars),
  // falling back to profileData when available. getImageUrl() normalizes full URLs
  // and relative Laravel storage paths (e.g. /storage/avatars/...) into absolute URLs.
  const profileName = user?.name || profileData?.name || 'sothea chhum';
  const rawProfileAvatars = user?.avatars?.length > 0
    ? user.avatars
    : (profileData?.avatars?.length > 0 ? profileData.avatars : []);
  const rawAvatar = user?.avatar || rawProfileAvatars[0] || profileData?.avatar || null;
  const profileAvatar = getImageUrl(rawAvatar);
  const profileInitial = profileName.charAt(0).toUpperCase();

  // Reset the image-fallback flag whenever the resolved avatar changes
  useEffect(() => {
    setAvatarError(false);
  }, [profileAvatar]);

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 z-40 h-screen bg-white dark:bg-[#0d1322] border-r border-gray-200 dark:border-gray-800 transform transition-all duration-200 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-${sidebarCollapsed ? '0' : '5'} py-5 border-b border-gray-200 dark:border-gray-800 ${sidebarCollapsed ? 'px-0' : 'px-5'}`}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                  <LayoutDashboard size={18} className="text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
                  Admin Panel
                </span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 mx-auto">
                <LayoutDashboard size={18} className="text-white" />
              </div>
            )}
            <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition text-gray-400">
              <X size={18} />
            </button>
          </div>

          {/* Profile */}
          {!sidebarCollapsed && (
            <div className="mx-4 mt-5 px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden">
                  {profileAvatar && !avatarError ? (
                    <img
                      src={profileAvatar}
                      alt={profileName}
                      onError={() => setAvatarError(true)}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    profileInitial
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{profileName}</p>
                  <p className="text-xs text-blue-400 font-medium">Administrator</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 mt-6 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); onClose(); }}
                title={sidebarCollapsed ? link.name : ''}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  sidebarCollapsed ? 'justify-center px-0' : ''
                } ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/5'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
                }`}
              >
                <link.icon size={18} className={`shrink-0 ${isActive(link.path) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                {!sidebarCollapsed && link.name}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="px-4 pb-6 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
            {/* Toggle Collapse Button (Desktop only) */}
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex w-full items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50 transition-all ${
                sidebarCollapsed ? 'justify-center px-0' : ''
              }`}
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={18} className="shrink-0" />
              ) : (
                <>
                  <PanelLeftClose size={18} className="shrink-0" />
                  <span>Collapse</span>
                </>
              )}
            </button>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-all ${
                sidebarCollapsed ? 'justify-center px-0' : ''
              }`}
              title="Logout"
            >
              <LogOut size={18} className="shrink-0" />
              {!sidebarCollapsed && 'Logout'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;