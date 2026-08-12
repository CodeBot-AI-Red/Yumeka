import axios from 'axios'
import type { Anime, JikanResponse } from '../types/anime'

const api = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  timeout: 10000,
})

// Pequeno throttle para respeitar o rate limit da Jikan (3 req/s)
const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

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
}
