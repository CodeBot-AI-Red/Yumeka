import { useParams, Link } from 'react-router-dom'
import { ORIGINAIS } from '../data/originais'
import styles from './AnimePage.module.css'

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
function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  )
}
function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/>
    </svg>
  )
}
function TvIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>
    </svg>
  )
}
function FilmIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="2"/>
      <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>
    </svg>
  )
}

/* ─── Componente principal ───────────────────────────────────── */
export default function AnimePage() {
  const { id } = useParams<{ id: string }>()
  const anime = ORIGINAIS.find(a => a.id === id)

  if (!anime) {
    return (
      <main className={styles.notFound}>
        <p className={styles.notFoundKanji}>空</p>
        <p className={styles.notFoundTitle}>Anime não encontrado</p>
        <Link to="/" className={styles.notFoundBack}>
          <ArrowLeft /> Voltar para a Home
        </Link>
      </main>
    )
  }

  const statusMap = {
    em_breve:    { label: 'Em breve',    color: '#a78bfa' },
    em_exibicao: { label: 'Em exibição', color: '#34d399' },
    completo:    { label: 'Completo',    color: '#9490a8' },
  }
  const { label: statusLabel, color: statusColor } = statusMap[anime.status]

  return (
    <main className={styles.page}>

      {/* ── Hero ────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: `url(${anime.bannerUrl})` }}
        />
        <div className={styles.heroGradLeft} />
        <div className={styles.heroGradBottom} />

        <div className={styles.heroInner}>
          {/* Poster */}
          <div className={styles.posterWrap}>
            <img src={anime.posterUrl} alt={anime.tituloRomaji} className={styles.poster} />
          </div>

          {/* Info */}
          <div className={styles.heroInfo}>
            <Link to="/" className={styles.backLink}>
              <ArrowLeft /> Voltar
            </Link>

            <span
              className={styles.statusBadge}
              style={{ '--status-color': statusColor } as React.CSSProperties}
            >
              <span className={styles.statusDot} />
              {statusLabel}
            </span>

            <h1 className={styles.titleRomaji}>{anime.tituloRomaji}</h1>
            <p className={styles.titleKanji}>{anime.titulo}</p>
            {anime.tituloPortugues && (
              <p className={styles.titlePortugues}>{anime.tituloPortugues}</p>
            )}

            {/* Meta */}
            <div className={styles.meta}>
              {anime.nota && (
                <span className={styles.metaScore}>
                  <StarIcon /> {anime.nota.toFixed(1)}
                </span>
              )}
              {anime.temporadas && (
                <span className={styles.metaItem}>
                  <TvIcon /> {anime.temporadas} temporadas
                </span>
              )}
              {anime.episodios && (
                <span className={styles.metaItem}>
                  <FilmIcon /> {anime.episodios} eps
                </span>
              )}
              <span className={styles.metaItem}>{anime.ano}</span>
            </div>

            {/* Gêneros */}
            <div className={styles.genres}>
              {anime.generos.map(g => (
                <span key={g} className={styles.genre}>{g}</span>
              ))}
            </div>

            {/* Sinopse — só a curta, sem spoilers */}
            <p className={styles.synopsis}>{anime.sinopse}</p>

            {/* CTAs */}
            <div className={styles.ctas}>
              {anime.status === 'em_exibicao' ? (
                <Link to={`/watch/${anime.id}-1`} className={styles.btnPlay}>
                  <PlayIcon /> Assistir EP 1
                </Link>
              ) : (
                <button className={styles.btnNotify}>
                  <BellIcon /> Avisar quando estrear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Personagens públicos ─────────────────────────────── */}
      {anime.personagensPublicos && anime.personagensPublicos.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleBar} aria-hidden="true" />
            Personagens
          </h2>
          <div className={styles.charGrid}>
            {anime.personagensPublicos.map(p => (
              <div key={p.nome} className={styles.charCard}>
                <div className={styles.charAvatar}>
                  {p.nome.slice(0, 2).toUpperCase()}
                </div>
                <div className={styles.charInfo}>
                  <p className={styles.charNome}>{p.nome}</p>
                  <p className={styles.charPapel}>{p.papel}</p>
                  <p className={styles.charDesc}>{p.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Temporada 1 apenas ──────────────────────────────── */}
      {anime.temporada1 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleBar} aria-hidden="true" />
            Primeira temporada
          </h2>
          <div className={styles.t1Card}>
            <div className={styles.t1Head}>
              <span className={styles.t1Num}>01</span>
              <div>
                <p className={styles.t1Titulo}>{anime.temporada1.titulo}</p>
                <span className={styles.t1Eps}>{anime.temporada1.episodios}</span>
              </div>
            </div>
            <p className={styles.t1Desc}>{anime.temporada1.descricao}</p>
          </div>
          <p className={styles.t1Aviso}>
            As temporadas seguintes serão reveladas conforme o anime for ao ar.
          </p>
        </section>
      )}

    </main>
  )
}
