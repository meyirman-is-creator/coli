"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  User,
  LogIn,
  PlusCircle,
  Search,
  Menu,
  X,
  Globe,
  LogOut,
} from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/common/search-bar";
import { useClientTranslation } from "@/i18n/client";
import { fetchCities } from "@/store/slices/addressSlice";
import { ModeToggle } from "../common/mode-toggle";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t, i18n } = useClientTranslation(locale);

  // Предзагрузка городов для SearchBar
  useEffect(() => {
    if (!pathname.includes("/me")) {
      dispatch(fetchCities());
    }
  }, [dispatch, pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = (lang: "en" | "ru") => {
    setLocale(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("locale", lang); // Сохраняем выбор в localStorage
  };

  // Navigation items with translations
  const navItems = [
    {
      title: t("header.home"),
      href: "/me",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: t("header.listings"),
      href: "/",
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
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t("header.switchLanguage")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className={cn(
                  locale === "en" && "bg-accent text-accent-foreground"
                )}
                onClick={() => changeLanguage("en")}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(
                  locale === "ru" && "bg-accent text-accent-foreground"
                )}
                onClick={() => changeLanguage("ru")}
              >
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
                  {t("header.postListing")}
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
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.firstName && (
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                      )}
                      {user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("header.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile/announcements"
                      className="cursor-pointer"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <span>{t("header.myListings")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/responses" className="cursor-pointer">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>{t("header.myResponses")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/logout" className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t("header.logout")}</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="hidden md:flex">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                {t("header.login")}
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
          locale={locale}
        />
      )}
    </header>
  );
};

export { Header };
