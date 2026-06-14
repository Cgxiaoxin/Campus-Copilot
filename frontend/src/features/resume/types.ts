export interface ResumeContent {
  personalInfo: { name: string; email: string; phone: string }
  summary: string
  skills: string[]
  education: Array<{ school: string; degree: string; major: string; startDate: string; endDate: string }>
  experience: Array<{ company: string; position: string; description: string; startDate: string; endDate: string }>
  projects: Array<{ name: string; role: string; description: string; techStack: string[] }>
}

export interface TemplateDef {
  id: string
  name: string
  description: string
}

export const TEMPLATES: TemplateDef[] = [
  { id: "modern", name: "现代", description: "左栏技能 + 主内容区" },
  { id: "minimal", name: "简约", description: "纯文本极简排版" },
  { id: "professional", name: "专业", description: "经典商务分栏" },
]
