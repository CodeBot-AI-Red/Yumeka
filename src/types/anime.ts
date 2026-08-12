export interface Anime {
  mal_id: number
  title: string
  title_portuguese?: string
  synopsis: string
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
    webp?: {
      image_url: string
      large_image_url: string
    }
  }
  score: number | null
  scored_by: number | null
  rank: number | null
  popularity: number | null
  episodes: number | null
  status: string
  rating: string | null
  genres: Array<{ mal_id: number; name: string }>
  studios: Array<{ mal_id: number; name: string }>
  year: number | null
  season: string | null
  trailer: {
    youtube_id: string | null
    url: string | null
  }
  type: string | null
  source: string | null
  duration: string | null
  members: number
}

export interface JikanResponse<T> {
  data: T
  pagination?: {
    last_visible_page: number
    has_next_page: boolean
    current_page: number
    items: {
      count: number
      total: number
      per_page: number
    }
  }
}
