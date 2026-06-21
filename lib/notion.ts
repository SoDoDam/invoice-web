// IMPORTANT: 이 파일은 서버 전용입니다 (Server Components, Server Actions, Route Handlers에서만 import 가능)

import type { Invoice, CreateInvoiceInput, UpdateInvoiceInput, InvoiceSummary, InvoiceStatus, Currency } from "@/lib/types"


// Notion API REST 호출 헬퍼
async function notionFetch<T>(
  endpoint: string,
  method: string = "GET",
  body?: unknown
): Promise<T> {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) {
    throw new Error("NOTION_API_KEY 환경 변수가 설정되지 않았습니다.")
  }

  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2026-03-11",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Notion API 오류: ${error.message}`)
  }

  return response.json()
}

function getDatabaseId(): string {
  const id = process.env.NOTION_DATABASE_ID
  if (!id) {
    throw new Error("NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다.")
  }
  return id
}

// Notion 페이지 응답 → Invoice 변환
function pageToInvoice(page: any): Invoice {
  const props = page.properties

  const getTitle = (prop: any) =>
    prop?.title?.[0]?.plain_text ?? ""

  const getRichText = (prop: any) =>
    prop?.rich_text?.[0]?.plain_text ?? ""

  const getNumber = (prop: any) =>
    prop?.number ?? 0

  // 2026-03-11 API: Status는 status 타입, Currency는 select 타입
  const getSelect = (prop: any, defaultValue: string = "draft") =>
    prop?.status?.name ?? prop?.select?.name ?? defaultValue

  const getDate = (prop: any) =>
    prop?.date?.start ?? ""

  return {
    id: page.id,
    invoiceNumber: getTitle(props.Title),
    client: getRichText(props.Client),
    amount: getNumber(props.Amount),
    status: getSelect(props.Status) as InvoiceStatus,
    issueDate: getDate(props.IssueDate),
    dueDate: getDate(props.DueDate),
    description: getRichText(props.Description),
    currency: getSelect(props.Currency, "KRW") as Currency,
    notionUrl: page.url,
    accessCode: getRichText(props.AccessCode) || undefined,
  }
}

// 인보이스 목록 조회
export async function getInvoices(filter?: {
  status?: InvoiceStatus
}): Promise<Invoice[]> {
  const databaseId = getDatabaseId()
  const allResults: any[] = []
  let startCursor: string | undefined

  while (true) {
    const response = await notionFetch<any>(
      `/data_sources/${databaseId}/query`,
      "POST",
      {
        page_size: 100,
        start_cursor: startCursor,
        sorts: [
          {
            property: "IssueDate",
            direction: "descending",
          },
        ],
        filter: filter?.status
          ? {
              property: "Status",
              status: {
                equals: filter.status,
              },
            }
          : undefined,
      }
    )

    allResults.push(...response.results)

    if (!response.has_more) break
    startCursor = response.next_cursor
  }

  return allResults.map(pageToInvoice)
}

// 인보이스 번호로 조회 (클라이언트 접근 코드 검증용)
export async function getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | null> {
  const databaseId = getDatabaseId()
  const response = await notionFetch<any>(
    `/data_sources/${databaseId}/query`,
    "POST",
    {
      page_size: 1,
      filter: {
        property: "Title",
        title: {
          equals: invoiceNumber,
        },
      },
    }
  )

  if (!response.results || response.results.length === 0) return null
  const page = response.results[0]
  if (page.archived) return null
  return pageToInvoice(page)
}

// 인보이스 단건 조회
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const page = await notionFetch<any>(`/pages/${id}`)
    if (page.archived) return null
    return pageToInvoice(page)
  } catch {
    return null
  }
}

// 인보이스 생성
export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  const response = await notionFetch<any>(
    "/pages",
    "POST",
    {
      parent: { database_id: getDatabaseId() },
      properties: {
        Title: {
          title: [{ text: { content: input.invoiceNumber } }],
        },
        Client: {
          rich_text: [{ text: { content: input.client } }],
        },
        Amount: {
          number: input.amount,
        },
        Status: {
          select: { name: input.status },
        },
        IssueDate: {
          date: { start: input.issueDate },
        },
        DueDate: {
          date: { start: input.dueDate },
        },
        Description: {
          rich_text: [{ text: { content: input.description } }],
        },
        Currency: {
          select: { name: input.currency },
        },
      },
    }
  )

  return pageToInvoice(response)
}

// 인보이스 수정
export async function updateInvoice(
  id: string,
  input: UpdateInvoiceInput
): Promise<Invoice> {
  const properties: any = {}

  if (input.invoiceNumber !== undefined) {
    properties.Title = {
      title: [{ text: { content: input.invoiceNumber } }],
    }
  }
  if (input.client !== undefined) {
    properties.Client = {
      rich_text: [{ text: { content: input.client } }],
    }
  }
  if (input.amount !== undefined) {
    properties.Amount = { number: input.amount }
  }
  if (input.status !== undefined) {
    properties.Status = { select: { name: input.status } }
  }
  if (input.issueDate !== undefined) {
    properties.IssueDate = { date: { start: input.issueDate } }
  }
  if (input.dueDate !== undefined) {
    properties.DueDate = { date: { start: input.dueDate } }
  }
  if (input.description !== undefined) {
    properties.Description = {
      rich_text: [{ text: { content: input.description } }],
    }
  }
  if (input.currency !== undefined) {
    properties.Currency = { select: { name: input.currency } }
  }

  const response = await notionFetch<any>(
    `/pages/${id}`,
    "PATCH",
    { properties }
  )

  return pageToInvoice(response)
}

// 인보이스 삭제 (Notion은 archive 처리)
export async function deleteInvoice(id: string): Promise<void> {
  await notionFetch<any>(
    `/pages/${id}`,
    "PATCH",
    { archived: true }
  )
}

// 대시보드 통계 계산
export async function getInvoiceSummary(): Promise<InvoiceSummary> {
  const invoices = await getInvoices()

  return {
    totalCount: invoices.length,
    paidAmount: invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0),
    pendingAmount: invoices
      .filter((i) => i.status === "sent" || i.status === "draft")
      .reduce((sum, i) => sum + i.amount, 0),
    overdueCount: invoices.filter((i) => i.status === "overdue").length,
  }
}
