import type { Metadata } from 'next';
import { Inter, Rajdhani } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WallSplat.gg — Tekken 8 Pro Leaderboard & Player Stats',
  description: 'Track the Top 25 professional Tekken 8 players, view individual fighter analytics, match histories, and compare players head-to-head. Sourced from the official Tekken World Tour.',
  keywords: ['Tekken 8', 'Leaderboard', 'TWT', 'Tekken World Tour', 'Arslan Ash', 'Ulsan', 'Atif Butt', 'FGC', 'Fighter Stats'],
  openGraph: {
    title: 'WallSplat.gg — Tekken 8 Pro Leaderboard',
    description: 'Track the Top 25 professional Tekken 8 players, view individual fighter analytics, match histories, and compare players head-to-head.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${rajdhani.variable}`}>
      <body className="flex flex-col min-h-screen text-gray-100 antialiased bg-[#0A0A0A]">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-[#2A2A2A] bg-[#0A0A0ARedirect] bg-opacity-95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded bg-[#C8102E] flex items-center justify-center font-bold text-lg tekken-heading transform group-hover:scale-105 group-hover:rotate-6 transition-transform">
                  WS
                </div>
                <span className="text-xl tekken-heading tracking-wider font-extrabold select-none">
                  Wall<span className="text-[#C8102E]">Splat</span><span className="text-[#888888]">.gg</span>
                </span>
              </Link>
            </div>

            {/* Menu Links */}
            <nav className="flex items-center gap-6" id="navbar-navigation">
              <Link
                id="nav-link-leaderboard"
                href="/"
                className="text-sm font-semibold hover:text-[#C8102E] tracking-wider uppercase transition-colors"
              >
                Leaderboard
              </Link>
              <Link
                id="nav-link-compare"
                href="/compare"
                className="text-sm font-semibold hover:text-[#C8102E] tracking-wider uppercase transition-colors"
              >
                Compare H2H
              </Link>
              <Link
                id="nav-link-admin"
                href="/admin"
                className="px-3 py-1 text-xs font-bold bg-[#1A1A1A] hover:bg-[#C8102E] border border-[#2A2A2A] hover:border-transparent rounded uppercase tracking-wider transition-all"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#2A2A2A] bg-[#0F0F0F] py-8 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} WallSplat.gg. All tournament data parsed from Liquipedia.</p>
            <p className="tracking-wide">
              Made for the <span className="text-[#C8102E] font-semibold">Fighting Game Community</span> (FGC).
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
