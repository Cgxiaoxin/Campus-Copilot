import type { ResumeContent } from "../types"

export function TemplateModern({ content }: { content: ResumeContent }) {
  return (
    <div className="flex gap-6">
      <div className="w-[120px] shrink-0 space-y-4">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-2">技能</p>
          <div className="space-y-1">
            {content.skills.map((s) => (
              <span key={s} className="block text-xs text-card-foreground">{s}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-5">
        <div>
          <p className="text-base font-semibold text-card-foreground">{content.personalInfo.name}</p>
          <p className="text-xs text-muted-foreground">{content.personalInfo.email} · {content.personalInfo.phone}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-1.5">简介</p>
          <p className="text-xs text-card-foreground leading-relaxed">{content.summary}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-1.5">教育经历</p>
          {content.education.map((e, i) => (
            <div key={i} className="mb-1.5">
              <p className="text-xs font-medium text-card-foreground">{e.school}</p>
              <p className="text-[11px] text-muted-foreground">{e.degree} · {e.major} · {e.startDate} - {e.endDate}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-1.5">经历</p>
          {content.experience.map((e, i) => (
            <div key={i} className="mb-2">
              <p className="text-xs font-medium text-card-foreground">{e.company} · {e.position}</p>
              <p className="text-[11px] text-muted-foreground">{e.startDate} - {e.endDate}</p>
              <p className="text-[11px] text-card-foreground mt-0.5">{e.description}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-1.5">项目</p>
          {content.projects.map((p, i) => (
            <div key={i} className="mb-2">
              <p className="text-xs font-medium text-card-foreground">{p.name} · {p.role}</p>
              <p className="text-[11px] text-card-foreground mt-0.5">{p.description}</p>
              {p.techStack.length > 0 && (
                <p className="text-[11px] text-muted-foreground mt-0.5">技术栈：{p.techStack.join("、")}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
