"use client"

import Link from "next/link"
import { useLocalStorage } from "@/lib/use-local-storage"
import { Icons } from "@/components/icons"

interface Application { id: string; company: string; position: string; status: string }
interface Task { id: string; title: string; completed: boolean; priority: string; dueTime: string }

const statusColor: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  applied: "bg-blue-50 text-blue-600",
  screening: "bg-amber-50 text-amber-600",
  interview: "bg-purple-50 text-purple-600",
  offer: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-600",
}

const statusLabel: Record<string, string> = {
  draft: "草稿", applied: "已投递", screening: "筛选中", interview: "面试", offer: "Offer", rejected: "未通过",
}

export default function Dashboard() {
  const [applications] = useLocalStorage<Application[]>("applications", [])
  const [tasks] = useLocalStorage<Task[]>("tasks", [])
  const [profile] = useLocalStorage("profile", null as { fullName: string } | null)

  const activeTasks = tasks.filter((t) => !t.completed)
  const recentApps = applications.slice(-4).reverse()

  return (
    <div className="max-w-5xl mx-auto px-8 py-10 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-gray-900">
          {profile?.fullName ? `${profile.fullName}，你好` : "工作台"}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: "投递数", value: applications.length.toString(), color: "text-gray-900" },
          { label: "面试中", value: applications.filter((a) => a.status === "interview").length.toString(), color: "text-purple-600" },
          { label: "待办任务", value: activeTasks.length.toString(), color: "text-amber-600" },
          { label: "Offer", value: applications.filter((a) => a.status === "offer").length.toString(), color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-xs text-gray-400 font-medium tracking-wide">{s.label}</p>
            <p className={`text-2xl font-semibold mt-1.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-500 tracking-wide">最近的投递</h2>
            <Link href="/applications" className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
              查看全部 <Icons.ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {recentApps.length === 0 ? (
            <p className="text-sm text-gray-300 py-6 text-center">暂无投递记录</p>
          ) : (
            <div className="space-y-2">
              {recentApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{app.company}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{app.position}</p>
                  </div>
                  <span className={`badge ${statusColor[app.status] || statusColor.draft}`}>
                    {statusLabel[app.status] || "草稿"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-500 tracking-wide">待办任务</h2>
            <Link href="/tasks" className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
              查看全部 <Icons.ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {activeTasks.length === 0 ? (
            <p className="text-sm text-gray-300 py-6 text-center">暂无待办任务</p>
          ) : (
            <div className="space-y-2">
              {activeTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.priority === "high" ? "bg-red-400" : task.priority === "medium" ? "bg-amber-400" : "bg-emerald-400"}`} />
                  <p className="text-sm text-gray-700 flex-1 truncate">{task.title}</p>
                  {task.dueTime && <span className="text-xs text-gray-400 tabular-nums">{task.dueTime}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xs font-semibold text-gray-500 tracking-wide mb-4">快捷操作</h2>
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: "编辑档案", desc: "管理求职信息", href: "/profile", icon: Icons.Profile },
          { title: "生成简历", desc: "AI 定制简历", href: "/resume", icon: Icons.Sparkles },
          { title: "投递管理", desc: "追踪投递进度", href: "/applications", icon: Icons.Applications },
          { title: "面试练习", desc: "AI 模拟面试", href: "/interviews", icon: Icons.Target },
        ].map((item) => (
          <Link key={item.title} href={item.href} className="card-hover p-5 group">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-900 group-hover:text-white transition-all duration-200 mb-3">
              <item.icon className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
