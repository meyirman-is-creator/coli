"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, User, LogIn, PlusCircle, Search } from "lucide-react";
import { AuthUser } from "@/types/auth";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isAuthenticated: boolean;
  user: AuthUser | null;
  navItems: { title: string; href: string; icon: React.ReactNode }[];
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isAuthenticated,
  user,
  navItems,
  onClose,
}) => {
  const pathname = usePathname();

  const authItems = isAuthenticated
    ? [
        {
          title: "Профиль",
          href: "/profile",
          icon: <User className="mr-2 h-4 w-4" />,
        },
        {
          title: "Мои объявления",
          href: "/profile/announcements",
          icon: <Search className="mr-2 h-4 w-4" />,
        },
        {
          title: "Мои отклики",
          href: "/profile/responses",
          icon: <PlusCircle className="mr-2 h-4 w-4" />,
        },
        {
          title: "Разместить объявление",
          href: "/profile/add/announcements",
          icon: <PlusCircle className="mr-2 h-4 w-4" />,
        },
        {
          title: "Выйти",
          href: "/auth/logout",
          icon: <LogIn className="mr-2 h-4 w-4" />,
        },
      ]
    : [
        {
          title: "Войти",
          href: "/auth/login",
          icon: <LogIn className="mr-2 h-4 w-4" />,
        },
        {
          title: "Регистрация",
          href: "/auth/register",
          icon: <User className="mr-2 h-4 w-4" />,
        },
      ];

  const allItems = [...navItems, ...authItems];

  return (
    <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background">
      <div className="relative z-20 rounded-md p-4">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {allItems.map((item, index) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
                index > 0 ? "mt-2" : ""
              )}
              onClick={onClose}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};
