import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { BurgerCategory } from '@/lib/types/burgers';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try { 

        const burger = await prisma.burger.findUnique({
            where: { id: params.id },
        });

        if (!burger) {
            return NextResponse.json(
                { error: 'Hambúrguer não encontrado' },
                { status: 404 }
            );
        }

        await prisma.burger.delete({
            where: { id: params.id },
        });

        const uploadDir = path.join(process.cwd(), 'public');
        
        if (burger.image) {
            const imagePath = path.join(uploadDir, burger.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        if (burger.images) {
            const additionalImages = JSON.parse(burger.images);
            additionalImages.forEach((imagePath: string) => {
                const fullPath = path.join(uploadDir, imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting burger:', error);
        return NextResponse.json(
            { error: 'Falha ao excluir hambúrguer' },
            { status: 500 }
        );
    }
}
 
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try { 
        const formData = await request.formData();
        
        // Busca o hambúrguer existente
        const existingBurger = await prisma.burger.findUnique({
            where: { id: params.id },
        });

        if (!existingBurger) {
            return NextResponse.json(
                { error: 'Hambúrguer não encontrado' },
                { status: 404 }
            );
        }

        // Processa as imagens
        const imageFile = formData.get('image') as File;
        const additionalImages = formData.getAll('additionalImages') as File[];
        
        let imagePath = existingBurger.image;
        if (imageFile.size > 0) {
            // Remove a imagem antiga
            if (existingBurger.image) {
                const oldImagePath = path.join(process.cwd(), 'public', existingBurger.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            // Salva a nova imagem
            imagePath = await saveImage(imageFile, 'main');
        }

        let additionalImagePaths = existingBurger.images ? JSON.parse(existingBurger.images) : [];
        if (additionalImages.length > 0) {
            // Remove imagens adicionais antigas
            if (existingBurger.images) {
                const oldImages = JSON.parse(existingBurger.images);
                oldImages.forEach((imgPath: string) => {
                    const fullPath = path.join(process.cwd(), 'public', imgPath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                });
            }
            // Salva as novas imagens adicionais
            additionalImagePaths = await Promise.all(
                additionalImages.map((file, index) => saveImage(file, `additional-${index}`))
            );
        }

        // Atualiza os dados do hambúrguer
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

        const updatedBurger = await prisma.burger.update({
            where: { id: params.id },
            data: burgerData,
        });

        return NextResponse.json(updatedBurger);
    } catch (error) {
        console.error('Error updating burger:', error);
        return NextResponse.json(
            { error: 'Failed to update burger' },
            { status: 500 }
        );
    }
}

async function saveImage(file: File, prefix: string): Promise<string> {
    if (!file || file.size === 0) return '';
    
    const uploadDir = path.join(process.cwd(), 'public', 'burgers');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = await file.arrayBuffer();
    const filename = `${prefix}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, filename);
    
    await fs.promises.writeFile(filePath, Buffer.from(buffer));
    
    return `/burgers/${filename}`;
}