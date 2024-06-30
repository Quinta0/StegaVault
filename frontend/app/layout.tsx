import './globals.css';
import { Manrope } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from '@/components/NavBar';
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { AuthProvider } from '../context/AuthContext';

const fontHeading = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata = {
  title: 'StegaVault',
  description: 'Secure password management with steganography',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable,
        )}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NavBar />
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
