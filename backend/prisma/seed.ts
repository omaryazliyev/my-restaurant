import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding boshlandi...');

  // 1. Admin foydalanuvchi
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'Adminov',
      phone: '+998900000000',
      username: 'admin',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log('Admin yaratildi:', admin.username);

  // 2. Kategoriyalar (Menu.jsx dagi categories massividan)
  const categoryNames = ['Первые', 'Вторые', 'Салаты', 'Напитки', 'Фаст-Фуд'];
  const categories = {};
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories[name] = cat;
  }
  console.log('Kategoriyalar yaratildi:', categoryNames.join(', '));

  // 3. Namunaviy taomlar
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Chicken soup',
        description: 'Spicy with garlic',
        price: 10.0,
        image: '/images/food2.png',
        categoryId: categories['Первые'].id,
      },
      {
        name: 'Дабл бургер',
        description:
          'Sochli mol go\'shti, pishloq, pomidor, piyoz va salat bargi bilan.',
        price: 4.0,
        image: '/images/food1.png',
        categoryId: categories['Фаст-Фуд'].id,
      },
      {
        name: 'Caesar salad',
        description: 'Tovuq, parmezan va krutonlar bilan',
        price: 6.5,
        image: '/images/food3.png',
        categoryId: categories['Салаты'].id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('Namunaviy taomlar yaratildi');

  // 4. Stollar
  await prisma.table.createMany({
    data: [
      { number: 'A1', capacity: 2, location: 'Oyna yonida' },
      { number: 'A2', capacity: 2, location: 'Oyna yonida' },
      { number: 'B1', capacity: 4, location: 'Markaziy zal' },
      { number: 'B2', capacity: 4, location: 'Markaziy zal' },
      { number: 'B3', capacity: 4, location: 'Markaziy zal' },
      { number: 'VIP-1', capacity: 6, location: 'VIP xona' },
    ],
    skipDuplicates: true,
  });
  console.log('Stollar yaratildi');

  console.log('Seeding tugadi ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
