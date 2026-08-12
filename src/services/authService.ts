import { supabaseAuthUrl, supabaseConfig } from './supabase'

const AUTH_STORAGE_KEY = 'yumeka.auth.session'

export interface AuthSession {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
  tokenType?: string
}

export interface UserProfile {
  id: string
  display_name: string
  avatar_url: string | null
  profile_completed: boolean
}

function getRedirectTo() {
  return `${window.location.origin}/auth/callback`
}

function persistSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

function parseAuthParams(search: string, hash: string) {
  const hashParams = new URLSearchParams(hash.replace(/^#/, ''))
  const searchParams = new URLSearchParams(search)
  return {
    accessToken: hashParams.get('access_token') ?? searchParams.get('access_token'),
    refreshToken: hashParams.get('refresh_token') ?? searchParams.get('refresh_token') ?? undefined,
    expiresIn: hashParams.get('expires_in') ?? searchParams.get('expires_in'),
    tokenType: hashParams.get('token_type') ?? searchParams.get('token_type') ?? undefined,
    error: hashParams.get('error_description') ?? searchParams.get('error_description') ?? hashParams.get('error') ?? searchParams.get('error'),
  }
}

// Requisição autenticada para a REST API do Supabase (schema public)
async function supabaseRest(path: string, options: RequestInit = {}, token: string) {
  const res = await fetch(`${supabaseConfig.url}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers ?? {}),
    },
  })
  return res
}

export const authService = {
  signInWithGoogle() {
    const params = new URLSearchParams({
      provider: 'google',
      redirect_to: getRedirectTo(),
    })
    window.location.assign(`${supabaseAuthUrl}/authorize?${params.toString()}`)
  },

  async signIn(email: string, password: string) {
    const res = await fetch(`${supabaseAuthUrl}/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${supabaseConfig.anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error_description ?? data.msg ?? 'Não foi possível entrar.')
    const session: AuthSession = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
      tokenType: data.token_type,
    }
    persistSession(session)
    return session
  },

  async signUp(name: string, email: string, password: string) {
    const res = await fetch(`${supabaseAuthUrl}/signup`, {
      method: 'POST',
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${supabaseConfig.anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        data: { name, full_name: name },
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error_description ?? data.msg ?? 'Não foi possível criar sua conta.')
    if (data.access_token) {
      const session: AuthSession = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
        tokenType: data.token_type,
      }
      persistSession(session)
    }
    return data
  },

  handleOAuthCallback(search = window.location.search, hash = window.location.hash) {
    const params = parseAuthParams(search, hash)
    if (params.error) throw new Error(params.error)
    if (!params.accessToken) throw new Error('O Google não retornou uma sessão válida.')
    const expiresIn = params.expiresIn ? Number(params.expiresIn) : undefined
    const session: AuthSession = {
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
      expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
      tokenType: params.tokenType,
    }
    persistSession(session)
    return session
  },

  // Busca perfil do usuário na tabela public.profiles
  async getProfile(accessToken: string): Promise<UserProfile | null> {
    const res = await supabaseRest('/profiles?select=*&limit=1', {}, accessToken)
    if (!res.ok) return null
    const data = await res.json()
    return data[0] ?? null
  },

  // Salva/atualiza display_name e marca profile_completed = true
  async saveDisplayName(name: string) {
    const session = this.getSession()
    if (!session) throw new Error('Sessão não encontrada.')

    // Primeiro busca o id do usuário
    const userRes = await fetch(`${supabaseAuthUrl}/user`, {
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
    if (!userRes.ok) throw new Error('Não foi possível buscar o usuário.')
    const user = await userRes.json()

    // Upsert no profiles
    const res = await supabaseRest(
      '/profiles',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          id: user.id,
          display_name: name,
          profile_completed: true,
        }),
      },
      session.accessToken,
    )
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? 'Não foi possível salvar o nome.')
    return data
  },

  getSession() {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthSession) : null
  },

  signOut() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  },
}
