import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
 
export async function PATCH(
    request: NextRequest,
    { params }: any
) {
    try {
        const { status } = await request.json();
        
        const validStatuses = ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Status inválido' },
                { status: 400 }
            );
        }

        const updatedOrder = await prisma.order.update({
            where: { id: params.id }, 
            data: { status },
            include: {
                items: {
                    include: {
                        burger: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json(
            { error: 'Falha ao atualizar o pedido' },
            { status: 500 }
        );
    }
}