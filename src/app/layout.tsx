// app/layout.tsx
import { LayoutProvider } from "@/components/providers/LayoutProvider";
import { ToastProvider } from "@/components/common/ui"; // Direct import
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "./layout-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard - My App",
  description: "Professional dashboard application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          <LayoutProvider>
            <LayoutClient>{children}</LayoutClient>
          </LayoutProvider>
        </ToastProvider>
      </body>
    </html>
  );
}