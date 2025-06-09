"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
  type: "login" | "register";
}

export default function AuthModal({ show, onClose, type }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, clearError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (type === "login") {
      const success = await login(email, password)
      if (success) {
        onClose()
        const { user } = useAuthStore.getState()
        if (user?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/gooburger')
        }
      }
    } else {

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            address,
            phone,
            role: "USER",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Erro no cadastro");
          setIsLoading(false);
          return;
        }

        const loginResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginResult?.error) {
          setError("Registro concluído, mas falha no login automático");
          setIsLoading(false);
          return;
        }

        onClose();
        router.push("/gooburger");
      } catch (error) {
        console.error("Registration error:", error);
        setError("Erro no cadastro");
      }
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setAddress("");
    setPhone("");
    setError("");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {type === "login" ? "Login" : "Cadastro"}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "register" && (
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          {type === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Endereço</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading
              ? type === "login"
                ? "Entrando..."
                : "Cadastrando..."
              : type === "login"
                ? "Entrar"
                : "Cadastrar"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          {type === "login" ? (
            <>
              Não tem uma conta?{" "}
              <button
                onClick={() => {
                  resetForm();
                  router.push("?auth=register");
                }}
                className="text-amber-500 hover:underline"
                disabled={isLoading}
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <button
                onClick={() => {
                  resetForm();
                  router.push("?auth=login");
                }}
                className="text-amber-500 hover:underline"
                disabled={isLoading}
              >
                Faça login
              </button>
            </>
          )}
        </div> 
      </div>
    </div>
  );
}