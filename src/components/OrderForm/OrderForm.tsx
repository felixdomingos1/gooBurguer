// components/OrderForm/OrderForm.tsx
"use client";

import { Burger } from "@/lib/types/burgers";
import { motion } from "framer-motion";

interface OrderFormProps {
  burger: Burger;
  onClose: () => void;
}

export default function OrderForm({ burger, onClose }: OrderFormProps) {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Pedir {burger.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <img 
            src={burger.image ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${burger.image}` : "/img/default-burger.jpg"} 
            alt={burger.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">{burger.description}</p>
          <p className="text-xl font-bold text-amber-600">AOA {burger.price.toFixed(2)}</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Quantidade</label>
            <input 
              type="number" 
              min="1" 
              defaultValue="1"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Observações</label>
            <textarea 
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              placeholder="Alguma observação especial?"
            />
          </div>
          
          <button
            type="button"
            className="w-full bg-amber-500 text-white py-3 rounded-md font-bold hover:bg-amber-600 transition"
          >
            Adicionar ao Carrinho
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}