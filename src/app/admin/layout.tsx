import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="container mx-auto p-4">
        {children}
      </div>
    </div>
  );
}

function AdminNavbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-amber-600">Painel Admin</h1>
        <div className="flex items-center space-x-4">
          <a href="/admin/burgers" className="text-gray-700 hover:text-amber-600">Hambúrgueres</a>
          <a href="/admin/orders" className="text-gray-700 hover:text-amber-600">Pedidos</a>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-gray-700 hover:text-amber-600">Sair</button>
          </form>
        </div>
      </div>
    </nav>
  );
}