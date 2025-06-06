import { prisma } from '@/lib/db';
import { Burger } from '@/lib/types/burgers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const burger = await prisma.burger.findUnique({
      where: { id: params.id },
      include: { reviews: true },
    });

    if (!burger) {
      return NextResponse.json({ error: 'Burger not found' }, { status: 404 });
    }

    const response: Burger = {
      ...burger,
      ingredients: JSON.parse(burger.ingredients),
      images: JSON.parse(burger.images),
      tags: JSON.parse(burger.tags),
      ratingAverage: burger.ratingAverage || 0,
      ratingCount: burger.ratingCount || 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching burger details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch burger details' },
      { status: 500 }
    );
  }
}