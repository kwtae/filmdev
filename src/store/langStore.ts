import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const translations = {
  en: {
    home: "Home",
    timer: "Timer",
    options: "Options",
    wiki: "Wiki",
    myRecipes: "My Recipes",
    new: "New",
    noRecipes: "No recipes found in your database.",
    loadPreset: "Load Preset Data",
    precheck: "PRE-CHECK",
    skipStep: "Skip Step ⏭",
    startProcess: "Begin Process",
    devTemp: "Developer Temp",
    filmLoaded: "Film Loaded & Tank Sealed",
    ensureVolume: "Ensure Not Silent Mode",
    noSession: "No Active Session",
    goRoot: "Go Root",
    processFinished: "Process Finished",
    safelyOpen: "Safely open the tank.",
    completeSave: "Complete & Save Log",
    instruction: "Instruction",
    upNext: "Up Next",
    finalStage: "Final Stage",
    totalSteps: "Total Steps",
    settings: "Settings & Data",
    dataManagement: "Data Management",
    exportBackup: "Export Backup (.json)",
    importBackup: "Import Backup",
    clearDb: "Clear Database"
  },
  ko: {
    home: "홈",
    timer: "타이머",
    options: "설정",
    wiki: "위키",
    myRecipes: "내 레시피",
    new: "새 만들기",
    noRecipes: "저장된 레시피가 없습니다.",
    loadPreset: "초기 데이터 로드",
    precheck: "사전 체크리스트",
    skipStep: "단계 건너뛰기 ⏭",
    startProcess: "프로세스 시작",
    devTemp: "현상액 목표 온도",
    filmLoaded: "장전 및 밀폐 완료",
    ensureVolume: "무음/진동 해제",
    noSession: "진행 중인 작업 없음",
    goRoot: "홈으로 이동",
    processFinished: "프로세스 종료됨",
    safelyOpen: "탱크를 안전하게 개방하십시오.",
    completeSave: "완료 및 로그 저장",
    instruction: "현재 교반 지시",
    upNext: "다음 단계",
    finalStage: "마지막 단계입니다",
    totalSteps: "전체 단계 수",
    settings: "설정 및 백업",
    dataManagement: "데이터 관리",
    exportBackup: "백업 내보내기 (.json)",
    importBackup: "백업 불러오기",
    clearDb: "데이터베이스 초기화"
  }
};

type Lang = keyof typeof translations;

interface LangState {
  lang: Lang;
  toggleLang: () => void;
  t: (key: keyof typeof translations['en']) => string;
}

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: 'ko', // 기본값 한국어
      toggleLang: () => set((state) => ({ lang: state.lang === 'en' ? 'ko' : 'en' })),
      t: (key) => translations[get().lang][key] || translations['en'][key] || key,
    }),
    { name: 'filmdev-lang' }
  )
);
