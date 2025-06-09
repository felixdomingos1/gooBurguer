import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Se não estiver autenticado e tentar acessar área protegida
    if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/gooburger"))) {
      return NextResponse.redirect(new URL("/?auth=login", req.url));
    }

    // Se for admin tentando acessar área de usuário
    if (pathname.startsWith("/gooburger") && token?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Se for usuário tentando acessar área de admin
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/gooburger", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Permitir acesso à página inicial e rotas de auth
        if (pathname === "/" || pathname.startsWith("/api/auth")) {
          return true;
        }
        
        // Rotas protegidas requerem token
        if (pathname.startsWith("/admin") || pathname.startsWith("/gooburger")) {
          return !!token;
        }
        
        return true;
      },
    },
    pages: {
      signIn: "/?auth=login",
      error: "/?auth=login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/gooburger/:path*",
  ],
};