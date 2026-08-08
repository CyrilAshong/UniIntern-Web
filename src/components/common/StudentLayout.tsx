import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import StudentSidebar from './StudentSidebar';

const StudentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar sidebarCollapsed={collapsed} />
      <StudentSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div
        className={`transition-all duration-300 pt-16 ${
          collapsed ? 'ml-16' : 'ml-56'
        }`}>
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;