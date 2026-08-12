import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      authService.handleOAuthCallback()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir o login com Google.')
    }
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
