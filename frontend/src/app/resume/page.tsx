"use client"

import { useState, useMemo } from "react"
import { useLocalStorage } from "@/lib/use-local-storage"
import { Icons } from "@/components/icons"

export default function ResumePage() {
  const [jd, setJd] = useState("")
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [profile] = useLocalStorage("profile", null as null | { fullName: string; skills: string[]; summary: string })

  const keywords = useMemo(() => {
    if (!jd.trim()) return []
    const words = jd.match(/[A-Za-z+#.]+/g) || []
    const freq: Record<string, number> = {}
    words.forEach((w) => { const l = w.toLowerCase(); if (l.length > 2) freq[l] = (freq[l] || 0) + 1 })
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([w]) => w)
  }, [jd])

  const matchedSkills = useMemo(() => {
    if (!profile?.skills || !keywords.length) return []
    return profile.skills.filter((s) => keywords.some((k) => s.toLowerCase().includes(k)))
  }, [profile, keywords])

  const handleGenerate = () => {
    if (!jd.trim()) return
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">AI 简历生成</h1>
        <p className="text-sm text-gray-400 mt-1">根据岗位描述自动生成定制化简历</p>
      </div>

      <section className="card p-5 mb-5">
        <h2 className="text-xs font-semibold text-gray-500 tracking-wide mb-4">岗位描述</h2>
        <textarea className="input resize-none" rows={8} placeholder="在此粘贴岗位描述..." value={jd}
          onChange={(e) => { setJd(e.target.value); setGenerated(false) }}
        />

        {keywords.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-medium text-gray-500 mb-2.5 tracking-wide">关键词匹配</p>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => {
                const matched = profile?.skills?.some((s) => s.toLowerCase().includes(kw))
                return (
                  <span key={kw} className={`badge ${matched ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                    {kw}{matched && " ✓"}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        <button onClick={handleGenerate} disabled={generating || !jd.trim()} className="btn-primary w-full mt-4">
          {generating ? (
            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> 分析中...</>
          ) : <><Icons.Sparkles className="w-4 h-4" /> 生成简历</>}
        </button>
      </section>

      {generated && (
        <section className="card p-5 mb-5 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-semibold text-gray-500 tracking-wide">生成结果</h2>
            <span className="badge bg-emerald-50 text-emerald-600">AI 生成完成</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-900">{profile?.fullName || "你的姓名"}</p>
              <p className="text-xs text-gray-400 mt-1">{profile?.summary || "简历摘要已根据 JD 优化"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">优化技能</p>
                <div className="flex flex-wrap gap-1.5">
                  {keywords.slice(0, 6).map((kw) => (<span key={kw} className="badge bg-gray-100 text-gray-700">{kw}</span>))}
                </div>
              </div>
              {matchedSkills.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-2">已有匹配</p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.map((s) => (<span key={s} className="badge bg-emerald-50 text-emerald-600">{s}</span>))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
              <p className="font-medium text-gray-700 mb-1">优化建议</p>
              <p>• 在项目描述中突出关键词：{keywords.slice(0, 4).join("、")}</p>
              {profile?.skills && keywords.filter((k) => !profile.skills.some((s) => s.toLowerCase().includes(k))).length > 0 && (
                <p>• 建议补充：{keywords.filter((k) => !profile.skills.some((s) => s.toLowerCase().includes(k))).slice(0, 3).join("、")}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 btn-ghost border border-gray-200">预览</button>
              <button className="flex-1 btn-primary">导出 PDF</button>
            </div>
          </div>
        </section>
      )}

      <section className="card p-5">
        <h2 className="text-xs font-semibold text-gray-500 tracking-wide mb-3">使用说明</h2>
        <ol className="text-xs text-gray-400 space-y-1.5 list-decimal list-inside">
          <li>粘贴目标岗位描述</li>
          <li>AI 自动分析关键词和匹配度</li>
          <li>自动调整项目描述和技能排序</li>
          <li>预览并导出定制化简历</li>
        </ol>
      </section>
    </div>
  )
}
