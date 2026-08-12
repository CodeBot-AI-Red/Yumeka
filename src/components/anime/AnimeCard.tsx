import { Link } from 'react-router-dom'
import type { Anime } from '../../types/anime'
import styles from './AnimeCard.module.css'

interface Props {
  anime: Anime
}

export default function AnimeCard({ anime }: Props) {
  const img = anime.images.webp?.large_image_url || anime.images.jpg.large_image_url
  const genre = anime.genres[0]?.name

  return (
    <Link to={`/anime/${anime.mal_id}`} className={styles.card}>
      <div className={styles.poster}>
        <img src={img} alt={anime.title} loading="lazy" />
        <div className={styles.overlay}>
          <button className={styles.playBtn} aria-label="Assistir">
            <PlayIcon />
          </button>
        </div>
        {anime.score && (
          <div className={styles.score}>
            <StarIcon />
            {anime.score.toFixed(1)}
          </div>
        )}
      </div>
      <div className={styles.info}>
        <p className={styles.title}>{anime.title}</p>
        <div className={styles.meta}>
          {genre && <span className={styles.genre}>{genre}</span>}
          {anime.episodes && <span className={styles.ep}>{anime.episodes} eps</span>}
        </div>
      </div>
    </Link>
  )
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/>
    </svg>
  )
}
