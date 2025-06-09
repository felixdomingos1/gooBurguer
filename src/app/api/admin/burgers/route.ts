import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { BurgerCategory } from '@/lib/types/burgers';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const burgers = await prisma.burger.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(burgers);
  } catch (error) {
    console.error('Error fetching burgers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch burgers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    
    // Processar upload de imagens
    const imageFile = formData.get('image') as File;
    const additionalImages = formData.getAll('additionalImages') as File[];
    
    // Salvar imagens e obter caminhos
    const imagePath = await saveImage(imageFile, 'main');
    const additionalImagePaths = await Promise.all(
      additionalImages.map((file, index) => saveImage(file, `additional-${index}`))
    );

    const burgerData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as BurgerCategory,
      preparationTime: parseInt(formData.get('preparationTime') as string),
      calories: formData.get('calories') ? parseInt(formData.get('calories') as string) : null,
      ingredients: formData.get('ingredients') as string,
      tags: formData.get('tags') as string,
      isAvailable: formData.get('isAvailable') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      isNew: formData.get('isNew') === 'true',
      image: imagePath,
      images: JSON.stringify(additionalImagePaths),
    };

    const burger = await prisma.burger.create({
      data: burgerData,
    });

    return NextResponse.json(burger);
  } catch (error) {
    console.error('Error creating burger:', error);
    return NextResponse.json(
      { error: 'Failed to create burger' },
      { status: 500 }
    );
  }
}

async function saveImage(file: File, prefix: string): Promise<string> {
  if (!file) return '';
  
  const uploadDir = path.join(process.cwd(), 'public', 'burgers');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const buffer = await file.arrayBuffer();
  const filename = `${prefix}-${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, filename);
  
  await fs.promises.writeFile(filePath, Buffer.from(buffer));
  
  return `/burgers/${filename}`;
}