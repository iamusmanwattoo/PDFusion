import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'PDFusion - Merge Your PDFs Instantly',
  description: 'A simple and fast web app to merge multiple PDF files into one.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.has('auth-token');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex flex-col min-h-screen">
                <Header isAuthenticated={isAuthenticated} />
                <main className="flex-grow pt-16 flex flex-col">
                    {children}
                </main>
                <Footer />
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
