import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_LIFE_AREAS = [
  { slug: 'health', name: 'Health', description: 'Physical well-being, exercise, nutrition, sleep, and energy.', icon: 'heart', color: '#ef4444' },
  { slug: 'relationships', name: 'Relationships', description: 'Family, friendships, romantic partnerships, and social connections.', icon: 'people', color: '#f97316' },
  { slug: 'career', name: 'Career', description: 'Professional growth, skills, purpose, and contribution.', icon: 'briefcase', color: '#3b82f6' },
  { slug: 'finances', name: 'Finances', description: 'Financial health, savings, investments, and security.', icon: 'wallet', color: '#22c55e' },
  { slug: 'mind', name: 'Mind', description: 'Mental health, learning, intellectual growth, and curiosity.', icon: 'bulb', color: '#a855f7' },
  { slug: 'spirit', name: 'Spirit', description: 'Inner peace, meaning, values, meditation, and spiritual practices.', icon: 'leaf', color: '#65a30d' },
  { slug: 'creativity', name: 'Creativity', description: 'Creative expression, art, music, writing, and imagination.', icon: 'color-palette', color: '#e879f9' },
  { slug: 'environment', name: 'Environment', description: 'Living space, nature connection, organization, and surroundings.', icon: 'home', color: '#78716c' },
];

const SAMPLE_PRACTICES = [
  { name: 'Morning meditation', description: '10 minutes of mindful breathing', category: 'ritual', frequency: 'daily', durationMinutes: 10, slug: 'spirit' },
  { name: 'Exercise', description: '30 minutes of physical activity', category: 'habit', frequency: 'daily', durationMinutes: 30, slug: 'health' },
  { name: 'Journaling', description: 'Write about thoughts and feelings', category: 'reflection', frequency: 'daily', durationMinutes: 15, slug: 'mind' },
  { name: 'Budget review', description: 'Review spending and savings progress', category: 'routine', frequency: 'weekly', durationMinutes: 20, slug: 'finances' },
  { name: 'Connect with a friend', description: 'Reach out to someone you care about', category: 'habit', frequency: 'weekly', durationMinutes: null, slug: 'relationships' },
  { name: 'Creative time', description: 'Dedicated time for creative expression', category: 'habit', frequency: 'weekly', durationMinutes: 60, slug: 'creativity' },
];

async function main() {
  console.log('Seeding Tend database...');

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@tend.app' },
    update: {},
    create: {
      email: 'demo@tend.app',
      displayName: 'Demo Gardener',
    },
  });

  console.log(`Created user: ${user.displayName}`);

  // Create default life areas
  const lifeAreaMap: Record<string, string> = {};
  for (const area of DEFAULT_LIFE_AREAS) {
    const created = await prisma.lifeArea.upsert({
      where: { userId_slug: { userId: user.id, slug: area.slug } },
      update: {},
      create: { ...area, userId: user.id },
    });
    lifeAreaMap[area.slug] = created.id;
    console.log(`  Life area: ${created.name}`);
  }

  // Create sample practices
  for (const practice of SAMPLE_PRACTICES) {
    const { slug, ...data } = practice;
    await prisma.practice.create({
      data: {
        ...data,
        lifeAreaId: lifeAreaMap[slug],
        userId: user.id,
      },
    });
    console.log(`  Practice: ${data.name}`);
  }

  // Create a sample reflection
  const reflection = await prisma.reflection.create({
    data: {
      type: 'daily',
      title: 'First day in the garden',
      content: 'Today I begin tending my life garden. Each area is a plot that needs care, attention, and patience. I am excited to see what grows.',
      mood: 'good',
      gratitude: ['Starting this journey', 'Having a clear framework'],
      insights: ['Small consistent actions compound over time'],
      userId: user.id,
    },
  });

  // Link reflection to life areas
  await prisma.reflectionLifeArea.createMany({
    data: [
      { reflectionId: reflection.id, lifeAreaId: lifeAreaMap['spirit'] },
      { reflectionId: reflection.id, lifeAreaId: lifeAreaMap['mind'] },
    ],
  });

  console.log(`  Reflection: ${reflection.title}`);
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
