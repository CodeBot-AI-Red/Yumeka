import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Assinatura.module.css'

/* ─── Ícones ───────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function ZapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function DevicesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}
      aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

/* ─── Dados dos planos ──────────────────────────────────────── */
interface Plan {
  id: string
  name: string
  price: { monthly: number; yearly: number }
  badge?: string
  highlight?: boolean
  features: string[]
  cta: string
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: { monthly: 0, yearly: 0 },
    features: [
      'Catálogo limitado',
      'Qualidade até 720p',
      'Anúncios entre episódios',
      '1 dispositivo simultâneo',
    ],
    cta: 'Plano atual',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 19.90, yearly: 14.90 },
    badge: 'Mais popular',
    highlight: true,
    features: [
      'Catálogo completo',
      'Qualidade até 4K HDR',
      'Zero anúncios',
      '2 dispositivos simultâneos',
      'Download para assistir offline',
      'Novos episódios em primeira mão',
    ],
    cta: 'Assinar Pro',
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: { monthly: 29.90, yearly: 22.90 },
    features: [
      'Tudo do Pro',
      '4 dispositivos simultâneos',
      'Áudio original com legenda',
      'Acesso antecipado a lançamentos',
      'Suporte prioritário',
    ],
    cta: 'Assinar Ultra',
  },
]

const FAQS = [
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim. Você pode cancelar sua assinatura a qualquer momento sem multa. O acesso continua até o fim do período já pago.',
  },
  {
    q: 'Como funciona o plano anual?',
    a: 'No plano anual você paga uma vez por ano com desconto de até 25% em relação ao mensal. O valor é cobrado integralmente na data de adesão.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Aceitamos cartão de crédito (Visa, Mastercard, Elo), Pix e boleto bancário.',
  },
  {
    q: 'Posso assistir em mais de um dispositivo?',
    a: 'Depende do plano: Gratuito permite 1 dispositivo, Pro permite 2 e Ultra permite até 4 simultâneos.',
  },
  {
    q: 'O catálogo é realmente completo?',
    a: 'Nos planos pagos você tem acesso a mais de 12.000 títulos, incluindo lançamentos da temporada atual e clássicos legendados e dublados.',
  },
]

/* ─── Componente de card de plano ───────────────────────────── */
interface PlanCardProps {
  plan: Plan
  billing: 'monthly' | 'yearly'
  current?: boolean
}

function PlanCard({ plan, billing, current }: PlanCardProps) {
  const price = plan.price[billing]
  const isFree = price === 0

  return (
    <div className={`${styles.planCard} ${plan.highlight ? styles.planCardHighlight : ''} ${current ? styles.planCardCurrent : ''}`}>
      {plan.badge && (
        <span className={styles.planBadge}>{plan.badge}</span>
      )}

      <div className={styles.planHeader}>
        <h3 className={styles.planName}>{plan.name}</h3>
        <div className={styles.planPrice}>
          {isFree ? (
            <span className={styles.planPriceValue}>Grátis</span>
          ) : (
            <>
              <span className={styles.planPriceCurrency}>R$</span>
              <span className={styles.planPriceValue}>{price.toFixed(2).replace('.', ',')}</span>
              <span className={styles.planPricePer}>/mês</span>
            </>
          )}
        </div>
        {billing === 'yearly' && !isFree && (
          <p className={styles.planYearlyNote}>cobrado anualmente</p>
        )}
      </div>

      <ul className={styles.planFeatures}>
        {plan.features.map((f, i) => (
          <li key={i} className={styles.planFeatureItem}>
            <span className={`${styles.planCheck} ${plan.highlight ? styles.planCheckAccent : ''}`}>
              <CheckIcon />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <button
        className={`${styles.planCta} ${plan.highlight ? styles.planCtaAccent : ''} ${current ? styles.planCtaCurrent : ''}`}
        disabled={current}
      >
        {current ? 'Plano atual' : plan.cta}
      </button>
    </div>
  )
}

/* ─── FAQ item ──────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ''}`}>
      <button className={styles.faqQuestion} onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span>{q}</span>
        <ChevronIcon open={open} />
      </button>
      {open && <p className={styles.faqAnswer}>{a}</p>}
    </div>
  )
}

/* ─── Componente principal ──────────────────────────────────── */
export default function Assinatura() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <main className={styles.page}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Planos de assinatura">
        <div className={styles.heroGlow} aria-hidden="true" />
        <span className={styles.heroDeco} aria-hidden="true">夢</span>

        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Yumeka Premium</p>
          <h1 className={styles.heroTitle}>
            Anime sem limites,<br />
            <em>do seu jeito.</em>
          </h1>
          <p className={styles.heroSub}>
            Catálogo completo, 4K HDR e zero anúncios.<br />
            Escolha o plano ideal para você.
          </p>

          {/* Toggle mensal / anual */}
          <div className={styles.billingToggle} role="group" aria-label="Período de cobrança">
            <button
              className={`${styles.billingBtn} ${billing === 'monthly' ? styles.billingBtnActive : ''}`}
              onClick={() => setBilling('monthly')}
            >
              Mensal
            </button>
            <button
              className={`${styles.billingBtn} ${billing === 'yearly' ? styles.billingBtnActive : ''}`}
              onClick={() => setBilling('yearly')}
            >
              Anual
              <span className={styles.billingDiscount}>−25%</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Cards dos planos ─────────────────────────────────── */}
      <section className={styles.plansSection} id="planos" aria-label="Planos disponíveis">
        <div className={styles.plansGrid}>
          {PLANS.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billing={billing}
              current={plan.id === 'free'}
            />
          ))}
        </div>
      </section>

      {/* ── Diferenciais ─────────────────────────────────────── */}
      <section className={styles.perksSection} aria-label="Benefícios">
        <div className={styles.perksInner}>
          <div className={styles.perk}>
            <span className={styles.perkIcon}><PlayIcon /></span>
            <span className={styles.perkLabel}>12.000+ títulos</span>
          </div>
          <span className={styles.perkDiv} aria-hidden="true" />
          <div className={styles.perk}>
            <span className={styles.perkIcon}><StarIcon /></span>
            <span className={styles.perkLabel}>4K HDR</span>
          </div>
          <span className={styles.perkDiv} aria-hidden="true" />
          <div className={styles.perk}>
            <span className={styles.perkIcon}><ZapIcon /></span>
            <span className={styles.perkLabel}>Zero anúncios</span>
          </div>
          <span className={styles.perkDiv} aria-hidden="true" />
          <div className={styles.perk}>
            <span className={styles.perkIcon}><DevicesIcon /></span>
            <span className={styles.perkLabel}>Multi-dispositivo</span>
          </div>
          <span className={styles.perkDiv} aria-hidden="true" />
          <div className={styles.perk}>
            <span className={styles.perkIcon}><ShieldIcon /></span>
            <span className={styles.perkLabel}>Cancele quando quiser</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className={styles.faqSection} aria-label="Perguntas frequentes">
        <div className={styles.faqInner}>
          <h2 className={styles.faqTitle}>Perguntas frequentes</h2>
          <div className={styles.faqList}>
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Rodapé da página ─────────────────────────────────── */}
      <div className={styles.pageFooter}>
        <p className={styles.pageFooterText}>
          Já é assinante?{' '}
          <Link to="/perfil" className={styles.pageFooterLink}>Gerencie sua conta</Link>
        </p>
      </div>

    </main>
  )
}
