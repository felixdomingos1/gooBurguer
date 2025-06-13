"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Burger } from "@/lib/types/burgers";
import { Button } from "../ui/button";

interface BurgerHeroProps {
  burgers: Burger[];
}

interface OrderData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  quantity: number;
}

export default function BurgerHero({ burgers }: BurgerHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [orderData, setOrderData] = useState<OrderData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    notes: '',
    quantity: 1
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({ show: false, success: false, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setOrderData(prev => ({
      ...prev,
      quantity: value
    }));
  };

  const handleSubmitOrder = async (burger: Burger) => {
    // Validação dos campos obrigatórios
    if (!orderData.customerName.trim() || !orderData.customerPhone.trim() || !orderData.customerAddress.trim()) {
      setFeedback({
        show: true,
        success: false,
        message: 'Por favor, preencha todos os campos obrigatórios'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: null,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          customerAddress: orderData.customerAddress,
          address: orderData.customerAddress,
          phone: orderData.customerPhone,
          total: currentBurger.price * orderData.quantity,
          notes: orderData.notes,
          items: [{
            burgerId: currentBurger.id,
            quantity: orderData.quantity,
            price: currentBurger.price,
          }],
        }),
      });

      if (response.ok) {
        setFeedback({
          show: true,
          success: true,
          message: 'Pedido realizado com sucesso! Entraremos em contato em breve.'
        });
        setOrderData({
          customerName: '',
          customerPhone: '',
          customerAddress: '',
          notes: '',
          quantity: 1
        });
        setShowOrderModal(false);
      } else {
        throw new Error('Erro ao realizar pedido');
      }
    } catch (error) {
      console.error('Erro ao realizar pedido:', error);
      setFeedback({
        show: true,
        success: false,
        message: 'Erro ao realizar pedido. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openOrderModal = () => {
    setShowOrderModal(true);
  };

  useEffect(() => {
    if (burgers.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % burgers.length);
        setIsTransitioning(false);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [burgers.length]);

  useEffect(() => {
    if (feedback.show) {
      const timer = setTimeout(() => {
        setFeedback(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback.show]);

  if (burgers.length === 0) return null;

  const currentBurger = burgers[currentIndex];
  const hasDiscount = currentBurger.originalPrice !== null;

  const imagePath = currentBurger.image
    ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${currentBurger.image}`
    : "/img/default-burger.jpg";

  return (
    <section className="relative h-screen max-h-[800px] min-h-[600px] w-full overflow-hidden">
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
                  AOA {currentBurger.originalPrice?.toFixed(2)}
                </span>
              )}
              <span className="text-3xl font-bold">
                AOA {currentBurger.price.toFixed(2)}
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
              onClick={openOrderModal}
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

      {/* Modal de Pedido - Implementação customizada */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Finalizar Pedido</h2>
              <p className="text-gray-600">Preencha seus dados para concluir o pedido de {currentBurger.name}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="customerName" className="mb-1 block text-sm font-medium text-gray-700">
                  Nome*
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  value={orderData.customerName}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="customerPhone" className="mb-1 block text-sm font-medium text-gray-700">
                  Telefone*
                </label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  value={orderData.customerPhone}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="customerAddress" className="mb-1 block text-sm font-medium text-gray-700">
                  Endereço*
                </label>
                <input
                  id="customerAddress"
                  name="customerAddress"
                  type="text"
                  value={orderData.customerAddress}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(orderData.quantity - 1)}
                    disabled={orderData.quantity <= 1}
                    className="h-8 w-8 rounded-md border border-gray-300 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{orderData.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(orderData.quantity + 1)}
                    className="h-8 w-8 rounded-md border border-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={orderData.notes}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  rows={3}
                  placeholder="Sem cebola, ponto da carne, etc."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSubmitOrder(currentBurger)}
                disabled={isSubmitting}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-70"
              >
                {isSubmitting ? "Enviando..." : "Confirmar Pedido"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback.show && (
        <div className={`fixed bottom-4 right-4 z-50 rounded-md p-4 shadow-lg ${feedback.success ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {feedback.message}
        </div>
      )}

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