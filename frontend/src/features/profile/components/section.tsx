import { Card, CardContent } from "@/components/ui/card"

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold text-muted-foreground tracking-wide mb-4">{title}</h2>
      <Card>
        <CardContent className="p-5">{children}</CardContent>
      </Card>
    </section>
  )
}
