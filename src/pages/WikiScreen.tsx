import { useState } from 'react';
import { BookOpen, Calculator, Beaker, Zap, FileQuestion, AlertOctagon } from 'lucide-react';

const tipsDB = [
  { id: 1, title: '암백(Darkbag) 훈련법', content: '입문자가 가장 많이 실패하는 단계입니다. 버리는 폐필름 하나를 활용해 눈을 감고 릴에 필름을 말아넣는 연습을 수십 번 반복하십시오. 실전에서 손에 땀이 나면 릴이 끈적거려 잘 안 들어가니, 손을 차갑고 건조하게 유지하세요.' },
  { id: 2, title: 'Push Processing (증감 현상)', content: 'ISO 400 필름을 어두운 곳에서 1600으로 촬영(+2 Stop)했다면, 기본 현상 시간 대비 엄청나게(통상 1스탑 당 1.5배) 시간을 늘려야 합니다. 명암비(콘트라스트)가 폭발적으로 강해지고 입자가 거칠어지는 예술적 효과가 납니다.' },
  { id: 3, title: '희석비(Dilution) 수학 기초', content: '예컨대 "1:9" 희석비란 현상액 원액 1스푼에 물 9스푼을 넣는다는 뜻입니다. 총 10등분이 됩니다. 만약 필요한 총 용액이 300ml라면, 원액 30ml + 물 270ml를 계량하면 정확합니다.' },
  { id: 4, title: '증류수 (Distilled Water)의 강력한 효능', content: '수돗물(하드 워터)의 칼슘과 철분은 현상액과 닿으면 현상력을 불규칙하게 만들거나 얼룩을 남길 수 있습니다. 현상액을 배합할 때와 가장 마지막 Photo-Flo를 섞을 때는 반드시 약국의 정제수나 마트의 증류수를 사용하세요.' },
  { id: 5, title: 'Stand Development (조용 현상)', content: 'Rodinal 등의 약품을 1:100의 극단적인 비율로 연하게 탄 뒤, 무려 1시간 동안 교반 없이 내버려 두는 기법입니다. 어두운 곳과 밝은 곳의 밸런스가 기가 막히게 조절되며, 경계면이 강조되는 모서리 효과(Edge Effect)가 도드라집니다.' },
  { id: 6, title: 'Fixing Time Test (정착 완벽 테스트)', content: '버려지는 필름 꼬투리 스니펫을 현상 전 픽서(정착액) 원액에 담가보십시오. 불투명한 노란 막이 완전히 투명한 비닐처럼 변하는 시간(Clearing Time)을 초시계로 잽니다. 그 시간의 정확히 "2배"를 타이머에 입력하는 것이 사용하시는 픽서의 가장 안전한 정착 시간입니다.' },
  { id: 7, title: 'Fixer Exhaustion (정착액 소모)', content: '정착액은 여러 번 재사용할 수 있지만, 한 번 사용할 때마다 픽싱 능력이 지속적으로 감퇴합니다. 이전 정착보다 시간이 더 오래 걸리기 시작한다면 보통 1 롤당 10%씩 타이머의 픽싱 듀레이션을 올려 설정해주세요.' },
  { id: 8, title: 'Safelight (안전등) 규정', content: '흑백 필름이라도 빨간 전구 아래서 현상할 수 있는 게 아닙니다. 현대의 흑백 필름(Panchromatic)은 모든 파장에 반응하므로 무조건 암실 밖에서 안 됩니다. 오직 "인화지(Paper)"만이 붉은색 안전등(Safelight)을 허락합니다.' },
  { id: 9, title: 'Water Spot (물방울 자국) 제거', content: '건조 후 얼룩이 생겼다면 절대 맨손으로 문지르지 마십시오. 부드러운 화장솜에 이소프로필 알코올(99%)이나 전용 필름 클리너(PEC-12)를 묻혀 힘을 완전히 빼고 스치듯 닦아내야 기스가 나지 않습니다.' },
  { id: 10, title: 'Blix (표백정착액) 온도 생명선 - C41', content: '컬러 현상(C-41) 과정에서 가장 흔한 핑크 캐스트(Pink Cast)나 은 잔류 현상은, Blix 단계에서 온도가 39도 밑으로 떨어져 화학반응이 느려졌기 때문입니다. 온조기를 항상 현상 탱크 바깥에 대서 수조(Water Jacket) 온도를 유지하세요.' },
  { id: 11, title: 'Pre-Wash (사전 수세 예열)', content: '컬러나 대형 흑백 현상 전 따뜻한 물을 채워 1분간 담가두면 필름 뒷면에 묻은 먼지와 안티할레이션(Anti-halation) 파란 염료가 오염 없이 씻겨 나가며, 무엇보다 "탱크 외부 온도"가 아닌 "필름 기질 자체의 내부 온도"를 39도로 안전하게 웜업시켜 줍니다.' },
  { id: 12, title: 'HC-110 Dilution B (희석비율)', content: 'HC-110은 시럽 형태로 제공되는데 너무 꾸덕꾸덕하여 주사기로 소수점 계량해야 합니다. 가장 대중적인 희석비인 Dilution B(1:31)를 편하게 만들려면, 시럽 원본 대신 원본을 1:3으로 물에 희석한 "스톡(Stock) 솔루션"을 큰 병에 미리 만들어 두고, 현상할 때마다 1:7로 물과 섞어 쓰면 아주 정밀합니다.' },
  { id: 13, title: 'Hypo Clearing Agent (HCA)', content: '시간이 금인 유저를 위한 마법석. 정착액이 끝난 후 HCA 용액에 2분간 필름을 담그면 젤라틴층의 티오황산나트륨을 아주 빠르게 분해해, 이어지는 수세(Wash) 시간을 15분에서 고작 3분 안팎으로 압도적으로 줄이고 물 수천 리터를 아껴줍니다.' },
  { id: 14, title: '보관과 산화(Storage & Oxidation)', content: '현상액 병 속에 남은 빈 공간(공기)은 산소입니다. 주사바늘처럼 산화(갈변화 현상) 속도를 극적으로 높이므로, 공기를 짜서 버릴 수 있는 쭈글쭈글한 아코디언형 주름병(Accordion bottles)을 사용하거나 병 안에 유리구슬을 가득 채워 수위를 끝까지 올려두면 압도적인 장기 보존이 가능합니다.' },
  { id: 15, title: '화장실 강압 건조 팁', content: '가정집에서 가장 먼지가 없는 무균실은 "막 뜨거운 샤워를 마친 욕실"입니다. 욕실을 뜨거운 증기로 가득 채워 공기 중 초미세 먼지들을 무겁게 만들어 전부 바닥으로 가라앉힌 뒤, 10분 후 들어가 필름을 걸어 건조시키면 스캔 퀄리티가 스튜디오 급이 됩니다.' }
];

const chemDB = [
  { id: 1, title: '할로겐화 은결정 (Silver Halides)', content: '필름의 유제(Emulsion)에는 빛에 극도로 민감한 브롬화 은(AgBr)과 요오드화 은(AgI) 결정이 젤라틴에 버무려져 있습니다. 셔터가 열려 빛 분자(광자, Photon)가 이 결정에 충돌하면 결정 격자가 붕괴되며 소량의 "은 원자 덩어리"가 형성됩니다. 물리적으로는 무언가 바뀌었지만 맨눈으로는 보이지 않는 이 지도를, 우리는 잠상(Latent Image)이라 부릅니다.' },
  { id: 2, title: '산화·환원 (Redox) 메커니즘', content: '현상주약(현상액의 주성분인 하이드로퀴논 등)은 매우 불안정하여 전자를 내놓고 싶어 합니다. 젤라틴 속으로 흡수된 현상주약은 "잠상을 씨앗으로 삼아" 전자를 은 이온(Ag+)에 공급하며 자신은 희생(산화)됩니다. 전자를 받은 은염은 완전한 금속 은(Metallic Silver)으로 환원되며, 금속 덩어리가 됨으로써 강력하게 빛을 차단해 시커먼 밀도를 형성합니다.' },
  { id: 3, title: '탄산수소나트륨과 pH 게임', content: '환원 과정은 알칼리성 수용액(pH 10 이상)에서만 강력하게 진행됩니다. 탄산나트륨이나 붕사와 같은 촉진제(Accelerator)가 이를 돕습니다. 현상액이 알비온(Albion)처럼 강한 에너지를 뿜어내지만, 반대로 pH가 5 근처인 아이셔산(아세트산 정지액)을 붓는 즉시 이 모든 전자 교환 축제는 소수점 초 단위로 파괴되어 강제 급정거됩니다.' },
  { id: 4, title: '정착액(Fixer)의 융해 기전', content: '가장 중요합니다. 어둠 속에서 빛을 받지 않아 여전히 "금속 은"으로 변하지 못한 뽀얀 은결정들은, 필름 통 밖으로 나오자마자 시커멓게 타버릴 준비를 하고 있습니다. 치오황산나트륨(Fixer 성분)은 이런 빛을 받지 않은 은염과만 도킹하여 "물에 녹을 수 있는 착화합물" 젤리로 변환시킵니다. 즉, 물에 씻겨 하수구로 버려지게 만드는 것이 정착의 본질입니다.' },
  { id: 5, title: '수세(Wash) 생략 시의 화학적 파멸', content: '현상, 약품 공정이 성공적이라도 필름 유제 스펀지 안에는 여전히 치오황산나트륨 찌꺼기가 남아 있습니다. 이를 "미세 티오황산염"이라 부르는데, 이를 물로 완벽히 씻어내지 않으면 수개월 내에 공기 중의 습기와 반응하여 서서히 황화은(Silver Sulfide)을 만듭니다. 결과적으로 필름 표면이 누레지거나 코팅이 썩어가며(Image Fading) 사진이 점차 지워집니다.' },
  { id: 6, title: '감도(ISO)와 노이즈의 유전학', content: '감도가 높은 ISO 1600 필름은 제조사가 할로겐화 은 결정을 고의로 굵고 거칠게 만듭니다. 그물이 클수록 쏘아지는 빛을 낚아채기 쉽기 때문입니다. 픽서가 필요 없는 부위를 다 깎아내고 나면 이 커다란 은 결정 뼈대만 남는데, 결정 자체가 크기 때문에 우리 눈에는 이것이 "그레인(모래알 같은 입자감)이 크고 거칠다"고 느껴지는 것입니다. 감도와 입자는 화학적으로 트레이드-오프(Trade-off) 관계입니다.' },
  { id: 7, title: '푸쉬/풀 현상의 본질 (Push / Pull reaction)', content: '어두운 곳에서 셔터속도를 억지로 올리려 빛을 덜 준(언더노출) 필름은 씨앗(잠상)의 싹이 너무 작습니다. 이 작은 씨앗에서 어떻게든 은 덩어리를 억지로 치열하게 키워내기 위해 현상액의 체류 시간을 배로 늘려(Push) 타협하는 것입니다. 하지만 애초에 빛이 단 한 번도 닿지 않은 완전한 섀도우(명부는 아예 없음) 영역은 현상액을 천년 동안 담가도 짙어지지 않기 때문에, 명부만 시커멓게 타오르는 고대비(하이 콘트라스트) 사진이 되는 이유가 여기 있습니다.' }
];

const errorDB = [
  { id: 1, title: '투명하고 투명하다 (Blank Film / No Edge marks)', fail: '완벽하게 투명하며 필름 테두리의 KODAK, ILFORD 같은 글씨조차 아예 없습니다.', reason: '최악의 참사입니다. "현상액(Developer)보다 정착액(Fixer)을 눈먼 채 먼저 부어버린 경우"입니다. 현상액을 만나 환원되기도 전에, 픽서가 필름의 모든 할로겐화 은을 용해해서 씻어내 버렸습니다. 혹은 현상액이 완전히 썩어(산화되어) 맹물이 된 경우입니다.' },
  { id: 2, title: '컷만 투명하다 (Blank Image / With Edge marks)', fail: '필름 컷(네모난 사진 영역)은 투명한데, 테두리의 숫자(프레임 넘버)나 브랜드 글씨는 까맣게 잘 남아 있습니다.', reason: '안심하십시오. 암실(현상) 과정은 "완벽"했습니다! 테두리 글씨가 선명하게 환원되었다는 건 약품의 힘과 순서는 정확했다는 증거입니다. 문제는 카메라입니다. 필름 로딩이 안 된 채 헛돌았거나, 렌즈 캡을 닫고 찍었거나, 셔터 릴리즈 자체가 아예 기계적으로 고장 난(가장 흔한 이유) 경우입니다.' },
  { id: 3, title: '새까만 필름탄 (Solid Black / Opaque)', fail: '필름 처음부터 끝까지 새까만 검정색 띠가 되어 도저히 형체를 알아볼 수 없습니다.', reason: '로딩 실수 또는 중대 빛 노출(Light Leak) 사고입니다. 탱크 뚜껑을 열었거나, 1롤을 완전히 교체하기 전 밝은 방의 빛을 수초 이상 전면적으로 맞은 경우입니다. 모든 면의 은염이 빛 펀치를 맞아 전면 현상되어버렸습니다.' },
  { id: 4, title: '보라색/핑크색 탁한 잔류물 (Purple/Pink Cast)', fail: '현상이 끝난 흑백 필름 표면에 핑크색이나 진한 보라색 얼룩이 끼어 있고, 색이 탁해 스캔이 답답합니다.', reason: '정착(Fixing) 결함입니다. 픽서 약효가 떨어져 시간이 너무 짧았거나 재사용 수명을 넘겼습니다. 빛을 안 받은 은염이 덜 씻겨 나갔거나, 필름 백킹의 안티할레이션 염료(난반사 방지 코팅)가 다 녹아나가지 못한 증상입니다. 정착액을 새로 타서 당장 2~3분 더 담궈두면 맑아집니다 (마법처럼 복구 됨!).' },
  { id: 5, title: '스프라켓 구멍 그림자 (Bromide Drag / Surge Marks)', fail: '필름의 빈 구멍통(스프라켓 홀) 아래 방향으로 하얗거나 까만 눈물 자국, 반달 무늬가 연달아 잔상처럼 박혀 있습니다.', reason: '교반(Agitation) 오류입니다. 칵테일 섞듯 폭력적으로 위아래로 미친듯이 섞으면 약품이 좁은 구멍을 폭포수처럼 통과하며 그 부분만 미친듯한 속도로 현상해버립니다. 반대로 아예 안 섞으면 무거운 브롬화물(현상 노폐물) 부유물이 밑으로 뚝뚝 떨어지며 화학 잔상(고드름)을 남깁니다.' },
  { id: 6, title: '뱀 껍질 크랙 (Reticulation / 에멀전 벗겨짐)', fail: '사진 표면이 가뭄 든 논바닥이나 모자이크, 파충류의 껍질처럼 미친듯이 갈라져 있습니다.', reason: '온도계의 패배입니다. 메인 현상은 20도에서 스무스하게 하다가, 헹군다고 수도꼭지 30도의 미온수를 들이붓거나 10도 얼음물 정지액을 부은 경우, 유기체인 젤라틴층이 극심한 수축/팽창 쇼크를 이기지 못해 물리적으로 수만 갈래로 찢어져 버린 흔적입니다. 복구 불가입니다.' },
  { id: 7, title: '작고 까만 기포구멍들 (Pinhole Effect)', fail: '필름 전체 샷에 바늘로 콕콕 찌른 것 같은 수많은 미세한 검은색 핀홀 자국(스캔 시 하얀색)이 박혀 있습니다.', reason: '강산 + 강염기 충돌입니다! 현상액의 알칼리와 아주 쎈 산성의 정지액이 충돌하면서 마치 콜라처럼 "탄산가스"를 폭발시켰고, 이 가스 방울들이 에멀전 속에서 팽창하며 조직을 파먹고 터져버린 아픈 상처들입니다. 정지액 비율을 낮추십시오.' }
];

export default function WikiScreen() {
  const [tab, setTab] = useState<'calc' | 'tips' | 'chem' | 'error'>('tips');

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
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[var(--accent)]" size={24} />
            <h2 className="text-2xl font-bold tracking-tighter uppercase">Knowledge Base</h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">초심자를 위한 전문 화학 라이브러리</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-xl border border-[var(--border)] shrink-0 shadow-sm mt-1 mb-2">
        <button onClick={() => setTab('tips')} className={`py-3 text-[11px] font-black uppercase tracking-wider rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all ${tab === 'tips' ? 'bg-[var(--bg-primary)] text-[var(--success)] shadow-md ring-1 ring-[var(--success)]/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
          <FileQuestion size={18}/> 실전 입문
        </button>
        <button onClick={() => setTab('chem')} className={`py-3 text-[11px] font-black uppercase tracking-wider rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all ${tab === 'chem' ? 'bg-[var(--bg-primary)] text-yellow-500 shadow-md ring-1 ring-yellow-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
          <Zap size={18} className={tab === 'chem' ? 'fill-yellow-500/20' : ''}/> 화학 원리
        </button>
        <button onClick={() => setTab('error')} className={`py-3 text-[11px] font-black uppercase tracking-wider rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all ${tab === 'error' ? 'bg-[var(--bg-primary)] text-[var(--danger)] shadow-md ring-1 ring-[var(--danger)]/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
          <AlertOctagon size={18} className={tab === 'error' ? 'fill-[var(--danger)]/10' : ''}/> 실패 부검
        </button>
        <button onClick={() => setTab('calc')} className={`py-3 text-[11px] font-black uppercase tracking-wider rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all ${tab === 'calc' ? 'bg-[var(--bg-primary)] text-[var(--accent)] shadow-md ring-1 ring-[var(--accent)]/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
          <Calculator size={18}/> 온도 수식
        </button>
      </div>
      
      {tab === 'calc' && (
        <div className="card border-[var(--accent)] bg-[var(--bg-secondary)] relative overflow-hidden flex-shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Calculator size={150} />
          </div>
          <h3 className="font-bold border-b border-[var(--border)] pb-2 mb-4 flex items-center gap-2 relative z-10 text-[var(--text-primary)]">
            <Beaker size={18}/> 체계화된 온도 변환 도구 (Arrhenius)
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed relative z-10 sm:w-[85%]">
            실제로 현상액의 화학 반응 속도는 온도에 기하급수적으로 반응합니다. 기준점(예: 20도)에서 이탈한 현재 약품 온도를 입력하면, 수축/팽창하는 타임 라인을 수학적으로 증빙하여 보정된 현상 시간을 제시합니다.
          </p>
          
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 relative z-10 mb-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest">Base Time (제조사 권장 시간)</span>
              <div className="flex gap-2">
                <input type="number" min="0" value={baseMin} onChange={e => setBaseMin(Number(e.target.value))} className="w-full text-center py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-lg shadow-inner outline-none focus:border-[var(--accent)] transition-colors" />
                <input type="number" min="0" max="59" value={baseSec} onChange={e => setBaseSec(Number(e.target.value))} className="w-full text-center py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-lg shadow-inner outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest">Base Temp (기준 온도 °C)</span>
              <input type="number" step="0.5" value={baseTemp} onChange={e => setBaseTemp(Number(e.target.value))} className="w-full text-center py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-lg shadow-inner outline-none focus:border-[var(--accent)] transition-colors" />
            </label>
            <label className="flex flex-col gap-2 sm:col-span-2 mt-4 p-5 bg-black/10 rounded-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent)]/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
              <span className="text-[10px] uppercase font-extrabold text-[var(--accent)] tracking-widest relative z-10">실측된 내 약품 온도 (Actual Target °C)</span>
              <div className="flex items-center gap-4 relative z-10 mt-1">
                <input type="range" min="15" max="35" step="0.5" value={targetTemp} onChange={e => setTargetTemp(Number(e.target.value))} className="w-full h-2 bg-[var(--bg-primary)] rounded-lg appearance-none cursor-pointer border border-[var(--border)] accent-[var(--accent)]" />
                <span className="font-black text-3xl w-24 shrink-0 text-right text-[var(--accent)] font-mono drop-shadow">{targetTemp}°C</span>
              </div>
            </label>
          </div>

          <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-[var(--accent)]/30 relative z-10 shadow-lg flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-extrabold tracking-widest">최종 적용 시간 (Compensated Result)</span>
              <span className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] font-mono tracking-tighter">{result.newMin}m {result.newSec}s</span>
            </div>
            <div className="text-right flex flex-col justify-end">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-extrabold tracking-widest mb-1">Time Gap</span>
              <span className={`font-black tracking-normal px-4 py-2 rounded-lg text-lg shadow-inner border border-transparent ${result.diffSecs > 0 ? 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/50' : 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/50'}`}>
                {result.diffSecs > 0 ? '+' : ''}{result.diffSecs} SEC
              </span>
            </div>
          </div>
        </div>
      )}

      {tab === 'tips' && (
        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-black text-sm text-[var(--text-primary)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2"><FileQuestion size={18} className="text-[var(--success)]" /> 현상 실전 입문서</span>
            <span className="bg-[var(--bg-secondary)] border border-[var(--border)] py-1 px-3 rounded-xl font-mono text-[10px] shadow-sm tracking-widest">{tipsDB.length} TACTICS</span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {tipsDB.map((tip, idx) => (
              <div key={idx} className="card p-5 group flex flex-col gap-2 border-[var(--border)] hover:border-[var(--success)] transition-colors relative overflow-hidden bg-gradient-to-br hover:from-[var(--bg-secondary)] from-[var(--bg-primary)]">
                <span className="absolute -right-2 -top-4 text-[6rem] opacity-5 font-black italic">{String(idx + 1).padStart(2, '0')}</span>
                <h4 className="font-extrabold text-[15px] sm:text-[17px] text-[var(--success)] border-b border-[var(--border)] border-dashed pb-2 inline-block relative z-10 w-fit shrink-0 tracking-tight">{tip.title}</h4>
                <p className="text-[var(--text-primary)] leading-[1.8] text-[13px] break-keep mt-2 relative z-10 font-medium opacity-90">{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'chem' && (
        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-black text-sm text-[var(--text-primary)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2"><Zap size={18} className="text-yellow-500 fill-yellow-500" /> 화학 반응의 물리학적 원리</span>
            <span className="bg-[var(--bg-secondary)] border border-[var(--border)] py-1 px-3 rounded-xl font-mono text-[10px] shadow-sm tracking-widest">{chemDB.length} THEORIES</span>
          </h3>
          <div className="grid grid-cols-1 gap-5">
            {chemDB.map((chem, idx) => (
              <div key={idx} className="card p-6 group flex flex-col gap-2 border-[var(--border)] hover:border-yellow-500/50 transition-colors relative overflow-hidden bg-[var(--bg-primary)] shadow-sm">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <Zap size={100} className="fill-current text-yellow-500" />
                </div>
                <h4 className="font-black text-[17px] text-[var(--text-primary)] inline-block relative z-10 tracking-tight w-[90%]">{chem.title}</h4>
                <div className="h-1 w-12 bg-yellow-500/30 my-2 rounded-full relative z-10 group-hover:w-full group-hover:bg-yellow-500 transition-all duration-700 ease-out"></div>
                <p className="text-[var(--text-secondary)] leading-[1.9] text-[13px] break-keep mt-2 relative z-10 font-bold opacity-80">{chem.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'error' && (
        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-black text-sm text-[var(--text-primary)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2"><AlertOctagon size={18} className="text-[var(--danger)]" /> 현상 실패 부검소 (Troubleshooting)</span>
            <span className="bg-[var(--bg-secondary)] border border-[var(--border)] py-1 px-3 rounded-xl font-mono text-[10px] shadow-sm tracking-widest">{errorDB.length} CASES</span>
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mb-6 tracking-wide leading-relaxed font-semibold">웹상에서 가장 많이 보고되는 참혹한 데이터들을 역추적하여, 화학적 증상에 기반한 완벽한 원인 부검 검시록을 제공합니다. 여러분의 필름을 버리기 전 먼저 상태를 대조해 보십시오.</p>
          <div className="grid grid-cols-1 gap-5">
            {errorDB.map((err, idx) => (
              <div key={idx} className="card p-6 flex flex-col gap-0 border-l-4 border-l-[var(--danger)] bg-gradient-to-r from-[var(--danger)]/5 to-[var(--bg-primary)] relative shadow-md">
                <div className="flex items-center gap-3 mb-4 border-b border-[var(--danger)]/20 pb-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--danger)]/20 flex items-center justify-center text-[var(--danger)] font-black shrink-0">
                    !
                  </div>
                  <h4 className="font-black text-lg text-[var(--danger)] drop-shadow-sm tracking-tight">{err.title}</h4>
                </div>
                
                <div className="flex flex-col gap-2 mt-2 bg-black/10 p-4 rounded-lg">
                  <span className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-widest border-b border-[var(--border)] pb-1 mb-1">증상 (Symptom)</span>
                  <p className="font-bold text-[13px] text-[var(--text-primary)] leading-relaxed">{err.fail}</p>
                </div>
                
                <div className="flex flex-col gap-2 mt-4 ml-2">
                  <span className="text-[10px] font-black uppercase text-[var(--danger)] tracking-widest">부검 소견 & 원인 분석 (Autopsy & Reason)</span>
                  <p className="text-[13px] leading-[1.8] text-[var(--text-secondary)] font-bold break-keep">{err.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
