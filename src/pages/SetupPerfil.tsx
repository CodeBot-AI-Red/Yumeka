import { useState, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import styles from './SetupPerfil.module.css'

function LogoIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#e11d48" />
      <text x="16" y="23" fontSize="18" textAnchor="middle" fill="white"
        fontFamily="serif" fontWeight="bold">夢</text>
    </svg>
  )
}

function Spinner() {
  return (
    <svg className={styles.spinner} width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" aria-label="Carregando">
      <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export default function SetupPerfil() {
  const id = useId()
  const navigate = useNavigate()

  const [name, setName]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const nameOk = name.trim().length >= 2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!nameOk) return
    setError(null)
    setLoading(true)
    try {
      await authService.updateDisplayName(name.trim())
      navigate('/', { replace: true })
    } catch {
      setError('Não foi possível salvar seu nome. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <LogoIcon />
          <span className={styles.logoText}>Yumeka</span>
        </div>

        <div className={styles.wave}>👋</div>

        <h1 className={styles.title}>Como devemos te chamar?</h1>
        <p className={styles.sub}>
          Escolha um nome para exibir no seu perfil. Pode ser seu nome real ou um apelido.
        </p>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <ErrorIcon />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor={`${id}-name`} className={styles.label}>
              Seu nome
            </label>
            <input
              id={`${id}-name`}
              type="text"
              autoComplete="name"
              autoFocus
              placeholder="Ex: Sakura, João, SenpaiOtaku..."
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setTouched(true)}
              className={`${styles.input} ${touched && !nameOk && name.length > 0 ? styles.inputError : ''}`}
              disabled={loading}
              maxLength={50}
            />
            {touched && name.length > 0 && !nameOk && (
              <span className={styles.hint} role="alert">
                Use pelo menos 2 caracteres.
              </span>
            )}
            <span className={styles.counter}>{name.length}/50</span>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !nameOk}
          >
            {loading ? <Spinner /> : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  )
}
