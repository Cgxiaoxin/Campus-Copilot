import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Sidebar } from "@/components/sidebar"
import { Providers } from "@/components/providers"
import { CommandPalette } from "@/components/command-palette"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Campus Copilot",
  description: "AI 校招操作系统",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground flex">
        <Providers>
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <CommandPalette />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
