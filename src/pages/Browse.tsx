import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { animeService, GENRES } from '../services/animeService'
import type { SortOption, BrowseResult } from '../services/animeService'
import AnimeCard from '../components/anime/AnimeCard'
import styles from './Browse.module.css'

/* ── Ícones ─────────────────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

/* ── Skeleton card ───────────────────────────────────────────── */
function CardSkeleton() {
  return <div className={styles.skeleton} aria-hidden="true" />
}

/* ── Opções de ordenação ─────────────────────────────────────── */
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'bypopularity', label: 'Mais populares' },
  { value: 'score',        label: 'Melhor nota' },
  { value: 'airing',       label: 'Em exibição' },
  { value: 'upcoming',     label: 'Em breve' },
  { value: 'favorite',     label: 'Favoritos' },
]

/* ── Componente principal ────────────────────────────────────── */
export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [query,        setQuery]        = useState(searchParams.get('q') ?? '')
  const [inputValue,   setInputValue]   = useState(searchParams.get('q') ?? '')
  const [sort,         setSort]         = useState<SortOption>('bypopularity')
  const [activeGenres, setActiveGenres] = useState<number[]>([])
  const [result,       setResult]       = useState<BrowseResult | null>(null)
  const [loading,      setLoading]      = useState(true)
  const [loadingMore,  setLoadingMore]  = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [page,         setPage]         = useState(1)
  const [filtersOpen,  setFiltersOpen]  = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  /* Busca ─────────────────────────────────────────────────────── */
  const fetch = useCallback(async (pg: number, reset: boolean) => {
    if (reset) setLoading(true)
    else setLoadingMore(true)
    setError(null)

    try {
      const data = await animeService.browse({
        query: query || undefined,
        sort,
        genres: activeGenres,
        page: pg,
        limit: 24,
      })
      setResult(prev =>
        reset || !prev
          ? data
          : { ...data, animes: [...prev.animes, ...data.animes] }
      )
      setPage(pg)
    } catch {
      setError('Não foi possível carregar o catálogo. Tente novamente.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [query, sort, activeGenres])

  /* Re-busca ao mudar filtros */
  useEffect(() => {
    fetch(1, true)
  }, [fetch])

  /* Sync URL → query */
  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    setQuery(q)
    setInputValue(q)
  }, []) // só na montagem

  /* Handlers ──────────────────────────────────────────────────── */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = inputValue.trim()
    setQuery(q)
    if (q) setSearchParams({ q })
    else setSearchParams({})
  }

  const clearSearch = () => {
    setQuery('')
    setInputValue('')
    setSearchParams({})
    inputRef.current?.focus()
  }

  const toggleGenre = (id: number) => {
    setActiveGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const clearFilters = () => {
    setActiveGenres([])
    setSort('bypopularity')
  }

  const hasFilters = activeGenres.length > 0 || sort !== 'bypopularity'

  return (
    <main className={styles.page}>

      {/* ── Cabeçalho ────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Catálogo</h1>
            <p className={styles.sub}>
              {result && !loading
                ? `${result.animes.length}${result.hasNextPage ? '+' : ''} títulos encontrados`
                : 'Explore todos os animes'}
            </p>
          </div>

          {/* Busca */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <span className={styles.searchIcon}><SearchIcon /></span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Buscar anime..."
              className={styles.searchInput}
            />
            {inputValue && (
              <button type="button" className={styles.clearBtn} onClick={clearSearch} aria-label="Limpar busca">
                <XIcon />
              </button>
            )}
            <button type="submit" className={styles.searchBtn}>Buscar</button>
          </form>
        </div>

        {/* Filtros */}
        <div className={styles.filtersRow}>
          {/* Ordenação */}
          <div className={styles.sortWrap}>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`${styles.sortBtn} ${sort === opt.value ? styles.sortBtnActive : ''}`}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Toggle gêneros mobile */}
          <button
            className={`${styles.filterToggle} ${filtersOpen ? styles.filterToggleOpen : ''}`}
            onClick={() => setFiltersOpen(v => !v)}
          >
            <FilterIcon />
            Gêneros
            {activeGenres.length > 0 && (
              <span className={styles.filterBadge}>{activeGenres.length}</span>
            )}
          </button>

          {hasFilters && (
            <button className={styles.clearFilters} onClick={clearFilters}>
              Limpar filtros
            </button>
          )}
        </div>

        {/* Gêneros */}
        <div className={`${styles.genresRow} ${filtersOpen ? styles.genresOpen : ''}`}>
          {GENRES.map(g => (
            <button
              key={g.id}
              className={`${styles.genreChip} ${activeGenres.includes(g.id) ? styles.genreChipActive : ''}`}
              onClick={() => toggleGenre(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────── */}
      {error ? (
        <div className={styles.errorBox} role="alert">
          <p>{error}</p>
          <button className={styles.retryBtn} onClick={() => fetch(page, true)}>
            Tentar novamente
          </button>
        </div>
      ) : loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 24 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : result?.animes.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyKanji}>空</span>
          <p className={styles.emptyTitle}>Nenhum resultado</p>
          <p className={styles.emptySub}>Tente outros termos ou remova os filtros.</p>
          <button className={styles.retryBtn} onClick={clearFilters}>Limpar filtros</button>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {result?.animes.map(anime => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
            {loadingMore && Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={`more-${i}`} />)}
          </div>

          {result?.hasNextPage && !loadingMore && (
            <div className={styles.loadMoreWrap}>
              <button
                className={styles.loadMoreBtn}
                onClick={() => fetch(page + 1, false)}
              >
                Carregar mais
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
