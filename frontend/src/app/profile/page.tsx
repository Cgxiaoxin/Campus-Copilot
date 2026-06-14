"use client"

import { useState } from "react"
import { useLocalStorage } from "@/lib/use-local-storage"
import { Icons } from "@/components/icons"

interface Education { school: string; degree: string; major: string; startDate: string; endDate: string }
interface Project { name: string; role: string; description: string; techStack: string; startDate: string; endDate: string }
interface Internship { company: string; position: string; description: string; startDate: string; endDate: string }
interface ProfileData {
  fullName: string; email: string; phone: string; summary: string
  education: Education[]; projects: Project[]; internships: Internship[]; skills: string[]; awards: string[]
}

const empty: ProfileData = { fullName: "", email: "", phone: "", summary: "", education: [], projects: [], internships: [], skills: [], awards: [] }

export default function ProfilePage() {
  const [profile, setProfile] = useLocalStorage<ProfileData>("profile", empty)
  const [saved, setSaved] = useState(false)

  const update = <K extends keyof ProfileData>(key: K, val: ProfileData[K]) => setProfile((p) => ({ ...p, [key]: val }))

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const addItem = <K extends "education" | "projects" | "internships">(k: K, v: ProfileData[K][number]) =>
    setProfile((p) => ({ ...p, [k]: [...p[k], v] as ProfileData[K] }))

  const removeItem = <K extends "education" | "projects" | "internships">(k: K, i: number) =>
    setProfile((p) => ({ ...p, [k]: p[k].filter((_, j) => j !== i) as ProfileData[K] }))

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">我的档案</h1>
          <p className="text-sm text-gray-400 mt-1">统一管理你的求职信息</p>
        </div>
        <button onClick={handleSave} className="btn-primary">
          {saved ? "已保存" : "保存"}
        </button>
      </div>

      <Section title="基本信息">
        <div className="grid grid-cols-2 gap-4">
          <Field label="姓名"><input className="input" value={profile.fullName} onChange={(e) => update("fullName", e.target.value)} /></Field>
          <Field label="邮箱"><input className="input" type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} /></Field>
          <Field label="电话"><input className="input" type="tel" value={profile.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
        </div>
        <div className="mt-4">
          <label className="label">个人简介</label>
          <textarea className="input resize-none" rows={3} value={profile.summary} onChange={(e) => update("summary", e.target.value)} placeholder="简要介绍自己，突出你的优势和求职方向" />
        </div>
      </Section>

      <Section title="教育经历">
        {profile.education.map((edu, i) => (
          <ItemCard key={i} onRemove={() => removeItem("education", i)}>
            <Field label="学校"><input className="input" value={edu.school} onChange={(e) => { const n = [...profile.education]; n[i] = { ...n[i], school: e.target.value }; update("education", n) }} /></Field>
            <Field label="学历"><input className="input" value={edu.degree} onChange={(e) => { const n = [...profile.education]; n[i] = { ...n[i], degree: e.target.value }; update("education", n) }} /></Field>
            <Field label="专业"><input className="input" value={edu.major} onChange={(e) => { const n = [...profile.education]; n[i] = { ...n[i], major: e.target.value }; update("education", n) }} /></Field>
            <div className="flex gap-3">
              <Field label="开始"><input type="date" className="input" value={edu.startDate} onChange={(e) => { const n = [...profile.education]; n[i] = { ...n[i], startDate: e.target.value }; update("education", n) }} /></Field>
              <Field label="结束"><input type="date" className="input" value={edu.endDate} onChange={(e) => { const n = [...profile.education]; n[i] = { ...n[i], endDate: e.target.value }; update("education", n) }} /></Field>
            </div>
          </ItemCard>
        ))}
        <button onClick={() => addItem("education", { school: "", degree: "", major: "", startDate: "", endDate: "" })} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2 flex items-center gap-1.5">
          <Icons.Plus className="w-3.5 h-3.5" /> 添加教育经历
        </button>
      </Section>

      <Section title="项目经历">
        {profile.projects.map((proj, i) => (
          <ItemCard key={i} onRemove={() => removeItem("projects", i)}>
            <Field label="项目名称"><input className="input" value={proj.name} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], name: e.target.value }; update("projects", n) }} /></Field>
            <Field label="角色"><input className="input" value={proj.role} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], role: e.target.value }; update("projects", n) }} /></Field>
            <div className="col-span-2">
              <label className="label">描述</label>
              <textarea className="input resize-none" rows={2} value={proj.description} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], description: e.target.value }; update("projects", n) }} />
            </div>
            <Field label="技术栈"><input className="input" value={proj.techStack} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], techStack: e.target.value }; update("projects", n) }} placeholder="React, TypeScript..." /></Field>
            <div className="flex gap-3">
              <Field label="开始"><input type="date" className="input" value={proj.startDate} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], startDate: e.target.value }; update("projects", n) }} /></Field>
              <Field label="结束"><input type="date" className="input" value={proj.endDate} onChange={(e) => { const n = [...profile.projects]; n[i] = { ...n[i], endDate: e.target.value }; update("projects", n) }} /></Field>
            </div>
          </ItemCard>
        ))}
        <button onClick={() => addItem("projects", { name: "", role: "", description: "", techStack: "", startDate: "", endDate: "" })} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2 flex items-center gap-1.5">
          <Icons.Plus className="w-3.5 h-3.5" /> 添加项目经历
        </button>
      </Section>

      <Section title="实习经历">
        {profile.internships.map((intern, i) => (
          <ItemCard key={i} onRemove={() => removeItem("internships", i)}>
            <Field label="公司"><input className="input" value={intern.company} onChange={(e) => { const n = [...profile.internships]; n[i] = { ...n[i], company: e.target.value }; update("internships", n) }} /></Field>
            <Field label="职位"><input className="input" value={intern.position} onChange={(e) => { const n = [...profile.internships]; n[i] = { ...n[i], position: e.target.value }; update("internships", n) }} /></Field>
            <div className="col-span-2">
              <label className="label">描述</label>
              <textarea className="input resize-none" rows={2} value={intern.description} onChange={(e) => { const n = [...profile.internships]; n[i] = { ...n[i], description: e.target.value }; update("internships", n) }} />
            </div>
            <div className="flex gap-3">
              <Field label="开始"><input type="date" className="input" value={intern.startDate} onChange={(e) => { const n = [...profile.internships]; n[i] = { ...n[i], startDate: e.target.value }; update("internships", n) }} /></Field>
              <Field label="结束"><input type="date" className="input" value={intern.endDate} onChange={(e) => { const n = [...profile.internships]; n[i] = { ...n[i], endDate: e.target.value }; update("internships", n) }} /></Field>
            </div>
          </ItemCard>
        ))}
        <button onClick={() => addItem("internships", { company: "", position: "", description: "", startDate: "", endDate: "" })} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2 flex items-center gap-1.5">
          <Icons.Plus className="w-3.5 h-3.5" /> 添加实习经历
        </button>
      </Section>

      <Section title="技能标签">
        <div className="flex flex-wrap gap-2 mb-3">
          {profile.skills.map((s, i) => (
            <span key={i} className="badge bg-gray-100 text-gray-700">
              {s}
              <button onClick={() => update("skills", profile.skills.filter((_, j) => j !== i))} className="ml-1.5 text-gray-400 hover:text-gray-600"><Icons.X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <input className="input" placeholder="输入技能后按 Enter 添加"
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
            <span key={i} className="badge bg-gray-100 text-gray-700">
              {a}
              <button onClick={() => update("awards", profile.awards.filter((_, j) => j !== i))} className="ml-1.5 text-gray-400 hover:text-gray-600"><Icons.X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <input className="input" placeholder="输入获奖信息后按 Enter 添加"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const v = e.currentTarget.value.trim()
              if (v && !profile.awards.includes(v)) update("awards", [...profile.awards, v])
              e.currentTarget.value = ""
            }
          }}
        />
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold text-gray-500 tracking-wide mb-4">{title}</h2>
      <div className="card p-5">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

function ItemCard({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 mb-3 relative group hover:border-gray-200 transition-colors">
      <button onClick={onRemove} className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all">
        <Icons.X className="w-4 h-4" />
      </button>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  )
}
