import type { ResumeContent } from "../types"

export function TemplateMinimal({ content }: { content: ResumeContent }) {
  return (
    <div className="space-y-4">
      <div className="text-center pb-3 border-b border-border">
        <p className="text-base font-semibold text-card-foreground">{content.personalInfo.name}</p>
        <p className="text-xs text-muted-foreground">{content.personalInfo.email} · {content.personalInfo.phone}</p>
      </div>
      <div>
        <p className="text-xs text-card-foreground leading-relaxed">{content.summary}</p>
      </div>
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-2">技能</p>
        <div className="flex flex-wrap gap-1.5">
          {content.skills.map((s) => (
            <span key={s} className="text-xs bg-muted px-2 py-0.5 rounded text-card-foreground">{s}</span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-2">教育经历</p>
        {content.education.map((e, i) => (
          <div key={i} className="mb-1.5 text-xs text-card-foreground">
            <span className="font-medium">{e.school}</span> · {e.degree} · {e.major} · {e.startDate} - {e.endDate}
          </div>
        ))}
      </div>
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-2">经历</p>
        {content.experience.map((e, i) => (
          <div key={i} className="mb-2 text-xs">
            <p className="font-medium text-card-foreground">{e.company} · {e.position} <span className="text-muted-foreground font-normal">{e.startDate} - {e.endDate}</span></p>
            <p className="text-card-foreground mt-0.5">{e.description}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-2">项目</p>
        {content.projects.map((p, i) => (
          <div key={i} className="mb-2 text-xs">
            <p className="font-medium text-card-foreground">{p.name} · {p.role}</p>
            <p className="text-card-foreground mt-0.5">{p.description}</p>
            {p.techStack.length > 0 && <p className="text-muted-foreground mt-0.5">技术栈：{p.techStack.join("、")}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
