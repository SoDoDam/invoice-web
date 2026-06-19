# invoice-web 클라이언트 인보이스 조회 MVP PRD

## 목적

**목적**: 관리자가 Notion에서 관리하는 인보이스를 클라이언트가 웹 브라우저에서 직접 조회하고 PDF로 다운로드할 수 있게 한다.  
**사용자**: 인보이스를 발급받은 클라이언트(비로그인 외부 사용자)

---

## 사용자 여정

### 클라이언트 (공개 접근)
```
1. 인보이스 조회 페이지 (진입점)
   - /invoice 페이지에 접근
   - 인보이스 번호 + 접근 코드 입력
   ↓

2. 접근 코드 검증 (Server Action)
   - 접근 코드 일치 여부 확인
   [성공] → 세션 저장 후 인보이스 상세 페이지
   [실패] → 오류 메시지 표시, 재입력 유도

   ↓

3. 인보이스 상세 페이지
   - 세션 기반 보안 검증
   - 전문 인보이스 양식으로 데이터 표시
   - PDF 다운로드 버튼 클릭
   ↓

4. PDF 다운로드 완료
   - 브라우저 인쇄 대화상자 → "PDF로 저장"
```

### 관리자 (인증 필요)
```
1. 관리자 로그인 페이지
   - /admin/login에 접근
   - 관리자 비밀번호 입력
   - httpOnly 쿠키에 토큰 저장
   ↓

2. 대시보드 페이지
   - middleware에서 인증 검증
   - 인보이스 목록 표시
   ↓

3. 공유 링크 생성
   - "공유" 버튼 클릭 → 모달 표시
   - 조회 폼 URL + 접근 코드 표시
   - 클립보드에 복사
```

---

## 기능 명세

### MVP 핵심 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|---------------|-------------|
| **F001** | 인보이스 번호 조회 | 인보이스 번호와 접근 코드를 입력해 특정 인보이스를 조회 | 클라이언트가 자신의 인보이스에만 접근하는 핵심 진입 방식 | 인보이스 조회 페이지 |
| **F002** | URL 직접 접근 | `/invoice/[invoiceNumber]` URL로 직접 인보이스 페이지 진입 | 관리자가 클라이언트에게 링크를 공유하는 주요 배포 방식 | 인보이스 상세 페이지 |
| **F003** | 접근 코드 검증 | 인보이스별 접근 코드(4-8자리)로 비인가 조회 차단 | 공개 URL에서 타인의 인보이스 열람 방지를 위한 최소 보안 | 인보이스 조회 페이지, 인보이스 상세 페이지 |
| **F004** | 인보이스 웹 표시 | Notion 데이터를 전문 인보이스 양식(헤더, 품목, 합계, 상태)으로 렌더링 | 서비스의 핵심 가치 - 보기 좋은 형태로 인보이스 전달 | 인보이스 상세 페이지 |
| **F005** | PDF 다운로드 | 화면에 표시된 인보이스를 PDF 파일로 클라이언트 기기에 저장 | 클라이언트의 최종 목적 - 문서 보관 및 회계 처리 | 인보이스 상세 페이지 |
| **F006** | 관리자 공유 링크 생성 | 대시보드에서 인보이스별 공유 URL과 접근 코드를 생성·복사 | 관리자가 클라이언트에게 인보이스를 전달하는 워크플로우 | 대시보드 페이지 |

### MVP 제외 기능 (이후 단계)

- 이메일로 인보이스 발송
- 인보이스 목록 일괄 조회 (클라이언트별)
- 클라이언트 로그인/계정 관리
- 인보이스 열람 이력 추적
- 결제 연동

---

## 메뉴 구조

```
공개 접근 (비로그인)
├── 인보이스 조회 페이지      → F001, F003
│   └── /invoice (번호 + 코드 입력)
└── 인보이스 상세 페이지      → F002, F003, F004, F005
    └── /invoice/[invoiceNumber] (세션 기반 보안 검증)

관리자 메뉴 (인증 필수)
├── 관리자 로그인 페이지      → 관리자 인증
│   └── /admin/login (비밀번호 입력)
└── 대시보드 페이지           → F006 (middleware로 보호)
    └── /dashboard (인보이스 목록 + 공유 기능)
```

---

## 페이지별 상세 기능

### 인보이스 조회 페이지

> **구현 기능:** `F001`, `F003` | **접근:** 공개 (비로그인)

| 항목 | 내용 |
|------|------|
| **역할** | 클라이언트가 인보이스 번호와 접근 코드를 입력해 자신의 인보이스를 찾는 진입점 |
| **진입 경로** | 직접 URL 입력, 관리자가 공유한 링크(쿼리 파라미터로 번호 자동 입력 가능) |
| **사용자 행동** | 인보이스 번호 입력 → 접근 코드 입력 → 조회 버튼 클릭 |
| **주요 기능** | - 인보이스 번호 입력 필드 (Notion Title 필드와 매칭)<br>- 접근 코드 입력 필드 (마스킹 표시)<br>- 입력값 Zod 검증 (빈 값, 형식 오류)<br>- 잘못된 접근 코드 시 오류 메시지 표시<br>- **인보이스 조회** 버튼 |
| **다음 이동** | 성공 → 인보이스 상세 페이지, 실패 → 오류 메시지 인라인 표시 후 재입력 |

---

### 인보이스 상세 페이지

> **구현 기능:** `F002`, `F003`, `F004`, `F005` | **접근:** 세션 기반 보안 검증 후

| 항목 | 내용 |
|------|------|
| **역할** | 전문 인보이스 양식으로 데이터를 표시하고 PDF 다운로드를 제공하는 핵심 페이지 |
| **진입 경로** | 인보이스 조회 페이지에서 검증 성공 후 이동 (세션 저장) |
| **보안** | Server Component에서 세션/쿠키 검증 후 데이터 렌더링 (재검증) |
| **사용자 행동** | 인보이스 내용 확인 → PDF 다운로드 버튼 클릭 → 브라우저 인쇄 대화상자 → "PDF로 저장" |
| **주요 기능** | - 인보이스 헤더: 인보이스 번호, 발급일, 납부 기한, 상태 배지<br>- 발급처 정보: 서비스 제공자 상호/연락처 (환경 변수로 설정)<br>- 수신처 정보: 클라이언트명<br>- 금액 및 통화 표시 (KRW/USD/EUR 포맷)<br>- 설명(Description) 텍스트 표시<br>- 상태별 색상 구분 (draft/sent/paid/overdue)<br>- **PDF로 다운로드** 버튼 (window.print 사용) |
| **다음 이동** | PDF 다운로드 → 동일 페이지 유지, 세션 만료 시 → 조회 페이지 리다이렉트 |

---

### 대시보드 페이지 (관리자 기능)

> **구현 기능:** `F006` | **접근:** 관리자 인증 필수 (middleware 보호)

| 항목 | 내용 |
|------|------|
| **역할** | 관리자가 인보이스 목록을 보고 클라이언트 공유 링크 생성/관리 |
| **진입 경로** | 관리자 로그인 후 `/dashboard` 접근 (middleware에서 인증 검증) |
| **인증** | httpOnly 쿠키 기반 토큰 검증 (middleware) |
| **사용자 행동** | 인보이스 목록에서 특정 인보이스의 "공유" 버튼 클릭 → 모달에서 링크/코드 확인 → 클립보드 복사 |
| **주요 기능** | - 인보이스 목록 각 행에 공유 아이콘 버튼 추가<br>- 공유 모달: 조회 폼 URL 표시 + 접근 코드 표시<br>- 조회 폼 URL 클립보드 복사 버튼<br>- 접근 코드 클립보드 복사 버튼<br>- 접근 코드 재생성 버튼 (선택) |
| **다음 이동** | 모달 닫기 → 대시보드 목록으로 복귀 |

---

## 데이터 모델

기존 Notion 데이터 구조는 유지하며, 접근 코드 관리를 위한 최소 저장소를 추가한다.

### 접근 코드 저장 전략 (선택)

**옵션 A: Notion 필드 추가 (권장)**
- Notion 인보이스 데이터베이스에 `AccessCode` 필드(Rich Text) 추가
- 별도 DB 없이 Notion에서 일괄 관리

| Notion 필드 | 설명 | 타입 |
|-------------|------|------|
| Title | 인보이스 번호 | Title |
| Client | 클라이언트명 | Rich Text |
| Amount | 금액 | Number |
| Status | 상태 (draft/sent/paid/overdue) | Select |
| IssueDate | 발급일 | Date |
| DueDate | 납부 기한 | Date |
| Description | 설명 | Rich Text |
| Currency | 통화 (KRW/USD/EUR) | Select |
| **AccessCode** | 클라이언트 접근 코드 (신규 추가) | Rich Text |

**옵션 B: 환경 변수 고정 코드**
- 단일 `ACCESS_CODE` 환경 변수로 모든 인보이스에 동일 코드 적용
- 구현 가장 단순, 보안성 낮음 (MVP 초기 단계에 적합)

---

## 기술 아키텍처

### 현재 스택 기반 구현

```
클라이언트 브라우저
    ↓ (조회 폼 제출 - POST)
Next.js 16 App Router (middleware 보호)
    ├── middleware.ts               (인증 검증)
    ├── /admin/login (관리자 로그인)
    ├── /invoice/page.tsx           (Server Component - 조회 폼)
    └── /invoice/[invoiceNumber]/page.tsx  (Server Component - 상세 + 세션 재검증)
    
    ↓ (Server Action 호출)
    
app/actions/
    ├── admin.ts                    (관리자 토큰 생성)
    ├── invoice-client.ts           (클라이언트 접근 코드 검증)
    └── dashboard.ts                (공유 링크/코드 관리)
    
    ↓ (fetch)
    
lib/notion.ts → getInvoiceByNumber() / getInvoiceById()
    ↓
Notion API REST (기존 연결 재사용)
```

### 신규 추가 파일 (Phase 별)

**Phase 1 (보안 기반)**
```
middleware.ts                      # 라우트 보호
app/admin/login/page.tsx          # 관리자 로그인
app/actions/admin.ts              # 관리자 인증 로직
lib/notion.ts (수정)              # getInvoiceByNumber() 추가
lib/types.ts (수정)               # Invoice.accessCode 추가
```

**Phase 2~5 (기능 구현)**
```
app/
├── invoice/
│   ├── page.tsx                   # 조회 폼 페이지
│   └── [invoiceNumber]/
│       └── page.tsx               # 상세 페이지
├── actions/
│   ├── invoice-client.ts          # 접근 코드 검증
│   └── dashboard.ts               # 공유 기능

components/
├── invoice/
│   ├── invoice-lookup-form.tsx    # 조회 폼
│   ├── invoice-template.tsx       # 인보이스 양식
│   └── pdf-download-button.tsx    # PDF 다운로드
├── dashboard/
│   ├── invoice-list.tsx           # 인보이스 목록
│   └── share-modal.tsx            # 공유 모달

lib/
├── auth.ts                        # JWT/토큰 유틸
└── (기존 파일들)
```

### PDF 생성 방식

| 방식 | 라이브러리 | 장점 | 단점 |
|------|-----------|------|------|
| **브라우저 Print API** | 없음 (CSS 활용) | 의존성 없음, 구현 단순 | 스타일 제어 제한적 |
| **jsPDF + html2canvas** | jsPDF, html2canvas | 픽셀 완벽 렌더링 | 번들 크기 증가, CLS 주의 |
| **react-pdf** | @react-pdf/renderer | 코드로 PDF 구조 정의 | 별도 컴포넌트 작성 필요 |

**권장: 브라우저 Print API** (MVP 단계)
- `@media print` CSS로 헤더/푸터 숨기기
- `window.print()` 호출로 저장 대화상자 표시
- 별도 라이브러리 불필요, 인쇄 품질 양호

---

## 데이터 흐름

### 인보이스 조회 흐름 (보안 강화)

```
1. 클라이언트 → POST /invoice (조회 폼 제출)
   - 인보이스 번호 + 접근 코드를 POST 바디로 전송
        ↓
2. Server Action: verifyInvoiceAccess(invoiceNumber, accessCode)
   - Notion에서 getInvoiceByNumber(invoiceNumber) 호출
   - 데이터베이스에서 accessCode 필드 조회
   - 제공된 코드와 Notion 저장 코드 비교 (상수 시간 비교)
        ↓
3. 검증 결과
   [불일치/미존재] → 오류 반환 ('인보이스를 찾을 수 없거나 코드가 올바르지 않습니다')
   [일치]   → httpOnly 쿠키에 세션 저장
           → redirect('/invoice/[invoiceNumber]')
        ↓
4. /invoice/[invoiceNumber]/page.tsx 렌더링 (Server Component)
   - 요청 시마다 쿠키/세션 재검증 (보안)
   - Notion에서 인보이스 데이터 재조회
   - 세션 유효 → invoice-template.tsx로 데이터 전달
   - 세션 무효 → 조회 페이지로 리다이렉트
        ↓
5. 화면 표시
```

**보안 특징:**
- ✅ 접근 코드는 **POST 바디로만 전송** (URL 노출 방지)
- ✅ 상세 페이지는 **매 요청마다 세션 검증** (우회 방지)
- ✅ 오류 메시지 **일관성** (인보이스 존재 여부 은닉)
- ✅ httpOnly 쿠키로 **XSS 방어**

### PDF 다운로드 흐름

```
1. 클라이언트 → "PDF 다운로드" 버튼 클릭
        ↓
2. pdf-download-button.tsx → window.print() 호출
        ↓
3. 브라우저 인쇄 대화상자 표시
   - @media print 스타일 적용 (헤더/버튼 숨김, 인보이스만 표시)
        ↓
4. "PDF로 저장" 선택 → 로컬 저장
```

---

## 보안 고려사항

### MVP 단계 보안 (구현 대상) ✅

| 위협 | 대응 방법 | 상태 |
|------|-----------|------|
| 타인 인보이스 무단 조회 | 인보이스별 접근 코드 검증 (Notion AccessCode 필드) | ✅ 구현 |
| URL 파라미터로 코드 노출 | **POST 바디로만 전송**, URL 쿼리 금지 | ✅ 구현 |
| verified 플래그 우회 | 상세 페이지에서 **매 요청마다 세션 재검증** | ✅ 구현 |
| XSS 공격 | httpOnly 쿠키로 토큰 보호 | ✅ 구현 |
| 접근 코드 브루트포스 | 6~8자리 코드 (1백만 조합), Server Action 내 로그 기록 | ✅ 구현 |
| Notion API 키 노출 | 환경 변수 사용, 서버리스 환경에서만 호출 | ✅ 구현 |
| 관리자 대시보드 접근 | middleware 기반 비밀번호 검증 + httpOnly 쿠키 | ✅ 구현 |

### MVP 이후 보완 (Phase 5+)

- Rate limiting (Vercel KV / Upstash)
- 접근 코드 만료 시간 설정 (예: 30일)
- 인보이스 조회 감사 로그 (Firebase/Analytics)
- IP 기반 제한 (선택)
- 접근 코드 재생성 주기 설정

---

## 성공 지표 및 테스트 계획

### 성공 지표

- 클라이언트가 공유 URL + 접근 코드만으로 인보이스 조회 가능
- PDF 파일이 올바른 데이터로 정상 생성됨
- 잘못된 접근 코드로 타인 인보이스 접근 불가

### 테스트 시나리오

| 시나리오 | 기대 결과 |
|----------|-----------|
| 유효한 인보이스 번호 + 올바른 접근 코드 | 인보이스 상세 페이지 정상 표시 |
| 유효한 인보이스 번호 + 잘못된 접근 코드 | 오류 메시지 표시, 인보이스 미표시 |
| 존재하지 않는 인보이스 번호 | 오류 메시지 표시 |
| 인보이스 상세 페이지에서 PDF 다운로드 | 브라우저 인쇄 대화상자 표시, 인보이스 내용 포함 |
| 관리자 대시보드 공유 버튼 | 공유 URL과 접근 코드가 모달에 표시됨 |

---

## 구현 순서 (Phase 기반)

### Phase 1: 보안 기반 구축 (Day 1, ~4시간) ⭐ 우선순위 1
**C1, C2 Critical Issues 해결**

1. **middleware.ts** 구현
   - `/dashboard` 접근 제어
   - `admin_token` 쿠키 검증

2. **관리자 로그인** (`app/admin/login/page.tsx`)
   - 비밀번호 입력 폼
   - Server Action으로 토큰 생성 및 쿠키 저장

3. **관리자 인증 로직** (`app/actions/admin.ts`)
   - `ADMIN_PASSWORD` 검증
   - JWT 토큰 생성

4. **Notion 필드 확장** (수동 작업)
   - Notion DB에 `AccessCode` 필드(Rich Text) 추가
   - `lib/types.ts`: `Invoice.accessCode` 추가
   - `lib/notion.ts`: `pageToInvoice()` 함수 업데이트, `getInvoiceByNumber()` 추가

### Phase 2: 클라이언트 인보이스 조회 (Day 1-2, ~6시간) ⭐ 우선순위 2
**F001, F002, F003, F004 (시각화)**

1. **조회 폼 페이지** (`app/invoice/page.tsx`)
2. **조회 폼 컴포넌트** (`components/invoice/invoice-lookup-form.tsx`)
   - React Hook Form + Zod 검증
3. **접근 코드 검증** (`app/actions/invoice-client.ts`)
   - Server Action: POST 바디로 코드 받음
   - Notion 쿼리 + 코드 비교
   - 성공 시 세션/쿠키 저장
4. **인보이스 상세 페이지** (`app/invoice/[invoiceNumber]/page.tsx`)
   - Server Component에서 세션 재검증
   - 데이터 렌더링
5. **인보이스 템플릿** (`components/invoice/invoice-template.tsx`)
   - 전문 양식 UI
   - 환경 변수로 회사 정보 표시

### Phase 3: PDF 다운로드 (Day 2, ~3시간) ⭐ 우선순위 3
**F005**

1. **PDF 버튼** (`components/invoice/pdf-download-button.tsx`)
   - `window.print()` 호출
2. **인쇄 스타일** (`app/globals.css`)
   - `@media print` CSS

### Phase 4: 대시보드 공유 기능 (Day 2-3, ~4시간) ⭐ 우선순위 4
**F006**

1. **인보이스 목록** (`components/dashboard/invoice-list.tsx`)
   - 테이블 + 공유 버튼
2. **공유 모달** (`components/dashboard/share-modal.tsx`)
   - URL 표시 + 클립보드 복사
3. **공유 API** (`app/actions/dashboard.ts`)
   - 코드 조회/생성

### Phase 5: 테스트 & 보안 검증 (Day 3-5, ~4시간) ⭐ 우선순위 5

1. 기능 테스트 시나리오 (7가지)
2. 보안 검증 (7가지)
3. 엣지 케이스 처리

---

## 환경 변수 (신규 추가)

```bash
# .env.local

# 관리자 인증
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_for_token_generation

# 회사 정보 (인보이스 헤더)
COMPANY_NAME=예제 주식회사
COMPANY_ADDRESS=서울시 강남구 테헤란로 123
COMPANY_PHONE=02-1234-5678
COMPANY_EMAIL=invoices@example.com
COMPANY_LOGO_URL=https://example.com/logo.png (선택)
```

---

## 기술 검증 결과

### prd-validator에서 지적된 Critical Issues 해결 ✅

**C1. 접근 코드 보안 우회 취약점** → **해결됨**
- Before: URL 파라미터 `?verified=true`, `?code=abc` (우회 가능)
- After: POST 바디로 코드 전송 + 상세 페이지에서 매 요청 재검증
- 결과: URL 파라미터 기반 우회 불가능

**C2. 대시보드 인증 누락** → **해결됨**
- Before: 인증 없이 누구나 `/dashboard` 접근 가능
- After: middleware 기반 관리자 인증 + `/admin/login` 페이지
- 결과: 비밀번호 없이 대시보드 접근 불가능

### 주요 개선사항 (M1~M3) 반영 ✅

- **M1. 접근 코드 길이**: 4~8자리 → **6~8자리로 강화**
- **M2. Notion API 마이그레이션**: 향후 `/data_sources` 전환 계획 포함
- **M3. Rate Limiting**: Phase 5+ (선택사항)

---

## 향후 확장 가능성

| 기능 | 설명 |
|------|------|
| 이메일 발송 | Resend 또는 Nodemailer로 클라이언트에게 인보이스 이메일 전송 |
| 클라이언트 계정 | Supabase Auth 추가로 클라이언트 로그인 및 본인 인보이스 목록 조회 |
| 온라인 결제 | Stripe 연동으로 인보이스 페이지에서 바로 결제 |
| 인보이스 서명 | 클라이언트가 웹에서 확인 서명 후 상태 자동 업데이트 |
| 다국어 템플릿 | 영문/한국어 인보이스 양식 선택 |
| 커스텀 로고 | 관리자 브랜딩을 위한 로고 업로드 및 인보이스 헤더 표시 |
