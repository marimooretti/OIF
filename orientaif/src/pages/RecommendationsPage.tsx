import { ArrowRight, BookOpenCheck, CheckCircle2, ClipboardCheck, FileSearch, Lightbulb, UsersRound } from 'lucide-react'
import { recommendations } from '../data/mockData'
import type { Page } from '../types'

type RecommendationsPageProps = { onNavigate: (page: Page) => void }

const reviewMeta = {
  'Aguardando revisão humana': { icon: FileSearch, tone: 'pending' },
  'Em revisão pedagógica': { icon: UsersRound, tone: 'review' },
  'Acompanhamento sugerido': { icon: ClipboardCheck, tone: 'followup' },
}

export function RecommendationsPage({ onNavigate }: RecommendationsPageProps) {
  return (
    <section className="recommendations-page section-shell">
      <div className="recommendation-header">
        <div><div className="eyebrow">Camada futura do produto</div><h1>Recomendações demonstrativas</h1><p>Uma proposta visual para transformar tendências agregadas em sugestões que precisam de contexto e revisão humana.</p></div>
        <div className="simulation-stamp"><Lightbulb size={20} /><span>Demonstração<br /><strong>sem IA conectada</strong></span></div>
      </div>

      <div className="recommendation-intro"><BookOpenCheck size={21} /><p>As recomendações abaixo são exemplos locais. Elas não foram geradas por inteligência artificial, não se baseiam em documentos institucionais e não devem orientar decisões reais.</p></div>

      <div className="recommendation-list">{recommendations.map((item) => {
        const meta = reviewMeta[item.review]
        const StatusIcon = meta.icon
        return <article className="recommendation-card" key={item.id}><div className="recommendation-number">0{item.id}</div><div className="recommendation-body"><div className="recommendation-topline"><span>NECESSIDADE IDENTIFICADA</span><div className={`review-status ${meta.tone}`}><StatusIcon size={15} />{item.review}</div></div><h2>{item.need}</h2><div className="recommendation-detail-grid"><div><span>EVIDÊNCIA AGREGADA</span><p>{item.evidence}</p></div><div><span>RECOMENDAÇÃO SUGERIDA</span><p>{item.recommendation}</p></div><div><span>JUSTIFICATIVA</span><p>{item.rationale}</p></div><div><span>INDICADOR DE ACOMPANHAMENTO</span><p>{item.indicator}</p></div></div><div className="source-row"><CheckCircle2 size={16} /><span><strong>Fontes documentais:</strong> não disponíveis nesta demonstração.</span></div></div></article>
      })}</div>

      <section className="recommendation-cta"><div><div className="eyebrow">Ver a origem da leitura</div><h2>Conheça a visualização institucional simulada.</h2></div><button className="button button-quiet" type="button" onClick={() => onNavigate('dashboard')}>Ir para o painel <ArrowRight size={18} /></button></section>
    </section>
  )
}
