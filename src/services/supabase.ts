const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL não está configurado no .env')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY não está configurado no .env')
}

export const supabaseConfig = {
  url: supabaseUrl.replace(/\/$/, ''),
  anonKey: supabaseAnonKey,
}

export const supabaseAuthUrl = `${supabaseConfig.url}/auth/v1`
