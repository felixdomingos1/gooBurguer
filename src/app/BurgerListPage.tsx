"use client";

import { useState, useEffect, useRef } from "react";
import { Burger } from "@/lib/types/burgers";
import CinematicHero from "@/components/hero/cinematic";
import BurgerCard from "@/components/burgerCard/card";
import Header from "@/components/Header";

export default function BurgerListPage({ initialBurgers }: { initialBurgers: Burger[] }) {
    const [burgers, setBurgers] = useState<Burger[]>(initialBurgers || []);
    const [currentHeroBurger, setCurrentHeroBurger] = useState<Burger | null>(initialBurgers.length > 0 ? initialBurgers[0] : null);
    const [isLoading, setIsLoading] = useState(!initialBurgers.length); // Initialize based on initialBurgers
    const [cartItems, setCartItems] = useState<Burger[]>([]);
    const [isHeaderTransparent, setIsHeaderTransparent] = useState(true);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!initialBurgers.length) {
            fetch('/api/burgers?page=1')
                .then(res => res.json())
                .then(data => {
                    setBurgers(data.results);
                    if (data.results.length > 0) {
                        setCurrentHeroBurger(data.results[0]);
                    }
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [initialBurgers]);

    useEffect(() => {
        if (burgers.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentHeroBurger(prev => {
                const currentIndex = burgers.findIndex(b => b.id === prev?.id);
                const nextIndex = (currentIndex + 1) % burgers.length;
                return burgers[nextIndex];
            });
        }, 8000);

        return () => clearInterval(interval);
    }, [burgers]);
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
    const addToCart = (burger: Burger) => {
        setCartItems([...cartItems, burger]);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Header cartCount={0} isTransparent={isHeaderTransparent} />
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

    if (!burgers.length) {
        return (
            <div className="min-h-screen">
                <Header cartCount={cartItems.length} isTransparent={isHeaderTransparent} />
                <div className="container mx-auto px-4 py-8 pt-24 text-center">
                    <h1 className="text-3xl font-bold mb-4">No Burgers Found</h1>
                    <p className="text-gray-600">We couldn't find any burgers to display.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header cartCount={cartItems.length} isTransparent={isHeaderTransparent} />
            {currentHeroBurger && (
                <CinematicHero
                    burger={currentHeroBurger}
                    key={currentHeroBurger.id}
                />
            )}

            <div className="container mx-auto px-4 py-8 pt-24">
                <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Nossos deliciosos Hamburgers</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {burgers.map((burger: Burger) => (
                        <BurgerCard key={burger.id} burger={burger} onAddToCart={() => addToCart(burger)} />
                    ))}
                </div>
            </div>
        </div>
    );
}