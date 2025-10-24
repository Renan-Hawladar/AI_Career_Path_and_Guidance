import { X, TrendingUp, Target, Award } from 'lucide-react';

interface IntroModalProps {
  onClose: () => void;
}

export default function IntroModal({ onClose }: IntroModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#161B22] rounded-2xl border border-[#3B82F6]/20 shadow-2xl shadow-[#3B82F6]/10 animate-slideUp">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Welcome to CareerCompass AI
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#E0E6ED]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-[#E0E6ED] font-['Inter'] leading-relaxed">
            CareerCompass AI is your intelligent career guidance platform powered by Google Gemini.
            We help you discover your ideal career path and provide personalized roadmaps to achieve your goals.
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-['Space_Grotesk']">
              Feature Highlights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#0D1117] rounded-xl border border-[#3B82F6]/20 hover:border-[#3B82F6]/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/5 flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-[#3B82F6]/30 transition-all">
                  <TrendingUp className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <h4 className="text-white font-semibold mb-2 font-['Space_Grotesk']">
                  AI Career Guidance
                </h4>
                <p className="text-[#E0E6ED] text-sm font-['Inter']">
                  Get top 5 personalized career recommendations based on your profile
                </p>
              </div>

              <div className="p-4 bg-[#0D1117] rounded-xl border border-[#9D4EDD]/20 hover:border-[#9D4EDD]/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#9D4EDD]/20 to-[#9D4EDD]/5 flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-[#9D4EDD]/30 transition-all">
                  <Target className="w-6 h-6 text-[#9D4EDD]" />
                </div>
                <h4 className="text-white font-semibold mb-2 font-['Space_Grotesk']">
                  Interactive Roadmaps
                </h4>
                <p className="text-[#E0E6ED] text-sm font-['Inter']">
                  Follow step-by-step paths with resources and milestone tracking
                </p>
              </div>

              <div className="p-4 bg-[#0D1117] rounded-xl border border-[#00C896]/20 hover:border-[#00C896]/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00C896]/20 to-[#00C896]/5 flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-[#00C896]/30 transition-all">
                  <Award className="w-6 h-6 text-[#00C896]" />
                </div>
                <h4 className="text-white font-semibold mb-2 font-['Space_Grotesk']">
                  Progress Tracking
                </h4>
                <p className="text-[#E0E6ED] text-sm font-['Inter']">
                  Track achievements and unlock badges as you progress
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all font-['Inter']"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
