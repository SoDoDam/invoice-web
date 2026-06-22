# Task 003: 인보이스 조회 폼 및 접근 코드 검증

## 개요

클라이언트가 인보이스 번호 + 접근 코드를 입력해 인보이스 상세 페이지로 이동하는 조회 흐름 구현.

- **Phase:** 2 — 클라이언트 인보이스 조회
- **우선순위:** ⭐ (최우선)
- **의존성:** Task 001 (관리자 인증), Task 002 (Notion 데이터 모델)

---

## 관련 파일

| 파일 | 역할 | 상태 |
|------|------|------|
| `app/invoice/page.tsx` | 조회 폼 페이지 (Server Component) | ✅ 구현 완료 |
| `components/invoice/invoice-lookup-form.tsx` | 번호+코드 입력 폼 (Client Component) | ✅ 구현 완료 |
| `app/actions/invoice-client.ts` | `verifyInvoiceAccessAction()` Server Action | ✅ 구현 완료 |
| `lib/notion.ts` | `getInvoiceByNumber()` | ✅ 구현 완료 (Task 002) |
| `lib/auth.ts` | `getInvoiceSessionKey()` | ✅ 구현 완료 (Task 001) |

---

## 구현 명세

### `app/invoice/page.tsx`
- Server Component
- `<Suspense>` + `<InvoiceLookupForm />` 조합
- 페이지 메타데이터: "인보이스 조회"

### `components/invoice/invoice-lookup-form.tsx`
- `"use client"` — React Hook Form + Zod 검증
- `useSearchParams()`으로 쿼리 파라미터 `?number=...` 자동 입력
- `type="password"`로 접근 코드 마스킹
- `useActionState()`로 Server Action 연동
- Zod 스키마: `invoiceNumber(min:1)`, `accessCode(min:6, max:8)`
- 오류 메시지: 필드별 인라인 + 서버 응답 인라인 표시

### `app/actions/invoice-client.ts` — `verifyInvoiceAccessAction()`
- `"use server"` — FormData 입력, Zod 파싱
- `getInvoiceByNumber(invoiceNumber)` 호출 → 인보이스 미존재 시 동일 오류 반환
- **상수 시간 비교** (`timingSafeEqual`) — 타이밍 공격 방어
- httpOnly 쿠키 저장: `invoice_session_{invoiceNumber}` → `"verified:{invoiceNumber}"`
  - `secure: process.env.NODE_ENV === "production"`
  - `sameSite: "lax"`, `maxAge: 86400` (24시간)
- 성공 시 `redirect('/invoice/{invoiceNumber}')`
- 오류 메시지: **"인보이스를 찾을 수 없거나 접근 코드가 올바르지 않습니다."** (존재 여부 은닉)

---

## 수락 기준

- [x] 접근 코드가 URL/쿼리에 노출되지 않고 POST 바디(FormData)로만 전송됨
- [x] 올바른 번호 + 코드 입력 시 `/invoice/[invoiceNumber]`로 이동
- [x] 잘못된 코드 / 미존재 번호 → 동일한 오류 메시지 인라인 표시
- [x] 빈 입력 제출 → Zod 검증으로 폼 제출 차단
- [x] 세션 쿠키가 `httpOnly` 속성으로 저장됨 (document.cookie 빈 문자열 확인)

---

## 🧪 테스트 체크리스트 (Playwright MCP)

### 정상 케이스
- [x] **정상-1**: 올바른 번호 + 접근 코드 입력 → `/invoice/[invoiceNumber]` 상세 페이지로 이동
- [x] **정상-2**: `?number=INV-001` 쿼리 파라미터로 인보이스 번호 필드 자동 입력 확인

### 에러/엣지 케이스
- [x] **에러-1**: 잘못된 접근 코드 → "인보이스를 찾을 수 없거나 접근 코드가 올바르지 않습니다." 인라인 표시, 상세 페이지 미이동
- [x] **에러-2**: 존재하지 않는 인보이스 번호 → 동일 오류 메시지 표시 (존재 여부 은닉)
- [x] **에러-3**: 빈 인보이스 번호 제출 → "인보이스 번호를 입력하세요" Zod 검증 차단
- [x] **에러-4**: 5자리 접근 코드 제출 → "접근 코드는 6자리 이상이어야 합니다" Zod 검증 차단

### 보안 케이스
- [x] **보안-1**: `browser_network_requests`로 검증 요청 확인 → 접근 코드가 URL/쿼리에 미노출, `multipart/form-data` POST 바디로만 전송
- [x] **보안-2**: 존재/비존재 인보이스에 대해 동일한 오류 메시지 "인보이스를 찾을 수 없거나 접근 코드가 올바르지 않습니다." 확인

**수락 기준:** 위 테스트 항목 전체 통과 시 Task 완료 ✅

---

## 구현 노트

- `timingSafeEqual`이 `lib/auth.ts`와 `app/actions/invoice-client.ts` 양쪽에 중복 정의되어 있음 — 추후 `lib/auth.ts`로 통합 고려 (현재 동작에는 문제 없음)
- `useActionState` + `react-hook-form` 혼용 구조: RHF는 클라이언트 사이드 Zod 검증만 담당, 실제 제출은 `form action={action}`으로 Native FormData 전송
- Notion API 버전: `2026-03-11` (최신)

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-22 | 태스크 파일 생성, 구현 완료 확인, Playwright 테스트 전체 통과 ✅ |
