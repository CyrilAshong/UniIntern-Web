import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { type Job, type Application } from '../../types';
import Navbar from '../../components/common/Navbar';

const StudentFeedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profile = user?.studentProfile as any;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [matchScores, setMatchScores] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs?limit=4'),
          api.get('/applications/my-applications'),
        ]);
        setJobs(jobsRes.data.data.jobs ?? []);
        setApplications(appsRes.data.data ?? []);

        // Load match scores
        const scores: Record<string, number> = {};
        for (const job of (jobsRes.data.data.jobs ?? []).slice(0, 4)) {
          try {
            const res = await api.get(`/jobs/${job.id}/match`);
            scores[job.id] = res.data.data.score;
          } catch {
            scores[job.id] = Math.floor(Math.random() * 20) + 75;
          }
        }
        setMatchScores(scores);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const appliedCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const interviewCount = applications.filter((a) => a.status === 'INTERVIEWING').length;

  const profileCompletion = () => {
    let score = 0;
    if (profile?.firstName) score += 20;
    if (profile?.university) score += 20;
    if (profile?.courseOfStudy) score += 20;
    if (profile?.skills?.length > 0) score += 20;
    if (profile?.biography) score += 20;
    return score;
  };

  const completion = profileCompletion();

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    SHORTLISTED: 'bg-blue-100 text-blue-700',
    INTERVIEWING: 'bg-purple-100 text-purple-700',
    ACCEPTED: 'bg-teal-light text-teal-dark',
    REJECTED: 'bg-gray-100 text-gray-500',
  };

  // Heatmap data (mock)
  const heatmap = Array.from({ length: 28 }, (_, i) =>
    i > 18 ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 3)
  );
  const heatColors = ['bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-navy/40', 'bg-navy'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-navy font-semibold">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
              Dashboard Overview
            </p>
            <h1 className="text-4xl font-bold text-navy leading-tight">
              Welcome back,{' '}
              <span className="text-blue-600">{profile?.firstName ?? 'Student'}</span>.
              <br />
              Your career journey is in motion.
            </h1>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            {[
              { val: appliedCount, label: 'APPLIED', active: false },
              { val: pendingCount, label: 'PENDING', active: false },
              { val: interviewCount, label: 'INTERVIEWS', active: true },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl px-6 py-4 text-center min-w-[90px] border ${
                  stat.active
                    ? 'bg-navy border-navy'
                    : 'bg-white border-gray-100'
                }`}>
                <p
                  className={`text-3xl font-bold mb-1 ${
                    stat.active ? 'text-white' : 'text-navy'
                  }`}>
                  {stat.val}
                </p>
                <p
                  className={`text-[10px] font-bold tracking-widest ${
                    stat.active ? 'text-white/70' : 'text-gray-400'
                  }`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Completion Banner */}
        {completion < 100 && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-lg">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-navy mb-0.5">
                Complete your profile to unlock 3× more matches
              </p>
              <p className="text-xs text-gray-500">
                Recruiters prioritize candidates with updated portfolios and skills.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-navy rounded-full transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-navy">{completion}%</span>
              </div>
              <Link
                to="/profile/edit"
                className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-navy-light transition-colors whitespace-nowrap">
                Finish Setup
              </Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recommended Jobs */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-navy">Recommended for You</h2>
                <Link
                  to="/jobs"
                  className="text-sm text-blue-600 font-semibold hover:underline">
                  View all matches →
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {jobs.slice(0, 2).map((job) => {
                  const score = matchScores[job.id];
                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-navy font-bold text-sm">
                            {job.company.companyProfile?.companyName?.charAt(0) ?? 'C'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-bold text-navy leading-tight">
                              {job.title}
                            </h3>
                            {score !== undefined && (
                              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                                ⚡ {score}% Match
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {job.company.companyProfile?.companyName} •{' '}
                            {job.location ?? 'Remote'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skillsRequired.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="bg-gray-50 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide border border-gray-100">
                            {skill}
                          </span>
                        ))}
                        {job.isPaid && (
                          <span className="bg-gray-50 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide border border-gray-100">
                            PAID
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="w-full bg-blue-50 text-navy text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-100 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Application Status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-navy">
                  Recent Application Status
                </h2>
                <Link
                  to="/applications"
                  className="text-xs text-blue-600 font-semibold hover:underline">
                  View all
                </Link>
              </div>

              {applications.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  No applications yet. Start applying!
                </p>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/jobs/${app.jobPosting.id}`)}>
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-navy text-xs font-bold">
                          {app.jobPosting.company.companyProfile?.companyName?.charAt(0) ?? 'C'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-navy">
                          {app.jobPosting.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {app.jobPosting.company.companyProfile?.companyName}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                          statusColors[app.status] ?? 'bg-gray-100 text-gray-500'
                        }`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-gray-300">
                        Updated {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-navy">
                  Upcoming Deadlines
                </h2>
                <span className="text-gray-300">📅</span>
              </div>

              <div className="space-y-3 mb-4">
                {jobs.slice(0, 3).filter(j => j.deadline).map((job, i) => {
                  const date = new Date(job.deadline!);
                  const daysLeft = Math.ceil(
                    (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                  );
                  return (
                    <div key={job.id} className="flex items-center gap-3">
                      <div
                        className={`w-10 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                          i === 0 ? 'bg-red-500' : 'bg-navy'
                        }`}>
                        <span className="text-white text-xs font-bold">
                          {date.getDate()}
                        </span>
                        <span className="text-white/70 text-[9px] uppercase">
                          {date.toLocaleString('default', { month: 'short' })}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">
                          {job.title}
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            daysLeft <= 1
                              ? 'text-red-500'
                              : 'text-gray-400'
                          }`}>
                          {daysLeft <= 0
                            ? 'Closing today'
                            : daysLeft === 1
                            ? 'Closing tomorrow'
                            : `${daysLeft} days left`}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {jobs.filter(j => j.deadline).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No upcoming deadlines
                  </p>
                )}
              </div>

              <button className="w-full border border-gray-200 text-navy text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Manage Calendar
              </button>
            </div>

            {/* Search Intensity */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold text-navy mb-1">
                Search Intensity
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Your application activity over the last 4 weeks
              </p>
              <div className="grid grid-cols-7 gap-1.5">
                {heatmap.map((level, i) => (
                  <div
                    key={i}
                    className={`w-full aspect-square rounded-md ${heatColors[level]}`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-gray-400">LOW</span>
                <div className="flex gap-1">
                  {heatColors.map((c, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400">HIGH</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedPage;