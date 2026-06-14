"use client"

import { useState, useMemo } from "react"
import { useLocalStorage } from "@/lib/use-local-storage"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageTransition } from "@/components/motion"

const questions = [
  "请介绍一下你最有挑战性的项目及你如何解决其中的技术难题",
  "描述一次你与团队成员产生分歧的经历，你是如何处理的",
  "你如何看待前端工程化？你在项目中做过哪些实践",
  "请解释一下你对 RESTful API 设计的理解",
  "你如何保证代码质量和可维护性",
  "请做一个简短的自我介绍",
  "你为什么想来我们公司？",
  "你认为自己最大的优点和缺点是什么",
  "描述一次你主动学习和掌握新技术的过程",
  "你对未来 3-5 年的职业规划是什么",
  "你期望的薪资范围是多少？",
  "你目前有其他公司的 Offer 吗？",
  "你最快什么时候可以入职？",
  "你有什么问题想问我们吗？",
]

export default function InterviewsPage() {
  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [generated, setGenerated] = useState(false)
  const [items, setItems] = useState<{ id: string; text: string; answer: string; feedback: string }[]>([])
  const [profile] = useLocalStorage("profile", null as null | { fullName: string })

  const handleGenerate = () => {
    if (!company.trim() || !position.trim()) return
    const picked = [...questions].sort(() => Math.random() - 0.5).slice(0, 4)
    setItems(picked.map((text) => ({ id: Date.now().toString() + Math.random(), text, answer: "", feedback: "" })))
    setGenerated(true)
  }

  const evaluate = (id: string) => {
    setItems(items.map((q) => {
      if (q.id !== id) return q
      const len = q.answer.length
      return { ...q, feedback: len < 10 ? "回答偏简短，建议结合具体项目展开，使用 STAR 原则组织。" : len < 50 ? "回答基本完整，建议增加具体数据或成果来增强说服力。" : "回答很清晰，有具体案例支撑，继续保持。" }
    }))
  }

  const score = useMemo(() => {
    if (!items.length) return 0
    return Math.round(items.reduce((s, q) => {
      const len = q.answer.length
      return s + (len > 100 ? 90 : len > 50 ? 70 : len > 10 ? 50 : 20)
    }, 0) / items.length)
  }, [items])

  return (
    <PageTransition className="max-w-3xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">AI 面试准备</h1>
        <p className="text-sm text-gray-400 mt-1">生成模拟面试题并获取反馈</p>
      </div>

      <Card className="mb-5">
        <CardContent className="p-5">
          <h2 className="text-xs font-semibold text-muted-foreground tracking-wide mb-4">开始练习</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><Label>目标公司</Label><Input className="mt-1" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="例如：腾讯" /></div>
            <div><Label>目标岗位</Label><Input className="mt-1" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="例如：前端工程师" /></div>
          </div>
          <Button onClick={handleGenerate} disabled={!company || !position} className="w-full"><Icons.Target className="w-4 h-4" /> 生成题目</Button>
        </CardContent>
      </Card>

      {generated && (
        <Card className="mb-5 animate-slide-up">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-semibold text-muted-foreground tracking-wide">{company} · {position}</h2>
              {profile?.fullName && <span className="text-xs text-muted-foreground">{profile.fullName}</span>}
            </div>

            {score > 0 && (
              <div className="mb-6 p-5 bg-muted rounded-xl text-center">
                <p className="text-xs text-muted-foreground mb-1">综合评分</p>
                <p className={`text-3xl font-semibold ${score >= 80 ? "text-emerald-600" : score >= 60 ? "text-blue-600" : "text-amber-600"}`}>{score}</p>
                <p className="text-xs text-muted-foreground mt-1">{score >= 80 ? "表现优秀" : score >= 60 ? "表现良好" : "建议多练习"}</p>
                <div className="mt-3 w-full bg-muted rounded-full h-1 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${score}%` }} />
                </div>
              </div>
            )}

            <div className="space-y-4">
              {items.map((q, i) => (
                <div key={q.id} className="border border-border rounded-xl p-4">
                  <p className="text-sm text-card-foreground mb-3">
                    <span className="font-medium text-muted-foreground mr-2">{i + 1}.</span>
                    {q.text}
                  </p>
                  <textarea className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none mb-3" rows={3} placeholder="输入你的回答..." value={q.answer}
                    onChange={(e) => setItems(items.map((x) => x.id === q.id ? { ...x, answer: e.target.value } : x))}
                  />
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => evaluate(q.id)} disabled={!q.answer.trim()}>获取反馈</Button>
                    <span className="text-xs text-muted-foreground">{q.answer.length} 字</span>
                  </div>
                  {q.feedback && (
                    <div className="mt-3 p-3.5 bg-muted rounded-xl text-xs text-muted-foreground leading-relaxed border border-border">
                      <span className="font-medium text-card-foreground">反馈：</span> {q.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!generated && (
        <Card>
          <CardContent className="p-5">
            <h2 className="text-xs font-semibold text-muted-foreground tracking-wide mb-3">使用说明</h2>
            <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>输入目标公司和岗位</li>
              <li>AI 生成相关面试题目</li>
              <li>输入你的回答并获取 AI 反馈</li>
              <li>根据反馈持续改进</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </PageTransition>
  )
}

