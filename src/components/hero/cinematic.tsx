"use client";


import { useState } from "react";
import { Burger } from "@/lib/types/burgers";
import { motion, useScroll, useTransform } from "framer-motion";
import OrderForm from "../OrderForm/OrderForm";
import { HeroButtons } from "../HeroButtons";
import { HeroContent } from "../HeroContent";
import { HeroImage } from "../HeroImage";

interface HeroProps {
  burger: Burger;
}

export default function CinematicHero({ burger }: HeroProps) {
  const [showOrderForm, setShowOrderForm] = useState(false);

  const handleOrderNow = () => {
    setShowOrderForm(true);
  };



  const imagePath = burger.image
    ? `http://localhost:3000${burger.image}`
    : "/img/default-burger.jpg";

  const handleAddToCart = () => {
    console.log("Add to cart clicked for", burger.name);
  };

  return (
    <section className="relative h-[100vh] min-h-[500px] max-h-[800px] overflow-hidden">
      <HeroImage imagePath={imagePath} alt={burger.name} />

      <div className="container relative z-20 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <HeroContent
            name={burger.name}
            description={burger.description || "A delicious burger made with premium ingredients"}
            price={burger.price}
          />
          <HeroButtons
            onOrderNow={handleOrderNow}
            onAddToCart={handleAddToCart}
          />
        <div className="space-y-6 sm:space-y-8">
        </div>
      </div>
      {
        showOrderForm && (
          <OrderForm
            burger={burger}
            onClose={() => setShowOrderForm(false)}
          />
        )
      }
      <motion.div
        className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-amber-400 blur-xl opacity-70"
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
        className="absolute bottom-1/3 right-1/3 w-6 h-6 rounded-full bg-orange-500 blur-xl opacity-50"
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
        className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-red-500 blur-lg opacity-60"
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