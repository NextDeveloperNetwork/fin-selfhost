import Link from 'next/link'
import styles from './dashboard.module.css'
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>FinanceFlow</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{session?.user?.email}</div>

                <nav className={styles.nav}>
                    <Link href="/dashboard" className={styles.navItem}>Overview</Link>
                    <Link href="/dashboard/journal" className={styles.navItem}>Journal Entries</Link>
                    <Link href="/dashboard/reports" className={styles.navItem}>Reports</Link>
                    <Link href="/api/auth/signout" className={styles.navItem} style={{ marginTop: 'auto', color: '#f87171' }}>Sign Out</Link>
                </nav>
            </aside>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    )
}
