import { ArrowRight, BarChart3, ClipboardList, Lightbulb, ShieldAlert, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { needs } from '../data/mockData'
import { buscarDashboard, dashboardMock, type DashboardData } from '../lib/api'
import type { Page } from '../types'

type DashboardPageProps = { onNavigate: (page: Page) => void }

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [data, setData] = useState<DashboardData>(dashboardMock)

  useEffect(() => {
    buscarDashboard().then(setData)
  }, [])

  const menorMedia = [...data.medias].sort((a, b) => a.value - b.value)[0]

  return (
    <section className="dashboard-page section-shell">
      <div className="dashboard-header">
        <div><div className="eyebrow">Ambiente separado da experiência estudantil</div><h1>Visão institucional</h1><p>Visualização demonstrativa de necessidades identificadas a partir de avaliações acadêmicas.</p></div>
        <div className="demo-badge"><ShieldAlert size={16} />{data.demonstrativo ? 'Dados fictícios · demonstração' : `${data.total} registro(s) no SQLite local`}</div>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><div className="metric-icon"><Users size={20} /></div><span>Total de avaliações</span><strong>{data.demonstrativo ? '148' : String(data.total)}</strong><small>{data.demonstrativo ? 'fictícias, para demonstração' : 'gravadas em server/orienta.db'}</small></article>
        <article className="metric-card"><div className="metric-icon"><ClipboardList size={20} /></div><span>Categorias identificadas</span><strong>03</strong><small>temas demonstrativos</small></article>
        <article className="metric-card"><div className="metric-icon"><BarChart3 size={20} /></div><span>Menor média {data.demonstrativo ? 'fictícia' : 'real'}</span><strong>{menorMedia.value.toFixed(1).replace('.', ',')}</strong><small>{menorMedia.label.toLowerCase()}</small></article>
        <article className="metric-card"><div className="metric-icon"><Lightbulb size={20} /></div><span>Recomendações</span><strong>03</strong><small>simuladas e revisáveis</small></article>
      </div>

      <div className="dashboard-grid">
        <section className="chart-card" aria-labelledby="average-chart-title"><div className="chart-title"><div><span className="card-kicker">Médias por critério</span><h2 id="average-chart-title">{data.demonstrativo ? 'Percepção agregada simulada' : 'Percepção agregada do banco local'}</h2></div><span className="scale-label">Escala 1–5</span></div><div className="bar-chart" role="img" aria-label="Gráfico demonstrativo de médias por critério, em uma escala de 1 a 5.">{data.medias.map((item) => <div className="bar-line" key={item.label}><span>{item.label}</span><div className="bar-track"><i style={{ width: `${(item.value / 5) * 100}%` }} /></div><strong>{item.value.toFixed(1)}</strong></div>)}</div><p className="chart-caption">{data.demonstrativo ? 'Médias locais e fictícias. Não representam resultados oficiais do IFTO.' : 'Médias calculadas via AVG no SQLite a partir das avaliações enviadas.'}</p></section>
        <section className="chart-card distribution-card" aria-labelledby="distribution-chart-title"><div className="chart-title"><div><span className="card-kicker">Distribuição de notas</span><h2 id="distribution-chart-title">{data.demonstrativo ? 'Composição simulada' : 'Composição real do banco'}</h2></div></div><div className="distribution-chart" role="img" aria-label="Distribuição demonstrativa de notas de 1 a 5.">{data.medias.length > 0 && data.distribuicao.map((item) => <div className="distribution-column" key={item.rating}><div className="distribution-track"><i style={{ height: `${item.value * 2}%` }}><b>{item.value}%</b></i></div><strong>{item.rating}</strong><span>{item.label}</span></div>)}</div><p className="chart-caption">{data.demonstrativo ? 'Percentuais fictícios para demonstrar leitura de tendências.' : 'Percentuais calculados com COUNT/GROUP BY no SQLite.'}</p></section>
      </div>

      <section className="needs-section" aria-labelledby="needs-title"><div className="section-heading"><div><div className="eyebrow">Síntese agregada</div><h2 id="needs-title">Necessidades em observação</h2></div><p>Itens simulados para exemplificar como uma equipe institucional poderia iniciar uma leitura responsável, sem expor respostas individuais.</p></div><div className="needs-list">{needs.map((need, index) => <article className="need-row" key={need.title}><span className="need-index">0{index + 1}</span><div><h3>{need.title}</h3><p>{need.description}</p></div><div className="need-meta"><span>{need.responses} respostas fictícias</span><strong className={`priority priority-${need.priority.toLowerCase().replaceAll(' ', '-')}`}>{need.priority}</strong></div></article>)}</div></section>

      <section className="dashboard-cta"><div><div className="eyebrow">Próxima camada do protótipo</div><h2>Explore recomendações simuladas e o estado de revisão humana.</h2></div><button className="button button-primary" type="button" onClick={() => onNavigate('recommendations')}>Ver recomendações <ArrowRight size={18} /></button></section>
    </section>
  )
}
