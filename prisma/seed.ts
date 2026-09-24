import { PrismaClient } from '@prisma/client';
import { DEFAULT_TEMPLATES } from '../lib/default-templates';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding templates...');

  // The only 4 allowed template slugs
  const allowedSlugs = DEFAULT_TEMPLATES.map((t) => t.id);

  // 1. Remove all other templates that are NOT one of the 4 allowed templates
  await prisma.template.deleteMany({
    where: {
      slug: {
        notIn: allowedSlugs,
      },
    },
  });

  // 2. Upsert each of the exact 4 templates
  for (const tpl of DEFAULT_TEMPLATES) {
    await prisma.template.upsert({
      where: { slug: tpl.id },
      update: {
        title: tpl.title,
        occasionType: tpl.occasion_type,
        thumbnailUrl: tpl.thumbnail_url,
        layoutConfig: tpl.layout_config as any,
        isActive: true,
      },
      create: {
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
