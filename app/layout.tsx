import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PreSales Consultant Toolbox',
  description: 'Tools for PreSales Consultants',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-background text-foreground`}>
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 pt-20 md:p-8 relative">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
