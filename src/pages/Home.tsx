import { useCallback, useEffect, useState } from 'react'
import type { Anime } from '../types/anime'
import { animeService } from '../services/animeService'
import AnimeBanner from '../components/anime/AnimeBanner'
import AnimeCarousel from '../components/anime/AnimeCarousel'
import styles from './Home.module.css'

export default function Home() {
  const [airing, setAiring] = useState<Anime[]>([])
  const [popular, setPopular] = useState<Anime[]>([])
  const [seasonal, setSeasonal] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const hero = airing[0] ?? null

  return (
    <main className={styles.main}>
      {/* Hero banner */}
      <AnimeBanner anime={hero} loading={loading} />

      {error && (
        <div className={styles.error} role="alert">
          <p>{error}</p>
          <button
            className={styles.errorBtn}
            onClick={() => fetchAll({ cancelled: false })}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Seções de carrossel */}
      <div className={styles.sections}>
        <AnimeCarousel
          title="Em exibição agora"
          animes={airing.slice(1)}
          loading={loading}
        />

        <AnimeCarousel
          title="Mais populares"
          animes={popular}
          loading={loading && popular.length === 0}
        />

        <AnimeCarousel
          title="Temporada atual"
          animes={seasonal}
          loading={loading && seasonal.length === 0}
        />
      </div>

      {/* CTA premium */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <span className={styles.ctaKanji} aria-hidden="true">夢</span>
          <div>
            <h2 className={styles.ctaTitle}>Assista sem limites</h2>
            <p className={styles.ctaSub}>
              Acesso completo ao catálogo, qualidade HD e sem anúncios.
            </p>
          </div>
          <a href="/assinatura" className={styles.ctaBtn}>Ver planos</a>
        </div>
      </section>
    </main>
  )
}
