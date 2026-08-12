import { Link } from 'react-router-dom'
import type { Anime } from '../../types/anime'
import styles from './AnimeBanner.module.css'

interface Props {
  anime: Anime | null
  loading: boolean
}

export default function AnimeBanner({ anime, loading }: Props) {
  if (loading || !anime) {
    return <div className={styles.skeleton} />
  }

  const bg = anime.images.jpg.large_image_url
  const synopsis = anime.synopsis
    ? anime.synopsis.slice(0, 180) + (anime.synopsis.length > 180 ? '...' : '')
    : 'Nenhuma sinopse disponível.'

  return (
    <div className={styles.banner}>
      {/* Imagem de fundo */}
      <div className={styles.bg} style={{ backgroundImage: `url(${bg})` }} />
      <div className={styles.gradLeft} />
      <div className={styles.gradBottom} />

      {/* Conteúdo */}
      <div className={styles.content}>
        <div className={styles.badges}>
          {anime.score && (
            <span className={styles.score}>★ {anime.score.toFixed(1)}</span>
          )}
          {anime.genres.slice(0, 3).map(g => (
            <span key={g.mal_id} className={styles.badge}>{g.name}</span>
          ))}
        </div>

        <h1 className={styles.title}>{anime.title}</h1>
        <p className={styles.synopsis}>{synopsis}</p>

        <div className={styles.ctas}>
          <Link to={`/watch/${anime.mal_id}-1`} className={styles.btnPlay}>
            <PlayIcon /> Assistir agora
          </Link>
          <Link to={`/anime/${anime.mal_id}`} className={styles.btnInfo}>
            <InfoIcon /> Mais info
          </Link>
        </div>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4M12 8h.01"/>
    </svg>
  )
}
