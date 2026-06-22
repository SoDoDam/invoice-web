# Task 005: PDF 다운로드 버튼 및 인쇄 스타일

## 개요

인보이스 상세 페이지에서 `window.print()`로 브라우저 인쇄 대화상자를 열어 PDF 저장을 지원하는 버튼과, 인쇄 시 불필요한 UI를 숨기는 `@media print` 스타일 구현.

- **Phase:** 3 — PDF 다운로드
- **우선순위:** ⭐ (Phase 2 완료 후 진행)
- **의존성:** Task 004 (인보이스 상세 페이지 위에서 동작)

---

## 관련 파일

| 파일 | 역할 | 상태 |
|------|------|------|
| `components/invoice/pdf-download-button.tsx` | PDF 다운로드 버튼 (Client Component) | ✅ 구현 완료 |
| `app/globals.css` | `@media print` 인쇄 스타일 | ✅ 구현 완료 |
| `components/invoice/invoice-template.tsx` | PDF 버튼 `print:hidden` 배치 | ✅ 구현 완료 (Task 004) |

---

## 구현 명세

### `components/invoice/pdf-download-button.tsx`
- `"use client"` — Client Component
- `window.print()` 호출
- `aria-label={`${invoiceNumber} PDF 다운로드`}` 접근성 속성
- `variant="outline"`, `Download` 아이콘 포함

### `app/globals.css` — `@media print`
```css
@media print {
  header, footer, .print\:hidden {
    display: none !important;
  }
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .invoice-wrapper {
    max-width: 100%;
  }
}
```
- `header`, `footer`, `.print:hidden` 요소 숨김
- `print-color-adjust: exact` — 배경색/배지 색상 인쇄 허용
- `.invoice-wrapper` 전체 너비 확장

### `components/invoice/invoice-template.tsx` 내 배치
```tsx
<div className="mb-6 flex justify-end print:hidden">
  <PdfDownloadButton invoiceNumber={invoice.invoiceNumber} />
</div>
```
- Tailwind `print:hidden` 클래스로 인쇄 시 버튼 숨김

---

## 수락 기준

- [x] PDF 다운로드 버튼 클릭 시 `window.print()` 호출 → 브라우저 인쇄 대화상자 표시
- [x] 인쇄 미디어에서 header/footer/버튼(`print:hidden`) 숨김
- [x] 배경색·배지 색상이 인쇄 결과물에 포함됨 (`print-color-adjust: exact`)
- [x] 인보이스 본문(`.invoice-wrapper`)이 전체 너비로 출력됨

---

## 🧪 테스트 체크리스트 (Playwright MCP)

### 정상 케이스
- [x] **정상-1**: `window.__printCalled` 스텁으로 PDF 다운로드 버튼 클릭 → `window.print()` 호출 확인 (`true` 반환)
- [x] **정상-2**: `document.styleSheets`에서 `@media print` 규칙 파싱 → `header, footer, .print\:hidden { display: none !important }` / `print-color-adjust: exact` / `.invoice-wrapper { max-width: 100% }` 3개 규칙 모두 확인. PDF 버튼이 `.print\:hidden` 래퍼 안에 위치 확인

### 에러 케이스
- [x] **에러-1**: 미인증 번호(`INV-NEVER-AUTHED`)로 상세 접근 → 조회 페이지 리다이렉트, `button[aria-label*="PDF 다운로드"]` 미존재 확인

**수락 기준:** 위 테스트 항목 전체 통과 시 Task 완료 ✅

---

## 구현 노트

- `window.print()`는 브라우저 네이티브 API이므로 별도 라이브러리 불필요
- Tailwind CSS v4에서 `print:hidden` 유틸리티 클래스가 `@media print { display: none }` 으로 컴파일됨. globals.css의 `.print\:hidden` 규칙은 이를 `!important`로 강화
- PDF 저장은 인쇄 대화상자에서 "PDF로 저장" 선택으로 완료 — 파일명은 브라우저가 페이지 타이틀 기반으로 자동 설정

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-22 | 태스크 파일 생성, 구현 완료 확인, Playwright 테스트 전체 통과 ✅ |
