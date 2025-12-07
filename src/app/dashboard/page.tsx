import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getBusiness, getAccounts, seedInitialData } from "../actions"
import styles from "./dashboard.module.css"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    // Auto-seed for demo if user is the admin
    if (session.user?.email === 'admin@finance.com') {
        await seedInitialData()
    }

    const business = await getBusiness((session.user as any).id)

    if (!business) {
        return <div className={styles.content}>No Business Found. Please contact support.</div>
    }

    const accounts = await getAccounts(business.id)

    return (
        <div>
            <header className={styles.header}>
                <h1 className={styles.pageTitle}>{business.name} Dashboard</h1>
                <p className={styles.pageSubtitle}>Double Entry Accounting System</p>
            </header>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3>Chart of Accounts</h3>
                    <div style={{ marginTop: '1rem', height: '300px', overflowY: 'auto' }}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((acc: any) => (
                                    <tr key={acc.id}>
                                        <td>{acc.code}</td>
                                        <td>
                                            {acc.parentId ? '\u00A0\u00A0 ' : ''}
                                            {acc.name}
                                            {acc.bankDetails ? ' (Bank)' : ''}
                                        </td>
                                        <td><span className={styles.badge}>{acc.type}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3>System Status</h3>
                    <p>User: {session.user.name}</p>
                    <p>Role: OWNER</p>
                    <p>System: Active</p>
                </div>
            </div>
        </div>
    )
}
