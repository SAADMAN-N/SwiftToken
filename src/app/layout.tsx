import { Inter } from "next/font/google";
import { Navbar } from "./components/navigation/Navbar";
import { ComingSoonBanner } from "./components/ComingSoonBanner";
import "./globals.css";
import { ClientProvider } from '@/providers/ClientProvider';
import { ClientWalletProvider } from '@/providers/WalletProvider';
import { metadata } from './metadata';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <ClientWalletProvider>
          <ClientProvider>
            <header className="border-b border-gray-200 dark:border-gray-800">
              <Navbar />
            </header>
            <main className="flex-1">
              {children}
            </main>
            <ComingSoonBanner />
          </ClientProvider>
        </ClientWalletProvider>
      </body>
    </html>
  );
}
