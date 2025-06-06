"use client";

import { motion } from "framer-motion";

interface HeroContentProps {
  name: string;
  description: string;
  price: number;
}

export const HeroContent = ({ name, description, price }: HeroContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-4 max-w-2xl lg:max-w-3xl"
    >
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
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
        <span className="text-2xl sm:text-3xl font-bold text-amber-400">
          ${price.toFixed(2)}
        </span> 
      </motion.div>

      <motion.p
        className="text-base sm:text-lg text-gray-300 line-clamp-3 sm:line-clamp-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};