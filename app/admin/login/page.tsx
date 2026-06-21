import type { Metadata } from "next"
import { AdminLoginForm } from "@/components/layout/admin-login-form"

export const metadata: Metadata = {
  title: "관리자 로그인",
}

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">관리자 로그인</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            관리자 비밀번호를 입력하세요.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
