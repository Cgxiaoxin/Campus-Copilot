"use client"

import Link from "next/link"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { PageTransition, StaggerGrid, CardMotion } from "@/components/motion"
import { useApplicationStore } from "@/stores/application-store"
import { useTaskStore } from "@/stores/task-store"
import { useProfileStore } from "@/stores/profile-store"

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
  const { applications } = useApplicationStore()
  const { tasks } = useTaskStore()
  const { profile } = useProfileStore()

  const activeTasks = tasks.filter((t) => !t.completed)
  const recentApps = applications.slice(-4).reverse()

  return (
    <PageTransition className="max-w-5xl mx-auto px-8 py-10">
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-gray-900">
          {profile?.fullName ? `${profile.fullName}，你好` : "工作台"}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}</p>
      </div>

      <StaggerGrid className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: "投递数", value: applications.length.toString(), color: "text-gray-900" },
          { label: "面试中", value: applications.filter((a) => a.status === "interview").length.toString(), color: "text-purple-600" },
          { label: "待办任务", value: activeTasks.length.toString(), color: "text-amber-600" },
          { label: "Offer", value: applications.filter((a) => a.status === "offer").length.toString(), color: "text-emerald-600" },
        ].map((s) => (
          <CardMotion key={s.label}>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground font-medium tracking-wide">{s.label}</p>
                <p className={`text-2xl font-semibold mt-1.5 ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          </CardMotion>
        ))}
      </StaggerGrid>

      <div className="grid grid-cols-2 gap-5 mb-10">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-muted-foreground tracking-wide">最近的投递</h2>
              <Link href="/applications" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                查看全部 <Icons.ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {recentApps.length === 0 ? (
              <EmptyState message="暂无投递记录" />
            ) : (
              <div className="space-y-2">
                {recentApps.map((app) => (
                  <div key={app.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{app.company}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{app.position}</p>
                    </div>
                    <Badge className={`${statusColor[app.status] || statusColor.draft} border-0`}>
                      {statusLabel[app.status] || "草稿"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-muted-foreground tracking-wide">待办任务</h2>
              <Link href="/tasks" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                查看全部 <Icons.ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {activeTasks.length === 0 ? (
              <EmptyState message="暂无待办任务" />
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
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xs font-semibold text-muted-foreground tracking-wide mb-4">快捷操作</h2>
      <StaggerGrid className="grid grid-cols-4 gap-4">
        {[
          { title: "编辑档案", desc: "管理求职信息", href: "/profile", icon: Icons.Profile },
          { title: "生成简历", desc: "AI 定制简历", href: "/resume", icon: Icons.Sparkles },
          { title: "投递管理", desc: "追踪投递进度", href: "/applications", icon: Icons.Applications },
          { title: "面试练习", desc: "AI 模拟面试", href: "/interviews", icon: Icons.Target },
        ].map((item) => (
          <CardMotion key={item.title}>
            <Link href={item.href} className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-gray-300 hover:shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 mb-3">
                <item.icon className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-card-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </Link>
          </CardMotion>
        ))}
      </StaggerGrid>
    </PageTransition>
  )
}
