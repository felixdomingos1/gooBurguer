import { useState, useEffect } from 'react';

export interface OrderItem {
  burgerId: string;
  quantity: number;
  price: number;
  specialRequest?: string;
}

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  customer: CustomerData;
  notes?: string;
  userId?: string; // Para usuários logados
}

export interface Order {
  id: string;
  user: {
    name: string;
    phone?: string;
    email: string;
  };
  items: {
    id: string;
    burger: {
      name: string;
      price: number;
      image?: string;
    };
    quantity: number;
    price: number;
    specialRequest?: string;
  }[];
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  address: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar todos os pedidos
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Falha ao carregar pedidos');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo pedido
  const createOrder = async (orderData: CreateOrderData): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: orderData.userId,
          customerName: orderData.customer.name,
          customerPhone: orderData.customer.phone,
          customerAddress: orderData.customer.address,
          customerEmail: orderData.customer.email,
          total: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          address: orderData.customer.address,
          phone: orderData.customer.phone,
          notes: orderData.notes,
          items: orderData.items,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar pedido');
      }

      const newOrder = await response.json();
      setOrders(prev => [newOrder, ...prev]);
      
      return newOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status do pedido
  const updateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar status');
      }

      const updatedOrder = await response.json();
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      return false;
    }
  };

  // Buscar pedido por ID
  const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
      setError(null);

      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Pedido não encontrado');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar pedido');
      return null;
    }
  };

  // Filtrar pedidos por status
  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  // Estatísticas básicas
  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'PENDING').length;
    const preparing = orders.filter(o => o.status === 'PREPARING').length;
    const ready = orders.filter(o => o.status === 'READY').length;
    const delivered = orders.filter(o => o.status === 'DELIVERED').length;
    const cancelled = orders.filter(o => o.status === 'CANCELLED').length;

    const totalRevenue = orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, order) => sum + order.total, 0);

    return {
      total,
      pending,
      preparing,
      ready,
      delivered,
      cancelled,
      totalRevenue,
    };
  };

  // Carregar pedidos na inicialização
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    getOrderStats,
  };
};

// Hook específico para um único pedido
export const useOrder = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Pedido não encontrado');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
  };
};