"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initializeAuth, isAuthenticated, isLoading, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Se não estiver autenticado, redireciona para login
      router.push('/?auth=login')
    } else if (!isLoading && isAuthenticated) {
      // Se estiver autenticado, redireciona conforme o role
      if (user?.role === 'ADMIN' && !window.location.pathname.startsWith('/admin')) {
        router.push('/admin')
      } else if (user?.role !== 'ADMIN' && window.location.pathname.startsWith('/admin')) {
        router.push('/unauthorized')
      }
    }
  }, [isLoading, isAuthenticated, router, user?.role])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return <>{children}</>
}