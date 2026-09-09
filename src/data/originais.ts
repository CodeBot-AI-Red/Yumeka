// Animes originais da Yumeka
// Adicione novos títulos aqui conforme forem produzidos

export interface OriginalAnime {
  id: string
  titulo: string
  tituloRomaji: string
  subtitulo?: string
  sinopse: string
  bannerUrl: string   // capa deitada (landscape) – usada no hero
  posterUrl: string   // capa em pé (portrait) – usada no card
  generos: string[]
  episodios: number | null
  status: 'em_breve' | 'em_exibicao' | 'completo'
  ano: number
}

export const ORIGINAIS: OriginalAnime[] = [
  {
    id: 'kakuregami',
    titulo: '隠れ神の不死四人組',
    tituloRomaji: 'Kakuregami no Fushi Yonin-gumi',
    subtitulo: '4人の不死者と、隠された神',
    sinopse:
      'Quatro imortais unidos por um destino que os transcende são arrastados para uma conspiração milenar em torno de um deus oculto. Entre batalhas, segredos e laços que a morte não pode desfazer, eles descobrem que a verdadeira imortalidade vai muito além de não morrer.',
    bannerUrl: '/kakuregami-banner.jpg',
    posterUrl: '/kakuregami-poster.jpg',
    generos: ['Ação', 'Fantasia', 'Sobrenatural'],
    episodios: null,
    status: 'em_breve',
    ano: 2025,
  },
]
