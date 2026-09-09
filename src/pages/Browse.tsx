import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ORIGINAIS } from '../data/originais'
import type { OriginalAnime } from '../data/originais'
import styles from './Browse.module.css'

/* ── Ícones ─────────────────────────────────────────────────── */
function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}
function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/>
    </svg>
  )
}

/* ── Filtros disponíveis ─────────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: 'todos',       label: 'Todos' },
  { value: 'em_breve',    label: 'Em breve' },
  { value: 'em_exibicao', label: 'Em exibição' },
  { value: 'completo',    label: 'Completo' },
]

/* ── Card do catálogo ────────────────────────────────────────── */
function CatalogCard({ anime }: { anime: OriginalAnime }) {
  const statusMap = {
    em_breve:    { label: 'Em breve',    color: '#a78bfa' },
    em_exibicao: { label: 'Em exibição', color: '#34d399' },
    completo:    { label: 'Completo',    color: '#9490a8' },
  }
  const { label, color } = statusMap[anime.status]

  return (
    <Link to={`/anime/${anime.id}`} className={styles.card}>
      <div className={styles.cardPoster}>
        <img src={anime.posterUrl} alt={anime.tituloRomaji} loading="lazy" />

        {/* overlay ao hover */}
        <div className={styles.cardOverlay}>
          {anime.status === 'em_exibicao'
            ? <span className={styles.overlayPlay}><PlayIcon /></span>
            : <span className={styles.overlayBell}><BellIcon /></span>
          }
        </div>

        {/* badge status */}
        <span
          className={styles.cardStatusBadge}
          style={{ '--sc': color } as React.CSSProperties}
        >
          <span className={styles.cardStatusDot} />
          {label}
        </span>
      </div>

      <div className={styles.cardInfo}>
        <p className={styles.cardRomaji}>{anime.tituloRomaji}</p>
        <p className={styles.cardKanji}>{anime.titulo}</p>
        <div className={styles.cardMeta}>
          {anime.nota && (
            <span className={styles.cardScore}><StarIcon />{anime.nota.toFixed(1)}</span>
          )}
          {anime.generos.slice(0, 2).map(g => (
            <span key={g} className={styles.cardGenre}>{g}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}

/* ── Componente principal ────────────────────────────────────── */
export default function Browse() {
  const [statusFilter, setStatusFilter] = useState('todos')
  const [genreFilter, setGenreFilter] = useState<string | null>(null)

  // Gêneros disponíveis dinamicamente
  const allGenres = useMemo(() => {
    const set = new Set<string>()
    ORIGINAIS.forEach(a => a.generos.forEach(g => set.add(g)))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    return ORIGINAIS.filter(a => {
      if (statusFilter !== 'todos' && a.status !== statusFilter) return false
      if (genreFilter && !a.generos.includes(genreFilter)) return false
      return true
    })
  }, [statusFilter, genreFilter])

  return (
    <main className={styles.page}>

      {/* ── Cabeçalho ────────────────────────────────────────── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Catálogo</h1>
          <p className={styles.sub}>
            {filtered.length === ORIGINAIS.length
              ? `${ORIGINAIS.length} original${ORIGINAIS.length !== 1 ? 'is' : ''} Yumeka`
              : `${filtered.length} de ${ORIGINAIS.length} títulos`}
          </p>
        </div>
      </div>

      {/* ── Filtros ──────────────────────────────────────────── */}
      <div className={styles.filters}>
        {/* Status */}
        <div className={styles.filterGroup}>
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`${styles.filterBtn} ${statusFilter === opt.value ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Gêneros */}
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterBtn} ${genreFilter === null ? styles.filterBtnActive : ''}`}
            onClick={() => setGenreFilter(null)}
          >
            Todos os gêneros
          </button>
          {allGenres.map(g => (
            <button
              key={g}
              className={`${styles.filterBtn} ${genreFilter === g ? styles.filterBtnActive : ''}`}
              onClick={() => setGenreFilter(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyKanji}>空</span>
          <p className={styles.emptyTitle}>Nenhum título encontrado</p>
          <p className={styles.emptySub}>Tente remover os filtros.</p>
          <button
            className={styles.retryBtn}
            onClick={() => { setStatusFilter('todos'); setGenreFilter(null) }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(anime => (
            <CatalogCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}

    </main>
  )
}
