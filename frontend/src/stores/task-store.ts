import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task } from "@/features/tasks/types"

interface TaskStore {
  tasks: Task[]
  addTask: (task: Task) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
      toggleTask: (id) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
    }),
    { name: "tasks" }
  )
)
