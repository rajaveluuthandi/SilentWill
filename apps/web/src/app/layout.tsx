import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'SilentWill — Digital Inheritance Vault',
  description: 'Secure digital inheritance vault with automatic release logic',
};

const themeInitScript = `
(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-surface font-inter text-on-surface">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
