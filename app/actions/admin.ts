"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { verifyAdminPassword, createAdminToken, getAdminTokenCookieOptions } from "@/lib/auth"

const LoginSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력하세요"),
})

type LoginResult = { success: false; error: string }

// 관리자 로그인 처리
export async function adminLoginAction(
  formData: FormData
): Promise<LoginResult> {
  const parsed = LoginSchema.safeParse({
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const isValid = verifyAdminPassword(parsed.data.password)
  if (!isValid) {
    return { success: false, error: "비밀번호가 올바르지 않습니다." }
  }

  const token = createAdminToken()
  const cookieOptions = getAdminTokenCookieOptions()
  const cookieStore = await cookies()

  cookieStore.set(cookieOptions.name, token, {
    maxAge: cookieOptions.maxAge,
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
  })

  redirect("/dashboard")
}

// 관리자 로그아웃 처리
export async function adminLogoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("admin_token")
  redirect("/admin/login")
}
