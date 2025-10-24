import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    checkProfile();
  }, [user]);

  const checkProfile = async () => {
    if (!user) {
      setCheckingProfile(false);
      return;
    }

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    setHasProfile(!!data && !!data.skills?.length && !!data.goals);
    setCheckingProfile(false);
  };

  if (authLoading || checkingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  if (!hasProfile) {
    return <ProfileSetup onComplete={() => setHasProfile(true)} />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
