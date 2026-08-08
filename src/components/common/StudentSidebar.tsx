import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Briefcase, label: 'Internships', path: '/feed' },
  { icon: ClipboardList, label: 'Applications', path: '/applications' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

const StudentSidebar = ({ collapsed, onToggle }: Props) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const profile = user?.studentProfile as any;

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-40 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      }`}>

      {/* Logo + Toggle */}
      <div className="px-50 py-5 border-b border-gray-100 flex items-center justify-between">
        {/* {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">U</span>
            </div>
            <span className="text-navy font-bold text-base">UniIntern</span>
          </Link>
        )} */}
        {/* {collapsed && (
          <div className="w-7 h-7 bg-navy rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white text-xs font-bold">U</span>
          </div>
        )} */}
        <button
          onClick={onToggle}
          className={`text-gray-400 hover:text-navy transition-colors flex-shrink-0 ${
            collapsed ? 'hidden' : 'block'
          }`}>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Toggle button when collapsed */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="mx-auto mt-2 text-gray-400 hover:text-navy transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : ''}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-sm font-medium transition-colors ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-navy text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-navy'
              }`}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className={`px-3 py-4 border-t border-gray-100 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center overflow-hidden">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xs font-bold">
                {profile?.firstName?.charAt(0) ?? 'S'}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">
                  {profile?.firstName?.charAt(0) ?? 'S'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-navy truncate">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-[10px] text-gray-400">Student</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-300 hover:text-red-500 transition-colors p-1"
              title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default StudentSidebar;