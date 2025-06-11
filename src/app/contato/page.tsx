"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function ContactPage() {
  const formAnimation = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Animação para informações
  const infoAnimation = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 w-full bg-gray-800 ">
        <div className="absolute inset-0 bg-black/60 flex items-center justify-evenly flex-col text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Fale Conosco</h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              A GooBurger está aqui para responder suas dúvidas e receber seu feedback
            </p>
          </motion.div>
          <button className="font-bold py-3 px-8 rounded-lg  cursor-pointer">
            <Link href="/" className="flex items-center justify-center text-white">
              Ir para o Início
            </Link>
          </button>
        </div>
      </div>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={formAnimation}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie uma mensagem</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option>Selecione um assunto</option>
                  <option>Dúvida sobre cardápio</option>
                  <option>Feedback</option>
                  <option>Parcerias</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Escreva sua mensagem aqui..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Enviar Mensagem
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={infoAnimation}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações de Contato</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-amber-500 mt-1 mr-4" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Endereço</h3>
                    <p className="text-gray-600">Av. 21 de Janeiro, Talatona<br />Luanda, Angola</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaPhone className="text-amber-500 mt-1 mr-4" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Telefone</h3>
                    <p className="text-gray-600">+244 999 999 999</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaWhatsapp className="text-amber-500 mt-1 mr-4" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                    <p className="text-gray-600">+244 929 781 171</p>
                    <a
                      href="https://wa.me/244929781171"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 mt-1 inline-block"
                    >
                      Enviar mensagem
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaClock className="text-amber-500 mt-1 mr-4" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Horário de Funcionamento</h3>
                    <p className="text-gray-600">
                      Segunda a Sexta: 10h - 22h<br />
                      Sábado e Domingo: 11h - 23h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white p-4 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 w-full h-64 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.715897835849!2d13.231215315785865!3d-8.9985351935422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a521f0c2a7eaa9b%3A0x3dd8d5d8e9a8d5b7!2sTalatona%2C%20Luanda%2C%20Angola!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}