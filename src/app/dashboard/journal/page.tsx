import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { getBusiness, getAccounts, postJournalEntry } from "../../actions"
import { redirect } from "next/navigation"
import styles from "../dashboard.module.css"

export default async function JournalPage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/login')

    const business = await getBusiness((session.user as any).id)
    if (!business) return <div>No Business</div>

    const accounts = await getAccounts(business.id)

    return (
        <div>
            <header className={styles.header}>
                <h1 className={styles.pageTitle}>Journal Entries</h1>
            </header>

            <div className={styles.card}>
                <h3>New Manual Entry</h3>
                <p style={{ color: 'yellow', marginBottom: '1rem' }}>
                    ⚠️ For demo: Submit POST request to this action. UI under construction.
                </p>
                <p>Available Accounts:</p>
                <ul>
                    {accounts.map((a: any) => <li key={a.id}>{a.code} - {a.name}</li>)}
                </ul>
            </div>
        </div>
    )
}
