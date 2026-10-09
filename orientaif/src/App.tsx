import { useEffect, useState } from 'react'
import { AboutPage } from './pages/AboutPage'
import { DashboardPage } from './pages/DashboardPage'
import { EvaluationPage } from './pages/EvaluationPage'
import { HomePage } from './pages/HomePage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import type { EvaluationForm, Page, Theme } from './types'

const initialForm: EvaluationForm = {
  studentName: '',
  course: '',
  classGroup: '',
  teacher: '',
  subject: '',
  ratings: {},
  comment: '',
  privacyAcknowledged: false,
}

const pageFromPath = (path: string): Page => {
  const routes: Record<string, Page> = {
    '/': 'home',
    '/avaliacao': 'evaluation',
    '/sobre': 'about',
    '/painel': 'dashboard',
    '/recomendacoes': 'recommendations',
  }
  return routes[path] ?? 'home'
}

const pathForPage: Record<Page, string> = {
  home: '/',
  evaluation: '/avaliacao',
  about: '/sobre',
  dashboard: '/painel',
  recommendations: '/recomendacoes',
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = window.localStorage.getItem('orienta-theme')
    return storedTheme === 'light' ? 'light' : 'dark'
  })
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname))
  const [form, setForm] = useState<EvaluationForm>(initialForm)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#090B09' : '#F5F7F0')
    window.localStorage.setItem('orienta-theme', theme)
  }, [theme])

  useEffect(() => {
    const handlePopState = () => setPage(pageFromPath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (nextPage: Page) => {
    const nextPath = pathForPage[nextPage]
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath)
    }
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleTheme = () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))

  const content = {
    home: <HomePage onNavigate={navigate} />,
    evaluation: <EvaluationPage form={form} setForm={setForm} onNavigate={navigate} />,
    about: <AboutPage onNavigate={navigate} />,
    dashboard: <DashboardPage onNavigate={navigate} />,
    recommendations: <RecommendationsPage onNavigate={navigate} />,
  }[page]

  return (
    <div className="app-shell">
      <Header activePage={page} theme={theme} onNavigate={navigate} onToggleTheme={toggleTheme} />
      <main id="main-content" className="main-content" tabIndex={-1}>
        {content}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  )
}
