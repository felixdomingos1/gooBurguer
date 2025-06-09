import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/jwt'

const protectedRoutes = ['/admin']
const authRoutes = ['/login']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth')?.value
    const { pathname } = request.nextUrl

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route))

    const isAuthRoute = authRoutes.includes(pathname)

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/gooburger', request.url))
    }

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/?auth=login', request.url))
        }

        const payload = verifyToken(token)
        if (!payload) {
            const response = NextResponse.redirect(new URL('/?auth=login', request.url))
            response.cookies.delete('auth')
            return response
        }

        // Verifica se o usuário tem permissão para a rota admin
        if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
    }

    return NextResponse.next()
}