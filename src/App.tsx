import { BrowserRouter, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AppRoutes from './routes/AppRoutes'

const AUTH_ROUTES = ['/login', '/registro', '/auth/callback']

function AppLayout() {
  const location = useLocation()
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname)

  return (
    <>
      {!isAuthRoute && <Header />}
      <AppRoutes />
      {!isAuthRoute && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
