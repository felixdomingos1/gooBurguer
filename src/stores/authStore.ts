import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { verifyToken } from '@/lib/jwt'

interface User {
  id: string
  email: string
  name: string
  role: string
  address?: string | null
  phone?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
  validateToken: () => boolean
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Inicia como true para carregamento inicial
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Erro ao fazer login')
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          })

          return true
        } catch (error) {
          console.error('Login error:', error)
          set({
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            isLoading: false,
          })
          return false
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },
      
      clearError: () => {
        set({ error: null })
      },

      validateToken: () => {
        const { token } = get()
        if (!token) return false
        
        const payload = verifyToken(token)
        if (!payload) {
          get().logout()
          return false
        }
        
        return true
      },

      initializeAuth: () => {
        const { validateToken } = get()
        const isValid = validateToken()
        
        set({
          isAuthenticated: isValid,
          isLoading: false,
        })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)