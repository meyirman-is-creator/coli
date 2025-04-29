"use client";

import React from "react";
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
import { Home, User, LogIn, PlusCircle, Search, Menu, X } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { useAppSelector } from "@/lib/hooks/redux-hooks";
import { cn } from "@/lib/utils";

const Header = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { title: "Главная", href: "/", icon: <Home className="mr-2 h-4 w-4" /> },
    {
      title: "Объявления",
      href: "/apartments",
      icon: <Search className="mr-2 h-4 w-4" />,
    },
  ];

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

        <div className="flex items-center space-x-2">
          <ModeToggle />

          {isAuthenticated ? (
            <>
              <Button variant="outline" asChild className="hidden md:flex">
                <Link href="/profile/add/announcements">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Разместить объявление
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
                      <span>Профиль</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/announcements">
                      <Search className="mr-2 h-4 w-4" />
                      <span>Мои объявления</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/responses">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Мои отклики</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/logout">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Выйти</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="hidden md:flex">
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Войти
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
