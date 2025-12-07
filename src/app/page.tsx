import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Finance Flow</h1>
        <p className={styles.subtitle}>Advanced Enterprise Resource Planning</p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link href="/login" className={styles.button} style={{ textDecoration: 'none', textAlign: 'center' }}>
            Login
          </Link>
        </div>
      </div>
    </main>
  )
}
