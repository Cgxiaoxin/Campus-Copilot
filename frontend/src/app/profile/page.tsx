"use client"

import { useState } from "react"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageTransition } from "@/components/motion"
import { Section } from "@/features/profile/components/section"
import { Field } from "@/features/profile/components/field"
import { ItemCard } from "@/features/profile/components/item-card"
import { useProfileStore } from "@/stores/profile-store"

export default function ProfilePage() {
  const { profile, update, addItem, removeItem } = useProfileStore()
  const [saved, setSaved] = useState(false)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <PageTransition className="max-w-3xl mx-auto px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">我的档案</h1>
          <p className="text-sm text-gray-400 mt-1">统一管理你的求职信息</p>
        </div>
        <Button onClick={handleSave} disabled={saved}>
          {saved ? "已保存" : "保存"}
        </Button>
      </div>

      <Section title="基本信息">
        <div className="grid grid-cols-2 gap-4">
          <Field label="姓名"><Input value={profile.fullName} onChange={(e) => update("fullName", e.target.value)} /></Field>
          <Field label="邮箱"><Input type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} /></Field>
          <Field label="电话"><Input type="tel" value={profile.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
        </div>
        <div className="mt-4">
          <Label>个人简介</Label>
          <textarea className="mt-1 h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none" rows={3} value={profile.summary} onChange={(e) => update("summary", e.target.value)} placeholder="简要介绍自己，突出你的优势和求职方向" />
        </div>
      </Section>

      <Section title="教育经历">
        {profile.education.map((edu, i) => (
          <ItemCard key={i} onRemove={() => removeItem("education", i)}>
            <Field label="学校"><Input value={edu.school} onChange={(e) => { const n = [...profile.education]; n[i] = { ...n[i], school: e.target.value }; update("education", n) }} /></Field>
            <Field label="学历"><Input value={edu.degree} onChange={(e) => { const n = [...profile.education]; n[i] = { ...n[i], degree: e.target.value }; update("education", n) }} /></Field>
            <Field label="专业"><Input value={edu.major} onChange={(e) => { const n = [...profile.education]; n[i] = { ...n[i], major: e.target.value }; update("education", n) }} /></Field>
            <div className="flex gap-3">
              <Field label="开始"><Input type="date" value={edu.startDate} onChange={(e) => { const n = [...profile.education]; n[i] = { ...n[i], startDate: e.target.value }; update("education", n) }} /></Field>
              <Field label="结束"><Input type="date" value={edu.endDate} onChange={(e) => { const n = [...profile.education]; n[i] = { ...n[i], endDate: e.target.value }; update("education", n) }} /></Field>
            </div>
          </ItemCard>
        ))}
        <Button variant="ghost" size="sm" onClick={() => addItem("education", { school: "", degree: "", major: "", startDate: "", endDate: "" })}>
          <Icons.Plus className="w-3.5 h-3.5" /> 添加教育经历
        </Button>
      </Section>

      <Section title="项目经历">
        {profile.projects.map((proj, i) => (
          <ItemCard key={i} onRemove={() => removeItem("projects", i)}>
            <Field label="项目名称"><Input value={proj.name} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], name: e.target.value }; update("projects", n) }} /></Field>
            <Field label="角色"><Input value={proj.role} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], role: e.target.value }; update("projects", n) }} /></Field>
            <div className="col-span-2">
              <Label>描述</Label>
              <textarea className="mt-1 h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none" rows={2} value={proj.description} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], description: e.target.value }; update("projects", n) }} />
            </div>
            <Field label="技术栈"><Input value={proj.techStack} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], techStack: e.target.value }; update("projects", n) }} placeholder="React, TypeScript..." /></Field>
            <div className="flex gap-3">
              <Field label="开始"><Input type="date" value={proj.startDate} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], startDate: e.target.value }; update("projects", n) }} /></Field>
              <Field label="结束"><Input type="date" value={proj.endDate} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], endDate: e.target.value }; update("projects", n) }} /></Field>
            </div>
          </ItemCard>
        ))}
        <Button variant="ghost" size="sm" onClick={() => addItem("projects", { name: "", role: "", description: "", techStack: "", startDate: "", endDate: "" })}>
          <Icons.Plus className="w-3.5 h-3.5" /> 添加项目经历
        </Button>
      </Section>

      <Section title="实习经历">
        {profile.internships.map((intern, i) => (
          <ItemCard key={i} onRemove={() => removeItem("internships", i)}>
            <Field label="公司"><Input value={intern.company} onChange={(e) => { const n = [...profile.internships]; n[i] = { ...n[i], company: e.target.value }; update("internships", n) }} /></Field>
            <Field label="职位"><Input value={intern.position} onChange={(e) => { const n = [...profile.internships]; n[i] = { ...n[i], position: e.target.value }; update("internships", n) }} /></Field>
            <div className="col-span-2">
              <Label>描述</Label>
              <textarea className="mt-1 h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none" rows={2} value={intern.description} onChange={(e) => { const n = [...profile.internships]; n[i] = { ...n[i], description: e.target.value }; update("internships", n) }} />
            </div>
            <div className="flex gap-3">
              <Field label="开始"><Input type="date" value={intern.startDate} onChange={(e) => { const n = [...profile.internships]; n[i] = { ...n[i], startDate: e.target.value }; update("internships", n) }} /></Field>
              <Field label="结束"><Input type="date" value={intern.endDate} onChange={(e) => { const n = [...profile.internships]; n[i] = { ...n[i], endDate: e.target.value }; update("internships", n) }} /></Field>
            </div>
          </ItemCard>
        ))}
        <Button variant="ghost" size="sm" onClick={() => addItem("internships", { company: "", position: "", description: "", startDate: "", endDate: "" })}>
          <Icons.Plus className="w-3.5 h-3.5" /> 添加实习经历
        </Button>
      </Section>

      <Section title="技能标签">
        <div className="flex flex-wrap gap-2 mb-3">
          {profile.skills.map((s, i) => (
            <span key={i} className="inline-flex h-5 w-fit items-center gap-1 rounded-4xl border border-transparent bg-muted px-2 py-0.5 text-xs font-medium whitespace-nowrap text-foreground">
              {s}
              <button onClick={() => update("skills", profile.skills.filter((_, j) => j !== i))} className="ml-0.5 text-muted-foreground hover:text-foreground"><Icons.X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <Input placeholder="输入技能后按 Enter 添加"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const v = e.currentTarget.value.trim()
              if (v && !profile.skills.includes(v)) update("skills", [...profile.skills, v])
              e.currentTarget.value = ""
            }
          }}
        />
      </Section>

      <Section title="获奖与荣誉">
        <div className="flex flex-wrap gap-2 mb-3">
          {profile.awards.map((a, i) => (
            <span key={i} className="inline-flex h-5 w-fit items-center gap-1 rounded-4xl border border-transparent bg-muted px-2 py-0.5 text-xs font-medium whitespace-nowrap text-foreground">
              {a}
              <button onClick={() => update("awards", profile.awards.filter((_, j) => j !== i))} className="ml-0.5 text-muted-foreground hover:text-foreground"><Icons.X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <Input placeholder="输入获奖信息后按 Enter 添加"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const v = e.currentTarget.value.trim()
              if (v && !profile.awards.includes(v)) update("awards", [...profile.awards, v])
              e.currentTarget.value = ""
            }
          }}
        />
      </Section>
    </PageTransition>
  )
}
