import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

import { cookies } from 'next/headers';
import { verifyContextToken } from '@/lib/auth';
import ContextModal from '@/components/ContextModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PreSales Box',
  description: 'Tools for PreSales Consultants',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const contextCookie = cookieStore.get('presales_user_context');

  let role = null;
  if (contextCookie) {
    role = await verifyContextToken(contextCookie.value);
  }

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-background text-foreground`}>
        {!role && <ContextModal />}
        <Sidebar userRole={role} />
        <main className="flex-1 overflow-auto p-4 pt-20 md:p-8 relative">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
