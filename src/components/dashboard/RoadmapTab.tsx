import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ExternalLink, BookOpen, Award, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateRoadmap, analyzeSkillGaps } from '../../lib/gemini';
import type { Database } from '../../types/database';

type RoadmapItem = Database['public']['Tables']['career_roadmaps']['Row'];
type SkillGap = Database['public']['Tables']['skill_gaps']['Row'];
type CareerRecommendation = Database['public']['Tables']['career_recommendations']['Row'];

export default function RoadmapTab() {
  const { user } = useAuth();
  const [careers, setCareers] = useState<CareerRecommendation[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadCareers();
  }, [user]);

  useEffect(() => {
    if (selectedCareer) {
      loadRoadmap();
      loadSkillGaps();
    }
  }, [selectedCareer]);

  const loadCareers = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('career_recommendations')
      .select('*')
      .eq('user_id', user.id)
      .order('rank', { ascending: true });

    if (data && data.length > 0) {
      setCareers(data);
      setSelectedCareer(data[0].id);
    }

    setLoading(false);
  };

  const loadRoadmap = async () => {
    if (!user || !selectedCareer) return;

    const { data } = await supabase
      .from('career_roadmaps')
      .select('*')
      .eq('user_id', user.id)
      .eq('career_id', selectedCareer)
      .order('order_index', { ascending: true });

    setRoadmapItems(data || []);
  };

  const loadSkillGaps = async () => {
    if (!user || !selectedCareer) return;

    const { data } = await supabase
      .from('skill_gaps')
      .select('*')
      .eq('user_id', user.id)
      .eq('career_id', selectedCareer);

    setSkillGaps(data || []);
  };

  const handleGenerateRoadmap = async () => {
    if (!user || !selectedCareer) return;

    setGenerating(true);

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const career = careers.find(c => c.id === selectedCareer);

    if (!profile || !career) {
      setGenerating(false);
      return;
    }

    const roadmap = await generateRoadmap(
      career.career_title,
      profile.skills,
      career.required_skills
    );

    const gaps = await analyzeSkillGaps(
      career.career_title,
      profile.skills,
      career.required_skills
    );

    await supabase.from('career_roadmaps').delete().eq('user_id', user.id).eq('career_id', selectedCareer);
    await supabase.from('skill_gaps').delete().eq('user_id', user.id).eq('career_id', selectedCareer);

    const newRoadmapItems = roadmap.map((item, idx) => ({
      user_id: user.id,
      career_id: selectedCareer,
      title: item.title,
      description: item.description,
      difficulty_level: item.difficulty_level,
      estimated_duration: item.estimated_duration,
      order_index: idx,
      resource_links: item.resource_links,
      certification_paths: item.certification_paths,
    }));

    const newSkillGaps = gaps.map(gap => ({
      user_id: user.id,
      career_id: selectedCareer,
      missing_skill: gap.missing_skill,
      importance: gap.importance,
      course_suggestions: gap.course_suggestions,
    }));

    await supabase.from('career_roadmaps').insert(newRoadmapItems);
    await supabase.from('skill_gaps').insert(newSkillGaps);

    await loadRoadmap();
    await loadSkillGaps();

    setGenerating(false);
  };

  const toggleComplete = async (itemId: string, completed: boolean) => {
    await supabase
      .from('career_roadmaps')
      .update({
        completed: !completed,
        completed_at: !completed ? new Date().toISOString() : null,
      })
      .eq('id', itemId);

    loadRoadmap();
  };

  const completedCount = roadmapItems.filter(item => item.completed).length;
  const progressPercent = roadmapItems.length > 0 ? (completedCount / roadmapItems.length) * 100 : 0;

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'text-[#00C896] bg-[#00C896]/20';
      case 'intermediate': return 'text-[#3B82F6] bg-[#3B82F6]/20';
      case 'advanced': return 'text-[#9D4EDD] bg-[#9D4EDD]/20';
      case 'expert': return 'text-[#FF6F61] bg-[#FF6F61]/20';
      default: return 'text-[#E0E6ED] bg-[#E0E6ED]/20';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case 'critical': return 'text-[#FF6F61] bg-[#FF6F61]/20';
      case 'high': return 'text-[#9D4EDD] bg-[#9D4EDD]/20';
      case 'medium': return 'text-[#3B82F6] bg-[#3B82F6]/20';
      case 'low': return 'text-[#00C896] bg-[#00C896]/20';
      default: return 'text-[#E0E6ED] bg-[#E0E6ED]/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  if (careers.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#E0E6ED] font-['Inter']">
          Generate career recommendations first to see your roadmap
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Space_Grotesk'] mb-2">
            Career Roadmap
          </h1>
          <p className="text-[#E0E6ED] font-['Inter']">
            Your personalized learning path with resources and milestones
          </p>
        </div>

        <button
          onClick={handleGenerateRoadmap}
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
              {roadmapItems.length > 0 ? 'Regenerate' : 'Generate'} Roadmap
            </>
          )}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {careers.map(career => (
          <button
            key={career.id}
            onClick={() => setSelectedCareer(career.id)}
            className={`px-4 py-2 rounded-lg transition-all font-['Inter'] ${
              selectedCareer === career.id
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white shadow-lg shadow-[#3B82F6]/30'
                : 'bg-[#161B22] text-[#E0E6ED] hover:bg-[#161B22]/80 border border-white/10'
            }`}
          >
            {career.career_title}
          </button>
        ))}
      </div>

      {roadmapItems.length > 0 && (
        <div className="p-6 bg-[#161B22] rounded-2xl border border-[#3B82F6]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white font-['Space_Grotesk']">
              Progress: {completedCount} / {roadmapItems.length}
            </h3>
            <span className="text-[#3B82F6] font-semibold font-['Inter']">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full h-3 bg-[#0D1117] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3B82F6] to-[#00C896] transition-all duration-500 rounded-full shadow-lg shadow-[#3B82F6]/30"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {skillGaps.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 font-['Space_Grotesk']">
            Skill Gap Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillGaps.map(gap => (
              <div
                key={gap.id}
                className="p-4 bg-[#161B22] rounded-xl border border-[#FF6F61]/20 hover:border-[#FF6F61]/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white font-['Space_Grotesk']">
                    {gap.missing_skill}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold font-['Inter'] ${getImportanceColor(gap.importance)}`}>
                    {gap.importance}
                  </span>
                </div>
                <div className="space-y-2">
                  {Array.isArray(gap.course_suggestions) && gap.course_suggestions.slice(0, 2).map((course: any, idx: number) => (
                    <a
                      key={idx}
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 bg-[#0D1117] rounded-lg hover:bg-[#0D1117]/80 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                        <span className="text-sm text-[#E0E6ED] font-['Inter']">
                          {course.title}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#4A5568] group-hover:text-[#3B82F6] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {roadmapItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 font-['Space_Grotesk']">
            Learning Milestones
          </h2>
          <div className="space-y-4">
            {roadmapItems.map((item, idx) => (
              <div
                key={item.id}
                className={`p-6 bg-[#161B22] rounded-2xl border transition-all ${
                  item.completed
                    ? 'border-[#00C896]/50 opacity-75'
                    : 'border-[#3B82F6]/20 hover:border-[#3B82F6]/50 hover:shadow-xl hover:shadow-[#3B82F6]/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(item.id, item.completed)}
                    className="flex-shrink-0 mt-1"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-[#00C896]" />
                    ) : (
                      <Circle className="w-6 h-6 text-[#4A5568] hover:text-[#3B82F6] transition-colors" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-xl font-bold font-['Space_Grotesk'] ${item.completed ? 'text-[#4A5568] line-through' : 'text-white'}`}>
                        {idx + 1}. {item.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold font-['Inter'] ${getDifficultyColor(item.difficulty_level)}`}>
                          {item.difficulty_level}
                        </span>
                        <span className="px-3 py-1 bg-[#0D1117] text-[#E0E6ED] rounded-full text-xs font-semibold font-['Inter']">
                          {item.estimated_duration}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#E0E6ED] mb-4 font-['Inter'] leading-relaxed">
                      {item.description}
                    </p>

                    {Array.isArray(item.resource_links) && item.resource_links.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-semibold text-[#E0E6ED] font-['Inter']">Resources:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {item.resource_links.map((resource: any, i: number) => (
                            <a
                              key={i}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-[#0D1117] rounded-lg hover:bg-[#0D1117]/80 transition-colors group"
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                                <div>
                                  <p className="text-sm text-[#E0E6ED] font-['Inter']">{resource.title}</p>
                                  <p className="text-xs text-[#4A5568] font-['Inter']">{resource.type}</p>
                                </div>
                              </div>
                              <ExternalLink className="w-4 h-4 text-[#4A5568] group-hover:text-[#3B82F6] transition-colors" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.certification_paths.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-[#E0E6ED] mb-2 font-['Inter'] flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#9D4EDD]" />
                          Relevant Certifications:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.certification_paths.map((cert, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-[#9D4EDD]/20 text-[#9D4EDD] rounded-lg text-sm font-['Inter']"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {roadmapItems.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3B82F6]/20 to-[#9D4EDD]/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-[#3B82F6]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 font-['Space_Grotesk']">
            Ready to build your roadmap?
          </h3>
          <p className="text-[#E0E6ED] font-['Inter']">
            Click the button above to generate a personalized learning path
          </p>
        </div>
      )}
    </div>
  );
}
