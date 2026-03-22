import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe } from '../db/db';

type TimerStateStatus = 'IDLE' | 'PREP' | 'RUNNING' | 'PAUSED' | 'FINISHED';

interface TimerStoreState {
  status: TimerStateStatus;
  recipe: Recipe | null;
  currentStepIndex: number;
  endTimeMs: number | null; 
  remainingMs: number | null; 
  agitationMisses: number;
  liveSensorTemp: number | null; // BLE Temperature probe monitoring
  
  startPrep: (recipe: Recipe) => void;
  startTimer: () => void;
  pauseTimer: (currentRemainingMs: number) => void;
  resumeTimer: () => void;
  nextStep: () => void;
  reset: () => void;
  registerMissedAgitation: () => void;
  setSensorTemp: (temp: number | null) => void;
}

export const useTimerStore = create<TimerStoreState>()(
  persist(
    (set, get) => ({
      status: 'IDLE',
      recipe: null,
      currentStepIndex: 0,
      endTimeMs: null,
      remainingMs: null,
      agitationMisses: 0,
      liveSensorTemp: null,

      startPrep: (recipe) => set({ status: 'PREP', recipe, currentStepIndex: 0, agitationMisses: 0, liveSensorTemp: null }),
      startTimer: () => {
        const state = get();
        if (!state.recipe || state.status !== 'PREP') return;
        const currentDuration = state.recipe.steps[state.currentStepIndex].duration_sec * 1000;
        set({ 
          status: 'RUNNING', 
          endTimeMs: Date.now() + currentDuration,
          remainingMs: currentDuration
        });
      },
      pauseTimer: (currentRemainingMs: number) => set({
        status: 'PAUSED',
        remainingMs: currentRemainingMs,
        endTimeMs: null
      }),
      resumeTimer: () => {
        const state = get();
        if (state.status !== 'PAUSED' || state.remainingMs === null) return;
        set({
          status: 'RUNNING',
          endTimeMs: Date.now() + state.remainingMs
        });
      },
      nextStep: () => {
        const state = get();
        if (!state.recipe) return;
        if (state.currentStepIndex + 1 < state.recipe.steps.length) {
          const nextIdx = state.currentStepIndex + 1;
          const nextDuration = state.recipe.steps[nextIdx].duration_sec * 1000;
          set({
            status: 'RUNNING',
            currentStepIndex: nextIdx,
            endTimeMs: Date.now() + nextDuration,
            remainingMs: nextDuration,
          });
        } else {
          set({ status: 'FINISHED', endTimeMs: null, remainingMs: null });
        }
      },
      reset: () => set({ 
        status: 'IDLE', recipe: null, currentStepIndex: 0, 
        endTimeMs: null, remainingMs: null, agitationMisses: 0, liveSensorTemp: null 
      }),
      registerMissedAgitation: () => set((state) => ({ agitationMisses: state.agitationMisses + 1 })),
      setSensorTemp: (temp) => set({ liveSensorTemp: temp })
    }),
    {
      name: 'film-dev-timer-storage',
      partialize: (state) => ({
        status: state.status,
        recipe: state.recipe,
        currentStepIndex: state.currentStepIndex,
        endTimeMs: state.endTimeMs,
        remainingMs: state.remainingMs,
        agitationMisses: state.agitationMisses
      })
    }
  )
);
