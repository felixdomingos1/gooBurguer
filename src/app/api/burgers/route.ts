import { prisma } from '@/lib/db';
import { Burger, BurgerListResponse } from '@/lib/types/burgers';
import { BurgerCategory } from '@prisma/client';
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
        category: BurgerCategory[category.toUpperCase() as keyof typeof BurgerCategory] 
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
      results: burgers.map((burger) => ({
        ...burger,
        ingredients: JSON.parse(burger.ingredients),
        images: JSON.parse(burger.images),
        tags: JSON.parse(burger.tags),
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
