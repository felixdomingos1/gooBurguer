"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Burger } from '@/lib/types/burgers';
import { QRCodeSVG } from 'qrcode.react';
import { FiX, FiShoppingBag, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

interface BurgerCardProps {
    burger: Burger;
}

const BurgerCard: React.FC<BurgerCardProps> = ({ burger }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pathimage = burger.image ? `http://localhost:3000${burger.image}` : '/img/default-burger.jpg';
    
    const handleOrderClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    const closeModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsModalOpen(false);
    };

    const generateWhatsAppLink = () => {
        const message = `Olá, gostaria de pedir: ${burger.name}\n\nPreço: ${burger.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\nDescrição: ${burger.description}`;
        return `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    };

    return (
        <>
            <div 
                className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] relative"
                onClick={handleOrderClick}
                aria-label={`Pedir ${burger.name}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleOrderClick(e as any)}
            >
                <div className="relative h-48 w-full">
                    <Image
                        src={pathimage}
                        alt={burger.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={burger.isFeatured}
                    />
                    {burger.isFeatured && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                            DESTAQUE
                        </div>
                    )}
                </div>
                <div className="px-6 py-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-gray-900">{burger.name}</h3>
                        <div className="flex flex-col items-end">
                            <span className="text-lg font-semibold text-gray-900">
                                {burger.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                            {burger.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    {burger.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-700 text-base line-clamp-2">{burger.description}</p>
                </div>
                <div className="px-6 pt-2 pb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {burger.tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="flex items-center mr-4">
                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="ml-1 text-sm text-gray-600">
                                    {burger.ratingAverage?.toFixed(1) || 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FiClock className="text-gray-500 mr-1" size={14} />
                                <span className="text-sm text-gray-600">{burger.preparationTime} min</span>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOrderClick(e);
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                            aria-label={`Botão para pedir ${burger.name}`}
                        >
                            <FiShoppingBag className="mr-2" />
                            Pedir
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Pedido */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div 
                        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <button 
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-1 shadow"
                                aria-label="Fechar modal"
                            >
                                <FiX size={24} />
                            </button>
                            <div className="relative h-48 w-full">
                                <Image
                                    src={pathimage}
                                    alt={burger.name}
                                    fill
                                    className="object-cover rounded-t-xl"
                                    sizes="100vw"
                                    priority
                                />
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{burger.name}</h2>
                            
                            <div className="flex items-center mb-4">
                                <span className="text-xl font-semibold text-gray-900 mr-3">
                                    {burger.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                                {burger.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                        {burger.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-gray-700 mb-6">{burger.description}</p>
                            
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Informações</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <FiClock className="text-gray-500 mr-2" />
                                        <span>{burger.preparationTime} min</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span>{burger.ratingAverage?.toFixed(1) || 'N/A'} ({burger.ratingCount || 0})</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Escaneie para pedir pelo WhatsApp</h3>
                                <div className="flex justify-center">
                                    <div className="p-4 bg-white rounded-lg border border-gray-200 inline-block">
                                        <QRCodeSVG 
                                            value={generateWhatsAppLink()} 
                                            size={150} 
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Ou clique no botão abaixo</p>
                            </div>
                            
                            <a
                                href={generateWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                                aria-label="Pedir pelo WhatsApp"
                            >
                                <FaWhatsapp size={20} className="mr-2" />
                                Pedir pelo WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BurgerCard;