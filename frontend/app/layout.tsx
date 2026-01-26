import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AgeGate } from '../components/AgeGate';

export const metadata: Metadata = {
  title: 'Golden Barrel | Premium Spirits',
  description: 'Luxury liquor shop offering curated whisky, vodka, rum, wine, and beer selections.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Golden Barrel',
    description: 'Premium spirits, curated for connoisseurs.',
    url: 'http://localhost:3000',
    siteName: 'Golden Barrel',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AgeGate />
          <Navbar />
          <main className="min-h-screen pt-24">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}