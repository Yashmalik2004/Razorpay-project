const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const CFO_EMAIL = 'cfo@org.com';
  const CFO_PASSWORD = 'CFO#ORG@April2026';
  const SALT_ROUNDS = 10;

  // Hash CFO password
  const passwordHash = await bcrypt.hash(CFO_PASSWORD, SALT_ROUNDS);

  // Upsert the root CFO user (safe to re-run)
  const cfo = await prisma.user.upsert({
    where: { email: CFO_EMAIL },
    update: {},
    create: {
      name: 'Chief Financial Officer',
      email: CFO_EMAIL,
      passwordHash,
      role: 'CFO',
    },
  });

  console.log(`✅ CFO account ready: ${cfo.email} (id: ${cfo.id})`);
  console.log('🌱 Seeding complete.');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
