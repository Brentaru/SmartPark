import React from 'react';
import Sidebar from '../../components/Sidebar';
import AuthTopbar from '../../components/AuthTopbar';
import { useSidebar } from '../../context/SidebarContext';
import UserManagement from '../../components/dashboard/admin/UserManagement';

const ManageUsersPage = () => {
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <div className="dashboard-layout">
      <AuthTopbar onToggleSidebar={toggleSidebar} sidebarOpen={isExpanded} />
      <Sidebar isOpen={isExpanded} onToggle={toggleSidebar} />
      <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-closed'}`} style={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
        <UserManagement />
      </main>
    </div>
  );
};

export default ManageUsersPage;
