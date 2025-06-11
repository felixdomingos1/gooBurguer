"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SMOKE_POSITIONS = Array.from({ length: 6 }, (_, i) => ({
    top: 20 + Math.sin(i * 1.2) * 25,
    left: 25 + Math.cos(i * 0.8) * 40,
    delay: i * 0.5
}));

const SPARKS_POSITIONS = Array.from({ length: 12 }, (_, i) => ({
    top: 40 + Math.sin(i * 0.6) * 35,
    left: 30 + Math.cos(i * 1.1) * 35,
    emoji: ['⚡', '🔥', '💥', '✨'][i % 4]
}));

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
    const router = useRouter();

    useEffect(() => {
        // Log do erro para debugging
        console.error('Erro capturado:', error);
    }, [error]);

    const handleRetry = () => {
        // Tenta resetar o erro primeiro
        reset();
        // Se não funcionar, recarrega a página
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-25"
                style={{
                    backgroundImage: "url('/burgers/classic-beef.jpg')",
                    filter: "blur(6px) saturate(0.5)"
                }}
            />

            <div className="absolute inset-0 z-1 bg-gradient-to-br from-red-600/30 via-orange-500/20 to-yellow-600/30 animate-gradient-shift" />

            <div className="relative z-10 w-full max-w-2xl">
                {/* Card com efeito de vidro */}
                <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                    {/* Cabeçalho com efeito neon */}
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg animate-pulse">
                            🔥 Algo deu errado!
                        </h1>
                    </div>

                    <div className="p-8">
                        {/* Hambúrguer "queimado" animado */}
                        <div className="relative flex justify-center mb-8">
                            <div className="relative w-48 h-48">
                                <img
                                    src="/burgers/classic-beef.jpg"
                                    alt="Hambúrguer com problema"
                                    className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-red-500 shadow-lg animate-shake filter saturate-50 brightness-75"
                                />
                                
                                {/* Efeito de fumaça */}
                                {SMOKE_POSITIONS.map((pos, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-8 h-8 bg-gray-400 rounded-full opacity-60 animate-smoke-rise"
                                        style={{
                                            top: `${pos.top}%`,
                                            left: `${pos.left}%`,
                                            animationDelay: `${pos.delay}s`
                                        }}
                                    />
                                ))}

                                {/* Efeito de faíscas */}
                                <div className="absolute inset-0 rounded-full animate-pulse bg-red-500 opacity-20" />
                                <div className="absolute inset-0 rounded-full animate-ping-slow opacity-30 bg-orange-500" />
                            </div>

                            {/* Ícones de problemas voando */}
                            {SPARKS_POSITIONS.map((pos, i) => (
                                <div
                                    key={i}
                                    className={`absolute text-2xl opacity-80 animate-spark-${i % 4}`}
                                    style={{
                                        top: `${pos.top}%`,
                                        left: `${pos.left}%`,
                                    }}
                                >
                                    {pos.emoji}
                                </div>
                            ))}
                        </div>

                        {/* Mensagem de erro */}
                        <div className="text-center mb-8">
                            <p className="text-xl md:text-2xl text-white font-semibold mb-4 animate-fade-in">
                                Ops! Nossa cozinha teve um pequeno acidente!
                            </p>
                            <p className="text-red-200 text-lg mb-4 animate-fade-in-delay">
                                Algo inesperado aconteceu enquanto preparávamos sua experiência.
                            </p>
                            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6 animate-fade-in">
                                <p className="text-red-200 text-sm">
                                    <strong>Detalhes técnicos:</strong> {error?.message || 'Erro interno do servidor'}
                                </p>
                            </div>
                            <p className="text-white/80 text-sm animate-fade-in">
                                Não se preocupe, nossos chefs já estão trabalhando para resolver!
                            </p>
                        </div>

                        {/* Botões de ação */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleRetry}
                                className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 animate-bounce-light"
                            >
                                🔄 Tentar Novamente
                            </button>
                            <Link
                                href="/"
                                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-center"
                            >
                                🏠 Voltar ao Início
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos de animação customizados */}
            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                @keyframes smoke-rise {
                    0% {
                        transform: translateY(0) scale(0.5);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(-100px) scale(1.5);
                        opacity: 0;
                    }
                }
                
                @keyframes spark-0 {
                    0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
                    25% { transform: translateX(10px) translateY(-10px) rotate(90deg); }
                    50% { transform: translateX(-5px) translateY(-20px) rotate(180deg); }
                    75% { transform: translateX(-10px) translateY(-5px) rotate(270deg); }
                }
                
                @keyframes spark-1 {
                    0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
                    25% { transform: translateX(-15px) translateY(-5px) rotate(45deg); }
                    50% { transform: translateX(10px) translateY(-15px) rotate(180deg); }
                    75% { transform: translateX(5px) translateY(-25px) rotate(315deg); }
                }
                
                @keyframes spark-2 {
                    0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
                    25% { transform: translateX(20px) translateY(-15px) rotate(120deg); }
                    50% { transform: translateX(-10px) translateY(-30px) rotate(240deg); }
                    75% { transform: translateX(-5px) translateY(-10px) rotate(360deg); }
                }
                
                @keyframes spark-3 {
                    0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
                    25% { transform: translateX(-8px) translateY(-20px) rotate(60deg); }
                    50% { transform: translateX(15px) translateY(-8px) rotate(180deg); }
                    75% { transform: translateX(8px) translateY(-35px) rotate(300deg); }
                }
                
                .animate-shake {
                    animation: shake 0.5s ease-in-out infinite;
                }
                
                .animate-smoke-rise {
                    animation: smoke-rise 3s ease-out infinite;
                }
                
                .animate-spark-0 {
                    animation: spark-0 2s ease-in-out infinite;
                }
                
                .animate-spark-1 {
                    animation: spark-1 2.5s ease-in-out infinite;
                }
                
                .animate-spark-2 {
                    animation: spark-2 3s ease-in-out infinite;
                }
                
                .animate-spark-3 {
                    animation: spark-3 1.8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}