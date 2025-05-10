"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  User,
  LogIn,
  PlusCircle,
  Search,
  LogOut,
  Heart,
  Bell,
  Settings,
  HelpCircle
} from "lucide-react";
import { AuthUser } from "@/types/auth";
import { cn } from "@/lib/utils";
import { useClientTranslation } from "@/i18n/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface MobileNavProps {
  isAuthenticated: boolean;
  user: AuthUser | null;
  navItems: { title: string; href: string; icon: React.ReactNode }[];
  onClose: () => void;
  onLogout?: () => void;
  locale: "en" | "ru";
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isAuthenticated,
  user,
  navItems,
  onClose,
  onLogout,
  locale
}) => {
  const pathname = usePathname();
  const { t } = useClientTranslation(locale);

  const authItems = isAuthenticated
    ? [
        {
          title: t("header.profile"),
          href: "/profile",
          icon: <User className="mr-2 h-4 w-4" />,
        },
        {
          title: t("header.myListings"),
          href: "/profile/announcements",
          icon: <Search className="mr-2 h-4 w-4" />,
        },
        {
          title: t("header.favorites"),
          href: "/profile/favorites",
          icon: <Heart className="mr-2 h-4 w-4" />,
        },
        {
          title: t("header.notifications"),
          href: "/profile/notifications",
          icon: <Bell className="mr-2 h-4 w-4" />,
        },
        {
          title: t("header.myResponses"),
          href: "/profile/responses",
          icon: <PlusCircle className="mr-2 h-4 w-4" />,
        },
        {
          title: t("header.postListing"),
          href: "/profile/add/announcements",
          icon: <PlusCircle className="mr-2 h-4 w-4" />,
        },
      ]
    : [
        {
          title: t("header.login"),
          href: "/login",
          icon: <LogIn className="mr-2 h-4 w-4" />,
        },
        {
          title: t("header.register"),
          href: "/register",
          icon: <User className="mr-2 h-4 w-4" />,
        },
      ];

  // Add general items that should appear for all users
  const generalItems = [
    {
      title: t("header.help"),
      href: "/help",
      icon: <HelpCircle className="mr-2 h-4 w-4" />,
    },
    {
      title: t("header.settings"),
      href: "/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background">
      <div className="relative z-20 rounded-md">
        {/* User info if authenticated */}
        {isAuthenticated && user && (
          <div className="mb-4 p-4 rounded-lg bg-accent/20">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user.photoUrl || ""}
                  alt={user.firstName || ""}
                />
                <AvatarFallback>
                  {user.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-muted-foreground truncate max-w-[200px]">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main navigation items */}
        <div className="grid grid-flow-row auto-rows-max text-sm">
          <h3 className="font-semibold mb-2 px-2">{t("header.menu")}</h3>
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start h-10",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
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
        </div>

        <Separator className="my-4" />

        {/* User-specific items */}
        <div className="grid grid-flow-row auto-rows-max text-sm">
          <h3 className="font-semibold mb-2 px-2">
            {isAuthenticated ? t("header.myAccount") : t("header.account")}
          </h3>
          {authItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start h-10",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
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
        </div>

        <Separator className="my-4" />

        {/* General items */}
        <div className="grid grid-flow-row auto-rows-max text-sm">
          <h3 className="font-semibold mb-2 px-2">{t("header.more")}</h3>
          {generalItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start h-10",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
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
        </div>

        {/* Logout button for authenticated users */}
        {isAuthenticated && onLogout && (
          <>
            <Separator className="my-4" />
            <Button
              variant="destructive"
              className="w-full mt-2"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("header.logout")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};