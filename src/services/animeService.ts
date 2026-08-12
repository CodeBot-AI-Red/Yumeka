import axios from 'axios'
import type { Anime, JikanResponse } from '../types/anime'

const api = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  timeout: 10000,
})

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export type SortOption = 'bypopularity' | 'score' | 'airing' | 'upcoming' | 'favorite'

export interface BrowseParams {
  query?: string
  sort?: SortOption
  genres?: number[]
  page?: number
  limit?: number
}

export interface BrowseResult {
  animes: Anime[]
  hasNextPage: boolean
  currentPage: number
  total: number
}

export const GENRES = [
  { id: 1,  name: 'Ação' },
  { id: 2,  name: 'Aventura' },
  { id: 4,  name: 'Comédia' },
  { id: 8,  name: 'Drama' },
  { id: 10, name: 'Fantasia' },
  { id: 14, name: 'Horror' },
  { id: 7,  name: 'Mistério' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' },
  { id: 30, name: 'Esportes' },
  { id: 37, name: 'Sobrenatural' },
]

// Mapeia sort para parâmetros corretos da Jikan
function buildParams(sort: SortOption, genres: number[], page: number, limit: number, query?: string) {
  const genreStr = genres.length > 0 ? genres.join(',') : undefined

  // Com busca textual → endpoint /anime com order_by
  if (query?.trim()) {
    const orderBy: Record<SortOption, string> = {
      bypopularity: 'members',
      score:        'score',
      airing:       'members',
      upcoming:     'members',
      favorite:     'favorites',
    }
    return {
      endpoint: '/anime',
      params: {
        q: query.trim(),
        order_by: orderBy[sort],
        sort: 'desc',
        genres: genreStr,
        page,
        limit,
        sfw: true,
      },
    }
  }

  // Sem busca → /top/anime (filter só aceita: airing, upcoming, bypopularity, favorite)
  // score não existe como filter → usamos /anime com order_by=score
  if (sort === 'score' || genres.length > 0) {
    const orderBy: Record<SortOption, string> = {
      bypopularity: 'members',
      score:        'score',
      airing:       'members',
      upcoming:     'start_date',
      favorite:     'favorites',
    }
    const statusMap: Partial<Record<SortOption, string>> = {
      airing:   'airing',
      upcoming: 'upcoming',
    }
    return {
      endpoint: '/anime',
      params: {
        order_by: orderBy[sort],
        sort: 'desc',
        status: statusMap[sort],
        genres: genreStr,
        page,
        limit,
        sfw: true,
      },
    }
  }

  // Caso simples: /top/anime com filter nativo
  const filterMap: Record<SortOption, string> = {
    bypopularity: 'bypopularity',
    score:        'bypopularity', // fallback (não chega aqui)
    airing:       'airing',
    upcoming:     'upcoming',
    favorite:     'favorite',
  }
  return {
    endpoint: '/top/anime',
    params: {
      filter: filterMap[sort],
      page,
      limit,
    },
  }
}

export const animeService = {
  async getTopAiring(): Promise<Anime[]> {
    const { data } = await api.get<JikanResponse<Anime[]>>('/top/anime', {
      params: { filter: 'airing', limit: 12 },
    })
    return data.data
  },

  async getTopPopular(): Promise<Anime[]> {
    await delay(400)
    const { data } = await api.get<JikanResponse<Anime[]>>('/top/anime', {
      params: { filter: 'bypopularity', limit: 18 },
    })
    return data.data
  },

  async getSeasonNow(): Promise<Anime[]> {
    await delay(800)
    const { data } = await api.get<JikanResponse<Anime[]>>('/seasons/now', {
      params: { limit: 18 },
    })
    return data.data
  },

  async search(query: string): Promise<Anime[]> {
    const { data } = await api.get<JikanResponse<Anime[]>>('/anime', {
      params: { q: query, limit: 12, order_by: 'members', sort: 'desc' },
    })
    return data.data
  },

  async browse({ query, sort = 'bypopularity', genres = [], page = 1, limit = 24 }: BrowseParams): Promise<BrowseResult> {
    const { endpoint, params } = buildParams(sort, genres, page, limit, query)

    // Remove params undefined para não mandar na query
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined)
    )

    const { data } = await api.get<JikanResponse<Anime[]>>(endpoint, { params: cleanParams })

    return {
      animes: data.data ?? [],
      hasNextPage: data.pagination?.has_next_page ?? false,
      currentPage: data.pagination?.current_page ?? page,
      total: data.pagination?.items?.total ?? 0,
    }
  },
}
