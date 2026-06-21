# invoice-web

Notion에서 관리하는 인보이스를 클라이언트가 웹 브라우저에서 조회하고 PDF로 다운로드할 수 있는 인보이스 조회 시스템입니다.

## 프로젝트 개요

**목적**: 관리자가 Notion에서 관리하는 인보이스를 클라이언트가 별도 회원가입 없이 인보이스 번호와 접근 코드만으로 조회하고 PDF로 저장할 수 있게 한다.

**사용자**
- 클라이언트 (비로그인): 인보이스 번호 + 접근 코드로 자신의 인보이스 조회 및 PDF 다운로드
- 관리자 (인증 필요): Notion 인보이스 현황 확인 및 클라이언트 공유 링크 생성

## 주요 페이지

1. `/invoice` — 인보이스 번호와 접근 코드 입력 폼 (공개)
2. `/invoice/[invoiceNumber]` — 인보이스 상세 및 PDF 다운로드 (세션 기반 보안)
3. `/admin/login` — 관리자 비밀번호 로그인
4. `/dashboard` — 인보이스 목록 및 공유 링크 생성 (관리자 전용)

## 핵심 기능

- **인보이스 조회**: 번호 + 접근 코드로 특정 인보이스에만 접근
- **접근 코드 보안**: POST 바디 전송 + 상세 페이지 매 요청 세션 재검증
- **PDF 다운로드**: 브라우저 Print API(`window.print`) 활용, 별도 라이브러리 없음
- **관리자 공유 기능**: 대시보드에서 조회 URL + 접근 코드를 클립보드로 복사
- **다크/라이트 모드**: next-themes 기반 시스템 테마 연동

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (radix-ui 기반)
- **Forms**: React Hook Form + Zod v4
- **Database**: Notion API (REST)
- **Auth**: httpOnly 쿠키 기반 서명 토큰

## 시작하기

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 Notion API 키, 관리자 비밀번호 등 입력

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 환경 변수

`.env.local.example` 파일을 복사하여 `.env.local`을 생성하고 아래 값을 설정하세요.

| 변수명 | 설명 |
|--------|------|
| `NOTION_API_KEY` | Notion API 키 (https://www.notion.so/my-integrations) |
| `NOTION_DATABASE_ID` | Notion 인보이스 데이터베이스 ID |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호 |
| `JWT_SECRET` | 토큰 서명용 시크릿 |
| `NEXT_PUBLIC_COMPANY_NAME` | 인보이스 헤더 회사명 |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | 회사 주소 |
| `NEXT_PUBLIC_COMPANY_PHONE` | 회사 전화번호 |
| `NEXT_PUBLIC_COMPANY_EMAIL` | 회사 이메일 |

## Notion 데이터베이스 스키마

인보이스 데이터베이스에 다음 필드가 필요합니다.

| 필드명 | 타입 | 설명 |
|--------|------|------|
| Title | Title | 인보이스 번호 |
| Client | Rich Text | 클라이언트명 |
| Amount | Number | 금액 |
| Status | Select | draft / sent / paid / overdue |
| IssueDate | Date | 발급일 |
| DueDate | Date | 납부 기한 |
| Description | Rich Text | 설명 |
| Currency | Select | KRW / USD / EUR |
| AccessCode | Rich Text | 클라이언트 접근 코드 (6~8자리) |

## 개발 상태

- 프로젝트 기본 구조 및 인증 시스템 구현 완료
- Notion API 연동 구현 완료
- 클라이언트 인보이스 조회 / 상세 페이지 구현 완료
- PDF 다운로드 기능 구현 완료
- 관리자 대시보드 / 공유 모달 구현 완료

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항
- [개발 가이드](./CLAUDE.md) - 개발 지침
