// Camada de acesso ao backend SQLite (com fallback para o mock).
// Se o backend não estiver rodando, o front continua funcionando em modo demonstrativo.
import type { EvaluationForm } from '../types'
import { criterionAverages, ratingDistribution } from '../data/mockData'

export type DashboardData = {
  demonstrativo: boolean
  total: number
  medias: { label: string; value: number }[]
  distribuicao: { rating: string; label: string; value: number }[]
}

const mediaLabel: Record<string, string> = {
  clarity: 'Clareza',
  organization: 'Organização',
  knowledge: 'Conteúdo',
  assessment: 'Critérios',
  feedback: 'Feedback',
  communication: 'Comunicação',
  participation: 'Participação',
}

const ratingLabel: Record<number, string> = {
  1: 'Muito ruim',
  2: 'Ruim',
  3: 'Regular',
  4: 'Bom',
  5: 'Excelente',
}

export function dashboardMock(): DashboardData {
  return {
    demonstrativo: true,
    total: 148,
    medias: criterionAverages,
    distribuicao: ratingDistribution,
  }
}

export async function enviarAvaliacao(form: EvaluationForm): Promise<{ ok: boolean; offline?: boolean; id?: number }> {
  try {
    const res = await fetch('/api/avaliacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: form.studentName,
        course: form.course,
        classGroup: form.classGroup,
        teacher: form.teacher,
        subject: form.subject,
        comment: form.comment,
        ratings: form.ratings,
      }),
    })
    if (!res.ok) return { ok: false }
    const data = await res.json()
    return { ok: true, id: data.id }
  } catch {
    // Backend desligado: mantém o fluxo demonstrativo local.
    return { ok: true, offline: true }
  }
}

export async function buscarDashboard(): Promise<DashboardData> {
  try {
    const res = await fetch('/api/dashboard')
    if (!res.ok) return dashboardMock()
    const data = await res.json()
    if (data.demonstrativo) return dashboardMock()

    const totalNotas =
      (data.distribuicao as { valor: number; qtd: number }[]).reduce((acc, d) => acc + d.qtd, 0) || 1

    return {
      demonstrativo: false,
      total: data.total,
      medias: (data.medias as { criterio: string; media: number }[]).map((m) => ({
        label: mediaLabel[m.criterio] ?? m.criterio,
        value: Number(m.media),
      })),
      distribuicao: (data.distribuicao as { valor: number; qtd: number }[]).map((d) => ({
        rating: String(d.valor),
        label: ratingLabel[d.valor] ?? '',
        value: Math.round((d.qtd / totalNotas) * 100),
      })),
    }
  } catch {
    return dashboardMock()
  }
}
