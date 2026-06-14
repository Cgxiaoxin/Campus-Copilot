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

export interface Resume {
  id: string
  userId: string
  title: string
  template: string
  jd?: string
  content?: {
    personalInfo: { name: string; email: string; phone: string }
    summary: string
    skills: string[]
    education: Array<{ school: string; degree: string; major: string; startDate: string; endDate: string }>
    experience: Array<{ company: string; position: string; description: string; startDate: string; endDate: string }>
    projects: Array<{ name: string; role: string; description: string; techStack: string[] }>
  }
  version: number
  createdAt: string
  updatedAt: string
}

export interface InterviewQuestion {
  index: number
  question: string
  category: string
  difficulty: string
}

export interface InterviewScore {
  questionIndex: number
  score: number
  feedback: string
}

export interface InterviewSession {
  id: string
  userId: string
  company: string
  position: string
  questions: InterviewQuestion[]
  answers: Array<{ questionIndex: number; answer: string }> | null
  scores: InterviewScore[] | null
  overallScore: number | null
  report: {
    summary: string
    strengths: string[]
    suggestions: string[]
    dimensions: Record<string, number>
  } | null
  createdAt: string
}
