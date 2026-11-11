import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggleButton from '../ThemeToggleButton';
import { messageApi } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';
import { Search, Bell, Menu, Home, User, LogOut, Settings, PanelLeftClose, PanelLeftOpen, CheckCircle, Mail } from 'lucide-react';

const Header = ({ onToggleSidebar, onToggleCollapse, sidebarCollapsed }) => {
  const navigate = useNavigate();
  const { user, accessToken, profileData, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [avatarError, setAvatarError] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!accessToken || !user) return;
    try {
      const data = await messageApi.getAll({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.warn('Failed to fetch messages for notification:', err);
      }
    }
  }, [accessToken, user]);

  useEffect(() => {
    if (!accessToken || !user) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 45000);
    return () => clearInterval(interval);
  }, [fetchMessages, accessToken, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const unreadMessages = messages.filter((m) => m.is_read === false || m.is_read === 0 || m.read === 'No' || !m.is_read);
  const unreadCount = unreadMessages.length;
  const recentMessages = messages.slice(0, 5);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await messageApi.markAsRead(id);
      fetchMessages();
    } catch (err) {
      console.warn('Failed to mark message as read:', err);
    }
  };

  // Resolve the profile avatar from the auth context (user.avatar / user.avatars),
  // falling back to profileData when available. getImageUrl() normalizes full URLs
  // and relative Laravel storage paths (e.g. /storage/avatars/...) into absolute URLs.
  const profileName = user?.name || profileData?.name || 'sothea chhum';
  const profileEmail = user?.email || profileData?.email || 'admin@example.com';
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
    <header className="sticky top-0 z-20 h-16 bg-white/90 dark:bg-[#0d1322]/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition text-gray-500 dark:text-gray-400"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition text-gray-500 dark:text-gray-400"
          >
            {sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
        <div className="flex items-center flex-1 max-w-md mx-4 lg:mx-0 lg:ml-4">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 dark:bg-[#131b2e] border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <ThemeToggleButton />

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setDropdownOpen(false);
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition"
              title="Notifications"
            >
              <Bell size={18} className="text-gray-500 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#0d1322]">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0d111c] border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/50 py-2 z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-500" />
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Incoming Messages</h4>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-500 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                  {recentMessages.length > 0 ? (
                    recentMessages.map((msg) => {
                      const isUnread = !msg.is_read || msg.is_read === 0 || msg.read === 'No';
                      return (
                        <div
                          key={msg.id}
                          onClick={() => {
                            setNotificationOpen(false);
                            navigate('/admin/messages');
                          }}
                          className={`p-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition ${
                            isUnread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
                              {msg.sender_name || 'Anonymous'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate mb-1">
                            {msg.subject || 'No Subject'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {msg.message}
                          </p>
                          {isUnread && (
                            <div className="mt-2 flex items-center justify-end">
                              <button
                                onClick={(e) => handleMarkAsRead(msg.id, e)}
                                className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={12} /> Mark as Read
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No incoming messages yet.
                    </div>
                  )}
                </div>

                <div className="px-4 py-2.5 border-t border-gray-200 dark:border-gray-800 text-center">
                  <button
                    onClick={() => {
                      setNotificationOpen(false);
                      navigate('/admin/messages');
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All Messages
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-lg pr-2 py-1.5 transition"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
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
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{profileName}</p>
                <p className="text-xs text-gray-500 leading-tight">{profileEmail}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0d111c] border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/50 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{profileName}</p>
                  <p className="text-xs text-gray-500">{profileEmail}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/40 transition"
                >
                  <Home size={16} />
                  Back to Homepage
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/admin/dashboard'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/40 transition"
                >
                  <Settings size={16} />
                  Dashboard Settings
                </button>
                <div className="border-t border-gray-200 dark:border-gray-800 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;