import axios from 'axios'
import type { Anime, JikanResponse } from '../types/anime'

const api = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  timeout: 10000,
})

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export type SortOption = 'bypopularity' | 'score' | 'airing' | 'upcoming' | 'favorite'
export type GenreId = number

export interface BrowseParams {
  query?: string
  sort?: SortOption
  genres?: GenreId[]
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
      params: { q: query, limit: 12, order_by: 'popularity', sort: 'asc' },
    })
    return data.data
  },

  async browse({ query, sort = 'bypopularity', genres = [], page = 1, limit = 24 }: BrowseParams): Promise<BrowseResult> {
    const params: Record<string, unknown> = { page, limit }

    if (query?.trim()) {
      // busca por texto
      params.q = query.trim()
      params.order_by = sort === 'score' ? 'score' : 'popularity'
      params.sort = 'desc'
    } else {
      // top/anime aceita filter
      params.filter = sort
    }

    if (genres.length > 0) {
      params.genres = genres.join(',')
    }

    const endpoint = query?.trim() ? '/anime' : '/top/anime'
    const { data } = await api.get<JikanResponse<Anime[]>>(endpoint, { params })

    return {
      animes: data.data,
      hasNextPage: data.pagination?.has_next_page ?? false,
      currentPage: data.pagination?.current_page ?? page,
      total: data.pagination?.items?.total ?? 0,
    }
  },
}
