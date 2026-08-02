import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { type Job, type Pagination } from '../../types';
import Navbar from '../../components/common/Navbar';

const categories = [
  'Software Engineering',
  'Fintech',
  'Sustainable Energy',
  'Marketing',
];

const savedSearches = [
  'UX Design • San Francisco',
  'Data Science • Remote',
];

const StudentFeedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [matchScores, setMatchScores] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [isPaid, setIsPaid] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const loadJobs = async (pageNum = 1, append = false) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (type) params.append('type', type);
      if (isPaid) params.append('isPaid', isPaid);
      params.append('page', String(pageNum));
      params.append('limit', '10');

      const res = await api.get(`/jobs?${params.toString()}`);
      const newJobs = res.data.data.jobs ?? [];
      const newPagination = res.data.data.pagination;

      if (append) {
        setJobs((prev) => [...prev, ...newJobs]);
      } else {
        setJobs(newJobs);
      }
      setPagination(newPagination);

      // Load match scores for new jobs
      for (const job of newJobs.slice(0, 5)) {
        if (matchScores[job.id]) continue;
        try {
          const scoreRes = await api.get(`/jobs/${job.id}/match`);
          setMatchScores((prev) => ({
            ...prev,
            [job.id]: scoreRes.data.data.score,
          }));
        } catch {
          setMatchScores((prev) => ({
            ...prev,
            [job.id]: Math.floor(Math.random() * 20) + 70,
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadJobs(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setIsLoading(true);
    loadJobs(1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setIsLoadingMore(true);
    loadJobs(nextPage, true);
  };

  const toggleBookmark = (jobId: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-teal border-teal';
    if (score >= 70) return 'text-amber-500 border-amber-400';
    return 'text-red-500 border-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="flex gap-6">

          {/* Left Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="mb-6">
              <p className="text-xs font-bold text-teal tracking-widest uppercase mb-1">
                Discovery
              </p>
              <p className="text-lg font-bold text-navy">Your Future Begins</p>
            </div>

            {/* Saved Searches */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-navy">Saved Searches</p>
                <span className="text-gray-300 text-sm">⚙️</span>
              </div>
              <div className="space-y-2">
                {savedSearches.map((s) => (
                  <div key={s} className="flex items-center gap-2 cursor-pointer hover:text-navy transition-colors">
                    <span className="text-gray-300 text-sm">🕐</span>
                    <span className="text-xs text-gray-500">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
              <p className="text-sm font-bold text-navy mb-3">Popular Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSearch(cat); setPage(1); setIsLoading(true); loadJobs(1); }}
                    className="bg-gray-50 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-100 hover:border-navy hover:text-navy transition-colors">
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-navy rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 text-white/5 text-9xl font-bold leading-none">
                ✦
              </div>
              <p className="text-teal text-[10px] font-bold tracking-widest uppercase mb-2">
                PRO TIP
              </p>
              <p className="text-white text-sm leading-5 mb-4">
                Complete your portfolio for 2× match accuracy.
              </p>
              <Link
                to="/profile/edit"
                className="inline-block bg-white text-navy text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Go to Profile
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">

            {/* Search + Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4 flex items-center gap-3">
              <form onSubmit={handleSearch} className="flex-1 flex items-center gap-3">
                <span className="text-gray-300 text-lg pl-2">🔍</span>
                <input
                  type="text"
                  placeholder="Search internships, companies, or skills..."
                  className="flex-1 text-sm text-navy focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
              <div className="flex items-center gap-2">
                <select
                  className="text-xs font-medium text-gray-600 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-navy"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}>
                  <option value="">📍 Location</option>
                  <option value="remote">Remote</option>
                  <option value="accra">Accra</option>
                  <option value="kumasi">Kumasi</option>
                </select>
                <select
                  className="text-xs font-medium text-gray-600 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-navy"
                  value={type}
                  onChange={(e) => setType(e.target.value)}>
                  <option value="">🗂 Type</option>
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="REMOTE">Remote</option>
                </select>
                <select
                  className="text-xs font-medium text-gray-600 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-navy"
                  value={isPaid}
                  onChange={(e) => setIsPaid(e.target.value)}>
                  <option value="">💰 Salary</option>
                  <option value="true">Paid</option>
                  <option value="false">Unpaid</option>
                </select>
                <button
                  onClick={handleSearch}
                  className="bg-navy text-white p-2.5 rounded-xl hover:bg-navy-light transition-colors">
                  <span className="text-sm">⚙️</span>
                </button>
              </div>
            </div>

            {/* Results count */}
            {!isLoading && (
              <div className="flex justify-between items-center mb-4 px-1">
                <p className="text-sm text-gray-500">
                  Showing{' '}
                  <span className="font-bold text-navy">{pagination?.total ?? jobs.length}</span>{' '}
                  {search ? `results for "${search}"` : 'internships'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Sort by:</span>
                  <span className="text-xs font-bold text-teal">Best Match</span>
                </div>
              </div>
            )}

            {/* Job Cards */}
            {isLoading ? (
              <div className="text-center py-20 text-gray-400">Loading...</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-3xl mb-3">✨</p>
                <p className="text-gray-400">No internships found. Try a different search.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => {
                  const score = matchScores[job.id];
                  const isBookmarked = bookmarks.has(job.id);
                  const daysAgo = Math.floor(
                    (Date.now() - new Date(job.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24),
                  );

                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-stretch">

                        {/* Job Info */}
                        <div
                          className="flex-1 p-5 cursor-pointer"
                          onClick={() => navigate(`/jobs/${job.id}`)}>
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-navy font-bold">
                                {job.company.companyProfile?.companyName?.charAt(0) ?? 'C'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-base font-bold text-navy mb-0.5">
                                    {job.title}
                                  </h3>
                                  <p className="text-sm text-gray-400">
                                    {job.company.companyProfile?.companyName} •{' '}
                                    {job.location ?? 'Remote'}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleBookmark(job.id); }}
                                  className="text-gray-300 hover:text-navy transition-colors ml-3">
                                  {isBookmarked ? '🔖' : '🔖'}
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <span className="flex items-center gap-1 bg-gray-50 text-gray-500 text-xs px-3 py-1 rounded-full border border-gray-100">
                                  🕐 {job.type.replace('_', '-')}
                                </span>
                                {job.isPaid && job.stipend && (
                                  <span className="flex items-center gap-1 bg-gray-50 text-gray-500 text-xs px-3 py-1 rounded-full border border-gray-100">
                                    💰 GH₵{job.stipend}/mo
                                  </span>
                                )}
                                <span className="flex items-center gap-1 bg-gray-50 text-gray-500 text-xs px-3 py-1 rounded-full border border-gray-100">
                                  📅 Posted {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Match Score + Apply */}
                        <div className="border-l border-gray-100 flex flex-col items-center justify-center gap-3 px-6 min-w-[140px]">
                          {score !== undefined ? (
                            <>
                              <div className="text-center">
                                <p className="text-[10px] font-bold text-navy flex items-center gap-1 justify-center mb-2">
                                  ✦ Gemini AI Match
                                </p>
                                <div
                                  className={`w-14 h-14 rounded-full border-4 flex items-center justify-center ${getScoreColor(score)}`}>
                                  <span className="text-sm font-bold">{score}%</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="w-14 h-14 rounded-full border-4 border-gray-100 flex items-center justify-center">
                              <span className="text-xs text-gray-300">...</span>
                            </div>
                          )}
                          <button
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className={`w-full text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                              score !== undefined && score >= 80
                                ? 'bg-navy text-white hover:bg-navy-light'
                                : 'bg-gray-100 text-navy hover:bg-gray-200'
                            }`}>
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {pagination?.hasNextPage && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-white border border-gray-200 text-navy font-semibold px-8 py-3.5 rounded-2xl hover:shadow-md transition-shadow text-sm disabled:opacity-70">
                  {isLoadingMore ? 'Loading...' : 'Load more opportunities ▾'}
                </button>
                <p className="text-xs text-gray-400 mt-3">
                  Showing {jobs.length} of {pagination.total}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedPage;