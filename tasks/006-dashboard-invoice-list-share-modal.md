# Task 006: 인보이스 목록 및 공유 모달

## 개요

관리자 대시보드에서 인보이스 목록을 테이블로 표시하고, 각 인보이스의 공유 버튼 클릭 시 조회 폼 URL + 접근 코드를 확인·복사할 수 있는 공유 모달 구현.

- **Phase:** 4 — 대시보드 공유 기능
- **우선순위:** ⭐ (Phase 1 완료 후 Phase 2/3와 병렬 진행 가능)
- **의존성:** Task 001 (관리자 인증), Task 002 (Notion AccessCode 필드)

---

## 관련 파일

| 파일 | 역할 | 상태 |
|------|------|------|
| `components/dashboard/invoice-list.tsx` | 인보이스 목록 테이블 + 공유 버튼 (Client Component) | ✅ 구현 완료 |
| `components/dashboard/share-modal.tsx` | 공유 URL·접근 코드 표시 + 클립보드 복사 (Client Component) | ✅ 구현 완료 |
| `app/dashboard/page.tsx` | InvoiceList 통합 (Server Component) | ✅ 구현 완료 |
| `lib/notion.ts` | `getInvoices()` — accessCode 포함 인보이스 목록 | ✅ 구현 완료 (Task 002) |

> **설계 선택**: ROADMAP에서 언급된 별도 `dashboard.ts` Server Action 없이, `getInvoices()`로 가져온 `Invoice.accessCode`를 `InvoiceList → ShareModal`로 직접 props 전달. 별도 API 호출 불필요.

---

## 구현 명세

### `components/dashboard/invoice-list.tsx`
- `"use client"` — `useState<Invoice | null>`로 선택된 인보이스 상태 관리
- 인보이스 목록 테이블: 번호, 클라이언트, 금액, 발급일, 상태 배지, 공유 버튼
- 공유 버튼: `<Share2>` 아이콘, `aria-label="${invoiceNumber} 공유"`
- `<ShareModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />` 하단 배치
- 빈 목록 시 "인보이스가 없습니다." 안내 문구

### `components/dashboard/share-modal.tsx`
- `Dialog` (shadcn/ui) 기반 모달
- **조회 링크**: `{origin}/invoice?number={encodeURIComponent(invoiceNumber)}`
- **접근 코드**: `invoice.accessCode ?? "접근 코드 없음"`
- `CopyButton` 내부 컴포넌트:
  - `navigator.clipboard.writeText()` 호출
  - 성공: 2초간 `<Check>` 아이콘 표시
  - 실패: `toast.error("복사에 실패했습니다. 직접 선택하여 복사해 주세요.")`
- 모달 열기: `open={!!invoice}`, 닫기: `onOpenChange → onClose()`

### `app/dashboard/page.tsx`
- `export const dynamic = "force-dynamic"`
- `Promise.all([getInvoiceSummary(), getInvoices()])` 병렬 조회
- `<Suspense>` + `<DashboardContent>` 구조
- `<InvoiceList invoices={invoices} />` 렌더링

---

## 수락 기준

- [x] 인보이스 목록 테이블에 각 행마다 공유 버튼 표시
- [x] 공유 버튼 클릭 시 모달 열림, 조회 폼 URL·접근 코드 표시
- [x] URL/접근 코드 복사 버튼 → 클립보드 복사, Check 아이콘 피드백 확인
- [x] 복사 실패 시 앱 크래시 없이 `toast.error`로 안내
- [x] 미인증 상태에서 `/dashboard` 접근 불가 (`/admin/login?from=%2Fdashboard` 리다이렉트 확인)

---

## 🧪 테스트 체크리스트 (Playwright MCP)

### 정상 케이스
- [x] **정상-1**: INV-2024-001 공유 버튼 클릭 → 모달 표시, URL `http://localhost:3000/invoice?number=INV-2024-001` 및 접근 코드 `ABC1234` 노출 확인
- [x] **정상-2**: URL 복사 버튼 클릭 → `navigator.clipboard.readText()`로 `http://localhost:3000/invoice?number=INV-2024-001` 검증, SVG path `M20 6 9 17l-5-5`(Lucide Check 아이콘)로 전환 확인
- [x] **정상-3**: 접근 코드 복사 버튼 클릭 → 클립보드 값 `ABC1234` 검증 확인
- [x] **정상-4**: 닫기(X) 버튼 클릭 → `role="dialog"` 요소 미존재 확인 (모달 닫힘)

### 에러 케이스
- [x] **에러-1**: `navigator.clipboard.writeText = () => Promise.reject(...)` 스텁 주입 → `waitFor("복사에 실패했습니다")` 성공 (sonner toast.error 표시), 앱 크래시 없음, 페이지 URL 유지 확인

### 보안 케이스
- [x] **보안-1**: 로그아웃 후 `/dashboard` 직접 접근 → `/admin/login?from=%2Fdashboard` 리다이렉트 확인

**수락 기준:** 위 테스트 항목 전체 통과 시 Task 완료 ✅

---

## 구현 노트

- `invoice.accessCode`가 없는 인보이스는 모달에서 "접근 코드 없음" 표시 — Notion AccessCode 필드 미설정 인보이스 방어 처리
- `window.location.origin`은 SSR 시 `undefined`이므로 `typeof window !== "undefined"` 가드 적용
- `CopyButton`의 copied 상태는 모달 내 각 버튼이 독립적으로 관리 (컴포넌트 분리)
- 클립보드 API(`navigator.clipboard`)는 HTTPS 또는 localhost에서만 동작 — 개발 환경(`localhost:3000`)에서 정상 작동

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-22 | 태스크 파일 생성, 구현 완료 확인, Playwright 테스트 전체 통과 ✅ |
