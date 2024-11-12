"use client";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <AuthProvider>
        <Toaster />
        <Navbar />
        <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
