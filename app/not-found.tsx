import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-8xl font-bold text-muted-foreground/30">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-muted-foreground">
        요청하신 인보이스가 존재하지 않거나 만료되었습니다.
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link href="/invoice">인보이스 조회로 돌아가기</Link>
      </Button>
    </div>
  )
}
