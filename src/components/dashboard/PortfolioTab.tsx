import { useState, useEffect } from 'react';
import { Plus, FileText, Award, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database';

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'];

export default function PortfolioTab() {
  const { user } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemType, setItemType] = useState<'project' | 'certification'>('project');

  useEffect(() => {
    loadItems();
  }, [user]);

  const loadItems = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setItems(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('portfolio_items').delete().eq('id', id);
    loadItems();
  };

  const projects = items.filter(item => item.type === 'project');
  const certifications = items.filter(item => item.type === 'certification');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Space_Grotesk'] mb-2">
            Portfolio & Certifications
          </h1>
          <p className="text-[#E0E6ED] font-['Inter']">
            Showcase your projects and professional achievements
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all font-['Inter']"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4 font-['Space_Grotesk'] flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#3B82F6]" />
          Projects ({projects.length})
        </h2>
        {projects.length === 0 ? (
          <div className="p-12 bg-[#161B22] rounded-2xl border border-white/10 text-center">
            <p className="text-[#E0E6ED] font-['Inter']">No projects yet. Add your first project to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <div
                key={project.id}
                className="p-6 bg-[#161B22] rounded-2xl border border-[#3B82F6]/20 hover:border-[#3B82F6]/50 transition-all hover:shadow-xl hover:shadow-[#3B82F6]/10 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#3B82F6] transition-colors">
                    {project.title}
                  </h3>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-[#FF6F61] hover:bg-[#FF6F61]/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[#E0E6ED] mb-4 font-['Inter'] leading-relaxed">
                  {project.description}
                </p>

                {project.skills_used.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-[#4A5568] mb-2 font-['Inter']">Technologies Used:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.skills_used.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#0D1117] text-[#E0E6ED] rounded text-xs font-['Inter']"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.file_url && (
                  <a
                    href={project.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#3B82F6] hover:text-[#9D4EDD] transition-colors text-sm font-['Inter']"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Project
                  </a>
                )}

                {project.ai_feedback && (
                  <div className="mt-4 p-3 bg-[#0D1117] rounded-lg border border-[#9D4EDD]/20">
                    <p className="text-xs text-[#9D4EDD] mb-1 font-['Inter'] font-semibold">AI Feedback:</p>
                    <p className="text-sm text-[#E0E6ED] font-['Inter']">{project.ai_feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4 font-['Space_Grotesk'] flex items-center gap-2">
          <Award className="w-6 h-6 text-[#9D4EDD]" />
          Certifications ({certifications.length})
        </h2>
        {certifications.length === 0 ? (
          <div className="p-12 bg-[#161B22] rounded-2xl border border-white/10 text-center">
            <p className="text-[#E0E6ED] font-['Inter']">No certifications yet. Add your achievements!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map(cert => (
              <div
                key={cert.id}
                className="p-6 bg-[#161B22] rounded-2xl border border-[#9D4EDD]/20 hover:border-[#9D4EDD]/50 transition-all hover:shadow-xl hover:shadow-[#9D4EDD]/10 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#9D4EDD] transition-colors">
                    {cert.title}
                  </h3>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-2 text-[#FF6F61] hover:bg-[#FF6F61]/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[#E0E6ED] mb-4 font-['Inter'] leading-relaxed">
                  {cert.description}
                </p>

                {cert.file_url && (
                  <a
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#9D4EDD] hover:text-[#3B82F6] transition-colors text-sm font-['Inter']"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadItems();
          }}
        />
      )}
    </div>
  );
}

function AddItemModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { user } = useAuth();
  const [type, setType] = useState<'project' | 'certification'>('project');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { error } = await supabase.from('portfolio_items').insert({
      user_id: user.id,
      type,
      title,
      description,
      file_url: fileUrl || null,
      skills_used: skills.split(',').map(s => s.trim()).filter(Boolean),
    });

    setLoading(false);

    if (!error) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#161B22] rounded-2xl border border-[#3B82F6]/20 shadow-2xl shadow-[#3B82F6]/10 animate-slideUp">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Add {type === 'project' ? 'Project' : 'Certification'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="text-2xl text-[#E0E6ED]">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('project')}
              className={`flex-1 px-4 py-2 rounded-lg transition-all font-['Inter'] ${
                type === 'project'
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white'
                  : 'bg-[#0D1117] text-[#E0E6ED] border border-white/10'
              }`}
            >
              Project
            </button>
            <button
              type="button"
              onClick={() => setType('certification')}
              className={`flex-1 px-4 py-2 rounded-lg transition-all font-['Inter'] ${
                type === 'certification'
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white'
                  : 'bg-[#0D1117] text-[#E0E6ED] border border-white/10'
              }`}
            >
              Certification
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter']">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
              placeholder={type === 'project' ? 'E-commerce Platform' : 'AWS Solutions Architect'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter']">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
              placeholder="Describe your project or certification..."
            />
          </div>

          {type === 'project' && (
            <div>
              <label className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter']">
                Skills/Technologies Used
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                placeholder="React, Node.js, PostgreSQL (comma separated)"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter']">
              Link/URL
            </label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
              placeholder="https://github.com/username/project"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-['Inter']"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Item'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
