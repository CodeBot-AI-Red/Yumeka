import { BrowserRouter } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  )
}
