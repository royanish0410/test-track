import { PrismaClient } from '@/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}


const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter:adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma