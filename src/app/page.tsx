"use client"; // We need to use client because we'll be using state and effects

import BurgerCard from "@/components/burgerCard/card";
import CinematicHero from "@/components/hero/cinematic";
import { Burger } from "@/lib/types/burgers";
import { useEffect, useState } from "react";

export default function BurgerListPage() {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [currentHeroBurger, setCurrentHeroBurger] = useState<Burger | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch burgers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/burgers?page=1');
        const data = await response.json();
        setBurgers(data.results);
        if (data.results.length > 0) {
          setCurrentHeroBurger(data.results[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching burgers:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Rotate hero burger every 8 seconds
  useEffect(() => {
    if (burgers.length <= 1) return;

    const interval = setInterval(() => {
      const currentIndex = burgers.findIndex(b => b.id === currentHeroBurger?.id);
      const nextIndex = (currentIndex + 1) % burgers.length;
      setCurrentHeroBurger(burgers[nextIndex]);
    }, 8000);

    return () => clearInterval(interval);
  }, [burgers, currentHeroBurger]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-[70vh] min-h-[500px] max-h-[800px] bg-gray-200 animate-pulse rounded-lg mb-8" />
        <div className="h-12 w-1/3 bg-gray-200 animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!burgers.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No Burgers Found</h1>
        <p className="text-gray-600">We couldn't find any burgers to display.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {currentHeroBurger && (
        <CinematicHero 
          burger={currentHeroBurger}
          key={currentHeroBurger.id}
        />
      )}
      
      <h1 className="text-3xl font-bold mb-8">Our Delicious Burgers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {burgers.map((burger: Burger) => (
          <BurgerCard key={burger.id} burger={burger} />
        ))}
      </div>
    </div>
  );
}