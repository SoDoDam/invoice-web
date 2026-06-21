import { redirect } from "next/navigation"

// 홈("/")은 인보이스 조회 페이지로 리다이렉트
export default function HomePage() {
  redirect("/invoice")
}
