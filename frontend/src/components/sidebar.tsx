"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

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
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col shrink-0">
      <div className="px-5 pt-6 pb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white tracking-tight">C</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 tracking-tight">Campus</span>
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
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-gray-900" : "text-gray-400")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4 mt-2">
        <div className="border-t border-gray-100 pt-4">
          <div className="px-3 py-3 rounded-lg bg-gray-50">
            <p className="text-xs font-medium text-gray-900">校招加油</p>
            <p className="text-[11px] text-gray-400 mt-0.5">坚持就是胜利</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
