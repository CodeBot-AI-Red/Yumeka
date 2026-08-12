import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Anime } from '../types/anime'
import { animeService } from '../services/animeService'
import AnimeBanner from '../components/anime/AnimeBanner'
import AnimeCarousel from '../components/anime/AnimeCarousel'
import styles from './Home.module.css'

/* ─── Ícones inline ─────────────────────────────────────────── */
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

/* ─── Stat card do topo ──────────────────────────────────────── */
interface StatProps { value: string; label: string }
function Stat({ value, label }: StatProps) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

/* ─── Card de destaque horizontal ───────────────────────────── */
interface FeaturedCardProps { anime: Anime; rank: number }
function FeaturedCard({ anime, rank }: FeaturedCardProps) {
  const img = anime.images.webp?.large_image_url || anime.images.jpg.large_image_url
  const synopsis = anime.synopsis
    ? anime.synopsis.slice(0, 100) + (anime.synopsis.length > 100 ? '…' : '')
    : ''

  return (
    <Link to={`/anime/${anime.mal_id}`} className={styles.featCard}>
      <span className={styles.featRank}>{String(rank).padStart(2, '0')}</span>
      <div className={styles.featPoster}>
        <img src={img} alt={anime.title} loading="lazy" />
      </div>
      <div className={styles.featInfo}>
        <p className={styles.featTitle}>{anime.title}</p>
        {synopsis && <p className={styles.featSynopsis}>{synopsis}</p>}
        <div className={styles.featMeta}>
          {anime.score && (
            <span className={styles.featScore}><StarIcon />{anime.score.toFixed(1)}</span>
          )}
          {anime.genres[0] && (
            <span className={styles.featGenre}>{anime.genres[0].name}</span>
          )}
        </div>
      </div>
      <span className={styles.featArrow}><ChevronRightIcon /></span>
    </Link>
  )
}

/* ─── Skeleton do card de destaque ──────────────────────────── */
function FeaturedCardSkeleton() {
  return <div className={`${styles.featCard} ${styles.featCardSkeleton}`} aria-hidden="true" />
}

/* ─── Componente principal ───────────────────────────────────── */
export default function Home() {
  const [airing, setAiring] = useState<Anime[]>([])
  const [popular, setPopular] = useState<Anime[]>([])
  const [seasonal, setSeasonal] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ctaRef = useRef<HTMLElement>(null)

  const fetchAll = useCallback(async (signal: { cancelled: boolean }) => {
    try {
      setError(null)
      setLoading(true)
      const airingData = await animeService.getTopAiring()
      if (signal.cancelled) return
      setAiring(airingData)
      setLoading(false)

      const [popularData, seasonalData] = await Promise.all([
        animeService.getTopPopular(),
        animeService.getSeasonNow(),
      ])
      if (signal.cancelled) return
      setPopular(popularData)
      setSeasonal(seasonalData)
    } catch (err) {
      if (!signal.cancelled) {
        setError('Não foi possível carregar os animes agora.')
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const signal = { cancelled: false }
    fetchAll(signal)
    return () => { signal.cancelled = true }
  }, [fetchAll])

  /* Efeito parallax suave no CTA ao scroll */
  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight))
      el.style.setProperty('--parallax-y', `${pct * 24}px`)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hero = airing[0] ?? null
  const topPopular = popular.slice(0, 5)

  return (
    <main className={styles.main}>

      {/* ── Hero banner ─────────────────────────────────────── */}
      <AnimeBanner anime={hero} loading={loading} />

      {/* ── Barra de stats ──────────────────────────────────── */}
      <div className={styles.statsBar}>
        <Stat value="12.000+" label="títulos no catálogo" />
        <span className={styles.statsDivider} aria-hidden="true" />
        <Stat value="4K HDR" label="qualidade máxima" />
        <span className={styles.statsDivider} aria-hidden="true" />
        <Stat value="0" label="anúncios" />
        <span className={styles.statsDivider} aria-hidden="true" />
        <Stat value="Novo" label="episódio toda semana" />
      </div>

      {error && (
        <div className={styles.error} role="alert">
          <p>{error}</p>
          <button className={styles.errorBtn} onClick={() => fetchAll({ cancelled: false })}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* ── Carrosséis + Top Popular ────────────────────────── */}
      <div className={styles.sections}>

        {/* Seção em exibição */}
        <AnimeCarousel
          title="Em exibição agora"
          animes={airing.slice(1)}
          loading={loading}
        />

        {/* Bloco duas colunas: temporada | top popular */}
        <div className={styles.split}>
          <div className={styles.splitCarousel}>
            <AnimeCarousel
              title="Temporada atual"
              animes={seasonal}
              loading={loading && seasonal.length === 0}
            />
          </div>

          {/* Top 5 popular — lista vertical */}
          <section className={styles.topSection}>
            <h2 className={styles.topTitle}>
              <span className={styles.topTitleBar} aria-hidden="true" />
              Top 5 populares
            </h2>
            <div className={styles.topList}>
              {loading || topPopular.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <FeaturedCardSkeleton key={i} />
                  ))
                : topPopular.map((anime, i) => (
                    <FeaturedCard key={anime.mal_id} anime={anime} rank={i + 1} />
                  ))}
            </div>
            <Link to="/browse?sort=popular" className={styles.topMore}>
              Ver todos <ChevronRightIcon />
            </Link>
          </section>
        </div>

        {/* Mais populares */}
        <AnimeCarousel
          title="Mais populares"
          animes={popular.slice(5)}
          loading={loading && popular.length === 0}
        />
      </div>

      {/* ── CTA premium ─────────────────────────────────────── */}
      <section className={styles.cta} ref={ctaRef} aria-label="Planos premium">
        {/* Camadas decorativas */}
        <span className={styles.ctaDeco1} aria-hidden="true">夢</span>
        <span className={styles.ctaDeco2} aria-hidden="true">夢</span>
        <div className={styles.ctaGlow} aria-hidden="true" />

        <div className={styles.ctaInner}>
          <div className={styles.ctaCopy}>
            <p className={styles.ctaEyebrow}>Premium · Sem limites</p>
            <h2 className={styles.ctaTitle}>
              Assista a qualquer anime,<br />
              <em>quando e onde quiser.</em>
            </h2>
            <p className={styles.ctaSub}>
              Catálogo completo, qualidade 4K HDR e zero anúncios — por menos do que uma entrada de cinema.
            </p>
          </div>

          <div className={styles.ctaActions}>
            <a href="/assinatura" className={styles.ctaBtn}>
              <PlayIcon /> Começar agora
            </a>
            <a href="/assinatura#planos" className={styles.ctaBtnGhost}>
              Ver planos
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
