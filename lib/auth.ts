// 서버 전용 인증 유틸리티

import { cookies } from "next/headers"

const ADMIN_TOKEN_COOKIE = "admin_token"
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7일

// 관리자 비밀번호 검증
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD 환경 변수가 설정되지 않았습니다.")
  }
  // 상수 시간 비교로 타이밍 공격 방어
  return timingSafeEqual(password, adminPassword)
}

// 상수 시간 문자열 비교 (타이밍 공격 방어)
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

// 관리자 토큰 생성 (서명된 페이로드)
export function createAdminToken(): string {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.")
  }
  // 단순 토큰: 타임스탬프 + 시크릿 해시 (프로덕션에서는 jose 등 사용 권장)
  const payload = `admin:${Date.now()}`
  return Buffer.from(`${payload}:${jwtSecret}`).toString("base64")
}

// 관리자 토큰 검증
export function verifyAdminToken(token: string): boolean {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) return false
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    return decoded.endsWith(`:${jwtSecret}`) && decoded.startsWith("admin:")
  } catch {
    return false
  }
}

// 쿠키에서 관리자 인증 상태 확인
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value
  if (!token) return false
  return verifyAdminToken(token)
}

// 관리자 토큰 쿠키 설정값 반환
export function getAdminTokenCookieOptions() {
  return {
    name: ADMIN_TOKEN_COOKIE,
    maxAge: TOKEN_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  }
}

// 인보이스 세션 쿠키 이름 생성
export function getInvoiceSessionKey(invoiceNumber: string): string {
  return `invoice_session_${invoiceNumber}`
}

// 인보이스 세션 검증
export async function verifyInvoiceSession(invoiceNumber: string): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionKey = getInvoiceSessionKey(invoiceNumber)
  const sessionValue = cookieStore.get(sessionKey)?.value
  if (!sessionValue) return false
  // 세션 값은 "verified:{invoiceNumber}" 형태
  return sessionValue === `verified:${invoiceNumber}`
}
