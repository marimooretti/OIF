import { Check, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, Edit3, LockKeyhole, MessageSquareText } from 'lucide-react'
import { useState, type Dispatch, type FormEvent, type KeyboardEvent, type SetStateAction } from 'react'
import { academicFields, criteria } from '../data/mockData'
import { enviarAvaliacao } from '../lib/api'
import type { EvaluationForm, Page } from '../types'

type EvaluationPageProps = {
  form: EvaluationForm
  setForm: Dispatch<SetStateAction<EvaluationForm>>
  onNavigate: (page: Page) => void
}

type TextField = keyof Pick<EvaluationForm, 'studentName' | 'course' | 'classGroup' | 'teacher' | 'subject' | 'comment'>

const ratingLabels = ['', 'Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente']
const steps = ['Informações acadêmicas', 'Avaliação do professor', 'Revisão e envio']

export function EvaluationPage({ form, setForm, onNavigate }: EvaluationPageProps) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [savedOffline, setSavedOffline] = useState(false)

  const updateTextField = (field: TextField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const validateStep = (target: number) => {
    const nextErrors: Record<string, string> = {}

    if (target === 1) {
      academicFields.forEach((field) => {
        if (!form[field.id].trim()) nextErrors[field.id] = `Informe ${field.label.toLowerCase()}.`
      })
    }

    if (target === 2) {
      criteria.forEach((criterion) => {
        if (!form.ratings[criterion.id]) nextErrors[criterion.id] = 'Selecione uma nota de 1 a 5.'
      })
    }

    if (target === 3 && !form.privacyAcknowledged) {
      nextErrors.privacyAcknowledged = 'Confirme que leu o aviso de privacidade para enviar a demonstração.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const next = () => {
    if (validateStep(step)) setStep((current) => Math.min(current + 1, 3))
  }

  const selectRating = (id: string, value: number) => {
    setForm((current) => ({ ...current, ratings: { ...current.ratings, [id]: value } }))
    setErrors((current) => ({ ...current, [id]: '' }))
  }

  const submit = async () => {
    if (!validateStep(3) || sending) return
    setSending(true)
    const result = await enviarAvaliacao(form)
    setSending(false)
    if (!result.ok) {
      setErrors((current) => ({ ...current, submit: 'Não foi possível gravar no banco. Tente de novo.' }))
      return
    }
    setSavedOffline(Boolean(result.offline))
    setSubmitted(true)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step < 3) next()
    else submit()
  }

  if (submitted) {
    return (
      <section className="success-view section-shell">
        <div className="success-icon"><CheckCircle2 size={40} /></div>
        <div className="eyebrow">Envio demonstrativo concluído</div>
        <h1>Avaliação registrada na demonstração.</h1>
        <p>Obrigado por contribuir com uma educação melhor. {savedOffline ? 'Backend desligado: registro apenas visual neste navegador.' : 'Registro gravado no banco SQLite local (server/orienta.db).'} Nenhuma análise por IA foi realizada.</p>
        <div className="success-actions">
          <button className="button button-primary" type="button" onClick={() => onNavigate('home')}>Voltar ao início</button>
          <button className="button button-quiet" type="button" onClick={() => onNavigate('dashboard')}>Ver visão demonstrativa</button>
        </div>
      </section>
    )
  }

  return (
    <section className="evaluation-page section-shell">
      <div className="form-header">
        <div>
          <div className="eyebrow">Avaliação demonstrativa</div>
          <h1>{step === 1 ? 'Vamos começar.' : step === 2 ? 'Sua experiência importa.' : 'Revise sua avaliação.'}</h1>
        </div>
        <div className="form-header-note"><LockKeyhole size={17} /><span>Não há envio institucional nesta versão.</span></div>
      </div>

      <ol className="progress-steps" aria-label={`Etapa ${step} de 3`}>
        {steps.map((label, index) => {
          const number = index + 1
          return (
            <li key={label} className={number === step ? 'is-current' : number < step ? 'is-complete' : ''}>
              <button type="button" disabled={number > step} onClick={() => setStep(number)}>
                <span>{number < step ? <Check size={15} /> : number}</span><strong>Etapa {number}</strong><em>{label}</em>
              </button>
            </li>
          )
        })}
      </ol>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-card">
          {step === 1 && <InfoStep form={form} errors={errors} onChange={updateTextField} />}
          {step === 2 && <RatingsStep form={form} errors={errors} onSelect={selectRating} onChange={updateTextField} />}
          {step === 3 && (
            <ReviewStep
              form={form}
              errors={errors}
              onPrivacyChange={(checked) => {
                setForm((current) => ({ ...current, privacyAcknowledged: checked }))
                setErrors((current) => ({ ...current, privacyAcknowledged: '' }))
              }}
              onEdit={setStep}
            />
          )}
        </div>

        <div className="form-actions">
          {step > 1 ? <button className="button button-quiet" type="button" onClick={() => setStep((current) => current - 1)}><ChevronLeft size={18} />Voltar</button> : <span />}
          {step < 3
            ? <button className="button button-primary" type="submit">Continuar <ChevronRight size={18} /></button>
            : <button className="button button-primary" type="submit" disabled={sending}>{sending ? 'Enviando…' : 'Enviar avaliação'} <CheckCircle2 size={18} /></button>}
        </div>
        {errors.submit && <p className="field-error"><CircleAlert size={15} />{errors.submit}</p>}
      </form>
    </section>
  )
}

type InfoStepProps = {
  form: EvaluationForm
  errors: Record<string, string>
  onChange: (field: TextField, value: string) => void
}

function InfoStep({ form, errors, onChange }: InfoStepProps) {
  return (
    <div className="step-content">
      <div className="step-intro"><p>Informe seus dados acadêmicos para contextualizar a avaliação.</p><span>Todos os campos são obrigatórios nesta demonstração.</span></div>
      <div className="field-grid">
        {academicFields.map((field) => (
          <div className="field" key={field.id}>
            <label htmlFor={field.id}>{field.label}</label>
            <input id={field.id} value={form[field.id]} onChange={(event) => onChange(field.id, event.target.value)} placeholder={field.placeholder} aria-invalid={Boolean(errors[field.id])} aria-describedby={errors[field.id] ? `${field.id}-error` : undefined} />
            {errors[field.id] && <p id={`${field.id}-error`} className="field-error"><CircleAlert size={15} />{errors[field.id]}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

type RatingsStepProps = {
  form: EvaluationForm
  errors: Record<string, string>
  onSelect: (id: string, value: number) => void
  onChange: InfoStepProps['onChange']
}

function RatingsStep({ form, errors, onSelect, onChange }: RatingsStepProps) {
  const handleRatingKeyDown = (event: KeyboardEvent<HTMLButtonElement>, criterionId: string, currentValue: number) => {
    const keys = {
      ArrowRight: currentValue === 5 ? 1 : currentValue + 1,
      ArrowDown: currentValue === 5 ? 1 : currentValue + 1,
      ArrowLeft: currentValue === 1 ? 5 : currentValue - 1,
      ArrowUp: currentValue === 1 ? 5 : currentValue - 1,
      Home: 1,
      End: 5,
    } as const
    const nextValue = keys[event.key as keyof typeof keys]

    if (!nextValue) return
    event.preventDefault()
    onSelect(criterionId, nextValue)
    const group = event.currentTarget.closest('[role="radiogroup"]')
    window.requestAnimationFrame(() => group?.querySelector<HTMLButtonElement>(`button[data-rating="${nextValue}"]`)?.focus())
  }

  return (
    <div className="step-content">
      <div className="step-intro"><p>Avalie sua experiência com o professor de forma respeitosa e compartilhe pontos que possam ajudar a melhorar o ensino.</p><span>Use a escala de 1 (Muito ruim) a 5 (Excelente).</span></div>
      <div className="rating-list">
        {criteria.map((criterion) => {
          const selected = form.ratings[criterion.id]
          const errorId = `${criterion.id}-error`
          return (
            <fieldset className={errors[criterion.id] ? 'rating-row has-error' : 'rating-row'} key={criterion.id}>
              <legend>{criterion.label}</legend>
              <div className="rating-controls" role="radiogroup" aria-label={criterion.label} aria-describedby={errors[criterion.id] ? errorId : undefined}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    data-rating={rating}
                    type="button"
                    className={selected === rating ? 'rating-button is-selected' : 'rating-button'}
                    onClick={() => onSelect(criterion.id, rating)}
                    onKeyDown={(event) => handleRatingKeyDown(event, criterion.id, rating)}
                    role="radio"
                    aria-checked={selected === rating}
                    aria-label={`${rating} — ${ratingLabels[rating]}`}
                    tabIndex={selected === rating || (!selected && rating === 1) ? 0 : -1}
                  >
                    <strong>{rating}</strong><span>{ratingLabels[rating]}</span>
                  </button>
                ))}
              </div>
              <div className="rating-selection" aria-live="polite">{selected ? <><Check size={15} />Selecionado: <strong>{selected} — {ratingLabels[selected]}</strong></> : 'Selecione uma nota'}</div>
              {errors[criterion.id] && <p id={errorId} className="field-error"><CircleAlert size={15} />{errors[criterion.id]}</p>}
            </fieldset>
          )
        })}
      </div>
      <div className="comment-field">
        <label htmlFor="comment"><MessageSquareText size={18} />Quer explicar melhor sua avaliação? <span>Opcional</span></label>
        <p>Compartilhe sua experiência, indicando o que funciona bem e o que poderia melhorar. Evite incluir nomes de outros estudantes ou informações pessoais de terceiros.</p>
        <textarea id="comment" maxLength={700} value={form.comment} onChange={(event) => onChange('comment', event.target.value)} placeholder="Escreva aqui, se desejar..." />
        <div className="character-count">{form.comment.length}/700 caracteres</div>
      </div>
    </div>
  )
}

type ReviewStepProps = {
  form: EvaluationForm
  errors: Record<string, string>
  onPrivacyChange: (checked: boolean) => void
  onEdit: (step: number) => void
}

function ReviewStep({ form, errors, onPrivacyChange, onEdit }: ReviewStepProps) {
  return (
    <div className="step-content">
      <div className="step-intro"><p>Confira as informações antes de concluir esta experiência demonstrativa.</p><span>Você pode voltar e corrigir qualquer campo.</span></div>
      <div className="review-columns">
        <section className="review-block">
          <div className="review-title"><div><span>01</span><h2>Identificação e contexto</h2></div><button type="button" onClick={() => onEdit(1)}><Edit3 size={15} />Editar</button></div>
          <dl>{academicFields.map((field) => <div key={field.id}><dt>{field.label}</dt><dd>{form[field.id]}</dd></div>)}</dl>
        </section>
        <section className="review-block">
          <div className="review-title"><div><span>02</span><h2>Respostas da avaliação</h2></div><button type="button" onClick={() => onEdit(2)}><Edit3 size={15} />Editar</button></div>
          <dl>{criteria.map((criterion) => <div key={criterion.id}><dt>{criterion.shortLabel}</dt><dd>{form.ratings[criterion.id]} — {ratingLabels[form.ratings[criterion.id]]}</dd></div>)}</dl>
          {form.comment && <div className="review-comment"><strong>Comentário opcional</strong><p>{form.comment}</p></div>}
        </section>
      </div>
      <aside className="privacy-notice"><LockKeyhole size={22} /><div><h2>Sobre anonimato nesta demonstração</h2><p>Seu nome e suas informações acadêmicas são usados aqui apenas para contextualizar o fluxo visual. No sistema final, dados de identificação e respostas deverão ser armazenados e processados separadamente, com controles técnicos para impedir a associação de cada comentário a quem o escreveu.</p><p>Este protótipo de front-end <strong>não implementa essa separação técnica</strong> e não realiza envio institucional real.</p></div></aside>
      <label className={errors.privacyAcknowledged ? 'privacy-check has-error' : 'privacy-check'}>
        <input type="checkbox" checked={form.privacyAcknowledged} onChange={(event) => onPrivacyChange(event.target.checked)} aria-describedby={errors.privacyAcknowledged ? 'privacyAcknowledged-error' : undefined} />
        <span><strong>Li e compreendi o aviso de privacidade e os limites desta demonstração.</strong><small>O botão de envio só registra uma confirmação visual neste navegador.</small></span>
      </label>
      {errors.privacyAcknowledged && <p id="privacyAcknowledged-error" className="field-error"><CircleAlert size={15} />{errors.privacyAcknowledged}</p>}
    </div>
  )
}
