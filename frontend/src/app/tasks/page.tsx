"use client"

import { useState, useMemo } from "react"
import { useLocalStorage } from "@/lib/use-local-storage"
import { Icons } from "@/components/icons"

type Priority = "high" | "medium" | "low"
interface Task { id: string; title: string; priority: Priority; dueTime: string; completed: boolean }

const priorityLabel: Record<Priority, string> = { high: "高", medium: "中", low: "低" }
const priorities: Priority[] = ["high", "medium", "low"]

export default function TasksPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", [])
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueTime, setDueTime] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const filtered = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed)
    if (filter === "completed") return tasks.filter((t) => t.completed)
    return tasks
  }, [tasks, filter])

  const addTask = () => {
    if (!title.trim()) return
    setTasks([...tasks, { id: Date.now().toString(), title: title.trim(), priority, dueTime, completed: false }])
    setTitle(""); setDueTime("")
  }

  const toggleTask = (id: string) => setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  const deleteTask = (id: string) => setTasks(tasks.filter((t) => t.id !== id))

  const stats = useMemo(() => ({
    total: tasks.length, active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    rate: tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0,
  }), [tasks])

  const priorityDot = (p: Priority) => {
    if (p === "high") return "bg-red-400"
    if (p === "medium") return "bg-amber-400"
    return "bg-emerald-400"
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">任务管理</h1>
        <p className="text-sm text-gray-400 mt-1">智能任务管理与每日计划</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "总任务", value: stats.total, color: "text-gray-900" },
          { label: "进行中", value: stats.active, color: "text-blue-600" },
          { label: "已完成", value: stats.completed, color: "text-emerald-600" },
          { label: "完成率", value: `${stats.rate}%`, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-5 mb-6">
        <div className="flex gap-2.5 mb-4">
          <input className="input flex-1" placeholder="添加新任务..." value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
          <select className="select w-28" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            {priorities.map((p) => (<option key={p} value={p}>{priorityLabel[p]}优先级</option>))}
          </select>
          <input type="date" className="input w-40" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
          <button onClick={addTask} className="btn-primary"><Icons.Plus className="w-4 h-4" /> 添加</button>
        </div>

        <div className="flex gap-2 mb-4">
          {(["all", "active", "completed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
            >{f === "all" ? "全部" : f === "active" ? "进行中" : "已完成"}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-300 text-center py-8">暂无任务</p>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                <button onClick={() => toggleTask(task.id)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    task.completed ? "bg-gray-900 border-gray-900" : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {task.completed && <Icons.Check className="w-3 h-3 text-white" />}
                </button>
                <span className={`flex-1 text-sm ${task.completed ? "line-through text-gray-300" : "text-gray-700"}`}>{task.title}</span>
                {task.dueTime && <span className="text-xs text-gray-400 tabular-nums">{task.dueTime}</span>}
                <span className={`flex items-center gap-1.5 text-xs text-gray-400`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priorityDot(task.priority)}`} />
                  {priorityLabel[task.priority]}
                </span>
                <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Icons.X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
