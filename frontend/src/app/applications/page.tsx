"use client"

import { useState, useMemo } from "react"
import { Modal } from "@/components/modal"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/empty-state"
import { PageTransition } from "@/components/motion"
import type { Status } from "@/features/applications/types"
import { statusConfig, statuses, emptyForm } from "@/features/applications/types"
import { useApplicationStore } from "@/stores/application-store"

export default function ApplicationsPage() {
  const { applications, addApplication, updateApplication, deleteApplication } = useApplicationStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Status | "all">("all")

  const filtered = useMemo(() => (filter === "all" ? applications : applications.filter((a) => a.status === filter)), [applications, filter])
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: applications.length }
    statuses.forEach((s) => { c[s] = applications.filter((a) => a.status === s).length })
    return c
  }, [applications])

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true) }
  const openEdit = (app: typeof applications[number]) => { setForm({ company: app.company, position: app.position, deadline: app.deadline, nextStep: app.nextStep, status: app.status }); setEditingId(app.id); setModalOpen(true) }
  const handleSave = () => {
    if (!form.company.trim() || !form.position.trim()) return
    if (editingId) updateApplication(editingId, form)
    else addApplication({ ...form, id: Date.now().toString() })
    setModalOpen(false)
  }

  return (
    <PageTransition className="max-w-5xl mx-auto px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">投递管理</h1>
          <p className="text-sm text-gray-400 mt-1">追踪你的校招投递进度</p>
        </div>
        <Button onClick={openCreate}><Icons.Plus className="w-4 h-4" /> 添加投递</Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", ...statuses] as const).map((s) => (
          <Button key={s} onClick={() => setFilter(s)} variant={filter === s ? "default" : "ghost"} size="sm" className="text-xs">
            {s === "all" ? "全部" : statusConfig[s].label}
            <span className="ml-1 text-[10px] opacity-60">{counts[s]}</span>
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent><EmptyState message="暂无投递记录" /></CardContent></Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["公司", "岗位", "状态", "截止日期", "下一步"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground tracking-wide">{h}</th>
                ))}
                <th className="w-16" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">{app.company.slice(0, 1)}</div>
                      <span className="text-sm font-medium text-card-foreground">{app.company}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{app.position}</td>
                  <td className="px-5 py-4"><Badge className={`${statusConfig[app.status].color} border-0`}>{statusConfig[app.status].label}</Badge></td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{app.deadline || "-"}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{app.nextStep || "-"}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(app)}><Icons.Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => deleteApplication(app.id)} className="hover:text-destructive"><Icons.Trash className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "编辑投递" : "添加投递"}>
        <div className="space-y-4">
          <div><Label>公司名称</Label><Input className="mt-1" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Tencent" /></div>
          <div><Label>岗位名称</Label><Input className="mt-1" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="前端工程师" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>状态</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{statuses.map((s) => (<SelectItem key={s} value={s}>{statusConfig[s].label}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div><Label>截止日期</Label><Input type="date" className="mt-1" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
          </div>
          <div><Label>下一步</Label><Input className="mt-1" value={form.nextStep} onChange={(e) => setForm({ ...form, nextStep: e.target.value })} placeholder="准备笔试" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>取消</Button>
            <Button onClick={handleSave}>{editingId ? "保存" : "创建"}</Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  )
}
