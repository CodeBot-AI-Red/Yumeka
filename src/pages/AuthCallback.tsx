import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const session = authService.handleOAuthCallback()

        // Busca dados do usuário para checar se já tem nome definido
        const user = await authService.getUser(session.accessToken)
        const hasName = user?.user_metadata?.name || user?.user_metadata?.full_name

        if (hasName) {
          // Usuário OAuth que já passou pelo setup antes
          navigate('/', { replace: true })
        } else {
          // Usuário novo — pedir nome
          navigate('/setup-perfil', { replace: true })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível concluir o login com Google.')
      }
    }

    run()
  }, [navigate])

  if (error) {
    return (
      <main style={{ padding: '3rem', textAlign: 'center' }}>
        <h1>Erro no login</h1>
        <p>{error}</p>
        <Link to="/login">Voltar para o login</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: '3rem', textAlign: 'center' }}>
      <h1>Concluindo login com Google...</h1>
      <p>Você será redirecionado em instantes.</p>
    </main>
  )
}
