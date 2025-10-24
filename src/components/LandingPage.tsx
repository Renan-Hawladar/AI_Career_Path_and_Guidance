import { useState } from 'react';
import { Compass, TrendingUp, Target, Award, Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';
import IntroModal from './IntroModal';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showIntro, setShowIntro] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117]">
      <nav className="fixed top-0 w-full z-50 bg-[#161B22]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#9D4EDD] flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-['Space_Grotesk']">
                CareerCompass AI
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={handleLogin}
                className="px-6 py-2 text-[#E0E6ED] hover:text-white transition-colors font-['Inter']"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white rounded-lg hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all font-['Inter'] font-medium"
              >
                Sign Up
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#161B22] border-t border-white/5">
            <div className="px-4 py-4 space-y-2">
              <button
                onClick={handleLogin}
                className="w-full px-6 py-2 text-[#E0E6ED] hover:text-white transition-colors font-['Inter'] text-left"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white rounded-lg hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all font-['Inter'] font-medium"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-[#161B22] border border-[#3B82F6]/30 rounded-full">
            <span className="text-[#3B82F6] font-['Inter'] text-sm">Powered by Google Gemini</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-['Space_Grotesk'] leading-tight">
            Navigate Your Career
            <br />
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] bg-clip-text text-transparent">
              with AI Precision
            </span>
          </h1>

          <p className="text-xl text-[#E0E6ED] mb-12 max-w-3xl mx-auto font-['Inter'] leading-relaxed">
            Discover personalized career paths, build skills with interactive roadmaps,
            and achieve your professional goals with AI-powered guidance tailored just for you.
          </p>

          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-[#3B82F6]/40 transition-all hover:scale-105 font-['Inter']"
          >
            Get Started Free
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            <div className="p-8 bg-[#161B22] rounded-2xl border border-[#3B82F6]/20 hover:border-[#3B82F6]/50 transition-all hover:shadow-xl hover:shadow-[#3B82F6]/10 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/5 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-[#3B82F6]/30 transition-all">
                <TrendingUp className="w-7 h-7 text-[#3B82F6]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-['Space_Grotesk']">
                AI Career Guidance
              </h3>
              <p className="text-[#E0E6ED] font-['Inter'] leading-relaxed">
                Get personalized career recommendations based on your skills, experience, and aspirations.
              </p>
            </div>

            <div className="p-8 bg-[#161B22] rounded-2xl border border-[#9D4EDD]/20 hover:border-[#9D4EDD]/50 transition-all hover:shadow-xl hover:shadow-[#9D4EDD]/10 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#9D4EDD]/20 to-[#9D4EDD]/5 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-[#9D4EDD]/30 transition-all">
                <Target className="w-7 h-7 text-[#9D4EDD]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-['Space_Grotesk']">
                Interactive Roadmaps
              </h3>
              <p className="text-[#E0E6ED] font-['Inter'] leading-relaxed">
                Follow step-by-step learning paths with curated resources and milestone tracking.
              </p>
            </div>

            <div className="p-8 bg-[#161B22] rounded-2xl border border-[#00C896]/20 hover:border-[#00C896]/50 transition-all hover:shadow-xl hover:shadow-[#00C896]/10 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00C896]/20 to-[#00C896]/5 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-[#00C896]/30 transition-all">
                <Award className="w-7 h-7 text-[#00C896]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-['Space_Grotesk']">
                Progress Tracking
              </h3>
              <p className="text-[#E0E6ED] font-['Inter'] leading-relaxed">
                Track achievements, unlock badges, and visualize your professional growth journey.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 px-4 bg-[#161B22]/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#9D4EDD] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white font-['Space_Grotesk']">
                  CareerCompass AI
                </span>
              </div>
              <p className="text-[#E0E6ED] text-sm font-['Inter']">
                AI-powered career guidance for the modern professional.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 font-['Space_Grotesk']">Contact</h4>
              <p className="text-[#E0E6ED] text-sm font-['Inter'] mb-2">support@careercompass.ai</p>
              <p className="text-[#E0E6ED] text-sm font-['Inter']">careers@careercompass.ai</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 font-['Space_Grotesk']">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-[#E0E6ED] hover:text-[#3B82F6] transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-[#E0E6ED] hover:text-[#3B82F6] transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-[#E0E6ED] hover:text-[#3B82F6] transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#E0E6ED] text-sm font-['Inter']">
              © 2025 CareerCompass AI. All rights reserved.
            </p>
            <p className="text-[#E0E6ED] text-sm font-['Inter']">
              Powered by <span className="text-[#3B82F6]">Google Gemini</span>
            </p>
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
        />
      )}

      {showIntro && <IntroModal onClose={() => setShowIntro(false)} />}
    </div>
  );
}
