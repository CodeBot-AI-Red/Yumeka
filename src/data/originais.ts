export interface OriginalAnime {
  id: string
  titulo: string
  tituloRomaji: string
  tituloPortugues?: string
  subtitulo?: string
  // Sinopse curta — sem spoilers, aparece na Home e no AnimePage
  sinopse: string
  bannerUrl: string
  posterUrl: string
  generos: string[]
  episodios: number | null
  temporadas: number | null
  status: 'em_breve' | 'em_exibicao' | 'completo'
  ano: number
  nota?: number
  // Só personagens que podem ser mostrados sem spoiler
  personagensPublicos?: PersonagemPublico[]
  // Só a T1 é revelada
  temporada1?: {
    titulo: string
    episodios: string
    descricao: string
  }
}

export interface PersonagemPublico {
  nome: string
  papel: string
  descricao: string
}

export const ORIGINAIS: OriginalAnime[] = [
  {
    id: 'kakuregami',
    titulo: '隠れ神の不死四人組',
    tituloRomaji: 'Kakuregami no Fushi Yonin-gumi',
    tituloPortugues: 'O Quarteto Imortal do Deus Oculto',
    subtitulo: '4人の不死者と、隠された神',
    sinopse:
      'Três estudantes do ensino médio sobrevivem a um acidente brutal e são transportados para um mundo de fantasia. O que começa como rivalidade escolar e comédia nonsense cresce até uma escala épica de milênios, imortalidade e poderes capazes de rivalizar com os próprios deuses.',
    bannerUrl: '/kakuregami-banner.jpg',
    posterUrl: '/kakuregami-poster.jpg',
    generos: ['Ação', 'Fantasia', 'Isekai', 'Comédia', 'Sobrenatural'],
    episodios: 120,
    temporadas: 6,
    status: 'em_breve',
    ano: 2025,
    nota: 8.5,
    personagensPublicos: [
      {
        nome: 'Recian Forden',
        papel: 'Protagonista',
        descricao:
          'Estudante de 14 anos desligado e de pavio curto. Passou anos treinando artes marciais após sofrer bullying — e virou o mais perigoso da escola sem que ninguém soubesse. Carrega um segredo dentro da própria mente que nem ele mesmo compreende.',
      },
      {
        nome: 'Akane Magnus',
        papel: 'Personagem principal',
        descricao:
          'Cabelo magenta, energia explosiva e mana quase infinita. Por fora é a mais agressiva do grupo — por dentro tem um medo silencioso que raramente mostra para alguém.',
      },
      {
        nome: 'Astria Dumian',
        papel: 'Personagem principal',
        descricao:
          'Cabelo prateado e arrogância afiada como lâmina. A melhor espadachim do mundo. A frieza é uma armadura — no fundo se preocupa com cada pessoa ao seu redor mais do que admite.',
      },
    ],
    temporada1: {
      titulo: 'O Japão e a Virada',
      episodios: 'EP 01–20',
      descricao:
        'Apresentação de Recian, Akane e Astria no cotidiano escolar — rivalidades, brigas, amizade e os primeiros sinais de algo inexplicável. Nos episódios finais, um acidente muda tudo.',
    },
  },
]
