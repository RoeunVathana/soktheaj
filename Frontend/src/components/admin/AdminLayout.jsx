import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#070a12] text-gray-900 dark:text-white flex transition-colors duration-300 overflow-x-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`w-full min-w-0 max-w-full overflow-x-hidden flex-1 flex flex-col transition-all duration-200 ml-0 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 p-4 lg:p-6 bg-gray-50 dark:bg-[#0b0f19]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;