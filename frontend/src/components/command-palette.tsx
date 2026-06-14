"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { LayoutDashboardIcon, UserIcon, FileTextIcon, ClipboardListIcon, CheckSquareIcon, MessageSquareTextIcon } from "lucide-react"

const pages = [
  { href: "/", label: "工作台", icon: LayoutDashboardIcon, shortcut: "⌘1" },
  { href: "/profile", label: "我的档案", icon: UserIcon, shortcut: "⌘2" },
  { href: "/applications", label: "投递管理", icon: FileTextIcon, shortcut: "⌘3" },
  { href: "/resume", label: "简历生成", icon: ClipboardListIcon, shortcut: "⌘4" },
  { href: "/tasks", label: "任务管理", icon: CheckSquareIcon, shortcut: "⌘5" },
  { href: "/interviews", label: "面试准备", icon: MessageSquareTextIcon, shortcut: "⌘6" },
]

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="搜索页面或输入命令..." />
      <CommandList>
        <CommandEmpty>无结果</CommandEmpty>
        <CommandGroup heading="导航">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              value={page.label}
              onSelect={() => { router.push(page.href); setOpen(false) }}
            >
              <page.icon className="size-4" />
              <span>{page.label}</span>
              <CommandShortcut>{page.shortcut}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
