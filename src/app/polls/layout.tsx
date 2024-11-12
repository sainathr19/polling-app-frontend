"use client";
import {useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const router = useRouter();
    const {isAuthenticated} = useAuth();
    useLayoutEffect(() => {
      if (!isAuthenticated) {
        router.push("/auth/signin");
      }
    }, [isAuthenticated, router]);
  return children;
}
