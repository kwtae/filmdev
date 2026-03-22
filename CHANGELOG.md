# 업데이트 기록 (Changelog)

## [v1.1.0] - 2026-03-23
### ✨ 기능 추가 (Features)
- 단일 페이지 애플리케이션(SPA) 내비게이션 확장을 위해 **위키(Wiki)** 및 **레시피 에디터(Recipe Editor)** 모듈 추가.
- 홈 화면의 `New(새로 만들기)` 버튼 활성화 및 라우팅 구현.
- **국제화(i18n):** 글로벌 Zustand 상태(`langStore`)를 도입하여 한국어(ko)와 영어(en)간 즉각적인 UI 텍스트 전환(Toggle) 기능 추가.
- 진행 중인 타이머 사이클을 즉시 중단하고 다음 단계 과정으로 넘어갈 수 있는 **`Skip Step ⏭` (단계 건너뛰기) 기능** 추가.

### 🐛 버그 수정 및 개선 (Fixes & Improvements)
- cPanel 환경 대응을 위해 `vite.config.ts`, `App.tsx` 상대경로 및 베이스(`/filmdev/`) 수정 건 반영됨.
- 터미널 팝업(Wake Lock) 알림 시각화 강화.
