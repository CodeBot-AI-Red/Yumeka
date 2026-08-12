import { useState, useId } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import styles from './Registro.module.css'

/* ─── Ícones ────────────────────────────────────────────────── */
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
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

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

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
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

function Spinner() {
  return (
    <svg className={styles.spinner} width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" aria-label="Carregando">
      <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

/* ─── Validação de senha ─────────────────────────────────────── */
interface PasswordRule { label: string; ok: boolean }

function getPasswordRules(password: string): PasswordRule[] {
  return [
    { label: 'Mínimo 8 caracteres',     ok: password.length >= 8 },
    { label: 'Letra maiúscula',          ok: /[A-Z]/.test(password) },
    { label: 'Número ou símbolo',        ok: /[\d!@#$%^&*]/.test(password) },
  ]
}

function strengthLabel(rules: PasswordRule[]): { label: string; level: 0 | 1 | 2 | 3 } {
  const n = rules.filter(r => r.ok).length
  if (n === 0) return { label: '',        level: 0 }
  if (n === 1) return { label: 'Fraca',   level: 1 }
  if (n === 2) return { label: 'Média',   level: 2 }
  return               { label: 'Forte',  level: 3 }
}

/* ─── Benefícios do painel visual ───────────────────────────── */
const BENEFITS = [
  { icon: '🎬', text: 'Mais de 12.000 títulos disponíveis' },
  { icon: '📺', text: 'Qualidade 4K HDR sem limites' },
  { icon: '🚫', text: 'Zero anúncios, zero interrupções' },
  { icon: '📱', text: 'Assista em qualquer dispositivo' },
  { icon: '🔔', text: 'Novo episódio toda semana' },
]

/* ─── Componente principal ───────────────────────────────────── */
export default function Registro() {
  const id = useId()
  const navigate = useNavigate()

  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [terms, setTerms]         = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [touched, setTouched]     = useState<Record<string, boolean>>({})

  const rules    = getPasswordRules(password)
  const strength = strengthLabel(rules)

  const confirmOk  = confirm.length > 0 && confirm === password
  const confirmErr = touched.confirm && confirm.length > 0 && confirm !== password
  const emailErr   = touched.email && email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const canSubmit =
    name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    rules.every(r => r.ok) &&
    confirmOk &&
    terms

  const blur = (field: string) =>
    setTouched(t => ({ ...t, [field]: true }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setLoading(true)
    try {
      await authService.signUp(name.trim(), email.trim(), password)
      navigate('/')
    } catch {
      setError('Não foi possível criar sua conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      authService.signInWithGoogle()
    } catch {
      setError('Não foi possível entrar com o Google. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      {/* ── Painel visual (esquerda) ─────────────────────────── */}
      <aside className={styles.visual} aria-hidden="true">
        <div className={styles.visualNoise} />
        <div className={styles.visualGlow} />

        <span className={styles.floatK1}>夢</span>
        <span className={styles.floatK2}>始</span>
        <span className={styles.floatK3}>新</span>

        <div className={styles.visualContent}>
          <p className={styles.visualEyebrow}>Junte-se à Yumeka</p>
          <h2 className={styles.visualTitle}>
            O seu próximo<br />anime favorito<br />
            <em className={styles.visualTitleEm}>está aqui.</em>
          </h2>

          <ul className={styles.benefitList}>
            {BENEFITS.map(b => (
              <li key={b.text} className={styles.benefit}>
                <span className={styles.benefitIcon}>{b.icon}</span>
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visualFooter}>
          <span className={styles.visualQuote}>
            "Comecei um trial e nunca mais parei."
          </span>
          <span className={styles.visualQuoteAuthor}>— usuário Yumeka</span>
        </div>
      </aside>

      {/* ── Painel do formulário (direita) ───────────────────── */}
      <main className={styles.formPanel}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <LogoIcon />
          <span className={styles.logoText}>Yumeka</span>
        </Link>

        <div className={styles.formBox}>
          <div className={styles.formHead}>
            <h1 className={styles.title}>Criar conta grátis</h1>
            <p className={styles.sub}>Sem cartão de crédito. Cancele quando quiser.</p>
          </div>

          {/* Erro global */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <ErrorIcon />
              <span>{error}</span>
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogle}
            disabled={loading}
          >
            <GoogleIcon />
            Continuar com Google
          </button>

          {/* Divisor */}
          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>ou preencha os dados</span>
            <span className={styles.dividerLine} />
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>

            {/* Nome */}
            <div className={styles.field}>
              <label htmlFor={`${id}-name`} className={styles.label}>Nome</label>
              <input
                id={`${id}-name`}
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => blur('name')}
                className={`${styles.input} ${touched.name && name.trim().length < 2 && name.length > 0 ? styles.inputError : ''}`}
                disabled={loading}
                required
              />
              {touched.name && name.length > 0 && name.trim().length < 2 && (
                <span className={styles.fieldHint} role="alert">
                  Use pelo menos 2 caracteres.
                </span>
              )}
            </div>

            {/* E-mail */}
            <div className={styles.field}>
              <label htmlFor={`${id}-email`} className={styles.label}>E-mail</label>
              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => blur('email')}
                className={`${styles.input} ${emailErr ? styles.inputError : ''}`}
                disabled={loading}
                required
              />
              {emailErr && (
                <span className={styles.fieldHint} role="alert">
                  Digite um e-mail válido.
                </span>
              )}
            </div>

            {/* Senha */}
            <div className={styles.field}>
              <label htmlFor={`${id}-pass`} className={styles.label}>Senha</label>
              <div className={styles.passwordWrap}>
                <input
                  id={`${id}-pass`}
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => blur('pass')}
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

              {/* Barra de força */}
              {password.length > 0 && (
                <div className={styles.strengthWrap}>
                  <div className={styles.strengthBar}>
                    {[1, 2, 3].map(n => (
                      <span
                        key={n}
                        className={`${styles.strengthSegment} ${strength.level >= n ? styles[`strengthL${strength.level}`] : ''}`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <span className={`${styles.strengthLabel} ${styles[`strengthText${strength.level}`]}`}>
                      {strength.label}
                    </span>
                  )}
                </div>
              )}

              {/* Regras */}
              {touched.pass && password.length > 0 && (
                <ul className={styles.rules}>
                  {rules.map(r => (
                    <li key={r.label} className={`${styles.rule} ${r.ok ? styles.ruleOk : styles.ruleFail}`}>
                      <span className={styles.ruleIcon}>
                        {r.ok ? <CheckIcon /> : <span className={styles.ruleDot} />}
                      </span>
                      {r.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirmar senha */}
            <div className={styles.field}>
              <label htmlFor={`${id}-confirm`} className={styles.label}>Confirmar senha</label>
              <div className={styles.passwordWrap}>
                <input
                  id={`${id}-confirm`}
                  type={showConf ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onBlur={() => blur('confirm')}
                  className={`${styles.input} ${styles.inputPass} ${confirmErr ? styles.inputError : confirmOk ? styles.inputOk : ''}`}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConf(v => !v)}
                  aria-label={showConf ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  <EyeIcon off={showConf} />
                </button>
              </div>
              {confirmErr && (
                <span className={styles.fieldHint} role="alert">
                  As senhas não coincidem.
                </span>
              )}
              {confirmOk && (
                <span className={`${styles.fieldHint} ${styles.fieldHintOk}`}>
                  Senhas coincidem ✓
                </span>
              )}
            </div>

            {/* Termos */}
            <label className={styles.termsLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={terms}
                onChange={e => setTerms(e.target.checked)}
                disabled={loading}
              />
              <span className={styles.termsText}>
                Concordo com os{' '}
                <a href="/termos" className={styles.termsLink}>Termos de Uso</a>
                {' '}e a{' '}
                <a href="/privacidade" className={styles.termsLink}>Política de Privacidade</a>.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !canSubmit}
            >
              {loading ? <Spinner /> : 'Criar minha conta'}
            </button>
          </form>

          <p className={styles.loginPrompt}>
            Já tem uma conta?{' '}
            <Link to="/login" className={styles.loginLink}>Entrar</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
