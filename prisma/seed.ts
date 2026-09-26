import { PrismaClient } from '@prisma/client';
import { DEFAULT_TEMPLATES } from '../lib/default-templates';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding templates...');

  // 1. Delete ALL templates first to ensure clean state
  await prisma.template.deleteMany({});
  console.log('Deleted all existing templates from database');

  // 2. Create exactly 5 templates from DEFAULT_TEMPLATES
  for (const tpl of DEFAULT_TEMPLATES) {
    await prisma.template.create({
      data: {
        slug: tpl.id,
        title: tpl.title,
        occasionType: tpl.occasion_type,
        thumbnailUrl: tpl.thumbnail_url,
        layoutConfig: tpl.layout_config as any,
        isActive: true,
      },
    });
  }

  console.log(`Successfully seeded ${DEFAULT_TEMPLATES.length} templates.`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
