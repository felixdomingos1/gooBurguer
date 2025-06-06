import { BurgerCategory, PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

const burgers = [
  {
    name: 'Classic Cheeseburger',
    description: 'Pão de hambúrguer, carne 150g, queijo cheddar, alface, tomate e molho especial',
    price: 18.90,
    originalPrice: 22.90,
    image: '/burgers/classic-cheeseburger.jpg',
    images: JSON.stringify(['/burgers/classic-cheeseburger-1.jpg', '/burgers/classic-cheeseburger-2.jpg']),
    tags: JSON.stringify(['best-seller']),
    category: BurgerCategory.CLASSIC,
    ingredients: JSON.stringify([
      { name: 'Pão de hambúrguer', isRemovable: false },
      { name: 'Carne 150g', isRemovable: false },
      { name: 'Queijo cheddar', isRemovable: true },
      { name: 'Alface', isRemovable: true },
      { name: 'Tomate', isRemovable: true },
      { name: 'Molho especial', isRemovable: true },
    ]),
    preparationTime: 15,
    calories: 550,
    isFeatured: true,
  },
  {
    name: 'Bacon Deluxe',
    description: 'Pão brioche, carne 180g, queijo emental, bacon crocante, cebola caramelizada e molho barbecue',
    price: 24.90,
    image: '/burgers/bacon-deluxe.jpg',
    images: JSON.stringify(['/burgers/bacon-deluxe-1.jpg', '/burgers/bacon-deluxe-2.jpg']),
    category: BurgerCategory.PREMIUM,
    ingredients: JSON.stringify([
      { name: 'Pão brioche', isRemovable: false },
      { name: 'Carne 180g', isRemovable: false },
      { name: 'Queijo emental', isRemovable: true },
      { name: 'Bacon crocante', isRemovable: true },
      { name: 'Cebola caramelizada', isRemovable: true },
      { name: 'Molho barbecue', isRemovable: true },
    ]),
    preparationTime: 20,
    calories: 720,
    isNew: true,
    tags: JSON.stringify(['new']),
  },
  {
    name: 'Veggie Supreme',
    description: 'Pão integral, hambúrguer de grão-de-bico, queijo vegano, rúcula, tomate seco e maionese de abacate',
    price: 22.50,
    image: '/burgers/veggie-supreme.jpg',
    images: JSON.stringify(['/burgers/veggie-supreme-1.jpg', '/burgers/veggie-supreme-2.jpg']),
    category: BurgerCategory.VEGETARIAN,
    ingredients: JSON.stringify([
      { name: 'Pão integral', isRemovable: false },
      { name: 'Hambúrguer de grão-de-bico', isRemovable: false },
      { name: 'Queijo vegano', isRemovable: true },
      { name: 'Rúcula', isRemovable: true },
      { name: 'Tomate seco', isRemovable: true },
      { name: 'Maionese de abacate', isRemovable: true },
    ]),
    preparationTime: 18,
    calories: 480,
    tags: JSON.stringify(['healthy']),
  },
  {
    name: 'Black Bean Vegan',
    description: 'Pão de beterraba, hambúrguer de feijão preto, cogumelos grelhados, cebola roxa e maionese de castanha',
    price: 23.90,
    image: '/burgers/black-bean-vegan.jpg',
    images: JSON.stringify(['/burgers/black-bean-vegan-1.jpg', '/burgers/black-bean-vegan-2.jpg']),
    category: BurgerCategory.VEGAN,
    ingredients: JSON.stringify([
      { name: 'Pão de beterraba', isRemovable: false },
      { name: 'Hambúrguer de feijão preto', isRemovable: false },
      { name: 'Cogumelos grelhados', isRemovable: true },
      { name: 'Cebola roxa', isRemovable: true },
      { name: 'Maionese de castanha', isRemovable: true },
    ]),
    preparationTime: 20,
    calories: 420,
    isNew: true,
    tags: JSON.stringify(['new', 'vegan']),
  },
  {
    name: 'Signature Smash',
    description: 'Pão australiano, 2 carnes 120g (smash style), queijo cheddar, cebola caramelizada, picles e molho da casa',
    price: 27.90,
    image: '/burgers/signature-smash.jpg',
    images: JSON.stringify(['/burgers/signature-smash-1.jpg', '/burgers/signature-smash-2.jpg']),
    category: BurgerCategory.SIGNATURE,
    ingredients: JSON.stringify([
      { name: 'Pão australiano', isRemovable: false },
      { name: '2 carnes 120g (smash style)', isRemovable: false },
      { name: 'Queijo cheddar', isRemovable: true },
      { name: 'Cebola caramelizada', isRemovable: true },
      { name: 'Picles', isRemovable: true },
      { name: 'Molho da casa', isRemovable: true },
      { name: 'Bacon extra', isRemovable: true, isExtra: true, extraPrice: 5.90 },
    ]),
    preparationTime: 25,
    calories: 850,
    isFeatured: true,
    tags: JSON.stringify(['signature', 'best-seller']),
  },
];

async function main() {
  console.log('Seeding database...');
  
  await prisma.burger.deleteMany();
  
  for (const burger of burgers) {
    await prisma.burger.create({
      data: burger,
    });
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