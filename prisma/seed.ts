import { prisma } from '@/lib/db';
import { hash } from 'bcryptjs';

// Use the Prisma-generated enum for BurgerCategory
import { BurgerCategory } from '@prisma/client';

const burgers = [
  {
    name: 'Kiamy burger',
    description: 'Hambúrguer individual com carne 100% angolana, queijo cheddar, alface, tomate e molho especial, servido no pão brioche.',
    price: 4000,
    image: '/burgers/chameburger.jpeg',
    images: JSON.stringify(['/burgers/chameburger.jpeg', '/burgers/chameburger.jpeg']),
    category: BurgerCategory.CLASSIC,
    ingredients: JSON.stringify([
      { name: 'Pão brioche', isRemovable: false },
      { name: 'Carne angolana 150g', isRemovable: false },
      { name: 'Queijo cheddar', isRemovable: true },
      { name: 'Alface', isRemovable: true },
      { name: 'Tomate', isRemovable: true },
      { name: 'Molho especial', isRemovable: true },
    ]),
    preparationTime: 12,
    calories: 540,
    tags: JSON.stringify(['individual']),
    isFeatured: true,
  },
  {
    name: 'Duo LoveBurger',
    description: 'Combo romântico com 2 hambúrgueres Chameburger e 1 porção de batatas fritas média. Ideal para partilhar a dois.',
    price: 7500,
    image: '/burgers/duo-loveburger.jpeg',
    images: JSON.stringify(['/burgers/duo-loveburger.jpeg', '/burgers/duo-loveburger.jpeg']),
    category: BurgerCategory.VEGAN,
    ingredients: JSON.stringify([
      { name: '2x Chameburger', isRemovable: false },
      { name: 'Batatas fritas média', isRemovable: true },
      { name: '2x Molho à escolha', isRemovable: true },
    ]),
    preparationTime: 20,
    calories: 1100,
    tags: JSON.stringify(['combo', 'casal']),
    isFeatured: false,
    isNew: true,
  },
  {
    name: 'Família GooBurger',
    description: 'Combo família com 4 hambúrgueres variados, 2 porções grandes de batatas fritas e 4 refrigerantes à escolha.',
    price: 15000,
    image: '/burgers/familia-gooburger.jpeg',
    images: JSON.stringify(['/burgers/familia-gooburger.jpeg', '/burgers/familia-gooburger.jpeg']),
    category: BurgerCategory.CLASSIC,
    ingredients: JSON.stringify([
      { name: '4x Hambúrgueres variados', isRemovable: false },
      { name: '2x Batatas grandes', isRemovable: true },
      { name: '4x Refrigerantes 33cl', isRemovable: true },
    ]),
    preparationTime: 25,
    calories: 2200,
    tags: JSON.stringify(['combo', 'família']),
    isFeatured: true,
  },
];

async function main() {
  console.log('Seeding database...');

  const adminPassword = await hash('@gooburger2025', 12);
  await prisma.user.upsert({
    where: { email: 'admin@gooburger.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@gooburger.com',
      password: adminPassword,
      role: 'ADMIN',
      address: 'Endereço do restaurante',
      phone: '11999999999',
    },
  });

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.burger.deleteMany();

  for (const burger of burgers) {
    await prisma.burger.create({ data: burger });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
