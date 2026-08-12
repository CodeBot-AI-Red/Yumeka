import { useParams } from 'react-router-dom'
export default function AnimePage() {
  const { id } = useParams()
  return (
    <main style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>Anime #{id} — em breve.</p>
    </main>
  )
}
