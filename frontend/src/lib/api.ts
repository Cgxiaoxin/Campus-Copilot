const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}

export const api = {
  getProfile: () => request<import("@/types").Profile>("/api/profile"),
  updateProfile: (data: Partial<import("@/types").Profile>) =>
    request("/api/profile", { method: "PUT", body: JSON.stringify(data) }),
  getApplications: () =>
    request<import("@/types").Application[]>("/api/applications"),
  getTasks: () => request<import("@/types").Task[]>("/api/tasks"),
}
