import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { generateToken } from '@/lib/jwt'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            )
        }

        let isValid = false
        if (!user.password.startsWith('$2b$')) {
            isValid = user.password === password
            if (isValid) {
                console.warn('AVISO: Usuário com senha não hashada - ', user.email)
            }
        } else {
            isValid = await bcrypt.compare(password, user.password)
        }

        if (!isValid) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            )
        }

        const { password: _, ...userWithoutPassword } = user

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        })

        return NextResponse.json({
            user: userWithoutPassword,
            token: token
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}