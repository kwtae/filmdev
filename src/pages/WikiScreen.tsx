import React, { useState } from 'react';
import { BookOpen, Calculator, Beaker } from 'lucide-react';

const tipsDB = [
  { id: 1, title: 'Push Processing (+1 Stop)', content: '감도를 1스탑 높여 촬영한 경우 현상 시간을 기본 시간 대비 약 1.5배(50%) 증가시킵니다. 입자가 거칠어지고 콘트라스트가 강해지는 특징이 있습니다.' },
  { id: 2, title: 'Stand Development (조용 현상)', content: 'Rodinal 등의 약품을 1:100의 극단적인 비율로 희석한 뒤, 최소 1시간 이상 놔두며 교반을 전혀 하지 않거나 초반 1회만 실시합니다. 경계면 강조 효과(Edge Effect)를 얻을 수 있습니다.' },
  { id: 3, title: 'Fixer (정착액) 관리법', content: '필름의 은 입자를 완전히 제거하기 위한 단계. 정착이 덜 되면 필름 베이스가 보라색이나 탁한 막이 씌워진 채로 나옵니다. 사용 횟수에 따라 정착력이 떨어지므로 보통 1회 재사용 시마다 10%씩 시간을 연장해 줍니다.' },
  { id: 4, title: 'Safelight (안전등) 규정', content: '흑백 필름(Panchromatic)은 모든 빛 파장에 반응하므로 암백(Darkbag)이나 완전 암실 밖에서 절대 꺼내면 안 됩니다! 오직 인화지(Paper)만이 붉은색 안전등(Safelight) 아래에서 작업이 허용됩니다.' },
  { id: 5, title: 'Stop Bath (정지액) 팁', content: '급할 경우 정지액 대신 빙초산 극소 희석액이나 순수 물(수세정지)로 대체할 수 있으나, 가급적 전용 일루미네이터나 빙초산을 비율에 맞게 섞어 확실히 정지시키는 것이 에멀전 손상을 방지합니다.' },
  { id: 6, title: 'Photo-Flo (수세 촉진제)', content: '가장 마지막 단계에서 1~2방울만 물에 떨어뜨려 1분간 담가두면 필름에 맺힌 작은 물방울(워터스팟) 자국 없이 깨끗하게 마릅니다. 절대 과량 사용하지 말고 거품이 나지 않게 살살 다루세요.' },
  { id: 7, title: 'Water Spot (물방울 자국) 제거', content: '건조 후 워터스팟이 생겼다면, 절대 손으로 강하게 문지르지 말고 이소프로필 알코올(99%)이나 PEC-12 용액을 부드러운 화장솜에 묻혀 조심스럽게 닦아냅니다.' },
  { id: 8, title: 'Developer Temperature', content: '현상액 배합 시 D-76 기준 주로 20°C를 표준 온도로 잡습니다. 온도가 1°C 상승할 때마다 현상시간을 약 8~10% 줄이고, 낮아질 경우 10% 연장하는 계산을 유지해야 콘트라스트가 안정적입니다.' },
  { id: 9, title: 'Fixing Time Test (정착 테스트)', content: '버려지는 필름 꼬투리를 현상 전 픽서(정착액)에 담가보십시오. 불투명한 막이 완전히 투명하게 변하는 시간(Clearing Time)의 정확히 "2배"가 해당 픽서의 완벽한 정착 시간입니다.' },
  { id: 10, title: 'Agitation Technique', content: '교반(탱크 뒤집기)은 너무 과격하게 쉐이킹하면 안 됩니다. 1초에 1회 뒤집는 우아한 속도로 공기방울이 위아래로 자연스럽게 이동해 약품이 섞이도록 해야 얼룩이나 현상 불균형 스트릭(Streak)을 막습니다.' },
  { id: 11, title: 'Blix (표백정착액) 팁 - C41', content: '컬러 C-41 과정에서 Blix 단계는 온도가 떨어지면 급격히 성능이 저하되어 은이 남는(Retained Silver) 문제가 생깁니다. 항상 38.5~39°C 온조기를 가동해 유지하십시오.' },
  { id: 12, title: 'Pre-Wash (사전수세)', content: '현상 전 물을 탱크에 채워 1분간 예열(사전수세)하면 필름 안티할레이션 층(초록/파란색 염료)이 씻겨 나가며 현상액의 오염을 방지하고 필름 베이스 온도를 고르게 만들어줍니다.' },
  { id: 13, title: 'HC-110 Dilution B (희석비율)', content: 'HC-110은 시럽 형태로 제공되며 가장 대중적인 희석비율은 Dilution B (1:31)입니다. 즉, 원액 약 9.5ml에 물 290.5ml를 부어 300ml 1롤 용량을 만듭니다.' },
  { id: 14, title: 'XTOL (엑스톨) 현상액 팁', content: 'XTOL은 아스코르브산(비타민C) 베이스의 친환경 현상액으로, 입자가 미세해지고 쉐도우 디테일이 살아납니다. 하지만 갑작스러운 산화(Sudden Death)로 효력이 사라질 수 있으니 보관 시 공기와의 접촉을 최소화하세요.' },
  { id: 15, title: 'Hypo Clearing Agent (HCA)', content: '수세(Wash) 단계를 대폭 줄여주며 물을 절약할 수 있게 해주는 화학약품입니다. 정착액 이후 HCA에 2분간 교반하면 이어지는 수세 시간을 10분에서 2~3분으로 줄일 수 있습니다.' },
  { id: 16, title: 'Developer Exhaustion (소진)', content: '1회용 현상액(One-shot)이 아닌 재사용 현상액을 사용할 때는 1롤을 현상할 때마다 현상력이 떨어집니다. 제조사 매뉴얼에 따라 롤당 추가해야 하는 시간(예: 롤당 +10%)을 반드시 숙지하세요.' },
  { id: 17, title: 'Latensification (잠상 보강)', content: '저감도 필름을 불가피하게 언더 노출했을 때, 화학 현상 전 아주 미세한 빛을 필름에 전면 노출시켜 암부 디테일을 약간이나마 끌어올리는 특수 테크닉입니다.' },
  { id: 18, title: 'Cross Processing (크로스 프로세싱)', content: '슬라이드(E-6) 필름을 네거티브(C-41) 약품으로 현상하거나, 반대 과정을 거치는 기법입니다. 색이 왜곡되고 콘트라스트가 극도로 높아지는 극적인 효과(Lomography 스크린)를 얻습니다.' },
  { id: 19, title: 'Drying Environment (건조 환경)', content: '먼지 묻음의 90%는 건조 중 발생합니다. 가장 좋은 곳은 샤워기로 뜨거운 물을 뿌려 습기를 가득 채우고 먼지를 가라앉힌 \'작동하지 않는 욕실\' 내부입니다.' },
  { id: 20, title: 'Storage of Chemicals (보관법)', content: '산화를 막기 위해 아코디언형 주름병(Accordion bottles)을 사용하여 남은 공기를 최대한 짜낸 뒤 꽉 잠가 서늘한 곳에 보관하는 것이 생명연장의 핵심입니다.' }
];

export default function WikiScreen() {
  const [baseMin, setBaseMin] = useState(10);
  const [baseSec, setBaseSec] = useState(0);
  const [baseTemp, setBaseTemp] = useState(20);
  const [targetTemp, setTargetTemp] = useState(22);

  const calculateCompensation = () => {
    const totalSecs = (baseMin * 60) + baseSec;
    const compensatedSecs = totalSecs * Math.exp(0.081 * (baseTemp - targetTemp));
    
    const newMin = Math.floor(compensatedSecs / 60);
    const newSec = Math.floor(compensatedSecs % 60);
    return { newMin, newSec, diffSecs: Math.round(compensatedSecs - totalSecs) };
  };

  const result = calculateCompensation();

  return (
    <div className="p-4 flex flex-col gap-6 pb-24 text-[var(--text-primary)] relative w-full h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-2 border-b border-[var(--border)] pb-4 shrink-0">
        <BookOpen className="text-[var(--accent)]" size={24} />
        <h2 className="text-2xl font-bold tracking-tighter uppercase">Knowledge Wiki</h2>
      </div>
      
      <div className="card border-[var(--accent)] bg-[var(--bg-secondary)] relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Calculator size={150} />
        </div>
        <h3 className="font-bold border-b border-[var(--border)] pb-2 mb-4 flex items-center gap-2 relative z-10 text-[var(--text-primary)]">
          <Beaker size={18}/> Dynamic Time/Temp Calculator
        </h3>
        
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 relative z-10 mb-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Base Time (Min:Sec)</span>
            <div className="flex gap-2">
              <input type="number" min="0" value={baseMin} onChange={e => setBaseMin(Number(e.target.value))} className="w-full text-center p-2.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-base outline-none focus:border-[var(--accent)]" />
              <input type="number" min="0" max="59" value={baseSec} onChange={e => setBaseSec(Number(e.target.value))} className="w-full text-center p-2.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-base outline-none focus:border-[var(--accent)]" />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Base Temp (°C)</span>
            <input type="number" step="0.5" value={baseTemp} onChange={e => setBaseTemp(Number(e.target.value))} className="w-full text-center p-2.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-base outline-none focus:border-[var(--accent)]" />
          </label>
          <label className="flex flex-col gap-2 sm:col-span-2 mt-2 p-3 bg-black/10 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-[var(--accent)] tracking-widest">Actual Chemistry Temp (°C)</span>
            <div className="flex items-center gap-4">
              <input type="range" min="15" max="30" step="0.5" value={targetTemp} onChange={e => setTargetTemp(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer border-[var(--border)] accent-[var(--accent)]" />
              <span className="font-black text-2xl w-20 shrink-0 text-right text-[var(--accent)] font-mono">{targetTemp}°C</span>
            </div>
          </label>
        </div>

        <div className="bg-[var(--bg-primary)] p-5 rounded-lg flex justify-between items-center border border-[var(--accent)]/30 relative z-10 font-mono shadow-inner">
          <div className="flex flex-col">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">Compensated Result</span>
            <span className="text-3xl font-black mt-1 text-[var(--text-primary)]">{result.newMin}m {result.newSec}s</span>
          </div>
          <div className="text-right flex flex-col justify-end">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase block font-semibold">Time Diff</span>
            <span className={`font-bold mt-1 px-2 py-1 rounded inline-block text-sm ${result.diffSecs > 0 ? 'bg-[var(--danger)] text-white' : 'bg-[var(--success)] text-[var(--bg-primary)]'}`}>
              {result.diffSecs > 0 ? '+' : ''}{result.diffSecs}s
            </span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 mt-4">
        <h3 className="font-bold text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2 flex items-center justify-between">
          <span>Community Hub (Tips & Facts)</span>
          <span className="text-xs bg-[var(--bg-secondary)] py-1 px-2 rounded-full font-mono">{tipsDB.length} Entries</span>
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {tipsDB.map(tip => (
            <div key={tip.id} className="card p-5 group flex flex-col gap-2 border-[var(--border)] hover:border-[var(--accent)] transition-colors relative overflow-hidden">
              <span className="absolute -right-4 -top-6 text-[5rem] opacity-5 font-black italic">{tip.id}</span>
              <h4 className="font-bold text-lg text-[var(--accent)] border-b border-[var(--border)] border-dashed pb-2 inline-block relative z-10">{tip.title}</h4>
              <p className="text-[var(--text-primary)] leading-relaxed text-sm break-keep mt-2 opacity-90 relative z-10">{tip.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
