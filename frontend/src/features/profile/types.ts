export interface Education {
  school: string; degree: string; major: string; startDate: string; endDate: string
}
export interface Project {
  name: string; role: string; description: string; techStack: string; startDate: string; endDate: string
}
export interface Internship {
  company: string; position: string; description: string; startDate: string; endDate: string
}
export interface ProfileData {
  fullName: string; email: string; phone: string; summary: string
  education: Education[]; projects: Project[]; internships: Internship[]; skills: string[]; awards: string[]
}

export const emptyProfile: ProfileData = {
  fullName: "", email: "", phone: "", summary: "",
  education: [], projects: [], internships: [], skills: [], awards: [],
}
