import { ArrowRight, Database, EyeOff, FileWarning, ShieldCheck, UsersRound } from 'lucide-react'
import type { Page } from '../types'

type AboutPageProps = { onNavigate: (page: Page) => void }

const commitments = [
  { icon: EyeOff, title: 'Separação necessária', text: 'No sistema final, identificação e contexto acadêmico devem ser processados separadamente das notas e comentários.' },
  { icon: UsersRound, title: 'Leitura agregada', text: 'A visão institucional deve priorizar tendências e grupos, nunca perfis individuais ou comentários atribuídos a estudantes.' },
  { icon: ShieldCheck, title: 'Revisão humana', text: 'Qualquer recomendação futura precisa de revisão pedagógica antes de orientar decisões ou intervenções.' },
]

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <section className="page-section section-shell about-page">
      <div className="page-hero">
        <div className="eyebrow">Sobre o Orienta IF</div>
        <h1>Uma interface para transformar escuta em <span>compreensão responsável.</span></h1>
        <p>O Orienta IF é um projeto de tecnologia educacional voltado ao apoio da melhoria institucional. Esta versão apresenta somente o fluxo visual e os princípios da experiência.</p>
      </div>

      <div className="principles-layout">
        <aside className="side-label"><span>PRINCÍPIOS<br />DO PROJETO</span></aside>
        <div className="principles-content">
          <article className="principle-card feature-card">
            <div className="feature-icon"><Database size={20} /></div>
            <div><h2>Contexto não é conteúdo da avaliação</h2><p>Nome, turma, curso, professor e disciplina ajudam a contextualizar a experiência, mas não devem ser associados às notas e aos comentários exibidos em análises futuras.</p></div>
          </article>
          <article className="principle-card feature-card warning-card">
            <div className="feature-icon"><FileWarning size={20} /></div>
            <div><h2>O front-end não garante anonimato sozinho</h2><p>Esta demonstração não realiza coleta, transmissão ou armazenamento institucional. O anonimato depende de controles de backend, regras de acesso e testes técnicos que ainda não fazem parte desta etapa.</p></div>
          </article>
        </div>
      </div>

      <div className="commitment-grid">
        {commitments.map((commitment) => {
          const Icon = commitment.icon
          return <article className="commitment-card" key={commitment.title}><Icon size={23} aria-hidden="true" /><h3>{commitment.title}</h3><p>{commitment.text}</p></article>
        })}
      </div>

      <section className="about-cta" aria-label="Participar da demonstração">
        <div><div className="eyebrow">Pronto para conhecer o fluxo?</div><h2>Experimente a avaliação demonstrativa.</h2></div>
        <button className="button button-primary" type="button" onClick={() => onNavigate('evaluation')}>Avaliar professor <ArrowRight size={18} /></button>
      </section>
    </section>
  )
}
