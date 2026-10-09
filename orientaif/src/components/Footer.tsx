import { ArrowUpRight } from 'lucide-react'
import type { Page } from '../types'
import { Brand } from './Brand'

type FooterProps = {
  onNavigate: (page: Page) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-intro">
          <Brand onClick={() => onNavigate('home')} />
          <p>Protótipo de tecnologia educacional para apoiar uma escuta mais organizada e melhorias orientadas por evidências.</p>
        </div>
        <div className="footer-links" aria-label="Informações do projeto">
          <span className="footer-label">Informações</span>
          <button type="button" onClick={() => onNavigate('about')}>Como funciona <ArrowUpRight size={14} /></button>
          <button type="button" onClick={() => onNavigate('about')}>Sobre anonimato <ArrowUpRight size={14} /></button>
          <button type="button" onClick={() => onNavigate('dashboard')}>Visão demonstrativa <ArrowUpRight size={14} /></button>
        </div>
        <div className="prototype-note">
          <span className="footer-label">Estado do produto</span>
          <p><strong>Protótipo demonstrativo.</strong> Não realiza coleta institucional nem análise por inteligência artificial.</p>
        </div>
      </div>
      <div className="footer-base">
        <span>Orienta IF · interface conceitual</span>
        <span>Dados exibidos são demonstrativos</span>
      </div>
    </footer>
  )
}
