# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**invoice-web**은 관리자가 Notion에서 관리하는 인보이스를 클라이언트가 웹 브라우저에서 직접 조회하고 PDF로 다운로드할 수 있는 인보이스 조회 시스템입니다.

## Project Context

- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md
- 에이전트 가이드: @AGENTS.md

## 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 기술 스택

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — PostCSS 플러그인 방식(`@tailwindcss/postcss`), 설정 파일 없음, `app/globals.css`에서 CSS 변수로 테마 관리
- **shadcn/ui** (`radix-nova` 스타일, `radix-ui` 패키지 사용) — `npx shadcn add <component>`로 추가
- **next-themes** — 다크/라이트 모드, `ThemeProvider`로 래핑
- **react-hook-form** + **zod v4** — 폼 유효성 검사
- **sonner** — 토스트 알림
- **@notionhq/client** — Notion API 연동

## 라우트 구조

```
공개 접근 (비로그인)
├── / → /invoice 리다이렉트
├── /invoice            — 인보이스 번호 + 접근 코드 입력 폼
└── /invoice/[num]      — 인보이스 상세 (세션 기반 보안)

관리자 (인증 필수)
├── /admin/login        — 관리자 비밀번호 로그인
└── /dashboard          — 인보이스 목록 + 공유 링크 생성 (middleware 보호)
```

## 아키텍처

### 레이아웃 구조

`app/layout.tsx`가 전체 쉘을 구성: `ThemeProvider → TooltipProvider → Header → <main> → Footer → Toaster`. 모든 페이지가 이 레이아웃을 공유하며, 페이지별 메타데이터는 각 `page.tsx`에서 `export const metadata`로 선언.

### 컴포넌트 계층

- `components/ui/` — shadcn/ui 원본 컴포넌트 (직접 수정 가능)
- `components/layout/` — Header, Footer, ThemeToggle, ThemeProvider, AdminLoginForm
- `components/invoice/` — InvoiceLookupForm, InvoiceTemplate, PdfDownloadButton
- `components/dashboard/` — StatsCard, InvoiceList, ShareModal

### 데이터 및 타입

- `lib/types.ts` — 프로젝트 공통 타입 정의 (Invoice, InvoiceStatus, Currency 등)
- `lib/constants.ts` — SITE_NAME, INVOICE_STATUS_CONFIG, CURRENCY_CONFIG 등
- `lib/utils.ts` — `cn()` 유틸리티 (clsx + tailwind-merge)
- `lib/notion.ts` — Notion API 연동 (서버 전용)
- `lib/auth.ts` — 관리자 토큰 및 인보이스 세션 유틸 (서버 전용)

### Server Actions

- `app/actions/admin.ts` — 관리자 로그인/로그아웃
- `app/actions/invoice-client.ts` — 인보이스 접근 코드 검증
- `app/actions/invoice.ts` — 인보이스 CRUD (대시보드용)

### 보안

- `/dashboard` 접근은 `middleware.ts`에서 `admin_token` httpOnly 쿠키 검증
- 인보이스 상세 페이지는 Server Component에서 세션 쿠키 재검증
- 접근 코드는 POST 바디로만 전송 (URL 노출 방지)

### 경로 별칭

`@/`는 프로젝트 루트를 가리킴 (`tsconfig.json` paths 설정).

## shadcn/ui 주의사항

이 프로젝트는 `radix-ui` 패키지(v1+, 단일 패키지)를 사용하며, 기존의 개별 `@radix-ui/*` 패키지와 다름. 컴포넌트 임포트 경로가 다를 수 있으므로 기존 `components/ui/` 파일을 참고할 것.

## 환경 변수

`.env.local.example` 참고. 필수 변수:
- `NOTION_API_KEY`, `NOTION_DATABASE_ID` — Notion 연동
- `ADMIN_PASSWORD`, `JWT_SECRET` — 관리자 인증
- `NEXT_PUBLIC_COMPANY_*` — 인보이스 헤더 회사 정보
