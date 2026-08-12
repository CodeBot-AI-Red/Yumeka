import { useState, useId } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

/* ─── Ícones ────────────────────────────────────────────────── */
function EyeIcon({ off }: { off?: boolean }) {
  return off ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function LogoIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#e11d48" />
      <text x="16" y="23" fontSize="18" textAnchor="middle" fill="white"
        fontFamily="serif" fontWeight="bold">夢</text>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

/* ─── Destaques do painel visual ────────────────────────────── */
const HIGHLIGHTS = [
  { kanji: '夢', label: 'Sonhos em movimento' },
  { kanji: '力', label: 'Histórias que transformam' },
  { kanji: '絆', label: 'Laços que transcendem' },
]

/* ─── Componente principal ───────────────────────────────────── */
export default function Login() {
  const id = useId()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [activeHighlight, setActiveHighlight] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setError(null)
    setLoading(true)
    try {
      // TODO: substituir por authService.signIn(email, password)
      await new Promise(r => setTimeout(r, 800))
      navigate('/')
    } catch {
      setError('E-mail ou senha incorretos. Verifique e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      // TODO: substituir por authService.signInWithGoogle()
      await new Promise(r => setTimeout(r, 600))
      navigate('/')
    } catch {
      setError('Não foi possível entrar com o Google. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      {/* ── Painel visual ───────────────────────────────────── */}
      <aside className={styles.visual} aria-hidden="true">
        <div className={styles.visualNoise} />
        <div className={styles.visualGlow} />

        {/* Kanji flutuantes decorativos */}
        <span className={styles.floatK1}>夢</span>
        <span className={styles.floatK2}>力</span>
        <span className={styles.floatK3}>絆</span>

        {/* Conteúdo central do painel */}
        <div className={styles.visualContent}>
          <div className={styles.highlightTabs}>
            {HIGHLIGHTS.map((h, i) => (
              <button
                key={h.kanji}
                className={`${styles.highlightTab} ${i === activeHighlight ? styles.highlightTabActive : ''}`}
                onClick={() => setActiveHighlight(i)}
                tabIndex={-1}
              >
                {h.kanji}
              </button>
            ))}
          </div>
          <p className={styles.highlightLabel}>
            {HIGHLIGHTS[activeHighlight].label}
          </p>
          <div className={styles.highlightKanji}>
            {HIGHLIGHTS[activeHighlight].kanji}
          </div>
        </div>

        {/* Rodapé do painel */}
        <div className={styles.visualFooter}>
          <span className={styles.visualStat}>12.000+</span>
          <span className={styles.visualStatLabel}>títulos no catálogo</span>
          <span className={styles.visualDot} />
          <span className={styles.visualStat}>4K HDR</span>
          <span className={styles.visualStatLabel}>qualidade máxima</span>
        </div>
      </aside>

      {/* ── Painel do formulário ─────────────────────────────── */}
      <main className={styles.formPanel}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <LogoIcon />
          <span className={styles.logoText}>Yumeka</span>
        </Link>

        <div className={styles.formBox}>
          <div className={styles.formHead}>
            <h1 className={styles.title}>Bem-vindo de volta</h1>
            <p className={styles.sub}>
              Entre para continuar assistindo onde parou.
            </p>
          </div>

          {/* Erro global */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <ErrorIcon />
              <span>{error}</span>
            </div>
          )}

          {/* Botão Google */}
          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogle}
            disabled={loading}
          >
            <GoogleIcon />
            Entrar com Google
          </button>

          {/* Divisor */}
          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>ou com e-mail</span>
            <span className={styles.dividerLine} />
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* E-mail */}
            <div className={styles.field}>
              <label htmlFor={`${id}-email`} className={styles.label}>
                E-mail
              </label>
              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.input}
                disabled={loading}
                required
              />
            </div>

            {/* Senha */}
            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label htmlFor={`${id}-pass`} className={styles.label}>
                  Senha
                </label>
                <Link to="/esqueci-senha" className={styles.forgotLink}>
                  Esqueci minha senha
                </Link>
              </div>
              <div className={styles.passwordWrap}>
                <input
                  id={`${id}-pass`}
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`${styles.input} ${styles.inputPass}`}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  <EyeIcon off={showPass} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !email || !password}
            >
              {loading ? <Spinner /> : 'Entrar'}
            </button>
          </form>

          {/* Rodapé do form */}
          <p className={styles.registerPrompt}>
            Não tem uma conta?{' '}
            <Link to="/registro" className={styles.registerLink}>
              Criar conta grátis
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

/* ─── Micro-componentes ─────────────────────────────────────── */
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
