import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProfileData } from "@/features/profile/types"
import { emptyProfile } from "@/features/profile/types"

interface ProfileStore {
  profile: ProfileData
  update: <K extends keyof ProfileData>(key: K, val: ProfileData[K]) => void
  setProfile: (p: ProfileData) => void
  addItem: <K extends "education" | "projects" | "internships">(k: K, v: ProfileData[K][number]) => void
  removeItem: <K extends "education" | "projects" | "internships">(k: K, i: number) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: emptyProfile,
      setProfile: (profile) => set({ profile }),
      update: (key, val) => set((s) => ({ profile: { ...s.profile, [key]: val } })),
      addItem: (k, v) => set((s) => ({ profile: { ...s.profile, [k]: [...s.profile[k], v] as ProfileData[typeof k] } })),
      removeItem: (k, i) => set((s) => ({ profile: { ...s.profile, [k]: s.profile[k].filter((_, j) => j !== i) as ProfileData[typeof k] } })),
    }),
    { name: "profile" }
  )
)
