import { useRef } from 'react'
import type { Anime } from '../../types/anime'
import AnimeCard from './AnimeCard'
import styles from './AnimeCarousel.module.css'

interface Props {
  title: string
  animes: Anime[]
  loading?: boolean
}

export default function AnimeCarousel({ title, animes, loading }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!trackRef.current) return
    const amount = trackRef.current.offsetWidth * 0.75
    trackRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.arrows}>
          <button className={styles.arrow} onClick={() => scroll('left')} aria-label="Anterior">
            <ChevronLeft />
          </button>
          <button className={styles.arrow} onClick={() => scroll('right')} aria-label="Próximo">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))
          : animes.map(anime => (
              <div key={anime.mal_id} className={styles.item}>
                <AnimeCard anime={anime} />
              </div>
            ))}
      </div>
    </section>
  )
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}
