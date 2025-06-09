import AuthInitializer from '@/components/AuthInitializer';
import '@/app/globals.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </body>
    </html>
  )
}