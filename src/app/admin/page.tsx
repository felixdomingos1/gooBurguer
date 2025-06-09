"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit, FiTrash2, FiUpload, FiImage } from 'react-icons/fi';
import { Burger, BurgerCategory } from '@/lib/types/burgers';

export default function BurgersAdminPanel() {
    const [burgers, setBurgers] = useState<Burger[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBurger, setCurrentBurger] = useState<Partial<Burger> | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchBurgers();
    }, []);

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

        formData.append('images',
            typeof currentBurger.images === 'string'
                ? currentBurger.images
                : JSON.stringify(currentBurger.images || []));

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
                // Adicionar ao formData no submit
            } else {
                const newPreviews = [...additionalImagesPreview, URL.createObjectURL(file)];
                setAdditionalImagesPreview(newPreviews);
                // Adicionar ao formData no submit
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gerenciar Hambúrgueres</h1>
                <button
                    onClick={() => {
                        setCurrentBurger({
                            name: '',
                            description: '',
                            price: 0,
                            category: 'CLASSIC',
                            isAvailable: true,
                            isFeatured: false,
                            isNew: false,
                            preparationTime: 15,
                            ingredients: JSON.stringify([]),
                            tags: JSON.stringify([]),
                        });
                        setIsModalOpen(true);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded flex items-center"
                >
                    <FiPlus className="mr-2" /> Adicionar Hambúrguer
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </div>
            ) : (
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
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(burger.price)}
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

            {/* Modal para adicionar/editar hambúrguer */}
            {isModalOpen && currentBurger && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
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