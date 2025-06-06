"use client";

import { Burger } from "@/lib/types/burgers";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface HeroProps {
  burger: Burger;
}

interface HeroImageProps {
  imagePath: string;
  alt: string;
}

interface HeroContentProps {
  name: string;
  description: string;
  price: number;
}

interface HeroButtonsProps {
  onOrderNow: () => void;
  onAddToCart: () => void;
}

const HeroImage = ({ imagePath, alt }: HeroImageProps) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <motion.div className="absolute inset-0" style={{ y }}>
      <Image
        src={imagePath || "/img/default-burger.jpg"}
        alt={alt}
        fill
        className="object-cover"
        priority
        quality={100}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
    </motion.div>
  );
};

const HeroContent = ({ name, description, price }: HeroContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-4 max-w-2xl lg:max-w-3xl"
    >
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {name}
      </motion.h1>

      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <span className="text-xl sm:text-2xl font-bold text-amber-400">
          ${price.toFixed(2)}
        </span> 
      </motion.div>

      <motion.p
        className="text-sm sm:text-base text-gray-300 line-clamp-3 sm:line-clamp-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        {description}
      </motion.p>
 
    </motion.div>
  );
};

const HeroButtons = ({ onOrderNow, onAddToCart }: HeroButtonsProps) => {
  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-white font-semibold hover:shadow-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        onClick={onOrderNow}
      >
        <span className="text-lg">🍔</span>
        <span>Order Now</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-semibold border border-white/20 hover:bg-white/20 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        onClick={onAddToCart}
      >
        <span className="text-lg">🛒</span>
        <span>Add to Cart</span>
      </motion.button>
    </motion.div>
  );
};

export default function CinematicHero({ burger }: HeroProps) {
  const imagePath = burger.image
    ? `http://localhost:3000${burger.image}`
    : "/img/default-burger.jpg"; 

  const handleOrderNow = () => {
    console.log("Order now clicked for", burger.name);
  };

  const handleAddToCart = () => {
    console.log("Add to cart clicked for", burger.name);
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
      <HeroImage imagePath={imagePath} alt={burger.name} />
      
      <div className="container relative z-20 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
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

      {/* Floating elements for cinematic effect - burger themed */}
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