import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    let userId = data.userId;
    
    if (!userId && data.customerName && data.customerPhone) {
      const tempUser = await prisma.user.create({
        data: {
          name: data.customerName,
          email: `temp_${Date.now()}@burger.app`, // Email temporário
          password: 'temp_password', // Senha temporária
          phone: data.customerPhone,
          address: data.customerAddress || data.address,
          role: 'USER'
        }
      });
      userId = tempUser.id;
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: "Dados do cliente são obrigatórios" },
        { status: 400 }
      );
    }
    
    const order = await prisma.order.create({
      data: {
        userId: userId,
        total: data.total,
        address: data.address,
        phone: data.phone,
        notes: data.notes || '',
        items: {
          create: data.items.map((item: any) => ({
            burgerId: item.burgerId,
            quantity: item.quantity,
            price: item.price,
            specialRequest: item.specialRequest || null,
          })),
        },
      },
      include: {
        items: {
          include: {
            burger: true,
          }
        },
        user: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json(
      { error: "Falha ao criar pedido" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            burger: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { error: "Falha ao buscar pedidos" },
      { status: 500 }
    );
  }
}

// Endpoint para atualizar status do pedido
export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();
    
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            burger: true,
          }
        },
        user: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { error: "Falha ao atualizar pedido" },
      { status: 500 }
    );
  }
}