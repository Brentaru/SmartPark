import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import AuthTopbar from '../../components/AuthTopbar';
import Reports from '../../components/dashboard/admin/Reports';

const ReportsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      <AuthTopbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <main className={`dashboard-main ${sidebarOpen ? '' : 'sidebar-closed'}`} style={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
        <Reports />
      </main>
    </div>
  );
};

export default ReportsPage;
