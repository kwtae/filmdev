import React, { useState } from 'react';
import { BookOpen, Calculator, Beaker } from 'lucide-react';
import { useLangStore } from '../store/langStore';

const tipsDB = [
  { id: 1, title: 'Push Processing (+1 Stop)', content: '감도를 1스탑 높여 촬영한 경우 현상 시간을 기본 시간 대비 약 1.5배(50%) 증가시킵니다. 입자가 거칠어지고 콘트라스트가 강해지는 특징이 있습니다.' },
  { id: 2, title: 'Stand Development (조용 현상)', content: 'Rodinal 등의 약품을 1:100의 극단적인 비율로 희석한 뒤, 최소 1시간 이상 놔두며 교반을 전혀 하지 않거나 초반 1회만 실시합니다. 경계면 강조 효과(Edge Effect)를 얻을 수 있습니다.' },
  { id: 3, title: 'Fixer (정착액) 관리법', content: '필름의 은 입자를 완전히 제거하기 위한 단계. 정착이 덜 되면 필름 베이스가 보라색이나 탁한 막이 씌워진 채로 나옵니다. 사용 횟수에 따라 시간이 늘어나므로 보통 재사용 시 1회당 10% 시간을 늘려줍니다.' },
  { id: 4, title: 'Safelight 안전등 가이드', content: '흑백 필름(Panchromatic)은 모든 빛에 반응하므로 암백(Darkbag) 밖에서 절대 꺼내면 안 됩니다! 오직 인화지(Paper) 과정에서만 붉은색 안전등(Safelight) 아래에서 작업이 가능합니다.' },
  { id: 5, title: 'Stop Bath (정지액) 대용', content: '급할 경우 정지액 대신 약산성인 식초희석액이나 물 100% (수세정지)로 대체할 수 있으나, 이 경우 물로 교반하며 온도를 일정하게 맞추어 씻어내는 시간을 다소 확보해야 합니다.' }
];

export default function WikiScreen() {
  const t = useLangStore(s => s.t);
  const [baseMin, setBaseMin] = useState(10);
  const [baseSec, setBaseSec] = useState(0);
  const [baseTemp, setBaseTemp] = useState(20);
  const [targetTemp, setTargetTemp] = useState(22);

  // t2 = t1 * exp(0.081 * (T1 - T2)) - Standard basic B&W compensation model.
  const calculateCompensation = () => {
    const totalSecs = (baseMin * 60) + baseSec;
    const compensatedSecs = totalSecs * Math.exp(0.081 * (baseTemp - targetTemp));
    
    const newMin = Math.floor(compensatedSecs / 60);
    const newSec = Math.floor(compensatedSecs % 60);
    return { newMin, newSec, diffSecs: Math.round(compensatedSecs - totalSecs) };
  };

  const result = calculateCompensation();

  return (
    <div className="p-4 flex flex-col gap-6 pb-24 text-[var(--text-primary)] h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-2 border-b border-[var(--border)] pb-4">
        <BookOpen className="text-[var(--accent)]" size={24} />
        <h2 className="text-2xl font-bold tracking-tighter uppercase">Knowledge Wiki</h2>
      </div>
      
      {/* 동적 온도 보상 계산기 */}
      <div className="card border-[var(--accent)] bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Calculator size={120} />
        </div>
        <h3 className="font-bold border-b border-[var(--border)] pb-2 mb-3 flex items-center gap-2 relative z-10"><Beaker size={18}/> Dynamic Time/Temp Calculator</h3>
        
        <div className="grid grid-cols-2 gap-4 relative z-10 mb-4">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Base Time (Min:Sec)</span>
            <div className="flex gap-2">
              <input type="number" value={baseMin} onChange={e => setBaseMin(Number(e.target.value))} className="w-full text-center p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono" />
              <input type="number" value={baseSec} onChange={e => setBaseSec(Number(e.target.value))} className="w-full text-center p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono" />
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Base Temp (°C)</span>
            <input type="number" step="0.5" value={baseTemp} onChange={e => setBaseTemp(Number(e.target.value))} className="w-full text-center p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono" />
          </label>
          <label className="flex flex-col gap-1 col-span-2 mt-2">
            <span className="text-[10px] uppercase font-bold text-[var(--accent)]">Actual Chemistry Temp (°C)</span>
            <div className="flex items-center gap-4">
              <input type="range" min="15" max="30" step="0.5" value={targetTemp} onChange={e => setTargetTemp(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--border)] accent-[var(--accent)]" />
              <span className="font-black text-xl w-16 text-right text-[var(--accent)]">{targetTemp}°C</span>
            </div>
          </label>
        </div>

        <div className="bg-[var(--bg-primary)] p-4 rounded-lg flex justify-between items-center border border-[var(--accent)]/30 relative z-10 font-mono">
          <div className="flex flex-col">
            <span className="text-xs text-[var(--text-secondary)] uppercase">Compensated Time</span>
            <span className="text-2xl font-black">{result.newMin}m {result.newSec}s</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[var(--text-secondary)] uppercase block">Time Diff</span>
            <span className={`font-bold ${result.diffSecs > 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
              {result.diffSecs > 0 ? '+' : ''}{result.diffSecs}s
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-3">Community Hub (Scraped Tips)</h3>
        <div className="flex flex-col gap-4">
          {tipsDB.map(tip => (
            <div key={tip.id} className="card p-5 group flex flex-col gap-2">
              <h4 className="font-bold text-lg text-[var(--text-primary)] border-b border-[var(--border)] border-dashed pb-1 inline-block w-fit">{tip.title}</h4>
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm break-keep mt-1">{tip.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
