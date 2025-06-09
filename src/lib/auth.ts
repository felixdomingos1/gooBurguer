import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            address?: string | null;
            phone?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: string;
        address?: string | null;
        phone?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        address?: string | null;
        phone?: string | null;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [    
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error("Usuário não encontrado");
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                 if (!isValid) {
                    throw new Error("Senha incorreta");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    address: user.address,
                    phone: user.phone,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.address = user.address;
                token.phone = user.phone;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.address = token.address;
                session.user.phone = token.phone;
            }
            return session;
        },
    },
    
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, 
    },
    
    pages: {
        signIn: "/", 
    },
    
    secret: process.env.NEXTAUTH_SECRET,
};