"use client"

import { useState, useMemo } from "react"
import { useLocalStorage } from "@/lib/use-local-storage"
import { Modal } from "@/components/modal"
import { Icons } from "@/components/icons"

type Status = "draft" | "applied" | "screening" | "interview" | "offer" | "rejected"

interface Application { id: string; company: string; position: string; status: Status; deadline: string; nextStep: string }

const statusConfig: Record<Status, { label: string; color: string }> = {
  draft: { label: "草稿", color: "bg-gray-100 text-gray-600" },
  applied: { label: "已投递", color: "bg-blue-50 text-blue-600" },
  screening: { label: "筛选中", color: "bg-amber-50 text-amber-600" },
  interview: { label: "面试中", color: "bg-purple-50 text-purple-600" },
  offer: { label: "Offer", color: "bg-emerald-50 text-emerald-600" },
  rejected: { label: "未通过", color: "bg-red-50 text-red-600" },
}

const statuses: Status[] = ["draft", "applied", "screening", "interview", "offer", "rejected"]
const emptyForm = { company: "", position: "", deadline: "", nextStep: "", status: "draft" as Status }

export default function ApplicationsPage() {
  const [applications, setApplications] = useLocalStorage<Application[]>("applications", [])
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
  const openEdit = (app: Application) => { setForm({ company: app.company, position: app.position, deadline: app.deadline, nextStep: app.nextStep, status: app.status }); setEditingId(app.id); setModalOpen(true) }
  const handleSave = () => {
    if (!form.company.trim() || !form.position.trim()) return
    if (editingId) setApplications(applications.map((a) => (a.id === editingId ? { ...a, ...form } : a)))
    else setApplications([...applications, { ...form, id: Date.now().toString() }])
    setModalOpen(false)
  }
  const handleDelete = (id: string) => setApplications(applications.filter((a) => a.id !== id))

  return (
    <div className="max-w-5xl mx-auto px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">投递管理</h1>
          <p className="text-sm text-gray-400 mt-1">追踪你的校招投递进度</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Icons.Plus className="w-4 h-4" /> 添加投递
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", ...statuses] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === s ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            {s === "all" ? "全部" : statusConfig[s].label}
            <span className="ml-1 text-[10px] opacity-60">{counts[s]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-sm text-gray-300">暂无投递记录</p>
        </div>
      ) : (
        <div className="card overflow-hidden !p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 tracking-wide">公司</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 tracking-wide">岗位</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 tracking-wide">状态</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 tracking-wide">截止日期</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 tracking-wide">下一步</th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">{app.company.slice(0, 1)}</div>
                      <span className="text-sm font-medium text-gray-900">{app.company}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{app.position}</td>
                  <td className="px-5 py-4"><span className={`badge ${statusConfig[app.status].color}`}>{statusConfig[app.status].label}</span></td>
                  <td className="px-5 py-4 text-sm text-gray-400">{app.deadline || "-"}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{app.nextStep || "-"}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(app)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"><Icons.Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(app.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"><Icons.Trash className="w-3.5 h-3.5" /></button>
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
          <div><label className="label">公司名称</label><input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Tencent" /></div>
          <div><label className="label">岗位名称</label><input className="input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="前端工程师" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">状态</label><select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>{statuses.map((s) => (<option key={s} value={s}>{statusConfig[s].label}</option>))}</select></div>
            <div><label className="label">截止日期</label><input type="date" className="input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
          </div>
          <div><label className="label">下一步</label><input className="input" value={form.nextStep} onChange={(e) => setForm({ ...form, nextStep: e.target.value })} placeholder="准备笔试" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost">取消</button>
            <button onClick={handleSave} className="btn-primary">{editingId ? "保存" : "创建"}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
