"use client"
 
export default function AuthGuard({ children, requiredRole }: { 
  children: React.ReactNode 
  requiredRole?: string 
}) { 
 
  return <>{children}</>
}