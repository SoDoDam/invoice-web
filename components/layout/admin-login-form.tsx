"use client"

import { useActionState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { adminLoginAction } from "@/app/actions/admin"

const schema = z.object({
  password: z.string().min(1, "비밀번호를 입력하세요"),
})

type FormValues = z.infer<typeof schema>
type State = { error?: string } | null

async function formAction(_prev: State, formData: FormData): Promise<State> {
  const result = await adminLoginAction(formData)
  return result
}

export function AdminLoginForm() {
  const [state, action, isPending] = useActionState(formAction, null)

  const {
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          {...register("password")}
          name="password"
          type="password"
          placeholder="관리자 비밀번호"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  )
}
