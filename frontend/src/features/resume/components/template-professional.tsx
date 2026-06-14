import type { ResumeContent } from "../types"

export function TemplateProfessional({ content }: { content: ResumeContent }) {
  return (
    <div className="flex gap-6">
      <div className="w-[160px] shrink-0 bg-muted p-4 rounded-lg space-y-4">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-2">联系方式</p>
          <p className="text-[11px] text-card-foreground">{content.personalInfo.email}</p>
          <p className="text-[11px] text-card-foreground">{content.personalInfo.phone}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-2">专业技能</p>
          <div className="space-y-1">
            {content.skills.map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="text-[11px] text-card-foreground">{s}</span>
                <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary/30 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-5">
        <div className="pb-3 border-b-2 border-primary/10">
          <p className="text-lg font-bold text-card-foreground">{content.personalInfo.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{content.personalInfo.email} · {content.personalInfo.phone}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-1.5 uppercase">Professional Summary</p>
          <p className="text-xs text-card-foreground leading-relaxed">{content.summary}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-1.5 uppercase">Education</p>
          {content.education.map((e, i) => (
            <div key={i} className="mb-1.5">
              <p className="text-xs font-medium text-card-foreground">{e.school}</p>
              <p className="text-[11px] text-muted-foreground">{e.degree} in {e.major} · {e.startDate} - {e.endDate}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-1.5 uppercase">Experience</p>
          {content.experience.map((e, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-card-foreground">{e.position}</p>
                <p className="text-[11px] text-muted-foreground">{e.startDate} - {e.endDate}</p>
              </div>
              <p className="text-[11px] text-muted-foreground">{e.company}</p>
              <p className="text-[11px] text-card-foreground mt-0.5">{e.description}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-1.5 uppercase">Projects</p>
          {content.projects.map((p, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-card-foreground">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.role}</p>
              </div>
              <p className="text-[11px] text-card-foreground mt-0.5">{p.description}</p>
              {p.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.techStack.map((t) => (
                    <span key={t} className="text-[10px] bg-primary/5 text-primary/70 px-1.5 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
