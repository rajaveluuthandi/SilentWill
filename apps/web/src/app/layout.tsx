import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SilentWill',
  description: 'Cross-platform app powered by SilentWill',
};

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-indigo-600">SilentWill</h1>
            <nav className="flex gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
