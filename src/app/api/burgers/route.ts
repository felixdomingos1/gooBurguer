import { prisma } from '@/lib/db';
import { Burger, BurgerCategory, BurgerIngredient, BurgerListResponse } from '@/lib/types/burgers';
import { NextResponse } from 'next/server';

 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;
  const skip = (page - 1) * limit;
  const category = searchParams.get('category');

  try {
    const where = {
      ...(category && {
        category: category.toUpperCase() as BurgerCategory
      }),
      isAvailable: true,
    };

    const [burgers, total] = await Promise.all([
      prisma.burger.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.burger.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: BurgerListResponse = {
      page,
      results: burgers.map((burger:any) => ({
        ...burger,
        ingredients: JSON.parse(burger.ingredients || '[]') as BurgerIngredient[],
        images: JSON.parse(burger.images || '[]') as string[],
        tags: JSON.parse(burger.tags || '[]') as string[],
        ratingAverage: burger.ratingAverage || 0,
        ratingCount: burger.ratingCount || 0,
      })),
      totalPages,
      totalResults: total,
      categories: Object.values(BurgerCategory),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching burgers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch burgers' },
      { status: 500 }
    );
  }
}