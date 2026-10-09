import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Page, Theme } from '../types'
import { Brand } from './Brand'

type HeaderProps = {
  activePage: Page
  theme: Theme
  onNavigate: (page: Page) => void
  onToggleTheme: () => void
}

const links: { page: Page; label: string }[] = [
  { page: 'home', label: 'Início' },
  { page: 'evaluation', label: 'Avaliação' },
  { page: 'about', label: 'Sobre' },
  { page: 'dashboard', label: 'Visão institucional' },
  { page: 'recommendations', label: 'Recomendações' },
]

export function Header({ activePage, theme, onNavigate, onToggleTheme }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstMobileLinkRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const focusFirstItem = window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus())
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', closeWithEscape)
    return () => {
      window.cancelAnimationFrame(focusFirstItem)
      window.removeEventListener('keydown', closeWithEscape)
    }
  }, [menuOpen])

  const navigate = (page: Page) => {
    onNavigate(page)
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <div className="header-inner">
        <Brand onClick={() => navigate('home')} />
        <nav className="primary-nav" aria-label="Navegação principal">
          {links.map((link) => (
            <button
              key={link.page}
              className={activePage === link.page ? 'nav-link is-active' : 'nav-link'}
              type="button"
              onClick={() => navigate(link.page)}
              aria-current={activePage === link.page ? 'page' : undefined}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            <span>{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
          </button>
          <button className="header-cta" type="button" onClick={() => navigate('evaluation')}>Avaliar professor</button>
          <button
            ref={menuButtonRef}
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-menu" className="mobile-nav" aria-label="Navegação móvel">
          {links.map((link, index) => (
            <button
              ref={index === 0 ? firstMobileLinkRef : undefined}
              key={link.page}
              className={activePage === link.page ? 'mobile-nav-link is-active' : 'mobile-nav-link'}
              type="button"
              onClick={() => navigate(link.page)}
            >
              {link.label}
            </button>
          ))}
          <button className="mobile-evaluate" type="button" onClick={() => navigate('evaluation')}>Avaliar professor</button>
        </nav>
      )}
    </header>
  )
}
