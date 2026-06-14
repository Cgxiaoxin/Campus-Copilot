type IconProps = { className?: string }

function Icon({ children, className = "w-5 h-5" }: { children: React.ReactNode; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
}

export const Icons = {
  Dashboard: ({ className }: IconProps) => <Icon className={className}><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></Icon>,
  Profile: ({ className }: IconProps) => <Icon className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>,
  Applications: ({ className }: IconProps) => <Icon className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></Icon>,
  Resume: ({ className }: IconProps) => <Icon className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></Icon>,
  Tasks: ({ className }: IconProps) => <Icon className={className}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Icon>,
  Interviews: ({ className }: IconProps) => <Icon className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></Icon>,
  Plus: ({ className }: IconProps) => <Icon className={className}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>,
  ChevronRight: ({ className }: IconProps) => <Icon className={className}><polyline points="9 18 15 12 9 6" /></Icon>,
  MoreHorizontal: ({ className }: IconProps) => <Icon className={className}><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></Icon>,
  Trash: ({ className }: IconProps) => <Icon className={className}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Icon>,
  Edit: ({ className }: IconProps) => <Icon className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>,
  Check: ({ className }: IconProps) => <Icon className={className}><polyline points="20 6 9 17 4 12" /></Icon>,
  X: ({ className }: IconProps) => <Icon className={className}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>,
  ArrowRight: ({ className }: IconProps) => <Icon className={className}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>,
  Search: ({ className }: IconProps) => <Icon className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>,
  Sparkles: ({ className }: IconProps) => <Icon className={className}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M18.5 14.5L16 16l2.5 1.5L20 20l1.5-2.5L24 16l-2.5-1.5L20 12l-1.5 2.5z" /><path d="M6 14l-1.5 2.5L2 18l2.5 1.5L6 22l1.5-2.5L10 18l-2.5-1.5L6 14z" /></Icon>,
  Target: ({ className }: IconProps) => <Icon className={className}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></Icon>,
  Clock: ({ className }: IconProps) => <Icon className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>,
  Building: ({ className }: IconProps) => <Icon className={className}><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="9" y1="6" x2="9" y2="6.01" /><line x1="15" y1="6" x2="15" y2="6.01" /><line x1="9" y1="10" x2="9" y2="10.01" /><line x1="15" y1="10" x2="15" y2="10.01" /><line x1="9" y1="14" x2="9" y2="14.01" /><line x1="15" y1="14" x2="15" y2="14.01" /></Icon>,
  Briefcase: ({ className }: IconProps) => <Icon className={className}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></Icon>,
  Calendar: ({ className }: IconProps) => <Icon className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Icon>,
  Graduation: ({ className }: IconProps) => <Icon className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></Icon>,
  Code: ({ className }: IconProps) => <Icon className={className}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>,
}
