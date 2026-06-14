export interface User {
  id: string
  name: string
  email: string
}

export interface Education {
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  gpa?: string
}

export interface Project {
  name: string
  role: string
  description: string
  techStack: string[]
  startDate: string
  endDate: string
  url?: string
}

export interface Internship {
  company: string
  position: string
  description: string
  startDate: string
  endDate: string
}

export interface Profile {
  id: string
  userId: string
  fullName: string
  phone: string
  email: string
  avatar?: string
  education: Education[]
  projects: Project[]
  internships: Internship[]
  skills: string[]
  awards: string[]
  summary: string
}

export interface Application {
  id: string
  company: string
  position: string
  status: "draft" | "applied" | "screening" | "interview" | "offer" | "rejected"
  deadline: string
  appliedDate?: string
  nextStep?: string
  notes?: string
}

export interface Task {
  id: string
  title: string
  priority: "high" | "medium" | "low"
  dueTime: string
  completed: boolean
  applicationId?: string
}
