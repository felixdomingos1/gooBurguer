"use client";

import { useState, useEffect, useRef } from "react";
import { Burger } from "@/lib/types/burgers";
import BurgerCard from "@/components/burgerCard/card";
import Header from "@/components/Header";
import BurgerHero from "@/components/hero/cinematic";

export default function BurgerListPage({ initialBurgers }: { initialBurgers: Burger[] }) {
    const [burgers, setBurgers] = useState<Burger[]>(initialBurgers || []);
    const [isLoading, setIsLoading] = useState(!initialBurgers.length);
    const [cartItems, setCartItems] = useState<Burger[]>([]);
    const [isHeaderTransparent, setIsHeaderTransparent] = useState(true);
    const heroRef = useRef<HTMLDivElement>(null);
    const [heroHeight, setHeroHeight] = useState(0);

    useEffect(() => {
        if (!initialBurgers.length) {
            fetch('/api/burgers?page=1')
                .then(res => res.json())
                .then(data => {
                    setBurgers(data.results);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [initialBurgers]);

    useEffect(() => {
        const handleScroll = () => {
            if (!heroRef.current) return;
            const heroHeight = heroRef.current.offsetHeight;
            const scrollPosition = window.scrollY;
            setIsHeaderTransparent(scrollPosition < heroHeight * 0.8);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (heroRef.current) {
            setHeroHeight(heroRef.current.offsetHeight);
        }
    }, []);
    const addToCart = (burger: Burger) => {
        setCartItems(prev => [...prev, burger]);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Header isTransparent={isHeaderTransparent}  heroHeight={heroHeight} />
                <div className="container mx-auto px-4 py-8 pt-24">
                    <div className="h-screen min-h-[600px] max-h-[1200px] bg-gray-200 animate-pulse rounded-lg mb-8" />
                    <div className="h-12 w-1/3 bg-gray-200 animate-pulse rounded mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (burgers.length === 0) {
        return (
            <div className="min-h-screen">
                <Header isTransparent={isHeaderTransparent}  heroHeight={heroHeight} />
                <div className="container mx-auto px-4 py-8 pt-24 text-center">
                    <h1 className="text-3xl font-bold mb-4">Nenhum Hamburger encontrado</h1>
                    <p className="text-gray-600">Não encontramos hambúrgueres para exibir.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header isTransparent={isHeaderTransparent}  heroHeight={heroHeight} />

            <div ref={heroRef}>
                <BurgerHero burgers={burgers} onAddToCart={addToCart} />
            </div>

            <div className="container mx-auto px-4 py-8 pt-12">
                <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Nossos deliciosos Hamburgers</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {burgers.map((burger: Burger) => (
                        <BurgerCard key={burger.id} burger={burger} />
                    ))}
                </div>
            </div>
        </div>
    );
}