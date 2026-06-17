# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

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

## 아키텍처

### 레이아웃 구조

`app/layout.tsx`가 전체 쉘을 구성: `ThemeProvider → TooltipProvider → Header → <main> → Footer → Toaster`. 모든 페이지가 이 레이아웃을 공유하며, 페이지별 메타데이터는 각 `page.tsx`에서 `export const metadata`로 선언.

### 컴포넌트 계층

- `components/ui/` — shadcn/ui 원본 컴포넌트 (직접 수정 가능)
- `components/layout/` — Header, Footer, MobileNav, ThemeToggle, ThemeProvider
- `components/landing/` — 랜딩 페이지 섹션 (HeroSection, FeaturesSection, CtaSection)
- `components/dashboard/` — 대시보드 전용 컴포넌트 (StatsCard, OverviewTabs, RecentActivity)

### 데이터 및 타입

- `lib/types.ts` — 프로젝트 공통 타입 정의
- `lib/constants.ts` — 네비게이션, 피처 목록, 목업 데이터 등 정적 상수 (데이터 변경 시 여기를 수정)
- `lib/utils.ts` — `cn()` 유틸리티 (clsx + tailwind-merge)

### 경로 별칭

`@/`는 프로젝트 루트를 가리킴 (`tsconfig.json` paths 설정).

## shadcn/ui 주의사항

이 프로젝트는 `radix-ui` 패키지(v1+, 단일 패키지)를 사용하며, 기존의 개별 `@radix-ui/*` 패키지와 다름. 컴포넌트 임포트 경로가 다를 수 있으므로 기존 `components/ui/` 파일을 참고할 것.
