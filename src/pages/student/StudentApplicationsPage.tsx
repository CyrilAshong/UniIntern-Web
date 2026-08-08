import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Clock,
  MessageSquare,
  DollarSign,
  RefreshCw,
  Calendar,
  ClipboardList,
  Building2,
  ChevronDown
} from 'lucide-react';
import api from '../../services/api';
import { type Application } from '../../types';


type TabType = 'ACTIVE' | 'HISTORY';

const statusConfig: Record<string, {
  label: string;
  color: string;
  dot: string;
  border: string;
}> = {
  PENDING: {
    label: 'Pending',
    color: 'text-amber-600 bg-amber-50',
    dot: 'bg-amber-500',
    border: 'border-l-amber-400',
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    color: 'text-blue-600 bg-blue-50',
    dot: 'bg-blue-500',
    border: 'border-l-blue-400',
  },
  INTERVIEWING: {
    label: 'Interviewing',
    color: 'text-purple-600 bg-purple-50',
    dot: 'bg-purple-500',
    border: 'border-l-purple-400',
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'text-teal-dark bg-teal-light',
    dot: 'bg-teal',
    border: 'border-l-teal',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'text-gray-500 bg-gray-100',
    dot: 'bg-gray-400',
    border: 'border-l-gray-300',
  },
};

const avatarColors = [
  'bg-purple-100 text-purple-600',
  'bg-blue-100 text-blue-600',
  'bg-amber-100 text-amber-600',
  'bg-teal-light text-teal-dark',
  'bg-pink-100 text-pink-600',
];

const StudentApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<TabType>('ACTIVE');
  const [sortBy, setSortBy] = useState('date');

  const loadApplications = useCallback(async () => {
    try {
      const res = await api.get('/applications/my-applications');
      setApplications(res.data.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const activeApps = applications.filter((a) =>
    ['PENDING', 'SHORTLISTED', 'INTERVIEWING'].includes(a.status),
  );
  const historyApps = applications.filter((a) =>
    ['ACCEPTED', 'REJECTED'].includes(a.status),
  );
  const displayApps = tab === 'ACTIVE' ? activeApps : historyApps;

  const totalApplied = applications.length;
  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const interviewCount = applications.filter((a) => a.status === 'INTERVIEWING').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="lg:ml-10 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-navy mb-1 sm:mb-2">
                My Applications
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm leading-5 sm:leading-6 max-w-md">
                Track your internship journey. Stay updated on where you stand
                with your dream roles.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 self-start sm:self-auto">
              <button
                className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  tab === 'ACTIVE'
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-gray-400 hover:text-navy'
                }`}
                onClick={() => setTab('ACTIVE')}>
                Active
              </button>
              <button
                className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  tab === 'HISTORY'
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-gray-400 hover:text-navy'
                }`}
                onClick={() => setTab('HISTORY')}>
                History
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              {
                val: totalApplied,
                label: 'TOTAL APPLIED',
                icon: Send,
                iconBg: 'bg-blue-50 text-blue-500',
                cornerIcon: DollarSign,
              },
              {
                val: pendingCount,
                label: 'PENDING REVIEW',
                icon: Clock,
                iconBg: 'bg-amber-50 text-amber-500',
                cornerIcon: RefreshCw,
              },
              {
                val: interviewCount,
                label: 'INTERVIEWS SCHEDULED',
                icon: MessageSquare,
                iconBg: 'bg-purple-50 text-purple-500',
                cornerIcon: Calendar,
              },
            ].map((stat) => {
              const MainIcon = stat.icon;
              const CornerIcon = stat.cornerIcon;

              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-row md:flex-col justify-between items-center md:items-start">
                  <div className="flex justify-between items-start w-full mb-0 md:mb-4">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                      <MainIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <CornerIcon className="hidden md:block text-gray-200 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-4xl font-bold text-navy mb-0.5 sm:mb-1">{stat.val}</p>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Applications List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-bold text-navy">Recent Activity</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Sort by:
                </span>
                <select
                  className="text-xs font-bold text-navy border-none focus:outline-none bg-transparent cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}>
                  <option value="date">Date Applied</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-20 text-gray-400">
                Loading applications...
              </div>
            ) : displayApps.length === 0 ? (
              <div className="text-center py-12 sm:py-20 bg-white rounded-2xl border border-gray-100 px-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center mb-4">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <p className="text-navy font-bold text-base sm:text-lg mb-2">
                  {tab === 'ACTIVE' ? 'No active applications' : 'No history yet'}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mb-6 max-w-sm">
                  {tab === 'ACTIVE'
                    ? 'Start exploring internships and apply today.'
                    : 'Your completed applications will appear here.'}
                </p>
                <button
                  onClick={() => navigate('/feed')}
                  className="bg-navy text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-navy-light transition-colors">
                  Browse Internships
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {displayApps.map((app, i) => {
                  const status = statusConfig[app.status] ?? statusConfig.PENDING;
                  const avatarColor = avatarColors[i % avatarColors.length];
                  const initials = (
                    app.jobPosting.company.companyProfile?.companyName ?? 'CO'
                  )
                    .split(' ')
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('');

                  return (
                    <div
                      key={app.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6 sm:py-5 border-b border-gray-50 last:border-b-0 border-l-4 ${status.border} hover:bg-gray-50 transition-colors`}>

                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                        {/* Avatar */}
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs sm:text-sm ${avatarColor}`}>
                          {initials}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-sm sm:text-base font-bold text-navy truncate">
                              {app.jobPosting.title}
                            </h3>
                            <span
                              className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full ${status.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-gray-400">
                            <span className="flex items-center gap-1 truncate">
                              <Building2 className="w-3.5 h-3.5 text-gray-400 inline-block" />
                              {app.jobPosting.company.companyProfile?.companyName ?? 'Company'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <Clock className="w-3.5 h-3.5 text-gray-400 inline-block" />
                              Applied{' '}
                              {new Date(app.appliedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => navigate(`/jobs/${app.jobPosting.id}`)}
                        className={`w-full sm:w-auto text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors whitespace-nowrap ${
                          i === 0
                            ? 'bg-navy text-white hover:bg-navy-light'
                            : 'bg-gray-100 text-navy hover:bg-gray-200'
                        }`}>
                        View Details →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {displayApps.length > 0 && (
              <button className="w-full mt-4 text-xs sm:text-sm text-gray-400 font-medium py-3 hover:text-navy transition-colors flex items-center justify-center gap-1">
                Load More Applications
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentApplicationsPage;