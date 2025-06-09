// app/layout.tsx
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}