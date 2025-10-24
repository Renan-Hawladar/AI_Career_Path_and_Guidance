import { useState, useEffect } from 'react';
import { User, Briefcase, Target, Link as LinkIcon, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ProfileSetupProps {
  onComplete: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    education: '',
    skills: '',
    goals: '',
    linkedin: '',
    github: '',
    portfolio: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setFormData({
        display_name: data.display_name || '',
        bio: data.bio || '',
        education: data.education?.[0]?.institution || '',
        skills: data.skills?.join(', ') || '',
        goals: data.goals || '',
        linkedin: data.social_links?.linkedin || '',
        github: data.social_links?.github || '',
        portfolio: data.social_links?.portfolio || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const profileData = {
      id: user.id,
      display_name: formData.display_name,
      bio: formData.bio,
      education: formData.education ? [{ institution: formData.education }] : [],
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      goals: formData.goals,
      social_links: {
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
      },
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('user_profiles')
      .upsert(profileData);

    setLoading(false);

    if (!error) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 font-['Space_Grotesk']">
            Complete Your Profile
          </h1>
          <p className="text-[#E0E6ED] font-['Inter']">
            Help us understand you better to provide personalized career guidance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161B22] rounded-2xl border border-[#3B82F6]/20 shadow-xl overflow-hidden">
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter'] flex items-center gap-2">
                <User className="w-4 h-4" />
                Display Name
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter']">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter'] flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Education
              </label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                placeholder="University name or highest degree"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter']">
                Skills
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                placeholder="JavaScript, Python, Design, Marketing (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter'] flex items-center gap-2">
                <Target className="w-4 h-4" />
                Career Goals
              </label>
              <textarea
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                placeholder="What are your career aspirations?"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <label className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter'] flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Social Links
              </label>

              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                placeholder="LinkedIn URL"
              />

              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                placeholder="GitHub URL"
              />

              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                placeholder="Portfolio URL"
              />
            </div>
          </div>

          <div className="p-6 bg-[#0D1117] border-t border-white/5 flex justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all disabled:opacity-50 flex items-center gap-2 font-['Inter']"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue to Dashboard'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
