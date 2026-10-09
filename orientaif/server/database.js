// Banco SQLite em arquivo — sem instalar MySQL/Postgres.
// Usa o módulo nativo do Node 22: `node:sqlite`.
// O arquivo `orienta.db` é criado sozinho na primeira execução.
import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

// Pasta deste arquivo — sem import.meta para o bundle portátil funcionar.
// Em dev: process.argv[1] = .../server/server.js -> server/
// Portátil: process.argv[1] = .../OrientaIF/servidor.cjs -> OrientaIF/
const __dirname = path.dirname(path.resolve(process.argv[1] || process.cwd()))

// Modo portátil: banco fica ao lado do servidor empacotado / pasta de execução,
// não dentro do código. Assim dá para levar no pendrive sem perder dados.
function resolverCaminhoBanco() {
  // servidor.mjs empacotado mora em release/OrientaIF/ -> banco vai para lá.
  // Em dev, __dirname é server/ -> banco vai para server/.
  try {
    const dono = path.dirname(process.argv[1] || '')
    if (dono && dono !== '.' && !dono.endsWith('node')) return path.join(dono, 'orienta.db')
  } catch { /* usa fallback */ }
  return path.join(__dirname, 'orienta.db')
}

const dbPath = process.env.ORIENTA_DB || resolverCaminhoBanco()

export const db = new DatabaseSync(dbPath)

// Toda a estrutura da base está aqui, via código (protótipo).
db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS avaliacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudante TEXT NOT NULL,
    curso TEXT NOT NULL,
    turma TEXT NOT NULL,
    professor TEXT NOT NULL,
    disciplina TEXT NOT NULL,
    comentario TEXT DEFAULT '',
    criado_em TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS notas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    avaliacao_id INTEGER NOT NULL,
    criterio TEXT NOT NULL,
    valor INTEGER NOT NULL CHECK (valor BETWEEN 1 AND 5),
    FOREIGN KEY (avaliacao_id) REFERENCES avaliacoes(id) ON DELETE CASCADE
  );
`)

// Insere uma avaliação + as 7 notas. Retorna o id gerado.
export function criarAvaliacao({ estudante, curso, turma, professor, disciplina, comentario = '', ratings }) {
  const insertAvaliacao = db.prepare(`
    INSERT INTO avaliacoes (estudante, curso, turma, professor, disciplina, comentario)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const insertNota = db.prepare(`
    INSERT INTO notas (avaliacao_id, criterio, valor) VALUES (?, ?, ?)
  `)

  // Transação manual do node:sqlite: ou grava tudo, ou não grava nada.
  db.exec('BEGIN')
  try {
    const result = insertAvaliacao.run(estudante, curso, turma, professor, disciplina, comentario ?? '')
    const avaliacaoId = Number(result.lastInsertRowid)
    for (const [criterio, valor] of Object.entries(ratings)) {
      insertNota.run(avaliacaoId, criterio, Number(valor))
    }
    db.exec('COMMIT')
    return avaliacaoId
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

export function contarAvaliacoes() {
  return Number(db.prepare(`SELECT COUNT(*) AS total FROM avaliacoes`).get().total)
}

export function mediasPorCriterio() {
  return db
    .prepare(`SELECT criterio, ROUND(AVG(valor), 1) AS media, COUNT(*) AS votos FROM notas GROUP BY criterio`)
    .all()
}

export function distribuicaoNotas() {
  return db
    .prepare(`SELECT valor, COUNT(*) AS qtd FROM notas GROUP BY valor ORDER BY valor`)
    .all()
}

export function listarAvaliacoes(limit = 20) {
  return db
    .prepare(`SELECT id, estudante, curso, turma, professor, disciplina, comentario, criado_em FROM avaliacoes ORDER BY id DESC LIMIT ?`)
    .all(limit)
}
