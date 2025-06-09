"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Burger } from "@/lib/types/burgers";
import { Button } from "../ui/button";

interface BurgerHeroProps {
  burgers: Burger[];
  onAddToCart: (burger: Burger) => void;
}

interface HeroProps {
  burger: Burger;
}

export default function BurgerHero({ burgers, onAddToCart }: BurgerHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Efeito para rotacionar os hambúrgueres automaticamente
  useEffect(() => {
    if (burgers.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % burgers.length);
        setIsTransitioning(false);
      }, 500); // Tempo da animação de transição
    }, 8000); // Troca a cada 8 segundos

    return () => clearInterval(interval);
  }, [burgers.length]);

  if (burgers.length === 0) return null;

  const currentBurger = burgers[currentIndex];
  const hasDiscount = currentBurger.originalPrice !== null;

  const imagePath = currentBurger.image
    ? `http://localhost:3000${currentBurger.image}`
    : "/img/default-burger.jpg";
  "use client";

  return (
    <section className="relative h-screen max-h-[800px] min-h-[600px] w-full overflow-hidden">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imagePath}
          alt={currentBurger.name}
          fill
          className={`object-cover transition-opacity duration-500 ${isTransitioning ? "opacity-30" : "opacity-100"
            }`}
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Conteúdo */}
      <div className="container relative z-10 flex h-full items-center px-4">
        <div
          className={`max-w-2xl text-white transition-all duration-500 ${isTransitioning ? "translate-x-[-50px] opacity-0" : "translate-x-0 opacity-100"
            }`}
        >
          {currentBurger.tags?.includes("new") && (
            <span className="mb-4 inline-block rounded-full bg-green-500 px-4 py-1 text-sm font-bold uppercase">
              Novo!
            </span>
          )}

          <h1 className="mb-4 text-5xl font-bold drop-shadow-lg md:text-6xl lg:text-7xl">
            {currentBurger.name}
          </h1>

          <p className="mb-6 text-lg drop-shadow-md md:text-xl">
            {currentBurger.description}
          </p>

          <div className="mb-8 flex items-center gap-4">
            <div className="flex items-baseline gap-2">
              {hasDiscount && (
                <span className="text-xl line-through opacity-70">
                  R$ {currentBurger.originalPrice?.toFixed(2)}
                </span>
              )}
              <span className="text-3xl font-bold">
                R$ {currentBurger.price.toFixed(2)}
              </span>
            </div>

            {currentBurger.calories && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                {currentBurger.calories} kcal
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => onAddToCart(currentBurger)}
              className="bg-green-900 hover:bg-primary/90"
            >
              Pedir Agora
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              Personalizar
            </Button>
          </div>
        </div>
      </div>

      {/* Indicadores */}
      {burgers.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
          {burgers.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }}
              className={`h-2 w-8 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              aria-label={`Ir para ${burgers[index].name}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}