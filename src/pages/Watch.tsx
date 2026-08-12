import { useParams } from 'react-router-dom'
export default function Watch() {
  const { id } = useParams()
  return (
    <main style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>Player #{id} — em breve.</p>
    </main>
  )
}
