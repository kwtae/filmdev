import { BookOpen } from 'lucide-react';

// Mocked tips library (Later you can crawl and populate this)
const tipsDB = [
  { id: 1, title: 'Push Processing (+1 Stop)', content: '감도를 1스탑 높여 촬영한 경우 현상 시간을 기본 시간 대비 약 1.5배(50%) 증가시킵니다. 입자가 거칠어지고 콘트라스트가 강해지는 특징이 있습니다.' },
  { id: 2, title: 'Stand Development (조용 현상)', content: 'Rodinal 등의 약품을 1:100의 극단적인 비율로 희석한 뒤, 최소 1시간 이상 놔두며 교반을 전혀 하지 않거나 초반 1회만 실시합니다. 경계면 강조 효과(Edge Effect)를 얻을 수 있습니다.' },
  { id: 3, title: 'Fixer (정착액) 관리법', content: '필름의 은 입자를 완전히 제거하기 위한 단계. 정착이 덜 되면 필름 베이스가 보라색이나 탁한 막이 씌워진 채로 나옵니다. 사용 횟수에 따라 시간이 늘어나므로 보통 재사용 시 1회당 10% 시간을 늘려줍니다.' },
  { id: 4, title: 'Safelight 안전등 가이드', content: '흑백 필름(Panchromatic)은 모든 빛에 반응하므로 암백(Darkbag) 밖에서 절대 꺼내면 안 됩니다! 오직 인화지(Paper) 과정에서만 붉은색 안전등(Safelight) 아래에서 작업이 가능합니다.' },
];

export default function WikiScreen() {
  return (
    <div className="p-4 flex flex-col gap-4 pb-24">
      <div className="flex items-center gap-2 mb-2 border-b border-[var(--border)] pb-4 text-[var(--text-primary)]">
        <BookOpen className="text-[var(--accent)]" size={24} />
        <h2 className="text-2xl font-bold tracking-tighter uppercase">Knowledge Wiki</h2>
      </div>
      
      <p className="text-sm text-[var(--text-secondary)] mb-2">웹 데이터베이스 및 커뮤니티에서 검증된 현상 팁 도서관입니다.</p>

      <div className="flex flex-col gap-4">
        {tipsDB.map(tip => (
          <div key={tip.id} className="card p-5 group flex flex-col gap-2">
            <h3 className="font-bold text-lg text-[var(--accent)]">{tip.title}</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm break-keep">{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
