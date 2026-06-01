import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminHash = await bcrypt.hash('admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ai-platform.dev' },
    update: {},
    create: {
      email: 'admin@ai-platform.dev',
      name: 'Admin User',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });

  // Create demo user
  const userHash = await bcrypt.hash('demo123!', 12);
  const demo = await prisma.user.upsert({
    where: { email: 'demo@ai-platform.dev' },
    update: {},
    create: {
      email: 'demo@ai-platform.dev',
      name: 'Demo User',
      passwordHash: userHash,
      role: 'USER',
    },
  });

  // Create a sample conversation
  await prisma.conversation.upsert({
    where: { id: 'seed-conv-01' },
    update: {},
    create: {
      id: 'seed-conv-01',
      userId: demo.id,
      title: 'Welcome to AI Platform',
      messages: {
        create: [
          { role: 'USER', content: 'Hello! What can you do?' },
          {
            role: 'ASSISTANT',
            content:
              'Hello! I can help you with chat, answer questions using RAG, process documents, and run AI agents. What would you like to explore?',
            model: 'mock-model-v1',
            tokens: 30,
          },
        ],
      },
    },
  });

  console.log(`✅ Seeded: admin (${admin.email}), demo (${demo.email})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
