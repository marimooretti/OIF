// Backend protótipo do Orienta IF — Express + SQLite em arquivo.
// Dev: npm run server  (API em http://localhost:3001, front Vite :3000 via proxy)
// Portátil: npm start (mesma porta serve front dist/ + API, sem Vite)
import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import {
  contarAvaliacoes,
  criarAvaliacao,
  distribuicaoNotas,
  listarAvaliacoes,
  mediasPorCriterio,
} from './database.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '64kb' }))

const CRITERIOS_VALIDOS = [
  'clarity',
  'organization',
  'knowledge',
  'assessment',
  'feedback',
  'communication',
  'participation',
]

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mode: 'sqlite-arquivo', db: process.env.ORIENTA_DB || 'orienta.db' })
})

// Envio do formulário (Etapa 3 do EvaluationPage).
app.post('/api/avaliacoes', (req, res) => {
  const { studentName, course, classGroup, teacher, subject, comment = '', ratings = {} } = req.body ?? {}

  if (!studentName?.trim() || !course?.trim() || !classGroup?.trim() || !teacher?.trim() || !subject?.trim()) {
    return res.status(400).json({ error: 'Campos acadêmicos incompletos.' })
  }
  for (const criterio of CRITERIOS_VALIDOS) {
    const valor = Number(ratings[criterio])
    if (!Number.isInteger(valor) || valor < 1 || valor > 5) {
      return res.status(400).json({ error: `Nota inválida para ${criterio}. Use 1 a 5.` })
    }
  }

  try {
    const id = criarAvaliacao({
      estudante: studentName.trim(),
      curso: course.trim(),
      turma: classGroup.trim(),
      professor: teacher.trim(),
      disciplina: subject.trim(),
      comentario: String(comment ?? '').slice(0, 700),
      ratings,
    })
    return res.status(201).json({ id, mensagem: 'Avaliação registrada na demonstração.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Falha ao gravar no SQLite.' })
  }
})

// Lista simples para mostrar a base funcionando (protótipo: sem anonimização real).
app.get('/api/avaliacoes', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  res.json({ total: contarAvaliacoes(), itens: listarAvaliacoes(limit) })
})

// Agregados para o painel institucional.
// Se o banco ainda está vazio, devolve `demonstrativo: true` para o front usar o mock.
app.get('/api/dashboard', (_req, res) => {
  const total = contarAvaliacoes()
  if (total === 0) {
    return res.json({ demonstrativo: true, total: 0 })
  }
  res.json({
    demonstrativo: false,
    total,
    medias: mediasPorCriterio(),
    distribuicao: distribuicaoNotas(),
  })
})

// Recomendações seguem simuladas nesta fase (sem IA).
app.get('/api/recomendacoes', (_req, res) => {
  res.json({
    demonstrativo: true,
    aviso: 'Demonstração — recomendação simulada, não produzida por IA.',
    itens: 3,
  })
})

// --- Modo plug-and-play: serve o front compilado (dist/) na mesma porta ---
// Se a pasta dist/ existir ao lado, o backend vira o software completo:
// front + API + SQLite em http://localhost:PORT. Sem Vite, sem npm no destino.
const __dirname = path.dirname(path.resolve(process.argv[1] || process.cwd()))
const candidatosDist = [
  path.join(__dirname, '../dist'),
  path.join(path.dirname(process.argv[1] || ''), 'dist'),
  path.join(path.dirname(process.execPath), 'dist'),
  path.join(process.cwd(), 'dist'),
]
const pastaDist = candidatosDist.find((p) => fs.existsSync(path.join(p, 'index.html')))
if (pastaDist) {
  app.use(express.static(pastaDist))
  // SPA fallback: qualquer rota não-/api devolve o index.html
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(pastaDist, 'index.html'))
  })
  console.log(`Front estático servido de: ${pastaDist}`)
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Orienta IF (front + API + SQLite) em http://localhost:${PORT}`)
})
