import { Label } from "@/components/ui/label"

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  )
}
