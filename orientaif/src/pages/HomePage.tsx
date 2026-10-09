import { ArrowRight, BarChart3, CheckCircle2, Compass, LockKeyhole, ScanLine, Sparkles } from 'lucide-react'
import type { Page } from '../types'

type HomePageProps = { onNavigate: (page: Page) => void }

const steps = [
  {
    number: '01',
    icon: ScanLine,
    title: 'Escuta',
    text: 'Os estudantes compartilham suas experiências acadêmicas de forma respeitosa e orientada.',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Análise',
    text: 'As respostas são organizadas para ajudar a identificar necessidades de maneira agregada.',
  },
  {
    number: '03',
    icon: Compass,
    title: 'Orientação',
    text: 'As informações podem apoiar propostas de melhoria e acompanhamento pedagógico.',
  },
]

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <section className="hero-section section-shell">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" />Escuta estudantil, com propósito</div>
          <h1>Uma educação melhor começa com a <span>escuta.</span></h1>
          <p className="hero-lead">O Orienta IF transforma percepções dos estudantes em informações que ajudam a identificar necessidades e orientar melhorias no ambiente educacional.</p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => onNavigate('evaluation')}>Avaliar professor <ArrowRight size={18} /></button>
            <button className="button button-quiet" type="button" onClick={() => onNavigate('about')}>Conhecer o projeto</button>
          </div>
          <div className="hero-reassurance"><LockKeyhole size={16} aria-hidden="true" /><span>Protótipo com orientações de privacidade e sem envio institucional real.</span></div>
        </div>
        <div className="hero-visual" aria-label="Representação visual do processo de escuta, análise e orientação">
          <div className="signal-grid" aria-hidden="true" />
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="visual-card visual-card-main">
            <div className="visual-card-top"><span>MAPA DE ESCUTA</span><span className="status-light">ATIVO</span></div>
            <div className="visual-line"><span>Perspectivas</span><strong>organizadas</strong></div>
            <div className="signal-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="visual-card-bottom"><span>Leitura coletiva</span><span>Etapa futura</span></div>
          </div>
          <div className="visual-card visual-card-small">
            <Sparkles size={17} aria-hidden="true" />
            <span>Melhoria começa aqui</span>
          </div>
          <div className="hero-seal"><Compass size={24} /><span>ORIENTA<br />IF</span></div>
        </div>
      </section>

      <section className="process-section section-shell" aria-labelledby="process-title">
        <div className="section-heading split-heading">
          <div>
            <div className="eyebrow">Um ciclo para orientar</div>
            <h2 id="process-title">Da experiência à possibilidade de melhoria.</h2>
          </div>
          <p>O desenho do produto prioriza uma experiência clara para estudantes e uma leitura institucional responsável dos dados agregados.</p>
        </div>
        <div className="process-rail">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <article className="process-item" key={step.number}>
                <div className="process-index">{step.number}</div>
                <div className="process-icon"><Icon size={21} aria-hidden="true" /></div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            )
          })}
        </div>
        <p className="future-note"><Sparkles size={16} aria-hidden="true" />A análise por inteligência artificial é uma possibilidade prevista para uma etapa futura. Nesta demonstração, não há IA conectada.</p>
      </section>

      <section className="project-section section-shell" aria-labelledby="project-title">
        <div className="project-panel">
          <div className="project-symbol" aria-hidden="true"><CheckCircle2 size={34} /></div>
          <div>
            <div className="eyebrow">Tecnologia educacional</div>
            <h2 id="project-title">Escutar com cuidado é parte de melhorar com responsabilidade.</h2>
          </div>
          <p>O Orienta IF é uma proposta de interface para apoiar a melhoria institucional. Ele foi pensado para separar visualmente contexto acadêmico e respostas, evitando que percepções individuais sejam apresentadas como perfis pessoais.</p>
          <button className="text-link" type="button" onClick={() => onNavigate('about')}>Entender princípios e limites do protótipo <ArrowRight size={17} /></button>
        </div>
      </section>

      <section className="closing-section section-shell">
        <div className="closing-copy">
          <div className="eyebrow">Sua experiência importa</div>
          <h2>Participe de uma escuta que respeita o contexto e aponta caminhos.</h2>
        </div>
        <button className="button button-primary" type="button" onClick={() => onNavigate('evaluation')}>Iniciar avaliação <ArrowRight size={18} /></button>
      </section>
    </>
  )
}
