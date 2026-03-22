import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Beaker, Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { cn } from './lib/utils';
import HomeScreen from './pages/HomeScreen';
import SettingsScreen from './pages/SettingsScreen';
import ActiveProcessScreen from './pages/ActiveProcessScreen';
import { useTimerStore } from './store/timerStore';

function NavigationFooter() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActiveTimerProcessRunning = useTimerStore(s => s.status === 'RUNNING' || s.status === 'PAUSED');

  return (
    <footer className="shrink-0 border-t border-[var(--border)] p-4 flex justify-around items-center bg-[var(--bg-secondary)] pb-8 pt-4 touch-manipulation relative z-50 shadow-2xl">
      <button onClick={() => navigate('/')} className={cn("flex flex-col items-center gap-1 opacity-60 hover:opacity-100 active:scale-95 transition-all text-[var(--text-primary)]", location.pathname === '/' && "opacity-100 text-[var(--accent)]")}>
        <HomeIcon size={24} />
      </button>

      <button onClick={() => navigate('/timer')} className={cn("flex flex-col items-center gap-1 opacity-60 hover:opacity-100 active:scale-95 transition-all text-[var(--text-primary)]", location.pathname === '/timer' && "opacity-100 text-[var(--accent)]")}>
        <div className="relative">
          <Beaker size={24} />
          {isActiveTimerProcessRunning && <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--danger)] rounded-full animate-ping block shadow-[0_0_10px_var(--danger)]" />}
        </div>
      </button>

      <button onClick={() => navigate('/settings')} className={cn("flex flex-col items-center gap-1 opacity-60 hover:opacity-100 active:scale-95 transition-all text-[var(--text-primary)]", location.pathname === '/settings' && "opacity-100 text-[var(--accent)]")}>
        <SettingsIcon size={24} />
      </button>
    </footer>
  );
}

function AppLayout() {
  const [themeMode, setThemeMode] = useState<'dark' | 'safelight'>('dark');

  // Apply Safelight CSS theme variables at body level
  useEffect(() => {
    if (themeMode === 'safelight') {
      document.body.classList.add('theme-safelight');
    } else {
      document.body.classList.remove('theme-safelight');
    }
  }, [themeMode]);

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto relative overflow-hidden bg-[var(--bg-primary)] tracking-tight">
      
      {/* Top Header */}
      <header className="flex justify-between items-center p-4 border-b border-[var(--border)] shrink-0 bg-[var(--bg-primary)] z-50">
        <h1 className="font-bold text-xl tracking-tighter text-[var(--text-primary)] flex items-center gap-2">
          {themeMode === 'safelight' ? <span className="w-2 h-2 rounded-full bg-[var(--danger)] animate-pulse shadow-[0_0_10px_var(--danger)] block"></span> : null}
          FilmDev
        </h1>
        <button 
          onClick={() => setThemeMode(prev => prev === 'dark' ? 'safelight' : 'dark')}
          className={cn(
            "p-2 rounded-full border border-[var(--border)] transition-colors active:scale-90 bg-[var(--bg-secondary)] shadow-sm",
            themeMode === 'safelight' ? "text-[var(--danger)] border-[var(--danger-hover)]" : "text-[var(--text-secondary)] border-[var(--border)]"
          )}
        >
          {themeMode === 'safelight' ? <Moon size={20} fill="currentColor" /> : <Sun size={20} />}
        </button>
      </header>
      
      {/* Routes Context Window */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/timer" element={<ActiveProcessScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </main>

      <NavigationFooter />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/filmdev">
      <AppLayout />
    </BrowserRouter>
  );
}
