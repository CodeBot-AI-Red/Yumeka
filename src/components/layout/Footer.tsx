import { Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import styles from './Footer.module.css'

export default function Footer() {
  const loggedIn = !!authService.getSession()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.kanji}>夢花</span>
          <p className={styles.tagline}>
            Yumeka — <em>flor de sonho em japonês</em>
          </p>
        </div>

        <div className={styles.links}>
          <Link to="/browse">Catálogo</Link>
          {loggedIn ? (
            <Link to="/perfil">Meu perfil</Link>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/registro">Registrar</Link>
            </>
          )}
          <Link to="/assinatura">Premium</Link>
        </div>

        <p className={styles.copy}>© {new Date().getFullYear()} Yumeka. Projeto de código aberto.</p>
      </div>
    </footer>
  )
}
