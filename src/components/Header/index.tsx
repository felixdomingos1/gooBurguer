"use client";

import { useState, useEffect } from "react";
import { FiMenu, FiX, FiHome, FiInfo, FiPhone, FiUser } from "react-icons/fi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthModal from "../AuthModal";

interface HeaderProps {
  isTransparent?: boolean;
  heroHeight?: number;
}

export default function Header({ isTransparent = false, heroHeight = 0 }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const authType = searchParams.get("auth");

  const showLogin = authType === "login";
  const showRegister = authType === "register";

  useEffect(() => {
    if (!isTransparent) {
      setScrolledPastHero(true);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolledPastHero(scrollPosition > heroHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroHeight, isTransparent]);


  const handleAuthClose = () => {
    router.push("/");
  };

  const textColor = isTransparent && !scrolledPastHero ? 'text-white' : 'text-gray-900';
  const hoverColor = isTransparent && !scrolledPastHero ? 'hover:text-amber-400' : 'hover:text-amber-600';

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${isTransparent && !scrolledPastHero
          ? 'bg-transparent'
          : 'bg-white shadow-md'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className={`text-2xl font-bold ${textColor} transition-colors`}>Goo</span>
              <span className={`text-2xl font-bold text-amber-500 transition-colors`}>Burger</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className={`${textColor} ${hoverColor} transition-colors flex items-center gap-1`}
              >
                <FiHome className="text-lg" /> Inicio
              </Link>
              <Link
                href="/about"
                className={`${textColor} ${hoverColor} transition-colors flex items-center gap-1`}
              >
                <FiInfo className="text-lg" /> Sobre
              </Link>
              <Link
                href="/contact"
                className={`${textColor} ${hoverColor} transition-colors flex items-center gap-1`}
              >
                <FiPhone className="text-lg" /> Contato
              </Link>

              <button
                onClick={() => router.push("?auth=login")}
                className={`${textColor} ${hoverColor} transition-colors`}
              >
                Entrar
              </button>
              <button
                onClick={() => router.push("?auth=register")}
                className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
              >
                Cadastrar
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden ${textColor} focus:outline-none`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className={`md:hidden ${isTransparent && !scrolledPastHero
              ? 'bg-black/95 backdrop-blur-lg'
              : 'bg-white shadow-lg'
              } rounded-lg mt-2 p-4 animate-fadeIn`}>
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className={`${textColor} ${hoverColor} transition-colors flex items-center gap-2 py-2`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiHome className="text-lg" /> Home
                </Link>
                <Link
                  href="/menu"
                  className={`${textColor} ${hoverColor} transition-colors flex items-center gap-2 py-2`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="text-lg" /> Menu
                </Link>
                <Link
                  href="/about"
                  className={`${textColor} ${hoverColor} transition-colors flex items-center gap-2 py-2`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiInfo className="text-lg" /> About
                </Link>
                <Link
                  href="/contact"
                  className={`${textColor} ${hoverColor} transition-colors flex items-center gap-2 py-2`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiPhone className="text-lg" /> Contact
                </Link>
                <button
                  onClick={() => {
                    router.push("?auth=login");
                    setIsMenuOpen(false);
                  }}
                  className={`${textColor} ${hoverColor} transition-colors flex items-center gap-2 py-2 text-left`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => {
                    router.push("?auth=register");
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors text-left"
                >
                  Cadastrar
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        show={showLogin}
        onClose={handleAuthClose}
        type="login"
      />
      <AuthModal
        show={showRegister}
        onClose={handleAuthClose}
        type="register"
      />
    </>
  );
}