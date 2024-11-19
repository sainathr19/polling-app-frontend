"use client";
import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import RootProvider from "@/providers/RootProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <ErrorBoundary>
          <RootProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </RootProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
