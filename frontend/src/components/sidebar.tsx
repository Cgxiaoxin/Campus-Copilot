"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-dialog"

const navItems = [
  { href: "/", label: "工作台", icon: Icons.Dashboard },
  { href: "/profile", label: "我的档案", icon: Icons.Profile },
  { href: "/applications", label: "投递管理", icon: Icons.Applications },
  { href: "/resume", label: "简历生成", icon: Icons.Resume },
  { href: "/tasks", label: "任务管理", icon: Icons.Tasks },
  { href: "/interviews", label: "面试准备", icon: Icons.Interviews },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="px-5 pt-6 pb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-[10px] font-bold text-sidebar-primary-foreground tracking-tight">C</span>
          </div>
          <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">Campus</span>
        </Link>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/40")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4 mt-2 space-y-2">
        <div className="flex items-center justify-between px-3">
          <span className="text-xs text-sidebar-foreground/40">主题</span>
          <ThemeToggle />
        </div>
        <SidebarAuth />
      </div>
    </aside>
  )
}

function SidebarAuth() {
  const { token, setOpen } = useAuth()
  return (
    <div className="border-t border-sidebar-border pt-4">
      <button
        onClick={() => setOpen(true)}
        className="w-full px-3 py-2 rounded-lg text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all text-left"
      >
        {token ? "已连接后端" : "连接后端 →"}
      </button>
    </div>
  )
}
