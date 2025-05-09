"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks/redux-hooks";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ModeToggle } from "@/components/common/mode-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Public paths that don't require redirection
  const publicAuthPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify",
    "/verify-email",
  ];

  // If user is authenticated, redirect to home from auth pages
  useEffect(() => {
    const isAuthPath = publicAuthPaths.some(path => pathname.startsWith(path));
    
    if (isAuthenticated && isAuthPath) {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-4 right-4 flex items-center space-x-2 z-50">
        <LanguageSwitcher locale={locale} setLocale={setLocale} />
        <ModeToggle />
      </div>
      
      {children}
    </div>
  );
}