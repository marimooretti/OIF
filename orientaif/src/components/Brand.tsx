type BrandProps = {
  onClick?: () => void
  compact?: boolean
}

export function Brand({ onClick, compact = false }: BrandProps) {
  return (
    <button className="brand" type="button" onClick={onClick} aria-label="Orienta IF — ir para a página inicial">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M6 23.5V8.5L16 4l10 4.5v15L16 28 6 23.5Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M11 12.2 16 9.8l5 2.4v7.6L16 22l-5-2.2v-7.6Z" fill="currentColor" opacity=".85" />
          <path d="M16 4v5.8M6 8.5l5 3.7M26 8.5l-5 3.7M16 22v6" stroke="currentColor" strokeWidth="1.25" opacity=".75" />
        </svg>
      </span>
      {!compact && (
        <span className="brand-wordmark">
          <strong>Orienta</strong><em>IF</em>
        </span>
      )}
    </button>
  )
}
