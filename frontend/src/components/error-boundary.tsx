"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon } from "lucide-react"

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-8">
          <AlertTriangleIcon className="size-10 text-muted-foreground" />
          <div>
            <h2 className="text-sm font-semibold text-card-foreground">页面出错了</h2>
            <p className="text-xs text-muted-foreground mt-1">{this.state.error?.message}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => this.setState({ hasError: false })}>
            重试
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
