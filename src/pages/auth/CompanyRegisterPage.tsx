import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerCompany } from '../../services/authService';

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Engineering',
  'Marketing',
  'Legal',
  'Consulting',
  'Manufacturing',
  'Other',
];

const CompanyRegisterPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!companyName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms of Service and Data Privacy Policy.');
      return;
    }
    try {
      setIsLoading(true);
      const { user, token } = await registerCompany(
        email.trim(),
        password,
        companyName,
      );
      setAuth(user, token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Left Panel */}
      <div className="hidden md:flex w-[42%] bg-navy flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute bottom-20 right-0 w-64 h-64 rounded-full border border-white/10 translate-x-1/2" />
        <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full border border-white/5 translate-x-1/2" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">🏢</span>
            </div>
            <span className="text-white font-bold text-sm">UniIntern</span>
          </div>

          <p className="text-white font-semibold text-base mb-2">
            Scale your team with the next generation.
          </p>
          <p className="text-white/50 text-sm leading-6 mb-10">
            Connect with high-potential students through our AI-driven
            recruitment ecosystem.
          </p>

          {/* Feature cards */}
          <div className="space-y-3">
            {[
              {
                icon: '⚡',
                title: 'Instant Postings',
                desc: 'Deploy internship listings to thousands of applicants in seconds.',
              },
              {
                icon: '🤖',
                title: 'AI Summaries',
                desc: 'Get condensed candidate insights without reading every CV.',
              },
              {
                icon: '✅',
                title: 'Vetted Pipeline',
                desc: 'Access a secure database of verified student profiles.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-white/50 text-xs leading-5">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div>
              <p className="text-white/70 text-sm italic leading-5">
                "UniIntern transformed how we source junior talent — cutting our
                screening time by 60%."
              </p>
              <p className="text-white/40 text-xs mt-2">
                — Sarah Jenkins, Talent Acquisition at TechFlow
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-10 py-12 bg-white">
        <div className="w-full max-w-lg">

          <div className="mb-8">
            <p className="text-xs font-bold text-navy tracking-widest uppercase mb-2">
              Corporate Portal
            </p>
            <h1 className="text-2xl font-bold text-navy mb-1">
              Create Company Account
            </h1>
            <p className="text-gray-400 text-sm">
              Join our network of 500+ leading companies hiring interns.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Company Name
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 gap-3 bg-gray-50 focus-within:border-navy focus-within:bg-white transition-colors">
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  className="flex-1 text-sm text-navy bg-transparent focus:outline-none"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <span className="text-gray-300 text-sm">🏢</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Industry
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-navy focus:outline-none focus:border-navy transition-colors appearance-none"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}>
                <option value="">Select industry...</option>
                {industries.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Corporate Email
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 gap-3 bg-gray-50 focus-within:border-navy focus-within:bg-white transition-colors">
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="flex-1 text-sm text-navy bg-transparent focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="text-gray-300 text-sm">✉️</span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                We only accept official corporate domains for security.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 gap-3 bg-gray-50 focus-within:border-navy focus-within:bg-white transition-colors">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="flex-1 text-sm text-navy bg-transparent focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-navy transition-colors">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-navy"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm text-gray-500 leading-5">
                I agree to the{' '}
                <a href="#" className="text-teal font-semibold hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-teal font-semibold hover:underline">
                  Data Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-navy text-white font-semibold py-4 rounded-xl hover:bg-navy-light transition-colors text-sm disabled:opacity-70">
              {isLoading ? 'Creating Account...' : 'Register Company →'}
            </button>
          </form>

          <div className="h-px bg-gray-100 my-6" />

          <p className="text-center text-sm text-gray-400">
            Already have a corporate account?{' '}
            <Link
              to="/company/login"
              className="text-navy font-bold hover:underline">
              Sign In
            </Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-6">
            {['🔒 Secure', '🌍 Global', '📋 Compliant'].map((badge) => (
              <span key={badge} className="text-xs text-gray-300 font-medium">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegisterPage;