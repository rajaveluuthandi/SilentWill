import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SilentWill — Digital Inheritance Vault',
  description: 'Secure digital inheritance vault with automatic release logic',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface font-inter text-on-surface">
        {children}
      </body>
    </html>
  );
}
