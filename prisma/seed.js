
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@finance.com'
    const password = await bcrypt.hash('admin123', 10)

    // 1. Upsert User
    const user = await prisma.user.upsert({
        where: { email },
        update: { password },
        create: {
            email,
            password,
            name: 'Admin User'
        }
    })

    console.log({ user })

    // 2. Create Business if not exists
    let business = await prisma.business.findFirst({ where: { name: 'My Finance Corp' } })
    if (!business) {
        business = await prisma.business.create({
            data: {
                name: 'My Finance Corp',
                currency: 'USD'
            }
        })

        // Link User
        await prisma.membership.create({
            data: {
                userId: user.id,
                businessId: business.id,
                role: 'OWNER'
            }
        })

        // Create default accounts
        const asset = await prisma.account.create({
            data: { code: '1000', name: 'Assets', type: 'ASSET', businessId: business.id }
        })
        await prisma.account.create({
            data: { code: '1100', name: 'Bank Accounts', type: 'ASSET', businessId: business.id, parentId: asset.id }
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
