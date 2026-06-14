"use client"

import { useState, createContext, useContext, type ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, clearToken } from "@/lib/api"

interface AuthContextType {
  token: string | null
  setToken: (t: string | null) => void
  open: boolean
  setOpen: (v: boolean) => void
}

const AuthContext = createContext<AuthContextType>({
  token: null, setToken: () => {}, open: false, setOpen: () => {},
})

export function useAuth() { return useContext(AuthContext) }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("campus_token")
  })
  const [open, setOpen] = useState(false)

  const setToken = (t: string | null) => {
    setTokenState(t)
    if (t) localStorage.setItem("campus_token", t)
    else { localStorage.removeItem("campus_token"); clearToken() }
  }

  return (
    <AuthContext.Provider value={{ token, setToken, open, setOpen }}>
      {children}
      <AuthDialog />
    </AuthContext.Provider>
  )
}

function AuthDialog() {
  const { open, setOpen, setToken } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError("")
    setLoading(true)
    try {
      const fn = mode === "login" ? api.login : api.register
      const res = await fn(email, password)
      setToken(res.access_token)
      setOpen(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "操作失败")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setToken(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="text-sm">{mode === "login" ? "登录" : "注册"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div>
            <Label className="text-xs">邮箱</Label>
            <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">密码</Label>
            <Input type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button className="w-full" onClick={handleSubmit} disabled={loading || !email || !password}>
            {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
          </Button>
          <div className="flex justify-between text-xs text-muted-foreground">
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError("") }} className="hover:text-card-foreground">
              {mode === "login" ? "没有账号？注册" : "已有账号？登录"}
            </button>
            <button onClick={handleLogout} className="hover:text-destructive">退出登录</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
