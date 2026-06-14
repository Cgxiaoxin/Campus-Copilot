export type Priority = "high" | "medium" | "low"

export interface Task {
  id: string; title: string; priority: Priority; dueTime: string; completed: boolean
}

export const priorities: Priority[] = ["high", "medium", "low"]

export const priorityLabel: Record<Priority, string> = {
  high: "高", medium: "中", low: "低",
}
