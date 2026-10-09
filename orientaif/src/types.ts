export type Theme = 'dark' | 'light'

export type Page = 'home' | 'evaluation' | 'about' | 'dashboard' | 'recommendations'

export type Criterion = {
  id: string
  label: string
  shortLabel: string
}

export type AcademicInfo = {
  studentName: string
  course: string
  classGroup: string
  teacher: string
  subject: string
}

export type Ratings = Record<string, number>

export type EvaluationForm = AcademicInfo & {
  ratings: Ratings
  comment: string
  privacyAcknowledged: boolean
}

export type Need = {
  title: string
  description: string
  responses: number
  priority: 'Alta' | 'Média' | 'Em acompanhamento'
}

export type Recommendation = {
  id: number
  need: string
  evidence: string
  recommendation: string
  rationale: string
  indicator: string
  review: 'Aguardando revisão humana' | 'Em revisão pedagógica' | 'Acompanhamento sugerido'
  source?: string
}
