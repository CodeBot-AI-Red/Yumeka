import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ORIGINAIS } from '../data/originais'
import type { OriginalAnime } from '../data/originais'
import styles from './Home.module.css'

/* ─── Ícones ─────────────────────────────────────────────────── */
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}

/* ─── Badge de status ─────────────────────────────────────────── */
function StatusBadge({ status }: { status: OriginalAnime['status'] }) {
  const map = {
    em_breve:    { label: 'Em breve',     color: '#a78bfa' },
    em_exibicao: { label: 'Em exibição',  color: '#34d399' },
    completo:    { label: 'Completo',     color: '#9490a8' },
  }
  const { label, color } = map[status]
  return (
    <span className={styles.statusBadge} style={{ '--status-color': color } as React.CSSProperties}>
      <span className={styles.statusDot} />
      {label}
    </span>
  )
}

/* ─── Hero banner (usa banner landscape) ─────────────────────── */
function HeroBanner({ anime }: { anime: OriginalAnime }) {
  return (
    <div className={styles.hero}>
      <div
        className={styles.heroBg}
        style={{ backgroundImage: `url(${anime.bannerUrl})` }}
      />
      <div className={styles.heroGradLeft} />
      <div className={styles.heroGradBottom} />

      <div className={styles.heroContent}>
        <StatusBadge status={anime.status} />

        <p className={styles.heroSubtitle}>{anime.subtitulo}</p>
        <h1 className={styles.heroTitle}>{anime.tituloRomaji}</h1>
        <p className={styles.heroKanji}>{anime.titulo}</p>
        <p className={styles.heroSynopsis}>{anime.sinopse}</p>

        <div className={styles.heroGenres}>
          {anime.generos.map(g => (
            <span key={g} className={styles.heroGenre}>{g}</span>
          ))}
        </div>

        <div className={styles.heroCtas}>
          {anime.status === 'em_exibicao' ? (
            <Link to={`/watch/${anime.id}-1`} className={styles.btnPlay}>
              <PlayIcon /> Assistir agora
            </Link>
          ) : (
            <button className={styles.btnNotify}>
              <BellIcon /> Avisar quando estrear
            </button>
          )}
          <Link to={`/anime/${anime.id}`} className={styles.btnInfo}>
            Saiba mais
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── Card vertical (usa poster portrait) ─────────────────────── */
function OriginalCard({ anime }: { anime: OriginalAnime }) {
  return (
    <Link to={`/anime/${anime.id}`} className={styles.card}>
      <div className={styles.cardPoster}>
        <img src={anime.posterUrl} alt={anime.tituloRomaji} loading="lazy" />
        <div className={styles.cardOverlay}>
          {anime.status === 'em_exibicao'
            ? <span className={styles.cardPlayIcon}><PlayIcon /></span>
            : <span className={styles.cardComingSoon}>Em breve</span>
          }
        </div>
        <div className={styles.cardStatusPin}>
          <StatusBadge status={anime.status} />
        </div>
      </div>
      <div className={styles.cardInfo}>
        <p className={styles.cardRomaji}>{anime.tituloRomaji}</p>
        <p className={styles.cardKanji}>{anime.titulo}</p>
        <div className={styles.cardMeta}>
          {anime.generos.slice(0, 2).map(g => (
            <span key={g} className={styles.cardGenre}>{g}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}

/* ─── Componente principal ───────────────────────────────────── */
export default function Home() {
  const ctaRef = useRef<HTMLElement>(null)

  /* Parallax suave no CTA */
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

  const hero = ORIGINAIS[0]

  return (
    <main className={styles.main}>

      {/* ── Hero ────────────────────────────────────────────── */}
      <HeroBanner anime={hero} />

      {/* ── Catálogo de originais ────────────────────────────── */}
      <section className={styles.catalog}>
        <div className={styles.catalogHeader}>
          <h2 className={styles.catalogTitle}>
            <span className={styles.titleBar} aria-hidden="true" />
            Originais Yumeka
          </h2>
          <p className={styles.catalogSub}>
            Títulos criados e produzidos pela Yumeka
          </p>
        </div>

        <div className={styles.cardGrid}>
          {ORIGINAIS.map(anime => (
            <OriginalCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      {/* ── CTA premium ─────────────────────────────────────── */}
      <section className={styles.cta} ref={ctaRef} aria-label="Planos premium">
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
