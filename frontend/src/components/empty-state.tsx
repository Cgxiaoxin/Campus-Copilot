import { InboxIcon } from "lucide-react"

export function EmptyState({ message = "暂无数据" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <InboxIcon className="size-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
