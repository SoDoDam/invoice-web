# invoice-web AI Agent 개발 규칙

## 1. 프로젝트 개요

- **목적**: Notion 인보이스를 클라이언트가 웹에서 조회·PDF 다운로드하는 시스템
- **스택**: Next.js 16.2.9 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui (radix-nova)
- **경로 별칭**: `@/` → 프로젝트 루트 (`tsconfig.json` paths)
- **언어**: 코드 주석·커밋 메시지·문서 → 한국어, 변수명·함수명 → 영어

---

## 2. 디렉토리 구조 및 파일 역할

```
app/
├── actions/
│   ├── admin.ts          # 관리자 로그인/로그아웃 Server Action ("use server" 필수)
│   ├── invoice-client.ts # 클라이언트 접근 코드 검증 Server Action ("use server" 필수)
│   └── invoice.ts        # 인보이스 CRUD Server Action ("use server" 필수)
├── admin/login/page.tsx  # 관리자 로그인 페이지 (Server Component)
├── dashboard/page.tsx    # 관리자 대시보드 (force-dynamic 필수)
├── invoice/
│   ├── page.tsx          # 조회 폼 페이지
│   └── [invoiceNumber]/page.tsx  # 상세 페이지 (force-dynamic 필수)
├── layout.tsx            # 루트 레이아웃: ThemeProvider → TooltipProvider → Header → main → Footer → Toaster
└── globals.css           # Tailwind v4 테마 (@theme inline {}), @media print 스타일

components/
├── ui/                   # shadcn/ui 원본 (직접 수정 가능, 삭제 시 재설치 필요)
├── layout/               # Header, Footer, ThemeToggle, ThemeProvider, AdminLoginForm
├── invoice/              # InvoiceLookupForm, InvoiceTemplate, PdfDownloadButton
└── dashboard/            # StatsCard, InvoiceList, ShareModal

lib/
├── types.ts              # 공통 타입 (Invoice, InvoiceStatus, Currency 등) — 서버+클라이언트 공용
├── constants.ts          # SITE_NAME, INVOICE_STATUS_CONFIG, CURRENCY_CONFIG 등 — 서버+클라이언트 공용
├── utils.ts              # cn() 유틸 (clsx + tailwind-merge)
├── notion.ts             # ⚠️ 서버 전용 — Notion REST API 연동
└── auth.ts               # ⚠️ 서버 전용 — JWT 토큰 및 인보이스 세션 유틸

middleware.ts             # /dashboard 접근 제어 (admin_token 쿠키 검증) — 미구현 상태
```

---

## 3. Next.js 16 / React 19 필수 사항

### params는 반드시 await

```typescript
// ✅ 올바름 (Next.js 16)
type Props = { params: Promise<{ invoiceNumber: string }> }
export default async function Page({ params }: Props) {
  const { invoiceNumber } = await params
}

// ❌ 금지 (Next.js 14 이하 방식)
type Props = { params: { invoiceNumber: string } }
```

### useActionState (React 19)

```typescript
// ✅ 올바름
import { useActionState } from "react"
const [state, action, isPending] = useActionState(formAction, null)

// ❌ 금지
import { useFormState } from "react-dom"
```

### force-dynamic 필수 페이지

- `app/dashboard/page.tsx` — Notion API 호출
- `app/invoice/[invoiceNumber]/page.tsx` — 세션 쿠키 + Notion API 호출
- 위 파일에 `export const dynamic = "force-dynamic"` 반드시 포함

### Server Component / Client Component 구분

- **"use client" 필수**: `InvoiceLookupForm`, `PdfDownloadButton`, `ShareModal`, `AdminLoginForm` (useState/useEffect/useActionState 사용)
- **서버에서만 import 가능**: `lib/notion.ts`, `lib/auth.ts`, `app/actions/*.ts`
- **공용 사용 가능**: `lib/types.ts`, `lib/constants.ts`, `lib/utils.ts`

---

## 4. 보안 규칙 (절대 준수)

### 접근 코드 전송

- **접근 코드는 반드시 POST body(FormData)로만 전송**
- URL 쿼리 파라미터, URL path에 접근 코드 포함 금지
- 조회 폼 URL에는 인보이스 번호만 쿼리 파라미터로 허용 (`?number=INV-001`)

### 오류 메시지 일관성

- 인보이스 미존재·접근 코드 불일치 모두 동일 메시지 반환
- 반드시: `"인보이스를 찾을 수 없거나 접근 코드가 올바르지 않습니다."`
- 두 케이스를 구분하는 메시지 사용 금지

### 상수 시간 비교

- 접근 코드 비교 시 `timingSafeEqual()` 함수 사용 (타이밍 공격 방어)
- `===` 직접 비교 금지

```typescript
// ✅ 올바름
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

// ❌ 금지
if (accessCode === invoice.accessCode) { ... }
```

### 쿠키 보안

- 모든 인증 쿠키는 반드시 `httpOnly: true` 설정
- 관리자 토큰: `admin_token` (7일 만료)
- 인보이스 세션: `invoice_session_{invoiceNumber}` (24시간 만료)
- 세션 값 형식: `verified:{invoiceNumber}`

### 인보이스 상세 페이지 보안

- 매 요청마다 `verifyInvoiceSession(invoiceNumber)` 호출 필수
- 세션 없으면 `/invoice?number={invoiceNumber}`로 redirect
- 세션 검증 없이 렌더링 절대 금지

---

## 5. Tailwind v4 및 shadcn/ui 규칙

### Tailwind v4

- `tailwind.config.js` 파일 없음 — 생성 금지
- 테마 커스텀은 `app/globals.css`의 `@theme inline {}` 블록에서만 수행
- CSS 변수 방식: oklch 색상 시스템 사용 (`--color-primary`, `--color-background` 등)
- 임포트: `@import "tailwindcss"` (최상단)

### shadcn/ui 컴포넌트 추가

```bash
# ✅ 올바른 명령어
npx shadcn add <component-name>

# ❌ 금지
npx shadcn-ui@latest add <component>
```

- 컴포넌트 임포트: `@/components/ui/<name>`
- `radix-ui` 단일 패키지 사용 (기존 `@radix-ui/*` 개별 패키지 아님)
- 기존 `components/ui/` 파일 임포트 패턴 참고 필수

### 아이콘

- 반드시 `lucide-react` 패키지에서 import
- `import { IconName } from "lucide-react"`

### 인쇄 스타일

- PDF 다운로드는 `window.print()` 사용
- 인쇄 시 숨길 요소: `className="print:hidden"`
- 인쇄 전용 스타일: `app/globals.css`의 `@media print {}` 블록에 추가

---

## 6. Notion 연동 규칙

### 필드명 (Notion DB 컬럼명 → 정확한 대소문자 유지)

| Notion 필드 | 타입 | 매핑 함수 |
|---|---|---|
| `Title` | title | `getTitle(props.Title)` |
| `Client` | rich_text | `getRichText(props.Client)` |
| `Amount` | number | `getNumber(props.Amount)` |
| `Status` | select | `getSelect(props.Status)` |
| `IssueDate` | date | `getDate(props.IssueDate)` |
| `DueDate` | date | `getDate(props.DueDate)` |
| `Description` | rich_text | `getRichText(props.Description)` |
| `Currency` | select | `getSelect(props.Currency, "KRW")` |
| `AccessCode` | rich_text | `getRichText(props.AccessCode)` |

### API 호출

- `@notionhq/client` 사용 금지 — `lib/notion.ts`의 `notionFetch()` 내부 함수만 사용
- Notion API 버전: `"Notion-Version": "2024-08-01"`
- 인보이스 삭제: `archived: true` PATCH (실제 삭제 아님)
- 페이지네이션: `has_more` + `next_cursor` 루프 방식 (`getInvoices` 참고)

### 인보이스 번호 조회

- `getInvoiceByNumber(invoiceNumber)`: `Title` 필드로 exact match 검색
- `getInvoiceById(id)`: Notion 페이지 ID로 단건 조회

---

## 7. Server Action 패턴

### 파일 구조

```typescript
"use server"  // 반드시 첫 줄

import { z } from "zod"
// ...

const Schema = z.object({ ... })
type ActionResult = { success: false; error: string }

export async function someAction(formData: FormData): Promise<ActionResult> {
  const parsed = Schema.safeParse({ ... })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }
  // ...
}
```

### Zod v4 에러 접근

```typescript
// ✅ 올바름 (Zod v4)
parsed.error.issues[0].message

// ❌ 금지 (Zod v3 이하)
parsed.error.errors[0].message
```

### redirect 사용

- `redirect()` 호출 후 return 불필요 (throw 방식)
- 성공 시 redirect, 실패 시 `{ success: false, error: string }` 반환

### useActionState 연동 폼 패턴

```typescript
// Client Component
type State = { error?: string } | null

async function formAction(_prev: State, formData: FormData): Promise<State> {
  const result = await serverAction(formData)
  return result
}

const [state, action, isPending] = useActionState(formAction, null)
// form에 action={action} 적용
```

---

## 8. 파일 간 동기화 규칙

아래 변경 시 **반드시 함께 수정**해야 하는 파일 목록:

| 변경 사항 | 함께 수정할 파일 |
|---|---|
| `Invoice` 타입 필드 추가/삭제 | `lib/notion.ts`의 `pageToInvoice()` 및 `createInvoice()`, `updateInvoice()` |
| Notion DB 필드명 변경 | `lib/notion.ts`의 `pageToInvoice()` 내 props 접근 코드 |
| `InvoiceStatus` union 타입 변경 | `lib/constants.ts`의 `INVOICE_STATUS_CONFIG` |
| `Currency` union 타입 변경 | `lib/constants.ts`의 `CURRENCY_CONFIG` |
| 새 환경 변수 추가 | `.env.local.example` |
| 새 shadcn 컴포넌트 추가 | `components/ui/` 확인 후 중복 방지 |
| `INVOICE_STATUS_CONFIG` 변경 | `components/invoice/invoice-template.tsx`의 Badge 스타일 확인 |

---

## 9. 환경 변수 규칙

| 변수 | 용도 | 노출 |
|---|---|---|
| `NOTION_API_KEY` | Notion 연동 | 서버 전용 |
| `NOTION_DATABASE_ID` | Notion DB ID | 서버 전용 |
| `ADMIN_PASSWORD` | 관리자 비밀번호 | 서버 전용 |
| `JWT_SECRET` | 토큰 서명 시크릿 | 서버 전용 |
| `NEXT_PUBLIC_COMPANY_NAME` | 인보이스 발급처 상호 | 클라이언트 노출 가능 |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | 발급처 주소 | 클라이언트 노출 가능 |
| `NEXT_PUBLIC_COMPANY_PHONE` | 발급처 전화 | 클라이언트 노출 가능 |
| `NEXT_PUBLIC_COMPANY_EMAIL` | 발급처 이메일 | 클라이언트 노출 가능 |

- 서버 전용 변수는 Client Component에서 절대 사용 금지
- 환경 변수 누락 시 `lib/notion.ts`, `lib/auth.ts`에서 명시적 Error throw

---

## 10. 금지 사항

- `lib/notion.ts` 또는 `lib/auth.ts`를 Client Component에서 import 금지
- `next/headers`(cookies, headers)를 Client Component에서 import 금지
- `@notionhq/client`의 SDK 클라이언트 직접 사용 금지 (내부 `notionFetch()` 사용)
- URL 쿼리 파라미터에 접근 코드(`accessCode`) 포함 금지
- 접근 코드 비교 시 `===` 직접 비교 금지 (타이밍 공격 위험)
- 두 케이스(미존재/코드 불일치)를 구분하는 오류 메시지 사용 금지
- `tailwind.config.js` 파일 생성 금지 (Tailwind v4는 설정 파일 없음)
- `npx shadcn-ui@latest` 명령어 사용 금지 (`npx shadcn` 사용)
- `@radix-ui/*` 개별 패키지 import 금지 (`radix-ui` 단일 패키지 사용)
- `useFormState` import 금지 (`useActionState` 사용)
- Next.js 동적 라우트에서 `params`를 await 없이 직접 구조분해 금지
- Notion API 직접 삭제 (`DELETE`) 금지 — `archived: true` PATCH 사용
- 쿠키 설정 시 `httpOnly: true` 누락 금지
- 세션 검증 없이 인보이스 상세 페이지 렌더링 금지
- `.env.local` 파일을 git commit에 포함 금지

---

## 11. 테스트 규칙

- API 연동·비즈니스 로직이 포함된 모든 Task는 Playwright MCP(`mcp__playwright__*`)로 E2E 테스트 필수
- 각 Task에 `### 🧪 테스트 체크리스트 (Playwright MCP)` 섹션 작성 필수
- 테스트 항목: 정상 케이스 + 에러/엣지 케이스 + 보안 케이스
- 모든 테스트 통과 후에만 Task 완료(✅) 표시 가능
- 개발 서버: `npm run dev` (http://localhost:3000)
