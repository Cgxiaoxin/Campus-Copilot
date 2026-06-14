"use client"

import { useState, useMemo } from "react"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/empty-state"
import { PageTransition } from "@/components/motion"
import type { Priority } from "@/features/tasks/types"
import { priorities, priorityLabel } from "@/features/tasks/types"
import { useTaskStore } from "@/stores/task-store"

export default function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore()
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueTime, setDueTime] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const filtered = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed)
    if (filter === "completed") return tasks.filter((t) => t.completed)
    return tasks
  }, [tasks, filter])

  const stats = useMemo(() => ({
    total: tasks.length, active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    rate: tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0,
  }), [tasks])

  const handleAdd = () => {
    if (!title.trim()) return
    addTask({ id: Date.now().toString(), title: title.trim(), priority, dueTime, completed: false })
    setTitle(""); setDueTime("")
  }

  const priorityDot = (p: Priority) => {
    if (p === "high") return "bg-red-400"
    if (p === "medium") return "bg-amber-400"
    return "bg-emerald-400"
  }

  return (
    <PageTransition className="max-w-3xl mx-auto px-8 py-10">
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
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex gap-2.5 mb-4 flex-wrap">
            <Input className="flex-1 min-w-[160px]" placeholder="添加新任务..." value={title}
              onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>{priorities.map((p) => (<SelectItem key={p} value={p}>{priorityLabel[p]}优先级</SelectItem>))}</SelectContent>
            </Select>
            <Input type="date" className="w-40" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
            <Button onClick={handleAdd}><Icons.Plus className="w-4 h-4" /> 添加</Button>
          </div>

          <div className="flex gap-2 mb-4">
            {(["all", "active", "completed"] as const).map((f) => (
              <Button key={f} onClick={() => setFilter(f)} variant={filter === f ? "default" : "ghost"} size="sm">
                {f === "all" ? "全部" : f === "active" ? "进行中" : "已完成"}
              </Button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState message="暂无任务" />
          ) : (
            <div className="space-y-0.5">
              {filtered.map((task) => (
                <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors group">
                  <button onClick={() => toggleTask(task.id)}
                    className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all ${
                      task.completed ? "bg-primary border-primary" : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {task.completed && <Icons.Check className="w-3 h-3 text-primary-foreground" />}
                  </button>
                  <span className={`flex-1 text-sm ${task.completed ? "line-through text-muted-foreground" : "text-card-foreground"}`}>{task.title}</span>
                  {task.dueTime && <span className="text-xs text-muted-foreground tabular-nums">{task.dueTime}</span>}
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
        </CardContent>
      </Card>
    </PageTransition>
  )
}
