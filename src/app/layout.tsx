'use client';

import './globals.css';
import { store } from '@/app/store';
import { Provider } from 'react-redux';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/app-header';
import { FirebaseClientProvider } from '@/firebase';

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
        className={'min-h-screen bg-background font-body antialiased'}
      >
        <Provider store={store}>
          <FirebaseClientProvider>
            <div className="relative flex min-h-screen flex-col">
              <AppHeader />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </FirebaseClientProvider>
        </Provider>
      </body>
    </html>
  );
}
