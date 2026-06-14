"use client"

import { useState } from "react"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/motion"
import type { InterviewQuestion } from "@/types"

type Stage = "setup" | "answering" | "review"

export default function InterviewPage() {
  const [stage, setStage] = useState<Stage>("setup")
  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [generating, setGenerating] = useState(false)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [scores, setScores] = useState<Array<{ score: number; feedback: string }>>([])
  const [overallScore, setOverallScore] = useState(0)

  const handleGenerate = async () => {
    if (!company || !position) return
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 1000))
    setQuestions([
      { index: 0, question: "请简单介绍一下你自己，以及为什么你对这个岗位感兴趣？", category: "行为面试", difficulty: "简单" },
      { index: 1, question: "请描述一个你在团队中解决过的技术难题。", category: "行为面试", difficulty: "中等" },
      { index: 2, question: "对于你使用的编程语言，它的垃圾回收机制是如何工作的？", category: "技术面试", difficulty: "中等" },
      { index: 3, question: "请解释 RESTful API 的设计原则，并举例说明。", category: "技术面试", difficulty: "中等" },
      { index: 4, question: "如果让你重新设计你最近完成的一个项目，你会做哪些不同的选择？", category: "行为面试", difficulty: "较难" },
    ])
    setAnswers(new Array(5).fill(""))
    setScores([])
    setCurrentQ(0)
    setGenerating(false)
    setStage("answering")
  }

  const handleSubmitAnswer = () => {
    const length = answers[currentQ].length
    const score = Math.min(30 + length * 0.3, 95)
    const feedback = score > 70 ? "回答完整，表达清晰。" : "回答较为简略，建议补充更多细节。"
    setScores((prev) => {
      const next = [...prev]
      next[currentQ] = { score: Math.round(score), feedback }
      return next
    })

    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1)
    } else {
      const total = scores.reduce((sum, s) => sum + s.score, 0) + Math.round(score)
      setOverallScore(Math.round(total / questions.length))
      setStage("review")
    }
  }

  return (
    <PageTransition className="max-w-3xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-card-foreground">面试准备</h1>
        <p className="text-sm text-muted-foreground mt-1">AI 模拟面试 · 实时评分 · 复盘报告</p>
      </div>

      {stage === "setup" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Label>目标公司</Label>
            <Input placeholder="如：字节跳动" value={company} onChange={(e) => setCompany(e.target.value)} />
            <Label>目标岗位</Label>
            <Input placeholder="如：前端开发工程师" value={position} onChange={(e) => setPosition(e.target.value)} />
            <Button onClick={handleGenerate} disabled={generating || !company || !position} className="w-full">
              {generating ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> 生成中...</>
              ) : (
                <><Icons.Interviews className="w-4 h-4" /> 开始模拟面试</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {stage === "answering" && questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">问题 {currentQ + 1} / {questions.length}</span>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className={`w-8 h-1 rounded-full ${i < currentQ ? "bg-emerald-400" : i === currentQ ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[11px]">{questions[currentQ].category}</Badge>
                <Badge variant="outline" className="text-[11px]">{questions[currentQ].difficulty}</Badge>
              </div>
              <p className="text-sm text-card-foreground leading-relaxed">{questions[currentQ].question}</p>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
                placeholder="输入你的回答..."
                rows={5}
                value={answers[currentQ]}
                onChange={(e) => {
                  const next = [...answers]
                  next[currentQ] = e.target.value
                  setAnswers(next)
                }}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{answers[currentQ].length} 字</span>
                <div className="flex gap-2">
                  {currentQ > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setCurrentQ((c) => c - 1)}>上一题</Button>
                  )}
                  <Button size="sm" onClick={handleSubmitAnswer} disabled={!answers[currentQ].trim()}>
                    {currentQ < questions.length - 1 ? "下一题" : "完成评测"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {scores.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-muted-foreground tracking-wide mb-2">已评题目</p>
                <div className="space-y-1.5">
                  {scores.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-card-foreground">Q{i + 1}</span>
                      <span className={s.score >= 70 ? "text-emerald-500" : "text-amber-500"}>{s.score}分</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {stage === "review" && overallScore > 0 && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-xs text-muted-foreground mb-2">综合评分</p>
              <p className={`text-4xl font-semibold ${overallScore >= 80 ? "text-emerald-500" : overallScore >= 60 ? "text-blue-500" : "text-amber-500"}`}>{overallScore}</p>
              <p className="text-xs text-muted-foreground mt-1">{overallScore >= 80 ? "表现优秀" : overallScore >= 60 ? "表现良好" : "建议多加练习"}</p>
            </CardContent>
          </Card>

          {scores.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-card-foreground">Q{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-card-foreground mb-1">{questions[i]?.question}</p>
                    <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2">{answers[i]}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${s.score >= 70 ? "text-emerald-500" : "text-amber-500"}`}>{s.score}</span>
                      <span className="text-[11px] text-muted-foreground">{s.feedback}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setStage("setup"); setQuestions([]); setScores([]) }}>重新开始</Button>
            <Button className="flex-1" onClick={() => window.print()}>导出报告</Button>
          </div>
        </div>
      )}
    </PageTransition>
  )
}
