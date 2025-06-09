"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  address: string;
  estimatedTime?: number;
  items: {
    id: string;
    quantity: number;
    price: number;
    burger: {
      name: string;
      image: string;
    };
  }[];
}

export default function GooburgerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/?auth=login");
      return;
    }
    fetchOrders();
  }, [session, status]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/user/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      PREPARING: "bg-orange-100 text-orange-800",
      READY: "bg-green-100 text-green-800",
      OUT_FOR_DELIVERY: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts = {
      PENDING: "Pendente",
      CONFIRMED: "Confirmado",
      PREPARING: "Preparando",
      READY: "Pronto",
      OUT_FOR_DELIVERY: "Saiu para entrega",
      DELIVERED: "Entregue",
      CANCELLED: "Cancelado",
    };
    return texts[status as keyof typeof texts] || status;
  };

  const activeOrders = orders.filter(order => 
    !["DELIVERED", "CANCELLED"].includes(order.status)
  );
  
  const orderHistory = orders.filter(order => 
    ["DELIVERED", "CANCELLED"].includes(order.status)
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-amber-600">GooBurger</h1>
              <span className="ml-4 text-gray-600">Bem-vindo, {session?.user?.name}!</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-900"
              >
                Fazer pedido
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("active")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "active"
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pedidos Ativos ({activeOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Histórico ({orderHistory.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {(activeTab === "active" ? activeOrders : orderHistory).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {activeTab === "active" 
                  ? "Você não tem pedidos ativos" 
                  : "Você ainda não fez nenhum pedido"}
              </div>
              <button
                onClick={() => router.push("/")}
                className="mt-4 bg-amber-500 text-white px-6 py-2 rounded hover:bg-amber-600"
              >
                Fazer pedido
              </button>
            </div>
          ) : (
            (activeTab === "active" ? activeOrders : orderHistory).map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Pedido #{order.id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    {order.estimatedTime && !["DELIVERED", "CANCELLED"].includes(order.status) && (
                      <p className="text-sm text-gray-600 mt-1">
                        Tempo estimado: {order.estimatedTime} min
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Itens:</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.burger.image}
                            alt={item.burger.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{item.burger.name}</p>
                            <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">R$ {item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Endereço de entrega:</p>
                      <p className="font-medium">{order.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total:</p>
                      <p className="text-xl font-bold text-amber-600">R$ {order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}