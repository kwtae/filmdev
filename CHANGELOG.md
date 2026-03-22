# 업데이트 기록 (Changelog)

## [v1.1.0] - 2026-03-23
### ✨ 기능 추가 (Features)
- **BLE(Bluetooth Low Energy) 센서 온도 모니터링:** 아날로그/디지털 무선 온도 센서 개입을 위한 `Web Bluetooth API` 통신 스크립트 구축 및 타이머 UI(`ActiveProcessScreen.tsx`)에 실시간 온도 모니터링 연동.
- **Recipe Editor(초고도화):** 수동으로 이름을 짓는 것을 넘어, 각 현상 과정(Step)들의 시간 지정, 교반(Agitation) 주기 설정, 타입(Inversion, Continuous 등) 설정 및 단계 추가/삭제 기능(드래그 지원 예정)이 통합된 커스텀 에디터 구축 완료 (`RecipeEditorScreen.tsx`).
- **데이터 크롤링(웹스크래핑) 기반 통합:** 외부 데이터를 파싱하여 로컬 IndexedDB가 읽을 수 있는 표준 JSON으로 파이프라이닝 해주는 `scripts/scraper.js` Node 크롤러의 뼈대 구성.
- **국제화(i18n):** 글로벌 Zustand 상태(`langStore`)를 도입하여 한국어(ko)와 영어(en)간 즉각적인 UI 텍스트 전환(Toggle) 기능 추가.
- 진행 중인 타이머 사이클을 즉시 중단하고 다음 단계 과정으로 넘어갈 수 있는 **`Skip Step ⏭` (단계 건너뛰기) 기능** 추가.

### 🐛 버그 수정 및 개선 (Fixes & Improvements)
- cPanel 환경 대응을 위해 `vite.config.ts`, `App.tsx` 상대경로 및 베이스(`/filmdev/`) 수정 건 반영됨.
- 터미널 팝업(Wake Lock) 알림 시각화 강화.
