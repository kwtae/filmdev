import { useState } from 'react';
import { BookOpen, Calculator, Beaker, Zap, FileQuestion } from 'lucide-react';

const tipsDB = [
  { id: 1, title: '암백(Darkbag) 훈련법', content: '입문자가 가장 많이 실패하는 단계입니다. 버리는 폐필름 하나를 활용해 눈을 감고 릴에 필름을 말아넣는 연습을 수십 번 반복하십시오. 실전에서 손에 땀이 나면 릴이 끈적거려 잘 안 들어가니, 손을 차갑고 건조하게 유지하세요.' },
  { id: 2, title: 'Push Processing (증감 현상)', content: 'ISO 400 필름을 어두운 곳에서 1600으로 촬영(+2 Stop)했다면, 기본 현상 시간 대비 엄청나게(통상 1스탑 당 1.5배) 시간을 늘려야 합니다. 명암비(콘트라스트)가 폭발적으로 강해지고 입자가 거칠어지는 예술적 효과가 납니다.' },
  { id: 3, title: '희석비(Dilution) 수학 기초', content: '예컨대 "1:9" 희석비란 현상액 원액 1스푼에 물 9스푼을 넣는다는 뜻입니다. 총 10등분이 됩니다. 만약 필요한 총 용액이 300ml라면, 원액 30ml + 물 270ml를 계량하면 정확합니다.' },
  { id: 4, title: '증류수 (Distilled Water)의 강력한 효능', content: '수돗물(하드 워터)의 칼슘과 철분은 현상액과 닿으면 현상력을 불규칙하게 만들거나 얼룩을 남길 수 있습니다. 현상액을 배합할 때와 가장 마지막 Photo-Flo를 섞을 때는 반드시 약국의 정제수나 마트의 증류수를 사용하세요.' },
  { id: 5, title: 'Reticulation (망상 현상)', content: '현상(20도) -> 정지(25도) -> 수세(15도)처럼 단계별로 투입되는 수온이 극심하게 다르면, 필름의 젤라틴 유제가 열충격을 받아 표면이 짜글짜글한 뱀껍질처럼 갈라집니다. 모든 약품 온도를 1도 이내로 똑같이 맞추는 것이 핵심입니다.' },
  { id: 6, title: '투명한 필름 (Blank Film) 판별법', content: '현상이 끝난 필름이 글씨 하나 없이 투명하다면 약품 순서(현상액보다 픽서를 먼저 부은 대참사)를 틀린 것입니다. 현상이 안 된 것입니다. 반면, 상/하단 테두리 "KODAK 400" 같은 글씨는 시커멓게 써있는데 사진 컷만 투명하다면 카메라 셔터 고장 및 노출 에러(빛을 못 받음)를 의미합니다.' },
  { id: 7, title: 'Agitation Streak (교반 얼룩)', content: '패터슨 탱크를 너무 위아래로 폭력적으로 흔들면 스프라켓 홀(구멍)을 통과한 용액 액체가 폭포수처럼 쏟아져 필름 기둥에 줄무늬(Streak) 현상 자국을 남깁니다. 아주 우아하고 부드럽게 뒤집으며 공기방울을 달래주어야 합니다.' },
  { id: 8, title: 'Stand Development (조용 현상)', content: 'Rodinal 등의 약품을 1:100의 극단적인 비율로 연하게 탄 뒤, 무려 1시간 동안 교반 없이 내버려 두는 기법입니다. 어두운 곳과 밝은 곳의 밸런스가 기가 막히게 조절되며, 경계면이 강조되는 모서리 효과(Edge Effect)가 도드라집니다.' },
  { id: 9, title: 'Fixing Time Test (정착 완벽 테스트)', content: '버려지는 필름 꼬투리 스니펫을 현상 전 픽서(정착액) 원액에 담가보십시오. 불투명한 노란 막이 완전히 투명한 비닐처럼 변하는 시간(Clearing Time)을 초시계로 잽니다. 그 시간의 정확히 "2배"를 타이머에 입력하는 것이 사용하시는 픽서의 가장 안전한 정착 시간입니다.' },
  { id: 10, title: 'Fixer Exhaustion (정착액 소모)', content: '정착액은 여러 번 재사용할 수 있지만, 한 번 사용할 때마다 픽싱 능력이 지속적으로 감퇴합니다. 이전 정착보다 시간이 더 오래 걸리기 시작한다면 보통 1 롤당 10%씩 타이머의 픽싱 듀레이션을 올려 설정해주세요.' },
  { id: 11, title: 'Safelight (안전등) 규정', content: '흑백 필름이라도 빨간 전구 아래서 현상할 수 있는 게 아닙니다. 현대의 흑백 필름(Panchromatic)은 모든 파장에 반응하므로 무조건 암실 밖에서 안 됩니다. 오직 "인화지(Paper)"만이 붉은색 안전등(Safelight)을 허락합니다.' },
  { id: 12, title: 'Water Spot (물방울 자국) 제거', content: '건조 후 얼룩이 생겼다면 절대 맨손으로 문지르지 마십시오. 부드러운 화장솜에 이소프로필 알코올(99%)이나 전용 필름 클리너(PEC-12)를 묻혀 힘을 완전히 빼고 스치듯 닦아내야 기스가 나지 않습니다.' },
  { id: 13, title: 'Blix (표백정착액) 온도 생명선 - C41', content: '컬러 현상(C-41) 과정에서 가장 흔한 핑크 캐스트(Pink Cast)나 은 잔류 현상은, Blix 단계에서 온도가 39도 밑으로 떨어져 화학반응이 느려졌기 때문입니다. 온조기를 항상 현상 탱크 바깥에 대서 수조(Water Jacket) 온도를 유지하세요.' },
  { id: 14, title: 'Pre-Wash (사전 수세 예열)', content: '컬러나 대형 흑백 현상 전 따뜻한 물을 채워 1분간 담가두면 필름 뒷면에 묻은 먼지와 안티할레이션(Anti-halation) 파란 염료가 오염 없이 씻겨 나가며, 무엇보다 "탱크 외부 온도"가 아닌 "필름 기질 자체의 내부 온도"를 39도로 안전하게 웜업시켜 줍니다.' },
  { id: 15, title: 'HC-110 Dilution B (희석비율)', content: 'HC-110은 시럽 형태로 제공되는데 너무 꾸덕꾸덕하여 주사기로 소수점 계량해야 합니다. 가장 대중적인 희석비인 Dilution B(1:31)를 편하게 만들려면, 시럽 원본 대신 원본을 1:3으로 물에 희석한 "스톡(Stock) 솔루션"을 큰 병에 미리 만들어 두고, 현상할 때마다 1:7로 물과 섞어 쓰면 아주 정밀합니다.' },
  { id: 16, title: 'Hypo Clearing Agent (HCA)', content: '시간이 금인 유저를 위한 마법석. 정착액이 끝난 후 HCA 용액에 2분간 필름을 담그면 젤라틴층의 티오황산나트륨을 아주 빠르게 분해해, 이어지는 수세(Wash) 시간을 15분에서 고작 3분 안팎으로 압도적으로 줄이고 물 수천 리터를 아껴줍니다.' },
  { id: 17, title: '핀홀 (Pinhole/탄산가스)', content: '강알칼리성 현상액이 작동하는 와중에 고농도의 강산 정지액(아세트산)을 너무 급격히 들이부으면, 그 위력적인 산/염기 충돌 중화반응 가스로 인해 미세한 탄산가스 거품이 터지면서 에멀전 덩어리를 파먹고 핀홀(바늘구멍 현상)을 만들어 버립니다. 정지액 비율을 정량으로 연하게 맞춰주십시오.' },
  { id: 18, title: '보관과 산화(Storage & Oxidation)', content: '현상액 병 속에 남은 빈 공간(공기)은 산소입니다. 주사바늘처럼 산화(갈변화 현상) 속도를 극적으로 높이므로, 공기를 짜서 버릴 수 있는 쭈글쭈글한 아코디언형 주름병(Accordion bottles)을 사용하거나 병 안에 유리구슬을 가득 채워 수위를 끝까지 올려두면 압도적인 장기 보존이 가능합니다.' },
  { id: 19, title: '화장실 강압 건조 팁', content: '가정집에서 가장 먼지가 없는 무균실은 "막 뜨거운 샤워를 마친 욕실"입니다. 욕실을 뜨거운 증기로 가득 채워 공기 중 초미세 먼지들을 무겁게 만들어 전부 바닥으로 가라앉힌 뒤, 10분 후 들어가 필름을 걸어 건조시키면 스캔 퀄리티가 스튜디오 급이 됩니다.' },
  { id: 20, title: 'Developer Temperature', content: 'D-76 기준 현상은 20°C가 메인 스트림입니다. 온도가 1°C 상승할 때마다 현상시간을 약 8~10% 줄이고, 낮아질 경우 10% 연장하는 계산을 유지해야 콘트라스트가 안정적입니다. (앱의 계산기 탭을 이용하세요!)' }
];

const chemDB = [
  { id: 1, title: '할로겐화 은결정 (Silver Halides)', content: '필름의 에멀전(유제)에는 빛에 극도로 민감한 브롬화 은(AgBr)과 요오드화 은(AgI) 결정이 동물성 젤라틴에 섞여 발라져 있습니다. 카메라 셔터가 열리면서 이 결정들이 아주 미세한 광자(Photon, 빛의 입자)에 두들겨 맞으면, 결정 격자가 무너지면서 미세한 "은 원자 덩어리"를 형성합니다. 이를 눈으로는 안 보이는 보이지 않는 그림, 잠상(Latent Image)이라 부릅니다.' },
  { id: 2, title: '왜 빛을 받으면 까매지는가? (Negative 현상)', content: '빛을 받아 생성된 "잠상"은 사실 아주 옅습니다. 현상액(Developer)의 핵심 역할인 "환원제"는 젤라틴 속으로 파고들어 이 잠상을 씨앗 삼아 결정 전체를 순수한 금속 은(Metallic Silver)으로 급속하게 환원시켜 버립니다. 은속 덩어리는 빛을 차단하므로 필름상에선 완전한 시커먼 색(Black)이 됩니다. 따라서 렌즈로 흰옷을 찍으면 현상 후 필름상에서는 검게 표현되므로 네거티브 반전이 일어납니다.' },
  { id: 3, title: '현상액의 4대 구성물질 (Developer Chemistry)', content: '1. 환원제(현상주약 - 예: 하이드로퀴논): 은 결정을 금속으로 환원 (명암 형성).\n2. 알칼리 촉진제(예: 붕사, 탄산나트륨): 현상주약이 강하게 작동할 수 있는 pH 10 이상의 염기성 판을 깔아줌.\n3. 보존제(예: 아황산나트륨): 공기 중 산소로부터 환원제가 먼저 폭파(산화)되는 것을 막고 수명을 연장.\n4. 억제제(예: 브롬화칼륨): 빛을 전혀 받지 않은 깨끗한 결정체들마저 까매지는 에러(포그 현상, 포깅)을 억누름.' },
  { id: 4, title: '정지액의 산염기 중화 (Stop Bath pH)', content: '알칼리성 환경에서만 전자를 방출하며 아드레날린을 뿜는 현상액에게 사형을 내리는 단계입니다. 아세트산이나 구연산이 베이스인 약산성(Acidic, pH 4~5) 정지액을 때려부으면, 환경이 급격히 산성으로 변하여 알칼리 촉매 반응이 소수점 단위 시간만에 급정거(Stop) 됩니다. 이 덕분에 유저가 원하는 초 단위의 정밀한 발색 통제가 가능합니다.' },
  { id: 5, title: '정착액 작용 기전 (The Fixer / Hypo)', content: '현상과 정지가 끝났다고 불을 켜면 안 됩니다. 까매지지 않은 나머지 "빛을 안 받은 뽀얀 할로겐화 은 결정들"이 필름에 덕지덕지 수억 개 붙어 있습니다. 밝은 곳에 나오자마자 빛을 받고 검게 타버립니다. 치오황산나트륨(Sodium thiosulfate: 이른바 하이포)이라는 마법의 가루는 이 빛을 받지 않은 은염들과 착화합물을 이뤄 오로지 "물에 녹는 수용성 형태"로 변환시켜 필름 밖으로 떨어져 나가게 합니다. 이때부터 빛을 봐도 되는 영원한 사진이 태어납니다.' },
  { id: 6, title: '감도(ISO/ASA)와 입자(Grain) 역학 원리', content: '필름 매뉴팩처러들은 ISO 400 필름을 만들려 할 때 할로겐화 은 결정을 크고 굵게 만듭니다. 그물이 클수록 쏘아진 광자를 잡아채기 쉽기 때문입니다(빛에 매우 민감). 그러나 픽서가 필름을 씻어내고 코어만 덜렁 남았을 때, 처음부터 거대한 은 결정을 썼으므로 까만 덩어리가 우리 눈에 도드라지게 보입니다. 우리는 이것을 "노이즈가 있다, 그레인이 거칠다"고 표현하는 것입니다.' },
  { id: 7, title: '아레니우스 방정식 (Arrhenius Equation & Temp)', content: '타이머 앱의 온도 계산기에 내장된 로직입니다. 화학반응 속도는 온도에 기하급수적으로 의존합니다. 대체로 현상액 용액의 온도가 10도 올라가면 반응 속도는 2~3배 훅 뛰어오릅니다(Q10 온도계수). 즉, 차가운 물(15도)로 현상하려면 3분이 아니라 10분을 넘게 기다려야 하고, 뜨거운 물(28도)에서 현상하려면 눈 깜짝할 새인 2분 만에 약품을 버려야 합니다. 시간 제어의 극한의 이점을 누리기 위하여 현상액을 항상 미온수 20도 근처로 맞추는 것입니다.' },
  { id: 8, title: '푸쉬/풀 현상의 과학 (Push / Pull Reaction)', content: '어두운 곳에서 억지로 셔터속도를 확보하고자 빛을 조금만 받아들인(언더노출) 필름은 극도로 환원하기 작고 빈약한 은 씨앗(잠상)을 갖고 있습니다. 이 씨앗을 키우고자 현상액에서 배로 긴 시간을 담궈 두는 것이 증감(Push)입니다. 하지만 없는 빛은 창조되지 않습니다. 밝은 곳(도화지나 램프 빛 등 약간의 빛을 받은 곳)만 계속해서 검게 더 타오르므로 섀도우가 붕 뜨는 하이-콘트라스트(고대비 조형)의 사진이 나오는 화학적 필연성을 안고 있습니다.' }
];

export default function WikiScreen() {
  const [tab, setTab] = useState<'calc' | 'tips' | 'chem'>('tips');

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
    <div className="p-4 flex flex-col gap-4 pb-24 text-[var(--text-primary)] relative w-full h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-2 border-b border-[var(--border)] pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="text-[var(--accent)]" size={24} />
          <h2 className="text-2xl font-bold tracking-tighter uppercase">FilmDev Wiki</h2>
        </div>
        <span className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-widest border border-[var(--accent)] px-2 py-0.5 rounded-full">Knowledge Base</span>
      </div>

      <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border)] shrink-0 shadow-sm mt-1 mb-2">
        <button onClick={() => setTab('tips')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${tab === 'tips' ? 'bg-[var(--bg-primary)] text-[var(--accent)] shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
          <FileQuestion size={18}/> 현상 실전 입문
        </button>
        <button onClick={() => setTab('chem')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${tab === 'chem' ? 'bg-[var(--bg-primary)] text-[var(--accent)] shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
          <Zap size={18} className={tab === 'chem' ? 'text-yellow-500' : ''}/> 화학 반응의 원리
        </button>
        <button onClick={() => setTab('calc')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${tab === 'calc' ? 'bg-[var(--bg-primary)] text-[var(--accent)] shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
          <Calculator size={18}/> 온도 변환 공식
        </button>
      </div>
      
      {tab === 'calc' && (
        <div className="card border-[var(--accent)] bg-[var(--bg-secondary)] relative overflow-hidden flex-shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Calculator size={150} />
          </div>
          <h3 className="font-bold border-b border-[var(--border)] pb-2 mb-4 flex items-center gap-2 relative z-10 text-[var(--text-primary)]">
            <Beaker size={18}/> Dynamic Time/Temp Calculator
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed relative z-10 w-[85%]">
            아레니우스 반응 속도론(Arrhenius Kinetics)에 기반한 알고리즘을 사용하여, 실측된 온도가 기준 온도와 달라질 때 정확하게 변동시켜야 하는 소요 시간을 자동으로 보정하여 산출합니다.
          </p>
          
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 relative z-10 mb-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest">Base Time (Min:Sec)</span>
              <div className="flex gap-2">
                <input type="number" min="0" value={baseMin} onChange={e => setBaseMin(Number(e.target.value))} className="w-full text-center p-2.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-base outline-none focus:border-[var(--accent)]" />
                <input type="number" min="0" max="59" value={baseSec} onChange={e => setBaseSec(Number(e.target.value))} className="w-full text-center p-2.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-base outline-none focus:border-[var(--accent)]" />
              </div>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest">Base Temp (°C)</span>
              <input type="number" step="0.5" value={baseTemp} onChange={e => setBaseTemp(Number(e.target.value))} className="w-full text-center p-2.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-base outline-none focus:border-[var(--accent)]" />
            </label>
            <label className="flex flex-col gap-2 sm:col-span-2 mt-2 p-4 bg-black/10 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[var(--accent)] tracking-widest">실제 측정된 약품 온도 (Actual Temp)</span>
              <div className="flex items-center gap-4">
                <input type="range" min="15" max="30" step="0.5" value={targetTemp} onChange={e => setTargetTemp(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer border-[var(--border)] accent-[var(--accent)]" />
                <span className="font-black text-2xl w-24 shrink-0 text-right text-[var(--accent)] font-mono drop-shadow">{targetTemp}°C</span>
              </div>
            </label>
          </div>

          <div className="bg-[var(--bg-primary)] p-5 rounded-lg flex justify-between items-center border border-[var(--accent)]/30 relative z-10 font-mono shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-extrabold tracking-widest mb-1">최종 보정된 시간 (Compensated)</span>
              <span className="text-3xl font-black mt-1 text-[var(--text-primary)]">{result.newMin}m {result.newSec}s</span>
            </div>
            <div className="text-right flex flex-col justify-end">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase block font-extrabold tracking-widest mb-1">Time Diff</span>
              <span className={`font-bold mt-1 px-3 py-1.5 rounded-lg inline-block text-sm shadow ${result.diffSecs > 0 ? 'bg-[var(--danger)] text-white' : 'bg-[var(--success)] text-[var(--bg-primary)]'}`}>
                {result.diffSecs > 0 ? '+' : ''}{result.diffSecs}s
              </span>
            </div>
          </div>
        </div>
      )}

      {tab === 'tips' && (
        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-black text-sm text-[var(--text-primary)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2"><FileQuestion size={18} className="text-[var(--accent)]" /> 초보자를 위한 위기 대응 및 행동 강령</span>
            <span className="bg-[var(--bg-secondary)] border border-[var(--border)] py-1 px-3 rounded-xl font-mono text-[10px] shadow-sm">{tipsDB.length} TACTICS</span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {tipsDB.map(tip => (
              <div key={tip.id} className="card p-5 group flex flex-col gap-2 border-[var(--border)] hover:border-[var(--accent)] transition-colors relative overflow-hidden bg-gradient-to-br hover:from-[var(--bg-secondary)] from-[var(--bg-primary)]">
                <span className="absolute -right-2 -top-4 text-[6rem] opacity-5 font-black italic">{String(tip.id).padStart(2, '0')}</span>
                <h4 className="font-bold text-lg text-[var(--accent)] border-b border-[var(--border)] border-dashed pb-2 inline-block relative z-10 max-w-[90%]">{tip.title}</h4>
                <p className="text-[var(--text-primary)] leading-relaxed text-[13px] break-keep mt-2 relative z-10 font-medium whitespace-pre-line opacity-90">{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'chem' && (
        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-black text-sm text-[var(--text-primary)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2"><Zap size={18} className="text-yellow-500 fill-yellow-500" /> 고급 현상학 (Photographic Chemistry)</span>
            <span className="bg-[var(--bg-secondary)] border border-[var(--border)] py-1 px-3 rounded-xl font-mono text-[10px] shadow-sm">{chemDB.length} THEORIES</span>
          </h3>
          <div className="grid grid-cols-1 gap-5">
            {chemDB.map(chem => (
              <div key={chem.id} className="card p-6 group flex flex-col gap-2 border-[var(--border)] hover:border-yellow-500/50 transition-colors relative overflow-hidden bg-black/5 shadow-inner">
                <span className="absolute top-4 right-4 text-[var(--border)] group-hover:text-yellow-500/30 transition-colors duration-500">
                  <Zap size={40} className="fill-current" />
                </span>
                <h4 className="font-bold text-xl text-[var(--text-primary)] inline-block relative z-10 max-w-[85%] leading-tight tracking-tight">{chem.title}</h4>
                <div className="h-1 w-12 bg-yellow-500/50 my-2 rounded-full relative z-10 group-hover:w-24 transition-all duration-500"></div>
                <p className="text-[var(--text-secondary)] leading-loose text-[13px] break-keep mt-2 relative z-10 font-medium whitespace-pre-line">{chem.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
