import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SettingsProvider } from '@/context/settings-provider';
import AppHeader from '@/components/app-header';

export const metadata: Metadata = {
  title: 'WeatherWise Dashboard',
  description: 'An intelligent weather analytics dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <SettingsProvider>
          <div className="relative flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </SettingsProvider>
      </body>
    </html>
  );
}
