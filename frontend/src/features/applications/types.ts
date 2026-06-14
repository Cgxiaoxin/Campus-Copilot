export type Status = "draft" | "applied" | "screening" | "interview" | "offer" | "rejected"

export interface Application {
  id: string; company: string; position: string; status: Status; deadline: string; nextStep: string
}

export const statuses: Status[] = ["draft", "applied", "screening", "interview", "offer", "rejected"]

export const statusConfig: Record<Status, { label: string; color: string }> = {
  draft: { label: "草稿", color: "bg-gray-100 text-gray-600" },
  applied: { label: "已投递", color: "bg-blue-50 text-blue-600" },
  screening: { label: "筛选中", color: "bg-amber-50 text-amber-600" },
  interview: { label: "面试中", color: "bg-purple-50 text-purple-600" },
  offer: { label: "Offer", color: "bg-emerald-50 text-emerald-600" },
  rejected: { label: "未通过", color: "bg-red-50 text-red-600" },
}

export const emptyForm = { company: "", position: "", deadline: "", nextStep: "", status: "draft" as Status }
