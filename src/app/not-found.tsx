"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 8000); // Aumentei para 8 segundos para dar tempo de apreciar as animações

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url('/burgers/veggie-supreme.jpg')",
          filter: "blur(4px)"
        }}
      />
      
      {/* Overlay colorido animado */}
      <div className="absolute inset-0 z-1 bg-gradient-to-br from-amber-500/20 via-red-600/20 to-purple-700/20 animate-gradient-shift" />

      {/* Conteúdo principal */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Card com efeito de vidro */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Cabeçalho com efeito neon */}
          <div className="bg-gradient-to-r from-amber-500 to-red-600 p-6 text-white text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg animate-pulse">
              404 - Página não encontrada
            </h1>
          </div>
          
          <div className="p-8">
            {/* Hambúrguer animado */}
            <div className="relative flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <img
                  src="/burgers/veggie-supreme.jpg"
                  alt="Hambúrguer especial"
                  className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-amber-400 shadow-lg animate-float"
                />
                {/* Efeito de explosão de sabores */}
                <div className="absolute inset-0 rounded-full animate-ping-slow opacity-30 bg-amber-400" />
                <div className="absolute inset-0 rounded-full animate-ping-slow-delay opacity-30 bg-red-500" />
              </div>
              
              {/* Ícones de ingredientes voando */}
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className={`absolute text-2xl opacity-80 animate-ingredient-${i % 4}`}
                  style={{
                    top: `${Math.random() * 30 + 35}%`,
                    left: `${Math.random() * 30 + 35}%`,
                  }}
                >
                  {['🍅', '🧀', '🥬', '🧅', '🥓', '🍄', '🥒', '🥑'][i]}
                </div>
              ))}
            </div>

            {/* Mensagem */}
            <div className="text-center mb-8">
              <p className="text-xl md:text-2xl text-white font-semibold mb-4 animate-fade-in">
                Ops! O hambúrguer que você pediu fugiu do cardápio!
              </p>
              <p className="text-amber-200 text-lg mb-6 animate-fade-in-delay">
                Mas temos muitos outros sabores explosivos esperando por você!
              </p>
              <p className="text-white/80 text-sm animate-fade-in">
                Redirecionando para a página inicial em alguns segundos...
              </p>
            </div>

            {/* Botão com efeito hover */}
            <Link
              href="/"
              className="block mx-auto w-fit px-8 py-3 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 animate-bounce-light"
            >
              Explorar Cardápio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}