export interface OriginalAnime {
  id: string
  titulo: string
  tituloRomaji: string
  tituloPortugues?: string
  subtitulo?: string
  sinopse: string
  sinopseCompleta?: string
  bannerUrl: string
  posterUrl: string
  generos: string[]
  episodios: number | null
  temporadas: number | null
  status: 'em_breve' | 'em_exibicao' | 'completo'
  ano: number
  nota?: number
  personagens: Personagem[]
  temporadasInfo?: TemporadaInfo[]
  inspiracoes?: string[]
}

export interface Personagem {
  nome: string
  papel: string
  descricao: string
}

export interface TemporadaInfo {
  numero: number
  titulo: string
  episodios: string
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
      'Três estudantes do ensino médio sobrevivem a um descarrilamento de trem e são transportados para um mundo de fantasia. O que começa como rivalidade escolar e comédia nonsense cresce até uma escala épica de milênios, imortalidade e poderes capazes de rivalizar com os próprios deuses.',
    sinopseCompleta:
      'Três estudantes do ensino médio sobrevivem a um descarrilamento de trem em uma montanha e são transportados para um mundo de fantasia. O que começa como uma história de rivalidade escolar, brigas e comédia nonsense cresce até uma escala épica de milênios, imortalidade e poderes capazes de rivalizar com os próprios deuses. No fim, o quarteto que emerge dessa jornada não é apenas o grupo mais poderoso da existência — é também o responsável por derrotar uma entidade maligna anterior à criação de tudo e fundir dois mundos em uma única realidade.',
    bannerUrl: '/kakuregami-banner.jpg',
    posterUrl: '/kakuregami-poster.jpg',
    generos: ['Ação', 'Fantasia', 'Isekai', 'Comédia', 'Sobrenatural', 'Mistério'],
    episodios: 120,
    temporadas: 6,
    status: 'em_breve',
    ano: 2025,
    nota: 8.5,
    personagens: [
      {
        nome: 'Recian Forden',
        papel: 'Protagonista',
        descricao:
          'Estudante de 14 anos desligado e de pavio curto. Apanhou muito, treinou anos para nunca mais precisar apanhar. Possui três habilidades únicas: Recipiente de Espíritos, Criador de Corpos e Vida após a Morte. Carrega uma IA dentro da própria mente.',
      },
      {
        nome: 'Akane Magnus',
        papel: 'Deuteragonista',
        descricao:
          'Cabelo magenta, energia explosiva, mana quase infinita. Por fora é a mais agressiva do grupo. Por dentro carrega um medo silencioso: não conseguir ajudar Recian em nada. A artilharia pesada do grupo.',
      },
      {
        nome: 'Astria Dumian',
        papel: 'Deuteragonista',
        descricao:
          'Cabelo prateado, arrogância afiada como lâmina. A melhor espadachim do mundo. A arrogância é uma armadura — ela sempre quis se mostrar para o Recian, então se tornou a melhor em tudo. Por dentro se preocupa profundamente com todos ao redor.',
      },
      {
        nome: 'A Criadora',
        papel: 'IA / Quarto membro',
        descricao:
          'A entidade mais poderosa da existência, escondida dentro da mente de Recian por milênios. Criou os dois mundos para sobreviver enquanto encontrava quem pudesse dar-lhe um corpo. No fim, ganha forma física e completa o quarteto.',
      },
    ],
    temporadasInfo: [
      {
        numero: 1,
        titulo: 'O Japão e a Virada',
        episodios: 'EP 01–20',
        descricao:
          'Apresentação de Recian, Akane e Astria no cotidiano escolar. Rivalidades, brigas, comédia e desenvolvimento da amizade. Nos episódios finais, os primeiros sinais misteriosos: uma voz e dores de cabeça inexplicáveis. O trem descarrila. Os três chegam ao novo mundo.',
      },
      {
        numero: 2,
        titulo: 'O Isekai e a Escalada',
        episodios: 'EP 21–40',
        descricao:
          'Aquisição de poderes no mundo de magia. O trio começa a entender as regras da nova realidade e desenvolve suas habilidades únicas. O Divino Supremo é criado — imortalidade para todos.',
      },
      {
        numero: 3,
        titulo: 'Os 4.000 Anos',
        episodios: 'EP 41–60',
        descricao:
          'Recian dedica milênios para criar a porta dimensional sem ajuda da IA. Civilizações nascem e desaparecem. O mundo mágico evolui. No meio de tudo, Recian recria do zero coisas do Japão — comida, tecnologia, cultura.',
      },
      {
        numero: 4,
        titulo: 'O Retorno',
        episodios: 'EP 61–80',
        descricao:
          'A porta dimensional conecta os dois mundos. O retorno ao Japão. Os deuses controlados aparecem e a Criadora revela sua verdadeira natureza — selando os próprios filhos para libertá-los.',
      },
      {
        numero: 5,
        titulo: 'O Quarteto Completo',
        episodios: 'EP 81–100',
        descricao:
          'Recian cria um corpo físico para a Criadora. O ser mais poderoso da existência finalmente tem forma — e companhia. A entidade maligna anterior à criação de tudo se aproxima.',
      },
      {
        numero: 6,
        titulo: 'A Fusão dos Mundos',
        episodios: 'EP 101–120',
        descricao:
          'A batalha final contra a entidade maligna. Os quatro fundem a Terra e o mundo de magia em uma única realidade. Após uma existência de solidão, a Criadora tem três pessoas do lado dela num mundo que ela mesma criou.',
      },
    ],
    inspiracoes: [
      'Girlfriend, Girlfriend — fase escolar e rivalidade',
      'Witch Watch — personalidade do Recian',
      'Seirei Gensouki: Spirit Chronicles — acidente como portal',
      'That Time I Got Reincarnated as a Slime — a IA (Raphael) e a Sala dos Deuses',
      'Mushoku Tensei — escala divina da IA e a espadachim não-protagonista',
      'Tsukimichi: Moonlit Fantasy — contrato com a família',
      'To Your Eternity — Divino Supremo e entidades primordiais',
      'Re:Zero — Vida após a Morte',
      'The Aristocrat\'s Otherworldly Adventure — fusão de mundos',
    ],
  },
]
