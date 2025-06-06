"use client";

import React from 'react';
import Image from 'next/image';
import { Burger } from '@/lib/types/burgers';

interface BurgerCardProps {
    burger: Burger;
    onAddToCart: () => void;
}

const BurgerCard: React.FC<BurgerCardProps> = ({ burger, onAddToCart }) => {
    const pathimage = burger.image ? `http://localhost:3000${burger.image}` : '/img/default-burger.jpg';
    
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 w-full">
                <Image
                    src={pathimage}
                    alt={burger.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={burger.isFeatured}
                />
            </div>
            <div className="px-6 py-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl">{burger.name}</h3>
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
                <div className="flex flex-wrap gap-2">
                    {burger.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mt-3 flex items-center">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-gray-600">
                            {burger.ratingAverage?.toFixed(1) || 'N/A'} ({burger.ratingCount || 0})
                        </span>
                    </div>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-sm text-gray-600">{burger.preparationTime} min</span>
                </div>
                <button 
                    onClick={onAddToCart}
                    className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default BurgerCard;