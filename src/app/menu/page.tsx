"use client";

import BurgerCard from '@/components/burgerCard/card';
import { Burger } from '@/lib/types/burgers';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MenuPage() {
    const [burgers, setBurgers] = useState([]);

    useEffect(() => {
        fetch('/api/burgers?page=1')
            .then(res => res.json())
            .then(data => setBurgers(data.results));
    }, []);
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Animação de itens
    const item = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Nosso <span className="text-amber-500">Cardápio</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Descubra nossos hambúrgueres artesanais feitos com ingredientes frescos e selecionados.
                    </p>
                </motion.div>

                {/* Menu Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {burgers.map((burger: Burger, index) => (
                        <motion.div
                            key={burger.id}
                            variants={item}
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <BurgerCard burger={burger} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-20 bg-amber-500 rounded-xl p-8 md:p-10 text-center"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Não encontrou o que procura?</h2>
                    <p className="text-white mb-6 max-w-2xl mx-auto">
                        Temos opções especiais disponíveis. Fale conosco para pedidos personalizados!
                    </p>
                    <button className="bg-white text-amber-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                        <Link href="/" className="flex items-center justify-center">
                           Fazer Pedido Especial
                        </Link>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}