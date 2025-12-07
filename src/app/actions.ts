'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

// --- AUTH SEED ---
export async function seedInitialData() {
    const existingUser = await prisma.user.findUnique({ where: { email: 'admin@finance.com' } })
    if (existingUser) return

    // 1. Create User
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const user = await prisma.user.create({
        data: {
            email: 'admin@finance.com',
            password: hashedPassword,
            name: 'Admin User'
        }
    })

    // 2. Create Business
    const business = await prisma.business.create({
        data: {
            name: 'My Finance Corp',
            currency: 'USD'
        }
    })

    // 3. Link them
    await prisma.membership.create({
        data: {
            userId: user.id,
            businessId: business.id,
            role: 'OWNER'
        }
    })

    // 4. Create Chart of Accounts (COA)
    const asset = await prisma.account.create({
        data: { code: '1000', name: 'Assets', type: 'ASSET', businessId: business.id }
    })
    const bank = await prisma.account.create({
        data: { code: '1100', name: 'Bank Accounts', type: 'ASSET', businessId: business.id, parentId: asset.id }
    })

    // Specific Bank
    const mainBank = await prisma.account.create({
        data: { code: '1110', name: 'Chase Checking', type: 'ASSET', businessId: business.id, parentId: bank.id }
    })
    await prisma.bankDetails.create({
        data: { accountId: mainBank.id, bankName: 'Chase', accountNumber: '123456789' }
    })

    // Equity
    const equity = await prisma.account.create({
        data: { code: '3000', name: 'Equity', type: 'EQUITY', businessId: business.id }
    })
    const capital = await prisma.account.create({
        data: { code: '3100', name: 'Owner Capital', type: 'EQUITY', businessId: business.id, parentId: equity.id }
    })

    // Revenue
    const revenue = await prisma.account.create({
        data: { code: '4000', name: 'Revenue', type: 'INCOME', businessId: business.id }
    })

    // Expenses
    const expense = await prisma.account.create({
        data: { code: '5000', name: 'Expenses', type: 'EXPENSE', businessId: business.id }
    })

    console.log('Seed completed')
}

// --- NEW ACTIONS ---

export async function getBusiness(userId: string) {
    // Get the first business for the user for now
    const membership = await prisma.membership.findFirst({
        where: { userId },
        include: { business: true }
    })
    return membership?.business
}

export async function getAccounts(businessId: string) {
    return await prisma.account.findMany({
        where: { businessId },
        orderBy: { code: 'asc' },
        include: { bankDetails: true }
    })
}

export async function postJournalEntry(data: {
    description: string
    businessId: string
    date: Date
    lines: { accountId: string, debit: number, credit: number }[]
}) {
    // Basic validation: Debits must equal Credits
    const totalDebit = data.lines.reduce((sum, line) => sum + line.debit, 0)
    const totalCredit = data.lines.reduce((sum, line) => sum + line.credit, 0)

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new Error(`Unbalanced Entry: Debit ${totalDebit} vs Credit ${totalCredit}`)
    }

    await prisma.journalEntry.create({
        data: {
            description: data.description,
            businessId: data.businessId,
            date: data.date,
            lines: {
                create: data.lines
            }
        }
    })
    revalidatePath('/dashboard')
}
