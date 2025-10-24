import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { chatWithAI } from '../../lib/gemini';
import type { Database } from '../../types/database';

type ChatMessage = Database['public']['Tables']['chat_history']['Row'];

export default function ChatTab() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    setMessages(data || []);
    setInitialLoad(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    await supabase.from('chat_history').insert({
      user_id: user.id,
      message: userMessage,
      role: 'user',
    });

    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      message: msg.message,
    }));

    const aiResponse = await chatWithAI(userMessage, conversationHistory);

    await supabase.from('chat_history').insert({
      user_id: user.id,
      message: aiResponse,
      role: 'assistant',
    });

    await loadChatHistory();
    setLoading(false);
  };

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white font-['Space_Grotesk'] mb-2">
          AI Career Mentor
        </h1>
        <p className="text-[#E0E6ED] font-['Inter']">
          Get personalized career guidance and mentorship from your AI assistant
        </p>
      </div>

      <div className="flex-1 bg-[#161B22] rounded-2xl border border-[#3B82F6]/20 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3B82F6]/20 to-[#9D4EDD]/20 flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-10 h-10 text-[#3B82F6]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-['Space_Grotesk']">
                  Start Your Career Conversation
                </h3>
                <p className="text-[#E0E6ED] mb-6 font-['Inter']">
                  Ask me anything about career paths, skill development, job searching, or professional growth!
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setInput("What skills should I focus on for my career?")}
                    className="w-full px-4 py-2 bg-[#0D1117] text-[#E0E6ED] rounded-lg hover:bg-[#0D1117]/80 transition-all text-sm font-['Inter']"
                  >
                    What skills should I focus on for my career?
                  </button>
                  <button
                    onClick={() => setInput("How can I prepare for a career transition?")}
                    className="w-full px-4 py-2 bg-[#0D1117] text-[#E0E6ED] rounded-lg hover:bg-[#0D1117]/80 transition-all text-sm font-['Inter']"
                  >
                    How can I prepare for a career transition?
                  </button>
                  <button
                    onClick={() => setInput("What are the current trends in tech careers?")}
                    className="w-full px-4 py-2 bg-[#0D1117] text-[#E0E6ED] rounded-lg hover:bg-[#0D1117]/80 transition-all text-sm font-['Inter']"
                  >
                    What are the current trends in tech careers?
                  </button>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fadeIn ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#9D4EDD] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl font-['Inter'] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white shadow-lg shadow-[#3B82F6]/20'
                      : 'bg-[#0D1117] text-[#E0E6ED] border border-white/10'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.message}</p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-[#0D1117] border border-white/10 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-[#E0E6ED]" />
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3 animate-fadeIn">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#9D4EDD] flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="px-4 py-3 bg-[#0D1117] rounded-2xl border border-white/10">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-white/5">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask me about your career..."
              className="flex-1 px-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all disabled:opacity-50 font-['Inter']"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-['Inter']"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
