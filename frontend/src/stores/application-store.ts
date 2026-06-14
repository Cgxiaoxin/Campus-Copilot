import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Application } from "@/features/applications/types"

interface ApplicationStore {
  applications: Application[]
  setApplications: (apps: Application[]) => void
  addApplication: (app: Application) => void
  updateApplication: (id: string, data: Partial<Application>) => void
  deleteApplication: (id: string) => void
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set) => ({
      applications: [],
      setApplications: (applications) => set({ applications }),
      addApplication: (app) => set((s) => ({ applications: [...s.applications, app] })),
      updateApplication: (id, data) => set((s) => ({ applications: s.applications.map((a) => a.id === id ? { ...a, ...data } : a) })),
      deleteApplication: (id) => set((s) => ({ applications: s.applications.filter((a) => a.id !== id) })),
    }),
    { name: "applications" }
  )
)
