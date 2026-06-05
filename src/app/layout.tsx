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
        <header className="sticky top-0 z-50 border-b border-[#2A2A2A] bg-[#0A0A0A] bg-opacity-95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded bg-[#C8102E] flex items-center justify-center font-bold text-lg tekken-heading transform group-hover:scale-105 group-hover:rotate-6 transition-transform">
                  WS
                </div>
                <span className="text-lg sm:text-xl tekken-heading tracking-wider font-extrabold select-none">
                  Wall<span className="text-[#C8102E]">Splat</span><span className="text-[#888888]">.gg</span>
                </span>
              </Link>
            </div>

            {/* Menu Links */}
            <nav className="flex items-center gap-3 sm:gap-6" id="navbar-navigation">
              <Link
                id="nav-link-leaderboard"
                href="/"
                className="text-xs sm:text-sm font-semibold hover:text-[#C8102E] tracking-wider uppercase transition-colors"
              >
                Leaderboard
              </Link>
              <Link
                id="nav-link-compare"
                href="/compare"
                className="text-xs sm:text-sm font-semibold hover:text-[#C8102E] tracking-wider uppercase transition-colors"
              >
                Compare H2H
              </Link>
              <Link
                id="nav-link-admin"
                href="/admin"
                className="px-2 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold bg-[#1A1A1A] hover:bg-[#C8102E] border border-[#2A2A2A] hover:border-transparent rounded uppercase tracking-wider transition-all"
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
            
            <div className="flex items-center gap-3">
              <span className="tracking-wide">
                Made by <span className="text-white font-semibold">Asad</span>
              </span>
              <a
                href="https://github.com/asadnaeem-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                aria-label="GitHub Profile"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                </svg>
              </a>
            </div>

            <p className="tracking-wide">
              Made for the <span className="text-[#C8102E] font-semibold">Fighting Game Community</span> (FGC).
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
