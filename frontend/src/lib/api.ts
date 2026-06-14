const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_V1 = `${API_BASE}/api/v1`

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("campus_token")
}

function setToken(token: string) {
  localStorage.setItem("campus_token", token)
}

export function clearToken() {
  localStorage.removeItem("campus_token")
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${API_V1}${endpoint}`, {
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
    ...options,
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }))
    throw new Error(detail.detail || `API Error: ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  // Auth
  register: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).then((r) => { setToken(r.access_token); return r }),

  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).then((r) => { setToken(r.access_token); return r }),

  // Profile
  getProfile: () =>
    request<import("@/types").Profile>("/profile"),

  updateProfile: (data: Partial<import("@/types").Profile>) =>
    request<import("@/types").Profile>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Applications
  getApplications: (status?: string) =>
    request<import("@/types").Application[]>(
      `/applications${status ? `?status=${status}` : ""}`
    ),

  createApplication: (data: Partial<import("@/types").Application>) =>
    request<import("@/types").Application>("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateApplication: (id: string, data: Partial<import("@/types").Application>) =>
    request<import("@/types").Application>(`/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteApplication: (id: string) =>
    request<void>(`/applications/${id}`, { method: "DELETE" }),

  // Tasks
  getTasks: () =>
    request<import("@/types").Task[]>("/tasks"),

  createTask: (data: Partial<import("@/types").Task>) =>
    request<import("@/types").Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTask: (id: string, data: Partial<import("@/types").Task>) =>
    request<import("@/types").Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteTask: (id: string) =>
    request<void>(`/tasks/${id}`, { method: "DELETE" }),

  // Resumes
  generateResume: (data: { jd: string; template?: string; title?: string }) =>
    request<import("@/types").Resume>("/resumes/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getResumes: () =>
    request<import("@/types").Resume[]>("/resumes"),

  getResume: (id: string) =>
    request<import("@/types").Resume>(`/resumes/${id}`),

  updateResume: (id: string, data: Partial<import("@/types").Resume>) =>
    request<import("@/types").Resume>(`/resumes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteResume: (id: string) =>
    request<void>(`/resumes/${id}`, { method: "DELETE" }),

  // Interviews
  generateInterview: (data: { company: string; position: string }) =>
    request<import("@/types").InterviewSession>("/interviews/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  submitInterview: (sessionId: string, answers: Array<{ questionIndex: number; answer: string }>) =>
    request<import("@/types").InterviewSession>("/interviews/submit", {
      method: "POST",
      body: JSON.stringify({ sessionId, answers }),
    }),

  getInterviewSessions: () =>
    request<import("@/types").InterviewSession[]>("/interviews"),

  getInterviewSession: (id: string) =>
    request<import("@/types").InterviewSession>(`/interviews/${id}`),
}
