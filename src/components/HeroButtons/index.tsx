"use client";

import { motion } from "framer-motion";

interface HeroButtonsProps {
  onOrderNow: () => void;
  onAddToCart: () => void;
}

export const HeroButtons = ({ onOrderNow, onAddToCart }: HeroButtonsProps) => {
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
        <span>Pedir Agora</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-semibold border border-white/20 hover:bg-white/20 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        onClick={onAddToCart}
      >
        <span className="text-lg">🛒</span>
        <span>Adicionar ao carrinho</span>
      </motion.button>
    </motion.div>
  );
};