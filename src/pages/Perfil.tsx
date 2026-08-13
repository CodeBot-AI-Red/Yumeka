import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import type { UserProfile } from '../services/authService'
import styles from './Perfil.module.css'

/* ─── Ícones ───────────────────────────────────────────────── */
function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 20h20M4 20l2-10 6 4 6-4 2 10" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" aria-label="Carregando">
      <circle cx="12" cy="12" r="10" strokeOpacity=".2" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

/* ─── Avatar grande ─────────────────────────────────────────── */
function AvatarLarge({ name, url }: { name?: string; url?: string | null }) {
  if (url) {
    return <img src={url} alt={name ?? 'Avatar'} className={styles.avatarImg} />
  }
  const initials = name
    ? name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : null
  return (
    <span className={styles.avatarFallback}>
      {initials ?? <UserIcon />}
    </span>
  )
}

/* ─── Card de estatística ───────────────────────────────────── */
interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  accent?: boolean
}
function StatCard({ icon, label, value, sub, accent }: StatCardProps) {
  return (
    <div className={`${styles.statCard} ${accent ? styles.statCardAccent : ''}`}>
      <span className={styles.statIcon}>{icon}</span>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
      {sub && <span className={styles.statSub}>{sub}</span>}
    </div>
  )
}

/* ─── Formulário de edição de nome ──────────────────────────── */
interface EditNameFormProps {
  current: string
  onSave: (name: string) => Promise<void>
  onCancel: () => void
}
function EditNameForm({ current, onSave, onCancel }: EditNameFormProps) {
  const [value, setValue] = useState(current)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nameOk = value.trim().length >= 2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameOk) return
    setLoading(true)
    setError(null)
    try {
      await onSave(value.trim())
    } catch {
      setError('Não foi possível salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      {error && <p className={styles.editError}>{error}</p>}
      <div className={styles.editRow}>
        <input
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          maxLength={50}
          className={styles.editInput}
          disabled={loading}
          placeholder="Seu nome de exibição"
        />
        <button type="submit" className={styles.editSave} disabled={loading || !nameOk}>
          {loading ? <Spinner /> : 'Salvar'}
        </button>
        <button type="button" className={styles.editCancel} onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
      </div>
      <span className={styles.editCounter}>{value.length}/50</span>
    </form>
  )
}

/* ─── Componente principal ──────────────────────────────────── */
export default function Perfil() {
  const navigate = useNavigate()

  const [profile, setProfile]   = useState<UserProfile | null>(null)
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState(false)
  const [success, setSuccess]   = useState(false)

  useEffect(() => {
    const session = authService.getSession()
    if (!session) {
      navigate('/login', { replace: true })
      return
    }
    authService.getProfile(session.accessToken).then(p => {
      setProfile(p)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [navigate])

  const handleSaveName = async (name: string) => {
    await authService.saveDisplayName(name)
    setProfile(prev => prev ? { ...prev, display_name: name } : prev)
    setEditing(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleLogout = () => {
    authService.signOut()
    navigate('/', { replace: true })
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingState}>
          <Spinner />
          <span>Carregando perfil…</span>
        </div>
      </main>
    )
  }

  /* ── Sem perfil / não logado (fallback) ── */
  if (!profile) {
    return (
      <main className={styles.page}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}><UserIcon /></span>
          <p className={styles.emptyText}>Perfil não encontrado.</p>
          <Link to="/login" className={styles.emptyBtn}>Entrar</Link>
        </div>
      </main>
    )
  }

  const joinedDate = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* ── Cabeçalho do perfil ─────────────────────────── */}
        <section className={styles.hero} aria-label="Informações do perfil">
          {/* Faixa decorativa */}
          <div className={styles.heroBanner} aria-hidden="true">
            <span className={styles.heroDeco}>夢</span>
          </div>

          <div className={styles.heroBody}>
            {/* Avatar */}
            <div className={styles.avatarWrap}>
              <AvatarLarge name={profile.display_name} url={profile.avatar_url} />
            </div>

            {/* Info */}
            <div className={styles.heroInfo}>
              {editing ? (
                <EditNameForm
                  current={profile.display_name}
                  onSave={handleSaveName}
                  onCancel={() => setEditing(false)}
                />
              ) : (
                <div className={styles.nameRow}>
                  <h1 className={styles.displayName}>{profile.display_name}</h1>
                  <button
                    className={styles.editBtn}
                    onClick={() => setEditing(true)}
                    aria-label="Editar nome"
                  >
                    <EditIcon /> Editar
                  </button>
                </div>
              )}

              {success && (
                <p className={styles.successMsg} role="status">Nome atualizado com sucesso!</p>
              )}

              <div className={styles.heroBadges}>
                <span className={styles.badge}>
                  <CrownIcon /> Plano gratuito
                </span>
                <span className={styles.badgeMuted}>
                  Membro desde {joinedDate}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────── */}
        <section className={styles.statsSection} aria-label="Estatísticas">
          <StatCard icon={<StarIcon />}  label="Favoritos"      value="0"      sub="animes salvos" />
          <StatCard icon={<ClockIcon />} label="Assistidos"     value="0"      sub="episódios" />
          <StatCard icon={<CrownIcon />} label="Assinatura"     value="Grátis" accent />
        </section>

        {/* ── Ações rápidas ───────────────────────────────── */}
        <section className={styles.actionsSection} aria-label="Ações">
          <h2 className={styles.sectionTitle}>Conta</h2>

          <div className={styles.actionList}>
            <Link to="/favoritos" className={styles.actionItem}>
              <span className={styles.actionIcon}><StarIcon /></span>
              <div className={styles.actionText}>
                <span className={styles.actionLabel}>Favoritos</span>
                <span className={styles.actionSub}>Animes que você salvou</span>
              </div>
              <span className={styles.actionArrow}>›</span>
            </Link>

            <Link to="/historico" className={styles.actionItem}>
              <span className={styles.actionIcon}><ClockIcon /></span>
              <div className={styles.actionText}>
                <span className={styles.actionLabel}>Histórico</span>
                <span className={styles.actionSub}>Episódios assistidos recentemente</span>
              </div>
              <span className={styles.actionArrow}>›</span>
            </Link>

            <Link to="/assinatura" className={styles.actionItem}>
              <span className={styles.actionIcon}><CrownIcon /></span>
              <div className={styles.actionText}>
                <span className={styles.actionLabel}>Assinatura</span>
                <span className={styles.actionSub}>Gerencie seu plano</span>
              </div>
              <span className={styles.actionArrow}>›</span>
            </Link>
          </div>
        </section>

        {/* ── Sair ────────────────────────────────────────── */}
        <div className={styles.logoutWrap}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogoutIcon /> Sair da conta
          </button>
        </div>

      </div>
    </main>
  )
}
