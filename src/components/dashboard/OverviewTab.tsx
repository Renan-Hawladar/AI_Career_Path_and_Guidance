import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, BarChart3, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateCareerRecommendations } from '../../lib/gemini';
import type { Database } from '../../types/database';

type CareerRecommendation = Database['public']['Tables']['career_recommendations']['Row'];

export default function OverviewTab() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('career_recommendations')
      .select('*')
      .eq('user_id', user.id)
      .order('rank', { ascending: true });

    if (data && data.length > 0) {
      setRecommendations(data);
    }

    setLoading(false);
  };

  const handleGenerateRecommendations = async () => {
    if (!user) return;

    setGenerating(true);

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      setGenerating(false);
      return;
    }

    const aiRecommendations = await generateCareerRecommendations(
      profile.skills,
      profile.goals,
      profile.education?.[0]?.institution || '',
      profile.bio
    );

    await supabase
      .from('career_recommendations')
      .delete()
      .eq('user_id', user.id);

    const newRecommendations = aiRecommendations.map((rec, idx) => ({
      user_id: user.id,
      career_title: rec.career_title,
      summary: rec.summary,
      market_demand: rec.market_demand,
      confidence_score: rec.confidence_score,
      required_skills: rec.required_skills,
      salary_range: rec.salary_range,
      growth_outlook: rec.growth_outlook,
      rank: idx + 1,
    }));

    const { data } = await supabase
      .from('career_recommendations')
      .insert(newRecommendations)
      .select();

    if (data) {
      setRecommendations(data);
    }

    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Space_Grotesk'] mb-2">
            Career Overview
          </h1>
          <p className="text-[#E0E6ED] font-['Inter']">
            AI-powered career recommendations tailored to your profile
          </p>
        </div>

        <button
          onClick={handleGenerateRecommendations}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all disabled:opacity-50 font-['Inter']"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {recommendations.length > 0 ? 'Regenerate' : 'Generate'} Recommendations
            </>
          )}
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3B82F6]/20 to-[#9D4EDD]/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-[#3B82F6]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 font-['Space_Grotesk']">
            Ready to discover your career path?
          </h3>
          <p className="text-[#E0E6ED] mb-6 font-['Inter']">
            Click the button above to generate personalized career recommendations
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((career, idx) => (
            <div
              key={career.id}
              onClick={() => setSelectedCareer(career)}
              className="p-6 bg-[#161B22] rounded-2xl border border-[#3B82F6]/20 hover:border-[#3B82F6]/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-[#3B82F6]/10 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded-full text-xs font-semibold font-['Inter']">
                      #{idx + 1}
                    </span>
                    <span className="px-3 py-1 bg-[#00C896]/20 text-[#00C896] rounded-full text-xs font-semibold font-['Inter']">
                      {career.confidence_score}% Match
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-['Space_Grotesk'] group-hover:text-[#3B82F6] transition-colors">
                    {career.career_title}
                  </h3>
                  <p className="text-[#E0E6ED] text-sm mb-4 font-['Inter'] leading-relaxed">
                    {career.summary}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-[#00C896]" />
                  <span className="text-[#E0E6ED] font-['Inter']">{career.salary_range}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-[#E0E6ED] font-['Inter']">{career.market_demand}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="w-4 h-4 text-[#9D4EDD]" />
                  <span className="text-[#E0E6ED] font-['Inter']">{career.growth_outlook}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-[#4A5568] mb-2 font-['Inter']">Key Skills Required:</p>
                <div className="flex flex-wrap gap-2">
                  {career.required_skills.slice(0, 4).map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[#0D1117] text-[#E0E6ED] rounded text-xs font-['Inter']"
                    >
                      {skill}
                    </span>
                  ))}
                  {career.required_skills.length > 4 && (
                    <span className="px-2 py-1 text-[#4A5568] text-xs font-['Inter']">
                      +{career.required_skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#161B22] rounded-2xl border border-[#3B82F6]/20 shadow-2xl shadow-[#3B82F6]/10 animate-slideUp max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#161B22] z-10">
              <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
                {selectedCareer.career_title}
              </h2>
              <button
                onClick={() => setSelectedCareer(null)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <span className="text-2xl text-[#E0E6ED]">×</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 font-['Space_Grotesk']">Overview</h3>
                <p className="text-[#E0E6ED] font-['Inter'] leading-relaxed">{selectedCareer.summary}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3 font-['Space_Grotesk']">Career Insights</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-[#0D1117] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-5 h-5 text-[#00C896]" />
                      <span className="text-sm font-semibold text-[#E0E6ED] font-['Inter']">Salary Range</span>
                    </div>
                    <p className="text-white font-['Inter']">{selectedCareer.salary_range}</p>
                  </div>

                  <div className="p-4 bg-[#0D1117] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
                      <span className="text-sm font-semibold text-[#E0E6ED] font-['Inter']">Market Demand</span>
                    </div>
                    <p className="text-white font-['Inter']">{selectedCareer.market_demand}</p>
                  </div>

                  <div className="p-4 bg-[#0D1117] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-5 h-5 text-[#9D4EDD]" />
                      <span className="text-sm font-semibold text-[#E0E6ED] font-['Inter']">Growth Outlook</span>
                    </div>
                    <p className="text-white font-['Inter']">{selectedCareer.growth_outlook}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3 font-['Space_Grotesk']">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.required_skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-[#0D1117] text-[#E0E6ED] rounded-lg text-sm font-['Inter'] border border-[#3B82F6]/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
