import type { Criterion, Need, Recommendation } from '../types'

export const criteria: Criterion[] = [
  { id: 'clarity', label: 'Clareza nas explicações', shortLabel: 'Clareza' },
  { id: 'organization', label: 'Organização das aulas', shortLabel: 'Organização' },
  { id: 'knowledge', label: 'Domínio do conteúdo', shortLabel: 'Conteúdo' },
  { id: 'assessment', label: 'Clareza dos critérios de avaliação', shortLabel: 'Critérios' },
  { id: 'feedback', label: 'Qualidade do feedback', shortLabel: 'Feedback' },
  { id: 'communication', label: 'Comunicação com os estudantes', shortLabel: 'Comunicação' },
  { id: 'participation', label: 'Estímulo à participação', shortLabel: 'Participação' },
]

export const academicFields = [
  { id: 'studentName', label: 'Nome do estudante', placeholder: 'Como deseja ser identificado no contexto acadêmico?' },
  { id: 'course', label: 'Curso', placeholder: 'Ex.: Técnico em Informática' },
  { id: 'classGroup', label: 'Turma', placeholder: 'Ex.: 2º ano A' },
  { id: 'teacher', label: 'Professor avaliado', placeholder: 'Nome do professor' },
  { id: 'subject', label: 'Disciplina', placeholder: 'Ex.: Desenvolvimento Web' },
] as const

export const criterionAverages = [
  { label: 'Clareza', value: 3.1 },
  { label: 'Organização', value: 3.4 },
  { label: 'Conteúdo', value: 4.2 },
  { label: 'Critérios', value: 2.8 },
  { label: 'Feedback', value: 3.0 },
  { label: 'Comunicação', value: 3.2 },
  { label: 'Participação', value: 3.7 },
]

export const ratingDistribution = [
  { rating: '1', label: 'Muito ruim', value: 6 },
  { rating: '2', label: 'Ruim', value: 13 },
  { rating: '3', label: 'Regular', value: 30 },
  { rating: '4', label: 'Bom', value: 34 },
  { rating: '5', label: 'Excelente', value: 17 },
]

export const needs: Need[] = [
  {
    title: 'Clareza dos critérios de avaliação',
    description: 'Parte das respostas fictícias aponta dificuldade para compreender como as atividades são avaliadas.',
    responses: 31,
    priority: 'Alta',
  },
  {
    title: 'Organização das atividades',
    description: 'Os dados demonstrativos sugerem oportunidade de tornar a sequência de tarefas mais previsível.',
    responses: 24,
    priority: 'Média',
  },
  {
    title: 'Comunicação com os estudantes',
    description: 'Há sinais agregados fictícios de que canais, prazos e devolutivas podem ficar mais claros.',
    responses: 18,
    priority: 'Em acompanhamento',
  },
]

export const recommendations: Recommendation[] = [
  {
    id: 1,
    need: 'Melhorar a clareza dos critérios de avaliação',
    evidence: 'Parte das respostas demonstrativas indica dificuldades para compreender os critérios utilizados nas atividades.',
    recommendation: 'Avaliar a adoção de rubricas com critérios explícitos e exemplos de diferentes níveis de desempenho.',
    rationale: 'Uma referência compartilhada pode apoiar a transparência do processo e orientar a preparação dos estudantes.',
    indicator: 'Percentual de estudantes que afirmam compreender os critérios de avaliação.',
    review: 'Aguardando revisão humana',
  },
  {
    id: 2,
    need: 'Tornar a organização das atividades mais previsível',
    evidence: 'As respostas agregadas simuladas indicam variação na percepção sobre a sequência e os prazos das atividades.',
    recommendation: 'Testar uma visão semanal com objetivos, entregas e materiais necessários para cada encontro.',
    rationale: 'Uma cadência visível facilita o acompanhamento e cria um ponto de partida para ajustes pedagógicos.',
    indicator: 'Percentual de estudantes que relatam conhecer as próximas atividades da disciplina.',
    review: 'Em revisão pedagógica',
  },
  {
    id: 3,
    need: 'Fortalecer a qualidade das devolutivas',
    evidence: 'Há uma oportunidade demonstrativa de tornar os retornos sobre atividades mais acionáveis para os estudantes.',
    recommendation: 'Definir momentos de feedback com indicação de avanços, próximos passos e espaço para dúvidas.',
    rationale: 'Devolutivas estruturadas podem apoiar a aprendizagem contínua sem reduzir a autonomia docente.',
    indicator: 'Percentual de estudantes que consideram o feedback útil para melhorar.',
    review: 'Acompanhamento sugerido',
  },
]
