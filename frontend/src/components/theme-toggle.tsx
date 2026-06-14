"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { SunIcon, MoonIcon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon-sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <SunIcon className="size-4 dark:hidden" />
      <MoonIcon className="size-4 hidden dark:block" />
      <span className="sr-only">切换主题</span>
    </Button>
  )
}
