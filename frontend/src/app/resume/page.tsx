"use client"

import { useState, useMemo, useCallback } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/components/auth-dialog"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/motion"
import { TEMPLATES, type ResumeContent } from "@/features/resume/types"
import { TemplateModern } from "@/features/resume/components/template-modern"
import { TemplateMinimal } from "@/features/resume/components/template-minimal"
import { TemplateProfessional } from "@/features/resume/components/template-professional"

const MOCK_CONTENT: ResumeContent = {
  personalInfo: { name: "张三", email: "zhangsan@example.com", phone: "138-0000-0000" },
  summary: "计算机科学专业毕业生，具备扎实的编程基础和良好的团队协作能力。专注于全栈开发，熟悉现代前端框架和云服务架构。",
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Docker", "PostgreSQL"],
  education: [{ school: "示例大学", degree: "本科", major: "计算机科学与技术", startDate: "2020-09", endDate: "2024-06" }],
  experience: [{ company: "示例科技有限公司", position: "前端开发实习生", description: "参与公司核心产品的前端架构设计和开发，使用 React + TypeScript 重构了用户管理模块，页面加载性能提升 40%。", startDate: "2023-06", endDate: "2023-09" }],
  projects: [{ name: "在线协作白板", role: "核心开发者", description: "基于 React + Canvas API 实现的多人实时协作白板，支持图形绘制、文字编辑和撤销重做功能。", techStack: ["React", "Canvas", "WebSocket", "Node.js"] }],
}

const TEMPLATE_MAP: Record<string, typeof TemplateModern> = {
  modern: TemplateModern,
  minimal: TemplateMinimal,
  professional: TemplateProfessional,
}

export default function ResumePage() {
  const [jd, setJd] = useState("")
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [content, setContent] = useState<ResumeContent>(MOCK_CONTENT)

  const keywords = useMemo(() => {
    if (!jd.trim()) return []
    const words = jd.match(/[A-Za-z+#.]+/g) || []
    const freq: Record<string, number> = {}
    words.forEach((w) => { const l = w.toLowerCase(); if (l.length > 2) freq[l] = (freq[l] || 0) + 1 })
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([w]) => w)
  }, [jd])

  const { token } = useAuth()
  const handleGenerate = useCallback(async () => {
    if (!jd.trim()) return
    setGenerating(true)
    try {
      if (token) {
        const res = await api.generateResume({ jd, template: selectedTemplate })
        if (res.content) setContent(res.content)
      } else {
        await new Promise((r) => setTimeout(r, 1200))
        setContent((prev) => ({
          ...prev,
          summary: `${prev.summary}（已针对 JD 优化：${jd.slice(0, 80)}...）`,
          skills: [...new Set([...prev.skills, ...keywords.slice(0, 5)])],
        }))
      }
      setGenerated(true)
    } catch {
      setContent((prev) => ({
        ...prev,
        summary: `${prev.summary}（已针对 JD 优化：${jd.slice(0, 80)}...）`,
        skills: [...new Set([...prev.skills, ...keywords.slice(0, 5)])],
      }))
      setGenerated(true)
    } finally {
      setGenerating(false)
    }
  }, [jd, keywords, token, selectedTemplate])

  const TemplateComponent = TEMPLATE_MAP[selectedTemplate] || TemplateModern

  return (
    <PageTransition className="max-w-5xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-card-foreground">AI 简历生成</h1>
        <p className="text-sm text-muted-foreground mt-1">根据岗位描述自动生成定制化简历</p>
      </div>

      <div className="grid grid-cols-[380px_1fr] gap-6">
        {/* Left: Control Panel */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <h2 className="text-xs font-semibold text-muted-foreground tracking-wide mb-3">岗位描述</h2>
              <textarea
                className="w-full min-h-[160px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
                rows={8}
                placeholder="粘贴岗位描述..."
                value={jd}
                onChange={(e) => { setJd(e.target.value); setGenerated(false) }}
              />
              {keywords.length > 0 && (
                <div className="mt-3">
                  <p className="text-[11px] text-muted-foreground mb-2">关键词匹配</p>
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.map((kw) => (
                      <Badge key={kw} variant="secondary" className="text-[11px]">{kw}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="text-xs font-semibold text-muted-foreground tracking-wide mb-3">选择模板</h2>
              <div className="space-y-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                      selectedTemplate === t.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <p className="text-xs font-medium text-card-foreground">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={generating || !jd.trim()}
            className="w-full"
          >
            {generating ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> 生成中...</>
            ) : (
              <><Icons.Sparkles className="w-4 h-4" /> AI 生成简历</>
            )}
          </Button>
        </div>

        {/* Right: Preview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-semibold text-muted-foreground tracking-wide">预览</h2>
                {generated && <Badge variant="secondary" className="text-[10px]">已生成</Badge>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Icons.Resume className="w-3.5 h-3.5" />
                  导出
                </Button>
              </div>
            </div>
            <div className="min-h-[500px] rounded-xl border border-border p-6 bg-white">
              <TemplateComponent content={content} />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
