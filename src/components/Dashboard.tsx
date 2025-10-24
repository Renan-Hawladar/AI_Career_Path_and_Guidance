import { useState, useEffect } from 'react';
import { LayoutDashboard, Map, Briefcase, MessageSquare, LogOut, Compass, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import OverviewTab from './dashboard/OverviewTab';
import RoadmapTab from './dashboard/RoadmapTab';
import PortfolioTab from './dashboard/PortfolioTab';
import ChatTab from './dashboard/ChatTab';

type TabType = 'overview' | 'roadmap' | 'portfolio' | 'chat';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { signOut, user } = useAuth();

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'roadmap' as TabType, label: 'Roadmap & Skills', icon: Map },
    { id: 'portfolio' as TabType, label: 'Portfolio & Certifications', icon: Briefcase },
    { id: 'chat' as TabType, label: 'Chat & Insights', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117]">
      <nav className="fixed top-0 w-full z-40 bg-[#161B22]/80 backdrop-blur-lg border-b border-white/5">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#9D4EDD] flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-['Space_Grotesk']">
                CareerCompass AI
              </span>
            </div>

            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-[#E0E6ED] hover:text-white hover:bg-white/5 rounded-lg transition-all font-['Inter']"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#161B22] border-r border-white/5 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} z-30`}>
          <div className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-['Inter'] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#3B82F6]/20 to-[#9D4EDD]/20 text-white border border-[#3B82F6]/30 shadow-lg shadow-[#3B82F6]/10'
                      : 'text-[#E0E6ED] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#3B82F6]' : ''}`} />
                  {sidebarOpen && <span>{tab.label}</span>}
                </button>
              );
            })}
          </div>
        </aside>

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="animate-fadeIn">
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'roadmap' && <RoadmapTab />}
              {activeTab === 'portfolio' && <PortfolioTab />}
              {activeTab === 'chat' && <ChatTab />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
