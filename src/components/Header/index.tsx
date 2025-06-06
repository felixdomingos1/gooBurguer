"use client";

import { useState, useEffect } from "react";
import { FiMenu, FiX, FiShoppingCart, FiHome, FiInfo, FiPhone, FiUser } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthModal from "../AuthModal";


interface HeaderProps {
  cartCount: number;
  isTransparent?: boolean;
} 

export default function Header({ cartCount, isTransparent = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authType = searchParams.get("auth");

  const showLogin = authType === "login";
  const showRegister = authType === "register";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClose = () => {
    router.push("/");
  };

  return (
    <>
      <header className={`fixed w-full z-50 transition-colors duration-300 ${isTransparent ? 'bg-transparent text-white' : 'bg-white text-gray-900 shadow-md'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-500">Goo</span>
              <span className="text-2xl font-bold text-amber-500">Burger</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-amber-400 transition-colors flex items-center gap-1">
                <FiHome className="text-lg" /> Inicio
              </Link>
              <Link href="/about" className="text-white hover:text-amber-400 transition-colors flex items-center gap-1">
                <FiInfo className="text-lg" /> Sobre
              </Link>
              <Link href="/contact" className="text-white hover:text-amber-400 transition-colors flex items-center gap-1">
                <FiPhone className="text-lg" /> Contata-nos
              </Link>

              {/* Auth Links */}
              {session ? (
                <>
                  {session.user.role === "ADMIN" ? (
                    <Link
                      href="/admin/dashboard"
                      className="text-white hover:text-amber-400 transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/my-orders"
                      className="text-white hover:text-amber-400 transition-colors"
                    >
                      Meus Pedidos
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-white hover:text-amber-400 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("?auth=login")}
                    className="text-white hover:text-amber-400 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push("?auth=register")}
                    className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                  >
                    Register
                  </button>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiShoppingCart className="text-white text-xl cursor-pointer hover:text-amber-400 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <button 
                className="md:hidden text-white focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-lg rounded-lg mt-4 p-4 animate-fadeIn">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="text-white hover:text-amber-400 transition-colors flex items-center gap-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiHome className="text-lg" /> Home
                </Link>
                <Link 
                  href="/menu" 
                  className="text-white hover:text-amber-400 transition-colors flex items-center gap-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="text-lg" /> Menu
                </Link>
                <Link 
                  href="/about" 
                  className="text-white hover:text-amber-400 transition-colors flex items-center gap-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiInfo className="text-lg" /> About
                </Link>
                <Link 
                  href="/contact" 
                  className="text-white hover:text-amber-400 transition-colors flex items-center gap-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiPhone className="text-lg" /> Contact
                </Link>

                {/* Auth Links Mobile */}
                {session ? (
                  <>
                    {session.user.role === "ADMIN" ? (
                      <Link
                        href="/admin/dashboard"
                        className="text-white hover:text-amber-400 transition-colors flex items-center gap-2 py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/my-orders"
                        className="text-white hover:text-amber-400 transition-colors flex items-center gap-2 py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Meus Pedidos
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="text-white hover:text-amber-400 transition-colors flex items-center gap-2 py-2 text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        router.push("?auth=login");
                        setIsMenuOpen(false);
                      }}
                      className="text-white hover:text-amber-400 transition-colors flex items-center gap-2 py-2 text-left"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        router.push("?auth=register");
                        setIsMenuOpen(false);
                      }}
                      className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors text-left"
                    >
                      Register
                    </button>
                  </>
                )}
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