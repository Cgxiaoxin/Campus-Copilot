import { Icons } from "@/components/icons"

export function ItemCard({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-xl p-4 mb-3 relative group hover:border-gray-300 transition-colors">
      <button onClick={onRemove} className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all">
        <Icons.X className="w-4 h-4" />
      </button>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  )
}
