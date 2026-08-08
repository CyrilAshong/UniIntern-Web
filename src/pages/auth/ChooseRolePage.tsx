import { Link } from 'react-router-dom';
import { GraduationCap, Building2, ExternalLink } from 'lucide-react';
import Navbar from '../../components/common/Navbar';

const ChooseRolePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col justify-center px-6 pt-24 pb-16 max-w-6xl mx-auto w-full">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-navy" />
            <p className="text-xs font-bold text-navy tracking-widest uppercase">
              Get Started
            </p>
          </div>
          <p className="text-gray-500 text-sm mb-2">Join UniIntern as a...</p>
          <p className="text-gray-600 max-w-md leading-relaxed">
            Choose your path to begin. Whether you're looking to launch your
            career or find the next generation of talent, we've got you covered.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">

          {/* Student Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col justify-between min-h-[360px]">
            {/* Decorative shape */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-8 translate-x-8 group-hover:bg-indigo-100 transition-colors" />

            <div>
              <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center mb-8 relative z-10">
                <GraduationCap className="size-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Student</h3>
              <p className="text-gray-500 text-sm leading-6 max-w-xs">
                Find your dream internship and get AI-powered match scores based
                on your unique skill set and academic background.
              </p>
            </div>

            <div className="mt-8">
              <Link
                to="/student/login"
                className="inline-block bg-navy text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-navy-light transition-colors text-sm"
              >
                Continue as Student
              </Link>
              <p className="absolute bottom-6 right-8 text-gray-200 text-2xl font-bold">
                01
              </p>
            </div>
          </div>

          {/* Company Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col justify-between min-h-[360px]">
            {/* Decorative shape */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-8 translate-x-8 group-hover:bg-blue-100 transition-colors" />

            <div>
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 relative z-10">
                <Building2 className="size-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Company</h3>
              <p className="text-gray-500 text-sm leading-6 max-w-xs">
                Post listings and find the perfect candidates with AI summaries
                that highlight the most relevant talent for your needs.
              </p>
            </div>

            <div className="mt-8">
              <Link
                to="/company/login"
                className="inline-block bg-navy text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-navy-light transition-colors text-sm"
              >
                Continue as Company
              </Link>
              <p className="absolute bottom-6 right-8 text-gray-200 text-2xl font-bold">
                02
              </p>
            </div>
          </div>
        </div>

        {/* Bottom link */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">Not sure which to choose?</p>
          <a
            href="#"
            className="text-navy text-sm font-medium hover:underline inline-flex items-center gap-1.5 group"
          >
            <span>Read our platform guide</span>
            <ExternalLink className="size-3.5 text-navy group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChooseRolePage;