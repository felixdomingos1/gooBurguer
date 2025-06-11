"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  // Animação para seções
  const sectionAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-96 w-full">
        <Image
          src="/img/about-hero.jpg"
          alt="Sobre nós"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex   items-center justify-evenly flex-col text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Nossa História</h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Do sonho à realidade, nossa paixão por hambúrgueres artesanais
            </p>
          </motion.div>
          <button className="font-bold py-3 px-8 rounded-lg  cursor-pointer">
            <Link href="/" className="flex items-center justify-center text-white">
              Ir para o Início
            </Link>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionAnimation}
          className="grid md:grid-cols-2 gap-12 items-center mb-24"
        >
          <div>
            <Image
              src="/img/about-story.jpg"
              alt="Nossa história"
              width={600}
              height={400}
              className="rounded-xl shadow-xl"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Como tudo começou</h2>
            <p className="text-gray-600 mb-4">
              Em 2015, dois amigos apaixonados por gastronomia decidiram trazer para Luanda um conceito diferente de hambúrguer artesanal.
            </p>
            <p className="text-gray-600 mb-6">
              Hoje, somos referência em hambúrgueres gourmet, com mais de 20 opções no cardápio e milhares de clientes satisfeitos.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-bold text-amber-600 text-xl">+10.000</h3>
                <p className="text-gray-600">Clientes satisfeitos</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-bold text-amber-600 text-xl">50+</h3>
                <p className="text-gray-600">Combinações únicas</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionAnimation}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Conheça nosso time</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Profissionais apaixonados por gastronomia e atendimento de qualidade
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Carlos Silva", role: "Chef Executivo", image: "/img/team1.jpg" },
              { name: "Ana Sousa", role: "Gerente", image: "/img/team2.jpg" },
              { name: "Miguel Costa", role: "Chef de Cozinha", image: "/img/team3.jpg" },
              { name: "Luísa Fernandes", role: "Atendimento", image: "/img/team4.jpg" },
            ].map((person, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-900">{person.name}</h3>
                <p className="text-amber-600">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}