import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Browse from '../pages/Browse'
import AnimePage from '../pages/AnimePage'
import Watch from '../pages/Watch'
import Perfil from '../pages/Perfil'
import Login from '../pages/Login'
import Registro from '../pages/Registro'
import Assinatura from '../pages/Assinatura'
import AuthCallback from '../pages/AuthCallback'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/anime/:id" element={<AnimePage />} />
      <Route path="/watch/:id" element={<Watch />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/assinatura" element={<Assinatura />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  )
}
