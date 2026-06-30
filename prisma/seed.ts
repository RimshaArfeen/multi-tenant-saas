
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed development data
  console.log('🌱 Seeding database...')
  
  // Create a test company
  const company = await prisma.company.create({
    data: {
      name: 'Acme Corporation',
      currency: 'USD',
      address: '123 Business St, San Francisco, CA 94105',
      settings: {
        create: {
          invoicePrefix: 'ACME-',
          invoiceNumber: 1000,
          paymentTerms: 30
        }
      }
    }
  })
  
  // Create an owner user
  const hashedPassword = await bcrypt.hash('password123', 10)
  await prisma.user.create({
    data: {
      email: 'owner@acme.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'OWNER',
      companyId: company.id
    }
  })
  
  // Create test clients
  const clients = [
    { name: 'TechStart Inc.', email: 'contact@techstart.io' },
    { name: 'DesignHub LLC', email: 'info@designhub.com' },
    { name: 'Cloud Solutions', email: 'hello@cloudsolutions.net' }
  ]
  
  for (const client of clients) {
    await prisma.client.create({
      data: {
        ...client,
        companyId: company.id
      }
    })
  }
  
  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })