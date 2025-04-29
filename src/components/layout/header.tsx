// src/components/layout/header.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Home,
  User,
  LogIn,
  PlusCircle,
  Search,
  Menu,
  X,
  Globe,
} from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { useAppSelector } from "@/lib/hooks/redux-hooks";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/ui/search-bar";

const Header = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locale, setLocale] = useState<"en" | "ru">("en");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Translations for navigation items
  const navItems = [
    {
      title: locale === "en" ? "Home" : "Главная",
      href: "/me",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: locale === "en" ? "Listings" : "Объявления",
      href: "/apartments",
      icon: <Search className="mr-2 h-4 w-4" />,
    },
  ];

  // Check if we're on the homepage
  const isHomePage = pathname === "/me";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-6">
            <span className="font-bold text-xl text-primary">coli</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Link href={item.href}>
                  <span className="flex items-center">
                    {item.icon}
                    {item.title}
                  </span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        {/* Search Bar - Hide on homepage */}
        {!isHomePage && (
          <div className="hidden md:flex mx-4 flex-1 max-w-md">
            <SearchBar locale={locale} />
          </div>
        )}

        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">
                  {locale === "en" ? "Switch Language" : "Переключить язык"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLocale("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale("ru")}>
                Русский
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />

          {isAuthenticated ? (
            <>
              <Button variant="outline" asChild className="hidden md:flex">
                <Link href="/profile/add/announcements">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {locale === "en" ? "Post a Listing" : "Разместить объявление"}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.photoUrl || ""}
                        alt={user?.firstName || ""}
                      />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>{locale === "en" ? "Profile" : "Профиль"}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/announcements">
                      <Search className="mr-2 h-4 w-4" />
                      <span>
                        {locale === "en" ? "My Listings" : "Мои объявления"}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/responses">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>
                        {locale === "en" ? "My Responses" : "Мои отклики"}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/logout">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>{locale === "en" ? "Logout" : "Выйти"}</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="hidden md:flex">
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                {locale === "en" ? "Login" : "Войти"}
              </Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <MobileNav
          isAuthenticated={isAuthenticated}
          user={user}
          navItems={navItems}
          onClose={toggleMenu}
        />
      )}
    </header>
  );
};

export { Header };
