"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit, FiTrash2, FiUpload, FiImage, FiPackage, FiUsers, FiClock, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { Burger, BurgerCategory } from '@/lib/types/burgers';

// Tipos para pedidos
interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    burger: {
        name: string;
        image: string;
    };
}

interface Order {
    id: string;
    status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
    total: number;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
    user: {
        name: string;
        email: string;
    };
}

type TabType = 'burgers' | 'orders';

const ORDER_STATUS_LABELS = {
    PENDING: 'Pendente',
    PREPARING: 'Preparando',
    READY: 'Pronto',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado'
};

const ORDER_STATUS_COLORS = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PREPARING: 'bg-blue-100 text-blue-800',
    READY: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800'
};

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<TabType>('burgers');
    const [burgers, setBurgers] = useState<Burger[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBurger, setCurrentBurger] = useState<Partial<Burger> | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);
    const router = useRouter();
    const [newOrderNotification, setNewOrderNotification] = useState<Order | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const previousOrdersCount = useRef(0);

    useEffect(() => {
        if (activeTab === 'burgers') {
            fetchBurgers();
        } else {
            fetchOrders();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'orders') {
            const interval = setInterval(() => {
                fetchOrders();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [activeTab]);

    const fetchBurgers = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/burgers');
            if (res.ok) {
                const data = await res.json();
                setBurgers(data);
            }
        } catch (error) {
            console.error('Error fetching burgers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();

                if (data.length > previousOrdersCount.current) {
                    const newOrders = data.slice(0, data.length - previousOrdersCount.current);
                    if (newOrders.length > 0) {
                        showNewOrderAlert(newOrders[0]);
                    }
                }

                previousOrdersCount.current = data.length;
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const showNewOrderAlert = (order: Order) => {
        setNewOrderNotification(order);
        setShowNotification(true);

        // Esconde a notificação após 5 segundos
        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
    };

    const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                fetchOrders(); // Recarregar pedidos
            } else {
                console.error('Error updating order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentBurger) return;

        const formData = new FormData();
        if (currentBurger.name) formData.append('name', currentBurger.name);
        if (currentBurger.description) formData.append('description', currentBurger.description);
        if (currentBurger.price) formData.append('price', currentBurger.price.toString());
        if (currentBurger.category) formData.append('category', currentBurger.category);
        if (currentBurger.preparationTime) formData.append('preparationTime', currentBurger.preparationTime.toString());
        formData.append('ingredients',
            typeof currentBurger.ingredients === 'string'
                ? currentBurger.ingredients
                : JSON.stringify(currentBurger.ingredients || []));

        formData.append('tags',
            typeof currentBurger.tags === 'string'
                ? currentBurger.tags
                : JSON.stringify(currentBurger.tags || []));

        const imageInput = document.getElementById('mainImageUpload') as HTMLInputElement;
        if (imageInput?.files?.[0]) {
            formData.append('image', imageInput.files[0]);
        }

        const additionalImagesInput = document.getElementById('additionalImagesUpload') as HTMLInputElement;
        if (additionalImagesInput?.files) {
            Array.from(additionalImagesInput.files).forEach(file => {
                formData.append('additionalImages', file);
            });
        }
        formData.append('isAvailable', currentBurger.isAvailable ? 'true' : 'false');
        formData.append('isFeatured', currentBurger.isFeatured ? 'true' : 'false');
        formData.append('isNew', currentBurger.isNew ? 'true' : 'false');

        try {
            let res;
            if (currentBurger.id) {
                res = await fetch(`/api/admin/burgers/${currentBurger.id}`, {
                    method: 'PUT',
                    body: formData,
                });
            } else {
                res = await fetch('/api/admin/burgers', {
                    method: 'POST',
                    body: formData,
                });
            }

            if (res.ok) {
                fetchBurgers();
                setIsModalOpen(false);
                setCurrentBurger(null);
                setImagePreview(null);
                setAdditionalImagesPreview([]);
            }
        } catch (error) {
            console.error('Error saving burger:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este hambúrguer?')) {
            try {
                const res = await fetch(`/api/admin/burgers/${id}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    fetchBurgers();
                }
            } catch (error) {
                console.error('Error deleting burger:', error);
            }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMainImage = true) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (isMainImage) {
                setImagePreview(URL.createObjectURL(file));
            } else {
                const newPreviews = [...additionalImagesPreview, URL.createObjectURL(file)];
                setAdditionalImagesPreview(newPreviews);
            }
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'PENDING': return <FiClock className="w-4 h-4" />;
            case 'PREPARING': return <FiAlertCircle className="w-4 h-4" />;
            case 'READY': return <FiCheck className="w-4 h-4" />;
            case 'DELIVERED': return <FiPackage className="w-4 h-4" />;
            case 'CANCELLED': return <FiX className="w-4 h-4" />;
            default: return <FiClock className="w-4 h-4" />;
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* Navegação por Tabs */} {showNotification && newOrderNotification && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center">
                        <FiPackage className="mr-2" />
                        <div>
                            <p className="font-bold">Novo Pedido Recebido!</p>
                            <p>Pedido #{newOrderNotification.id.slice(-8)} - {newOrderNotification.user.name}</p>
                        </div>
                        <button
                            onClick={() => setShowNotification(false)}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            <FiX />
                        </button>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('burgers')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'burgers'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <FiPackage className="inline mr-2" />
                        Hambúrgueres
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'orders'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <FiUsers className="inline mr-2" />
                        Pedidos
                    </button>
                </div>

                {activeTab === 'burgers' && (
                    <button
                        onClick={() => {
                            setCurrentBurger({
                                name: '',
                                description: '',
                                price: 0,
                                originalPrice: null,
                                category: 'CLASSIC',
                                isAvailable: true,
                                isFeatured: false,
                                isNew: false,
                                preparationTime: 15,
                                calories: null,
                                ingredients: JSON.stringify([]),
                                tags: JSON.stringify([]),
                                images: JSON.stringify([]),
                                ratingAverage: 0,
                                ratingCount: 0
                            });
                            setIsModalOpen(true);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded flex items-center"
                    >
                        <FiPlus className="mr-2" /> Adicionar Hambúrguer
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </div>
            ) : (
                <>
                    {/* Conteúdo da Tab de Hambúrgueres */}
                    {activeTab === 'burgers' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {burgers.map((burger) => (
                                        <tr key={burger.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full" src={burger.image} alt={burger.name} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{burger.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {burger.category}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(burger.price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${burger.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {burger.isAvailable ? 'Disponível' : 'Indisponível'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => {
                                                        setCurrentBurger(burger);
                                                        setImagePreview(burger.image);
                                                        setAdditionalImagesPreview(JSON.parse(burger.images));
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="text-amber-600 hover:text-amber-900 mr-4"
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(burger.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Conteúdo da Tab de Pedidos */}
                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Gerenciar Pedidos</h2>
                                <p className="text-sm text-gray-500">Total de pedidos: {orders.length}</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID do Pedido</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{order.id.slice(-8)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                                                    <div className="text-sm text-gray-500">{order.user.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        {order.items.map((item, index) => (
                                                            <div key={index} className="flex items-center space-x-2">
                                                                <img
                                                                    src={item.burger.image}
                                                                    alt={item.burger.name}
                                                                    className="w-6 h-6 rounded-full"
                                                                />
                                                                <span className="text-sm text-gray-900">
                                                                    {item.quantity}x {item.burger.name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(order.total)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                                                        {getStatusIcon(order.status)}
                                                        <span className="ml-1">{ORDER_STATUS_LABELS[order.status]}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString('pt-AO')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                                                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                    >
                                                        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                                                            <option key={value} value={value}>
                                                                {label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal para adicionar/editar hambúrguer */}
            {isModalOpen && currentBurger && (
                <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                {currentBurger.id ? 'Editar Hambúrguer' : 'Adicionar Hambúrguer'}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nome</label>
                                            <input
                                                type="text"
                                                value={currentBurger.name || ''}
                                                onChange={(e) => setCurrentBurger({ ...currentBurger, name: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                            <textarea
                                                value={currentBurger.description || ''}
                                                onChange={(e) => setCurrentBurger({ ...currentBurger, description: e.target.value })}
                                                rows={3}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Preço</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={currentBurger.price || 0}
                                                onChange={(e) => setCurrentBurger({ ...currentBurger, price: parseFloat(e.target.value) })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Categoria</label>
                                            <select
                                                value={currentBurger.category || 'CLASSIC'}
                                                onChange={(e) => setCurrentBurger({ ...currentBurger, category: e.target.value as BurgerCategory })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                            >
                                                {Object.values(BurgerCategory).map((category) => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Preço Original (opcional)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={currentBurger.originalPrice || ''}
                                                onChange={(e) => setCurrentBurger({
                                                    ...currentBurger,
                                                    originalPrice: e.target.value ? parseFloat(e.target.value) : null
                                                })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>

                                        {/* Novo campo: Tempo de Preparação */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tempo de Preparação (minutos)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={currentBurger.preparationTime || 15}
                                                onChange={(e) => setCurrentBurger({
                                                    ...currentBurger,
                                                    preparationTime: parseInt(e.target.value)
                                                })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            />
                                        </div>

                                        {/* Novo campo: Calorias */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Calorias (opcional)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={currentBurger.calories || ''}
                                                onChange={(e) => setCurrentBurger({
                                                    ...currentBurger,
                                                    calories: e.target.value ? parseInt(e.target.value) : null
                                                })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Imagem Principal</label>
                                            <div className="mt-1 flex items-center">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                                                ) : (
                                                    <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center">
                                                        <FiImage className="text-gray-400" size={24} />
                                                    </div>
                                                )}
                                                <label className="ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 cursor-pointer">
                                                    <FiUpload className="inline mr-2" />
                                                    Upload
                                                    <input
                                                        id='mainImageUpload'
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e) => handleImageUpload(e, true)}
                                                        accept="image/*"
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Imagens Adicionais</label>
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                {additionalImagesPreview.map((img, index) => (
                                                    <img key={index} src={img} alt={`Preview ${index}`} className="h-20 w-20 object-cover rounded" />
                                                ))}
                                                <label className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center cursor-pointer">
                                                    <FiPlus size={24} className="text-gray-400" />
                                                    <input
                                                        id='additionalImagesUpload'
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e) => handleImageUpload(e, false)}
                                                        accept="image/*"
                                                        multiple
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="isAvailable"
                                                    type="checkbox"
                                                    checked={currentBurger.isAvailable || false}
                                                    onChange={(e) => setCurrentBurger({ ...currentBurger, isAvailable: e.target.checked })}
                                                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                                                    Disponível
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    id="isFeatured"
                                                    type="checkbox"
                                                    checked={currentBurger.isFeatured || false}
                                                    onChange={(e) => setCurrentBurger({ ...currentBurger, isFeatured: e.target.checked })}
                                                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                                                    Destaque
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    id="isNew"
                                                    type="checkbox"
                                                    checked={currentBurger.isNew || false}
                                                    onChange={(e) => setCurrentBurger({ ...currentBurger, isNew: e.target.checked })}
                                                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700">
                                                    Novo
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ingredientes (JSON)</label>
                                    <textarea
                                        value={typeof currentBurger.ingredients === 'string'
                                            ? currentBurger.ingredients
                                            : JSON.stringify(currentBurger.ingredients || [], null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                setCurrentBurger({ ...currentBurger, ingredients: parsed });
                                            } catch {
                                                setCurrentBurger({ ...currentBurger, ingredients: e.target.value });
                                            }
                                        }}
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Insira como array JSON, ex: ["Pão", "Carne 120g", "Queijo"]
                                    </p>
                                </div>

                                {/* Novo campo: Tags (como JSON) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tags (JSON)</label>
                                    <textarea
                                        value={typeof currentBurger.tags === 'string'
                                            ? currentBurger.tags
                                            : JSON.stringify(currentBurger.tags || [], null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                setCurrentBurger({ ...currentBurger, tags: parsed });
                                            } catch {
                                                setCurrentBurger({ ...currentBurger, tags: e.target.value });
                                            }
                                        }}
                                        rows={2}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Insira como array JSON, ex: ["promoção", "novidade"]
                                    </p>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-amber-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}