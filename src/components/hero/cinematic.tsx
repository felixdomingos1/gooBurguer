"use client";

import { useRef, useState } from "react";
import { Burger } from "@/lib/types/burgers";
import { motion } from "framer-motion";
import OrderForm from "../OrderForm/OrderForm";
import { HeroButtons } from "../HeroButtons";
import { HeroContent } from "../HeroContent";
import { HeroImage } from "../HeroImage";
import Header from "../Header";

interface HeroProps {
  burger: Burger;
}

export default function CinematicHero({ burger }: HeroProps) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [cartItems, setCartItems] = useState<Burger[]>([]);

  const [isHeaderTransparent, setIsHeaderTransparent] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const handleOrderNow = () => {
    setShowOrderForm(true);
  };

  const handleAddToCart = () => {
    console.log("Add to cart clicked for", burger.name);
  };

  const imagePath = burger.image
    ? `http://localhost:3000${burger.image}`
    : "/img/default-burger.jpg";

  return (
    <section
      className="relative w-full h-[90vh] min-h-[600px] max-h-[1200px] overflow-hidden"
      style={{ marginTop: '-4rem' }} // Compensa o header
    >
      <Header cartCount={cartItems.length} isTransparent={isHeaderTransparent} />

      <HeroImage imagePath={imagePath} alt={burger.name} />

      <div className="absolute inset-0 z-10 flex items-center justify-center pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="space-y-6 sm:space-y-8 relative z-20">
            <HeroContent
              name={burger.name}
              description={burger.description || "A delicious burger made with premium ingredients"}
              price={burger.price}
            />
            <HeroButtons
              onOrderNow={handleOrderNow}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>

      {showOrderForm && (
        <OrderForm
          burger={burger}
          onClose={() => setShowOrderForm(false)}
        />
      )}

      <motion.div
        className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-amber-400 blur-xl opacity-70 z-0"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 0.4, 0.7]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-6 h-6 rounded-full bg-orange-500 blur-xl opacity-50 z-0"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.5, 0.2, 0.5]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-red-500 blur-lg opacity-60 z-0"
        animate={{
          y: [0, -20, 0],
          opacity: [0.6, 0.3, 0.6]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </section>
  );
}