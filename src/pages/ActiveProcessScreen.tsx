import { useEffect, useState, useRef } from 'react';
import { useTimerStore } from '../store/timerStore';
import { useLangStore } from '../store/langStore';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, AlertTriangle, BatteryWarning, FastForward } from 'lucide-react';

export default function ActiveProcessScreen() {
  const navigate = useNavigate();
  const t = useLangStore(s => s.t);
  const { 
    status, recipe, currentStepIndex, endTimeMs, remainingMs, liveSensorTemp,
    startTimer, pauseTimer, resumeTimer, nextStep, reset, setSensorTemp
  } = useTimerStore();
  
  const [displayRemaining, setDisplayRemaining] = useState(0);
  const [checks, setChecks] = useState([false, false, false, false]);
  const [postChecks, setPostChecks] = useState([false, false, false, false]);

  const rafRef = useRef<number | undefined>(undefined);
  const wakeLockRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastAgitationSecRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'RUNNING' && endTimeMs !== null) {
      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.max(0, endTimeMs - now);
        setDisplayRemaining(diff);
        
        if (recipe && currentStepIndex < recipe.steps.length) {
          const step = recipe.steps[currentStepIndex];
          if (step.agitation_interval_sec > 0) {
            const elapsedSec = Math.floor((step.duration_sec * 1000 - diff) / 1000);
            const isAgitationTick = elapsedSec > 0 && elapsedSec % step.agitation_interval_sec === 0;
            
            if (isAgitationTick && lastAgitationSecRef.current !== elapsedSec) {
              lastAgitationSecRef.current = elapsedSec;
              beep(600, 'square'); 
            }
          }
        }

        if (diff > 0) {
          rafRef.current = requestAnimationFrame(updateTimer);
        } else {
          beep(400, 'sine', 1.5); 
          lastAgitationSecRef.current = null;
          nextStep();
        }
      };
      rafRef.current = requestAnimationFrame(updateTimer);
    } else if (status === 'PAUSED' && remainingMs !== null) {
      setDisplayRemaining(remainingMs);
    } else if (status === 'PREP' && recipe) {
      setDisplayRemaining(recipe.steps[0].duration_sec * 1000);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [status, endTimeMs, remainingMs, nextStep, recipe, currentStepIndex]);

  const beep = (freq: number, type: OscillatorType, durSec: number = 0.5) => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    osc.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtxRef.current.currentTime + durSec);
    osc.stop(audioCtxRef.current.currentTime + durSec);
  };

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch (err: any) {
        console.warn(`${err.name}, ${err.message}`);
      }
    }
  };
  const handleAudioTest = () => {
    // Force init and resume inside user gesture
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    beep(500, 'sine', 0.2);
    setChecks([checks[0], checks[1], true, checks[3]]);
  };
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) wakeLockRef.current.release().then(() => { wakeLockRef.current = null; });
    };
  }, []);

  const connectBLESensor = async () => {
    try {
      if (!('bluetooth' in navigator)) throw new Error('Web Bluetooth API not supported');
      const device = await (navigator as any).bluetooth.requestDevice({ acceptAllDevices: true });
      // Stub: Subscribe to GATT Health Thermometer char here.
      // Simulating connected sensor returning temp around target.
      alert(`Connected to device: ${device.name || 'Sensor'}`);
      setSensorTemp((recipe?.base_temp_c || 20) + 0.2); 
    } catch (e: any) {
      alert("Bluetooth connection failed or skipped: " + e.message);
      // Fallback emulation for dev
      setSensorTemp(recipe?.base_temp_c || 20);
    }
  };

  const handleStartProcess = async () => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    await requestWakeLock();
    startTimer();
  };

  const handleAreaTap = () => {
    if (status === 'RUNNING') pauseTimer(displayRemaining);
    else if (status === 'PAUSED') resumeTimer();
  };

  const handleSkipStep = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering the background tap pause
    beep(400, 'sine', 1.0); // signal step finish earlier
    lastAgitationSecRef.current = null;
    nextStep();
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--text-secondary)] h-full gap-4">
        <AlertTriangle size={64} className="opacity-40 text-[var(--danger)]" />
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{t('noSession')}</h2>
        <button className="btn btn-secondary mt-4 w-full" onClick={() => navigate('/')}>{t('goRoot')}</button>
      </div>
    );
  }

  if (status === 'PREP') {
    return (
      <div className="p-4 flex flex-col h-full gap-4 pb-20 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h2 className="text-2xl font-bold tracking-tighter text-[var(--text-primary)]">{t('precheck')}</h2>
          <span className="text-xs bg-[var(--bg-secondary)] py-1 px-2 rounded font-mono border border-[var(--border)]">
            {t('totalSteps')}: {recipe.steps.length}
          </span>
        </div>
        
        <div className="flex flex-col gap-3 my-4 flex-1 justify-center">
          <label className="card flex items-center justify-between cursor-pointer border-[var(--border)] transition-colors">
            <span className="font-medium text-[var(--text-secondary)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-xs font-bold border border-[var(--border)]">1</span>
              {t('devTemp')} ~ {recipe.base_temp_c}°C 
              {liveSensorTemp !== null && <span className="ml-2 text-[var(--danger)] animate-pulse">({liveSensorTemp.toFixed(1)}°C)</span>}
            </span>
            <div className="flex items-center gap-3">
              <button onClick={(e) => { e.preventDefault(); connectBLESensor(); }} className="text-[10px] font-bold uppercase border text-[var(--accent)] border-[var(--accent)] px-2 py-1 rounded">Read BLE</button>
              <input type="checkbox" className="w-8 h-8 rounded accent-[var(--success)]" 
                checked={checks[0]} onChange={(e) => setChecks([e.target.checked, checks[1], checks[2], checks[3]])} />
            </div>
          </label>

          <label className="card flex items-center justify-between cursor-pointer border-[var(--border)] transition-colors">
            <span className="font-medium text-[var(--text-secondary)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-xs font-bold border border-[var(--border)]">2</span>
              {t('filmLoaded')}
            </span>
            <input type="checkbox" className="w-8 h-8 rounded accent-[var(--success)]" 
              checked={checks[1]} onChange={(e) => setChecks([checks[0], e.target.checked, checks[2], checks[3]])} />
          </label>

          <div className="card flex items-center justify-between border-[var(--border)]">
            <span className="font-medium text-[var(--text-secondary)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-xs font-bold border border-[var(--border)]">3</span>
              <BatteryWarning className="text-[var(--danger)] shrink-0" size={16} /> Volume & Audio
            </span>
            <div className="flex items-center gap-3">
              <button onClick={handleAudioTest} className="text-[10px] font-bold uppercase bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] px-2 py-1 rounded active:scale-95">Test Ping</button>
              <input type="checkbox" className="w-8 h-8 rounded accent-[var(--success)]" 
                checked={checks[2]} onChange={(e) => setChecks([checks[0], checks[1], e.target.checked, checks[3]])} />
            </div>
          </div>

          <label className="card flex items-center justify-between cursor-pointer border-[var(--border)] transition-colors">
            <span className="font-medium text-[var(--text-secondary)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-xs font-bold border border-[var(--border)]">4</span>
              Stop & Fix Chemistry Ready
            </span>
            <input type="checkbox" className="w-8 h-8 rounded accent-[var(--success)]" 
              checked={checks[3]} onChange={(e) => setChecks([checks[0], checks[1], checks[2], e.target.checked])} />
          </label>
        </div>

        <button 
          disabled={!checks.every(Boolean)}
          onClick={handleStartProcess}
          className="btn btn-primary h-16 shadow-lg text-xl disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-secondary)] disabled:opacity-50 mt-auto"
        >
          {t('startProcess')}
        </button>
      </div>
    );
  }

  if (status === 'FINISHED') {
    return (
      <div className="flex items-center flex-col p-6 h-full gap-4 pb-20 overflow-y-auto">
        <div className="text-[var(--success)] w-24 h-24 mt-4 shrink-0 rounded-full border-4 border-current flex items-center justify-center animate-in zoom-in spin-in-180">
          <CheckCircle size={48} fill="currentColor" className="text-[var(--bg-primary)]" />
        </div>
        
        <div className="text-center shrink-0">
          <h2 className="text-3xl font-black tracking-tighter">{t('processFinished')}</h2>
          <p className="opacity-75 text-sm mt-1">{t('safelyOpen')}</p>
        </div>

        <div className="w-full flex-1 flex flex-col gap-3 my-4">
          <h3 className="font-bold border-b border-[var(--border)] pb-2 mb-2 text-sm text-[var(--accent)] uppercase tracking-wider">Post-Process Cleanup</h3>
          
          <label className="card flex items-center justify-between cursor-pointer border-[var(--border)] transition-colors">
            <span className="font-medium text-sm text-[var(--text-secondary)]">1. Wash & Rinse Film (Photo-Flo)</span>
            <input type="checkbox" className="w-8 h-8 rounded accent-[var(--success)]" 
              checked={postChecks[0]} onChange={(e) => setPostChecks([e.target.checked, postChecks[1], postChecks[2], postChecks[3]])} />
          </label>
          <label className="card flex items-center justify-between cursor-pointer border-[var(--border)] transition-colors">
            <span className="font-medium text-sm text-[var(--text-secondary)]">2. Squeegee & Hang correctly</span>
            <input type="checkbox" className="w-8 h-8 rounded accent-[var(--success)]" 
              checked={postChecks[1]} onChange={(e) => setPostChecks([postChecks[0], e.target.checked, postChecks[2], postChecks[3]])} />
          </label>
          <label className="card flex items-center justify-between cursor-pointer border-[var(--border)] transition-colors">
            <span className="font-medium text-sm text-[var(--text-secondary)]">3. Store/Dispose Used Chemicals</span>
            <input type="checkbox" className="w-8 h-8 rounded accent-[var(--success)]" 
              checked={postChecks[2]} onChange={(e) => setPostChecks([postChecks[0], postChecks[1], e.target.checked, postChecks[3]])} />
          </label>
          <label className="card flex items-center justify-between cursor-pointer border-[var(--border)] transition-colors">
            <span className="font-medium text-sm text-[var(--text-secondary)]">4. Wash Reels, Tank, and Thermometer</span>
            <input type="checkbox" className="w-8 h-8 rounded accent-[var(--success)]" 
              checked={postChecks[3]} onChange={(e) => setPostChecks([postChecks[0], postChecks[1], postChecks[2], e.target.checked])} />
          </label>
        </div>

        <button 
          disabled={!postChecks.every(Boolean)}
          className="btn btn-secondary mt-auto w-full shadow-lg h-16 text-lg disabled:opacity-50 disabled:bg-[var(--bg-secondary)]" 
          onClick={() => { reset(); navigate('/'); }}
        >
          {t('completeSave')}
        </button>
      </div>
    );
  }

  const currentStep = recipe.steps[currentStepIndex];
  const mins = Math.floor(displayRemaining / 1000 / 60).toString().padStart(2, '0');
  const secs = Math.floor((displayRemaining / 1000) % 60).toString().padStart(2, '0');

  const upcomingSteps = recipe.steps.slice(currentStepIndex + 1, currentStepIndex + 3);

  return (
    <div className="relative flex flex-col h-full bg-[var(--bg-primary)] select-none">
      
      <div 
        className="absolute inset-0 z-10 w-full h-[60vh] mt-[20vh] cursor-pointer touch-none"
        onClick={handleAreaTap}
        aria-label="Play or Pause Space"
      />

      <div className="flex flex-col flex-1 pb-16 justify-between text-center relative pointer-events-none">
        
        {/* Top Header & Skip Action */}
        <div className="pt-6 px-4 flex justify-between items-start pointer-events-auto z-20">
           <div className="text-left">
             <div className="inline-block relative">
               <h2 className="text-4xl font-bold tracking-tighter text-[var(--accent)] uppercase">{currentStep.name}</h2>
               {status === 'PAUSED' && <span className="absolute -right-8 -top-8 bg-[var(--danger)] text-white px-2 py-1 text-xs font-bold rounded animate-pulse shadow-xl shadow-[var(--danger)]">PAUSED</span>}
             </div>
             <p className="text-[var(--text-secondary)] mt-1 font-mono uppercase text-sm tracking-widest">Step {currentStepIndex + 1} of {recipe.steps.length}</p>
           </div>
           {/* Skip Step Button */}
           <button onClick={handleSkipStep} className="btn border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm font-bold opacity-75 hover:opacity-100 flex gap-2 items-center">
             <FastForward size={16}/> {t('skipStep')}
           </button>
        </div>

        <div className="w-full relative flex items-center justify-center py-6 sm:py-12 bg-[var(--bg-secondary)] border-y border-[var(--border)] font-mono drop-shadow-2xl">
          <span className="text-[25vw] sm:text-[12rem] leading-none font-black tracking-tighter text-[var(--text-primary)]">
            {mins}:{secs}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-4">
          <div className="text-sm border border-[var(--border)] px-4 py-3 rounded-xl bg-[var(--bg-secondary)] inline-flex flex-col gap-1 items-center shadow-inner mt-4 pointer-events-auto">
             <span className="opacity-70 font-semibold uppercase tracking-wider text-[10px] text-[var(--text-secondary)]">{t('instruction')}</span>
             <span className="font-bold text-lg leading-tight uppercase text-[var(--text-primary)]">
               {currentStep.agitation_interval_sec > 0 
                ? `${currentStep.agitation_type} ${currentStep.agitation_duration_sec}s per ${currentStep.agitation_interval_sec}s`
                : "No Agitation"}
             </span>
          </div>
        </div>

        <div className="border-t border-[var(--border)] w-full py-4 bg-[var(--bg-secondary)]/50 pointer-events-auto mt-auto">
          <div className="flex items-center px-4 justify-between w-full opacity-60">
            <span className="text-sm font-bold uppercase tracking-wider">{t('upNext')}</span>
            <ChevronRight size={18} />
          </div>
          {upcomingSteps.length > 0 ? (
            <div className="flex gap-2 px-4 mt-2 overflow-x-hidden opacity-75 grayscale sepia-0">
               {upcomingSteps.map((s, idx) => (
                 <div key={idx} className="bg-[var(--bg-primary)] border border-[var(--border)] flex-1 p-2 rounded truncate text-left">
                   <div className="text-xs uppercase font-bold text-[var(--text-primary)] block truncate">{s.name}</div>
                   <div className="text-[10px] font-mono text-[var(--text-secondary)]">{Math.floor(s.duration_sec / 60)}m {s.duration_sec % 60}s</div>
                 </div>
               ))}
            </div>
          ) : (
            <div className="px-4 text-left mt-2 block w-full">
              <span className="opacity-50 text-xs uppercase font-bold">{t('finalStage')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
