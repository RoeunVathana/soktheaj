import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  Folder, Mail, Cpu, Users,
  Eye, MousePointerClick, TrendingUp,
  ArrowUpRight, ArrowDownRight, CheckCircle, MessageSquare,
  Plus, Settings, ExternalLink, ChevronRight, Briefcase
} from 'lucide-react';
import { projectApi, messageApi, skillApi, getAuthToken, dashboardApi } from '../../services/api';
import { userManagementApi } from '../../services/adminApi';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#0b0f19] border border-gray-200 dark:border-gray-700/50 rounded-lg p-3 shadow-xl">
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
const DashboardOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyActivity, setMonthlyActivity] = useState([]);
  const [monthlyLoading, setMonthlyLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Explicitly attach the Bearer token to the user-count request so the
        // dashboard counter syncs with /admin/users even if the request runs
        // before the interceptor fully initializes.
        const authHeaders = getAuthToken()
          ? { headers: { Authorization: `Bearer ${getAuthToken()}` } }
          : {};
        const [projRes, msgRes, skillRes, userRes] = await Promise.all([
          projectApi.getAll().catch(() => []),
          messageApi.getAll().catch(() => []),
          skillApi.getAll().catch(() => []),
          userManagementApi.getAll(authHeaders).catch(() => []),
        ]);

        setProjects(Array.isArray(projRes) ? projRes : (projRes?.data || projRes?.projects || []));
        setMessages(Array.isArray(msgRes) ? msgRes : (msgRes?.data || msgRes?.messages || []));
        setSkills(Array.isArray(skillRes) ? skillRes : (skillRes?.data || skillRes?.skills || []));
        setUsers(Array.isArray(userRes) ? userRes : (userRes?.data || userRes?.users || []));
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ── Real-time Monthly Activity (Visitors / Messages / Downloads) ──
  // Fetches directly from GET /api/v1/admin/monthly-activity and polls every
  // 30 seconds so incoming messages/downloads update the bar heights live.
  const fetchMonthlyActivity = useCallback(async () => {
    try {
      const data = await dashboardApi.getMonthlyActivity();
      setMonthlyActivity(Array.isArray(data) ? data : []);
    } catch (err) {
      // 401 / session-expiry is handled globally (redirect to login) — keep the
      // existing chart data on transient polling failures instead of flashing errors.
      if (err?.response?.status !== 401 && !err?.isSessionExpired) {
        console.error('Failed to load monthly activity', err);
      }
    } finally {
      setMonthlyLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthlyActivity();
    const intervalId = setInterval(fetchMonthlyActivity, 30000);
    return () => clearInterval(intervalId);
  }, [fetchMonthlyActivity]);
  const totalProjects = projects.length;
  const unreadMessages = messages.filter(m => !m.is_read || m.is_read === 0 || m.status === 'unread').length;
  const totalSkills = skills.length;
  const registeredUsers = users.length;

  const statCards = [
    { title: 'Total Projects', value: loading ? '...' : totalProjects.toLocaleString(), change: '+5.2%', up: true, icon: Folder, color: 'blue', link: '/admin/projects' },
    { title: 'Unread Messages', value: loading ? '...' : unreadMessages.toLocaleString(), change: unreadMessages > 0 ? `${unreadMessages} new` : 'All read', up: unreadMessages > 0, icon: Mail, color: 'orange', link: '/admin/messages' },
    { title: 'Total Skills', value: loading ? '...' : totalSkills.toLocaleString(), change: '+12.0%', up: true, icon: Cpu, color: 'green', link: '/admin/skills' },
    { title: 'Registered Users', value: loading ? '...' : registeredUsers.toLocaleString(), change: '+8.5%', up: true, icon: Users, color: 'purple', link: '/admin/users' },
  ];

  // Monthly Visitors, Messages & Downloads Activity — now sourced LIVE from
  // GET /api/v1/admin/monthly-activity (polled every 30s above). No static mock data.
  // Projects by Category distribution
  const categoryCounts = {};
  projects.forEach(p => {
    const cat = p.category || p.type || 'Web Development';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const projectsByCategory = Object.keys(categoryCounts).length > 0
    ? Object.keys(categoryCounts).map((cat, idx) => ({
        name: cat,
        value: categoryCounts[cat],
        color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'][idx % 6],
      }))
    : [
        { name: 'Web App', value: 4, color: '#3b82f6' },
        { name: 'Mobile App', value: 3, color: '#10b981' },
        { name: 'API / Backend', value: 2, color: '#f59e0b' },
        { name: 'UI / UX Design', value: 1, color: '#8b5cf6' },
      ];

  const recentMessages = messages.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {user?.name || 'Admin'}! Here is your portfolio activity summary.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.link)}
            className="bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-gray-800/60 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-700/50 transition group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg bg-${card.color}-500/10`}>
                <card.icon size={20} className={`text-${card.color}-400`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {card.up ? <ArrowUpRight size={14} className="text-green-400" /> : <ArrowDownRight size={14} className="text-red-400" />}
              <span className={`text-xs font-medium ${card.up ? 'text-green-400' : 'text-red-400'}`}>{card.change}</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-gray-800/60 rounded-xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Visitors & Messages Activity</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Monthly traffic and contact message trends</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Visitors</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Messages</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Downloads</span>
            </div>
          </div>
          {monthlyActivity.length === 0 ? (
            <div className="flex items-center justify-center" style={{ height: 320 }}>
              {monthlyLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">No activity recorded yet this year.</p>
              )}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyActivity} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-30" />
                <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }} />
                <Bar dataKey="visitors" name="Visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="messages" name="Messages" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="downloads" name="Downloads" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-gray-800/60 rounded-xl p-4 lg:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Quick Actions</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-6">Frequently used portfolio shortcuts</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/projects')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition group"
              >
                <span className="flex items-center gap-2.5">
                  <Plus size={16} /> Add New Project
                </span>
                <ChevronRight size={16} className="transform group-hover:translate-x-1 transition" />
              </button>
              <button
                onClick={() => navigate('/admin/messages')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 transition group"
              >
                <span className="flex items-center gap-2.5">
                  <Mail size={16} /> Unread Messages ({unreadMessages})
                </span>
                <ChevronRight size={16} className="transform group-hover:translate-x-1 transition" />
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition group"
              >
                <span className="flex items-center gap-2.5">
                  <Users size={16} /> Update Profile
                </span>
                <ChevronRight size={16} className="transform group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => window.open('/', '_blank')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/50 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              <ExternalLink size={15} /> View Live Portfolio
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-gray-800/60 rounded-xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Projects by Category</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Distribution across portfolio</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={projectsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {projectsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {projectsByCategory.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                <span className="truncate">{cat.name} ({cat.value})</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-gray-800/60 rounded-xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Contact Messages</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Latest inquiries received</p>
            </div>
            <button
              onClick={() => navigate('/admin/messages')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              View All ({messages.length})
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Name</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Subject</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Date</th>
                  <th className="text-right py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No contact messages found.
                    </td>
                  </tr>
                ) : (
                  recentMessages.map((msg, index) => (
                    <tr key={msg.id || index} className="border-b border-gray-200 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-3 px-2 text-gray-900 dark:text-gray-200 font-medium flex items-center gap-2">
                        {!msg.is_read && <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" title="Unread"></span>}
                        <span className="truncate">{msg.sender_name || msg.name || 'Anonymous'}</span>
                      </td>
                      <td className="py-3 px-2 text-gray-700 dark:text-gray-300 truncate max-w-xs">{msg.subject || 'No Subject'}</td>
                      <td className="py-3 px-2 text-gray-500 dark:text-gray-400 text-xs">
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => navigate('/admin/messages')}
                          className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-xs font-medium transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
