import { supabaseAuthUrl, supabaseConfig } from './supabase'

const AUTH_STORAGE_KEY = 'yumeka.auth.session'

export interface AuthSession {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
  tokenType?: string
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

export const authService = {
  signInWithGoogle() {
    const params = new URLSearchParams({
      provider: 'google',
      redirect_to: getRedirectTo(),
    })

    window.location.assign(`${supabaseAuthUrl}/authorize?${params.toString()}`)
  },

  async signIn(email: string, password: string) {
    const response = await fetch(`${supabaseAuthUrl}/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${supabaseConfig.anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error_description ?? data.msg ?? 'Não foi possível entrar.')
    }

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
    const response = await fetch(`${supabaseAuthUrl}/signup`, {
      method: 'POST',
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${supabaseConfig.anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        // name em data → salva em user_metadata no Supabase Auth Users
        data: { name, full_name: name },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error_description ?? data.msg ?? 'Não foi possível criar sua conta.')
    }

    if (data.access_token) {
      persistSession({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
        tokenType: data.token_type,
      })
    }

    return data
  },

  handleOAuthCallback(search = window.location.search, hash = window.location.hash) {
    const params = parseAuthParams(search, hash)

    if (params.error) {
      throw new Error(params.error)
    }

    if (!params.accessToken) {
      throw new Error('O Google não retornou uma sessão válida.')
    }

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

  // Busca dados do usuário autenticado via token
  async getUser(accessToken: string) {
    const response = await fetch(`${supabaseAuthUrl}/user`, {
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) return null

    return await response.json() as {
      id: string
      email: string
      user_metadata: Record<string, string>
    }
  },

  // Atualiza o nome (user_metadata) do usuário autenticado
  async updateDisplayName(name: string) {
    const session = this.getSession()
    if (!session) throw new Error('Sessão não encontrada.')

    const response = await fetch(`${supabaseAuthUrl}/user`, {
      method: 'PUT',
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: { name, full_name: name },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error_description ?? data.msg ?? 'Não foi possível salvar o nome.')
    }

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
