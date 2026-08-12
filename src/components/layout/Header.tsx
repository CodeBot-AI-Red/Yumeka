import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../../services/authService'
import type { UserProfile } from '../../services/authService'
import styles from './Header.module.css'

const NAV_LINKS = [
  { label: 'Início', to: '/' },
  { label: 'Catálogo', to: '/browse' },
]

const MENU_ITEMS = [
  { icon: '👤', label: 'Meu perfil',    to: '/perfil' },
  { icon: '⭐', label: 'Favoritos',     to: '/favoritos' },
  { icon: '🕓', label: 'Histórico',     to: '/historico' },
  { icon: '👑', label: 'Assinatura',    to: '/assinatura' },
  { icon: '⚙️', label: 'Configurações', to: '/configuracoes' },
]

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

/* Avatar sem foto: iniciais ou ícone */
function AvatarIcon({ name }: { name?: string }) {
  const initials = name
    ? name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : null

  return (
    <span className={styles.avatarCircle}>
      {initials ?? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      )}
    </span>
  )
}

export default function Header() {
  const [scrolled, setScrolled]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery]           = useState('')
  const [menuOpen, setMenuOpen]     = useState(false)
  const [profile, setProfile]       = useState<UserProfile | null>(null)
  const [loggedIn, setLoggedIn]     = useState(false)

  const inputRef  = useRef<HTMLInputElement>(null)
  const menuRef   = useRef<HTMLDivElement>(null)
  const navigate  = useNavigate()
  const location  = useLocation()

  /* Scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Foco no input ao abrir busca */
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  /* Fechar menu ao clicar fora */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* Checar sessão + carregar perfil */
  useEffect(() => {
    const session = authService.getSession()
    if (!session) { setLoggedIn(false); return }
    setLoggedIn(true)
    authService.getProfile(session.accessToken).then(p => {
      if (p) setProfile(p)
    })
  }, [location.pathname]) // re-checa ao navegar (ex: após setup-perfil)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/browse?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  const handleLogout = () => {
    authService.signOut()
    setLoggedIn(false)
    setProfile(null)
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>

        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#e11d48" />
            <text x="16" y="23" fontSize="18" textAnchor="middle" fill="white"
              fontFamily="serif" fontWeight="bold">夢</text>
          </svg>
          <span className={styles.logoText}>Yumeka</span>
        </Link>

        {/* Nav */}
        <nav className={styles.nav}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.navLink} ${location.pathname === link.to ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Busca */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar anime..."
                className={styles.searchInput}
                onBlur={() => !query && setSearchOpen(false)}
              />
              <button type="submit" aria-label="Buscar" className={styles.iconBtn}>
                <SearchIcon />
              </button>
            </form>
          ) : (
            <button className={styles.iconBtn} onClick={() => setSearchOpen(true)} aria-label="Abrir busca">
              <SearchIcon />
            </button>
          )}

          {/* Logado */}
          {loggedIn ? (
            <div className={styles.userWrap} ref={menuRef}>
              <button
                className={`${styles.avatarBtn} ${menuOpen ? styles.avatarBtnOpen : ''}`}
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Menu do usuário"
                aria-expanded={menuOpen}
              >
                <AvatarIcon name={profile?.display_name} />
                <ChevronIcon open={menuOpen} />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className={styles.dropdown}>
                  {/* Cabeçalho do menu */}
                  <div className={styles.dropHead}>
                    <AvatarIcon name={profile?.display_name} />
                    <div className={styles.dropHeadInfo}>
                      <span className={styles.dropName}>
                        {profile?.display_name || 'Usuário'}
                      </span>
                      <span className={styles.dropPlan}>Plano gratuito</span>
                    </div>
                  </div>

                  <div className={styles.dropDivider} />

                  {/* Links */}
                  <nav className={styles.dropNav}>
                    {MENU_ITEMS.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={styles.dropItem}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className={styles.dropIcon}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className={styles.dropDivider} />

                  {/* Sair */}
                  <button className={styles.dropLogout} onClick={handleLogout}>
                    <span className={styles.dropIcon}>🚪</span>
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Deslogado */
            <>
              <Link to="/login" className={styles.loginBtn}>Entrar</Link>
              <Link to="/registro" className={styles.registerBtn}>Começar grátis</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
