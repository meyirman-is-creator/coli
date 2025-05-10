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
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  Bell,
  Heart,
  Settings,
  HelpCircle,
  Landmark,
  Moon,
  Sun,
  LayoutGrid,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/common/search-bar"; // Import your updated SearchBar
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();

  // Get auth state from Redux store
  const { user, isAuthenticated, status } = useAppSelector((state) => state.auth);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [scrolled, setScrolled] = useState(false);
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Language switcher
  const changeLanguage = (lang: "en" | "ru") => {
    setLocale(lang);
    localStorage.setItem("locale", lang);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      // In a real app, you would dispatch a logout action
      // await dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigation items
  const navItems = [
    {
      title: locale === "en" ? "Home" : "Главная",
      href: "/me",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      title: locale === "en" ? "Listings" : "Объявления",
      href: "/",
      icon: <Search className="h-4 w-4 mr-2" />,
    },
    {
      title: locale === "en" ? "Map" : "Карта",
      href: "/map",
      icon: <MapPin className="h-4 w-4 mr-2" />,
    },
  ];

  // Check if we're on the homepage
  const isHomePage = pathname === "/me";
  const shouldShowSearchBar = !isHomePage && !pathname.includes("/login") && 
                             !pathname.includes("/register") && 
                             !pathname.includes("/forgot-password");

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border transition-all duration-200",
        scrolled 
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm" 
          : "bg-background"
      )}
    >
      <div className="container-custom mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-6">
              <img src="/logo.svg" alt="Shanyraq Logo" className="h-8 w-auto mr-2" />
              <span className="font-bold text-xl text-primary">Shanyraq</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  asChild
                  className={cn(
                    "transition-colors",
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

          {/* Search Bar - Hide on specific pages */}
          {shouldShowSearchBar && (
            <div className="hidden md:flex mx-4 flex-1 max-w-md">
              <SearchBar locale={locale} variant="compact" />
            </div>
          )}

          <div className="flex items-center space-x-1">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">
                    {locale === "en" ? "Switch Language" : "Сменить язык"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className={cn(
                    "cursor-pointer",
                    locale === "en" && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => changeLanguage("en")}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    "cursor-pointer",
                    locale === "ru" && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => changeLanguage("ru")}
                >
                  Русский
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-2" />
                  Светлая
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-2" />
                  Темная
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Landmark className="h-4 w-4 mr-2" />
                  Системная
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth-dependent UI */}
            {status === "loading" ? (
              // Loading state
              <Button variant="ghost" size="icon" disabled>
                <div className="h-5 w-5 rounded-full border-2 border-foreground/30 border-t-foreground/80 animate-spin" />
              </Button>
            ) : isAuthenticated ? (
              // Authenticated UI
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {notificationsCount > 0 && (
                        <Badge 
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground"
                        >
                          {notificationsCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Уведомления</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[300px] overflow-auto">
                      {[1, 2, 3].map((item) => (
                        <DropdownMenuItem key={item} className="flex items-start p-3 cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <p className="font-medium text-sm">Новый отклик на ваше объявление</p>
                            <p className="text-xs text-muted-foreground">
                              Пользователь проявил интерес к вашему объявлению "2-комнатная квартира"
                            </p>
                            <p className="text-xs text-muted-foreground">5 мин назад</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center cursor-pointer">
                      <Link href="/notifications" className="text-sm text-primary">
                        Посмотреть все
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Favorites */}
                <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
                  <Link href="/favorites">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Add Listing Button */}
                <Button variant="outline" asChild className="hidden md:flex">
                  <Link href="/profile/add/announcements">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {locale === "en" ? "Post Listing" : "Разместить объявление"}
                  </Link>
                </Button>

                {/* User Profile Dropdown */}
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
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user?.photoUrl || ""}
                          alt={user?.firstName || ""}
                        />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
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
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>{locale === "en" ? "Profile" : "Профиль"}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile/announcements"
                          className="cursor-pointer"
                        >
                          <LayoutGrid className="mr-2 h-4 w-4" />
                          <span>{locale === "en" ? "My Listings" : "Мои объявления"}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/favorites" className="cursor-pointer">
                          <Heart className="mr-2 h-4 w-4" />
                          <span>{locale === "en" ? "Favorites" : "Избранное"}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/messages" className="cursor-pointer">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          <span>{locale === "en" ? "Messages" : "Сообщения"}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>{locale === "en" ? "Settings" : "Настройки"}</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{locale === "en" ? "Log out" : "Выйти"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Non-authenticated UI
              <>
                <Button variant="outline" asChild className="hidden md:flex">
                  <Link href="/register">
                    <User className="mr-2 h-4 w-4" />
                    {locale === "en" ? "Register" : "Регистрация"}
                  </Link>
                </Button>
                <Button asChild className="hidden md:flex">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    {locale === "en" ? "Login" : "Войти"}
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <SheetHeader className="px-6 py-4 border-b">
                  <SheetTitle className="text-left">Меню</SheetTitle>
                </SheetHeader>
                
                {/* User profile section if authenticated */}
                {isAuthenticated && user && (
                  <div className="border-b px-6 py-4">
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
                
                {/* Navigation links */}
                <div className="px-2 py-4">
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Button
                          variant={pathname === item.href ? "secondary" : "ghost"}
                          className="justify-start w-full"
                          asChild
                        >
                          <Link href={item.href}>
                            {item.icon}
                            {item.title}
                          </Link>
                        </Button>
                      </SheetClose>
                    ))}
                  </nav>
                  
                  <Separator className="my-4" />
                  
                  {/* User-specific items */}
                  <h3 className="px-4 text-sm font-medium mb-2">
                    {isAuthenticated ? "Аккаунт" : "Пользователь"}
                  </h3>
                  <nav className="flex flex-col gap-1">
                    {isAuthenticated ? (
                      // Authenticated menu items
                      <>
                        <SheetClose asChild>
                          <Button variant="ghost" className="justify-start w-full" asChild>
                            <Link href="/profile">
                              <User className="mr-2 h-4 w-4" />
                              Профиль
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button variant="ghost" className="justify-start w-full" asChild>
                            <Link href="/profile/announcements">
                              <LayoutGrid className="mr-2 h-4 w-4" />
                              Мои объявления
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button variant="ghost" className="justify-start w-full" asChild>
                            <Link href="/favorites">
                              <Heart className="mr-2 h-4 w-4" />
                              Избранное
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button variant="ghost" className="justify-start w-full" asChild>
                            <Link href="/notifications">
                              <Bell className="mr-2 h-4 w-4" />
                              Уведомления
                              {notificationsCount > 0 && (
                                <Badge className="ml-auto">{notificationsCount}</Badge>
                              )}
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button variant="ghost" className="justify-start w-full" asChild>
                            <Link href="/profile/add/announcements">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Разместить объявление
                            </Link>
                          </Button>
                        </SheetClose>
                      </>
                    ) : (
                      // Non-authenticated menu items
                      <>
                        <SheetClose asChild>
                          <Button variant="ghost" className="justify-start w-full" asChild>
                            <Link href="/login">
                              <LogIn className="mr-2 h-4 w-4" />
                              Войти
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button variant="ghost" className="justify-start w-full" asChild>
                            <Link href="/register">
                              <User className="mr-2 h-4 w-4" />
                              Регистрация
                            </Link>
                          </Button>
                        </SheetClose>
                      </>
                    )}
                  </nav>
                  
                  <Separator className="my-4" />
                  
                  {/* Settings and help */}
                  <h3 className="px-4 text-sm font-medium mb-2">
                    Дополнительно
                  </h3>
                  <nav className="flex flex-col gap-1">
                    <SheetClose asChild>
                      <Button variant="ghost" className="justify-start w-full" asChild>
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          Настройки
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" className="justify-start w-full" asChild>
                        <Link href="/help">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Помощь
                        </Link>
                      </Button>
                    </SheetClose>
                  </nav>
                  
                  {/* Theme and language switchers */}
                  <div className="px-4 mt-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant={theme === "light" ? "secondary" : "ghost"} 
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant={theme === "dark" ? "secondary" : "ghost"} 
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={locale === "ru" ? "secondary" : "ghost"}
                        onClick={() => changeLanguage("ru")}
                      >
                        RU
                      </Button>
                      <Button 
                        size="sm" 
                        variant={locale === "en" ? "secondary" : "ghost"}
                        onClick={() => changeLanguage("en")}
                      >
                        EN
                      </Button>
                    </div>
                  </div>
                  
                  {/* Logout button for authenticated users */}
                  {isAuthenticated && (
                    <>
                      <Separator className="my-4" />
                      <div className="px-4">
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Выйти
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Mobile search bar for specific pages */}
      {shouldShowSearchBar && (
        <div className="md:hidden border-t border-border py-2 px-4">
          <SearchBar variant="compact" className="w-full" />
        </div>
      )}
    </header>
  );
}