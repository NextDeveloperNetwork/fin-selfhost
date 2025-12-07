'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import styles from './page.module.css'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await signIn('credentials', {
            email,
            password,
            callbackUrl: '/dashboard'
        })
    }

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>Welcome Back</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="admin@finance.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="admin123"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className={styles.button}>Sign In</button>
                </form>
            </div>
        </div>
    )
}
