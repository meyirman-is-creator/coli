"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useClientTranslation } from "@/i18n/client";
import { useAppSelector } from "@/lib/hooks/redux-hooks";
import { cn } from "@/lib/utils";
import {
  User,
  Home,
  FileText,
  PlusSquare,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "profile");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const { user } = useAppSelector((state) => state.auth);

  const profileNavItems = [
    {
      title: t("sidebar.profile"),
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: t("sidebar.myAnnouncements"),
      href: "/my-announcement",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: t("sidebar.survey"),
      href: "/survey",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: t("sidebar.addAnnouncement"),
      href: "/add-announcement",
      icon: <PlusSquare className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Sidebar Trigger */}
      <div className="flex items-center border-b p-4 lg:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            {renderSidebar(true)}
          </SheetContent>
        </Sheet>
        <div className="ml-4 text-lg font-semibold">
          {t("sidebar.dashboard")}
        </div>
      </div>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden border-r bg-card transition-all duration-300 lg:block",
            isCollapsed ? "w-[80px]" : "w-[250px]"
          )}
        >
          {renderSidebar()}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );

  function renderSidebar(isMobile = false) {
    return (
      <div
        className={cn(
          "flex h-full flex-col px-3 py-6",
          isCollapsed && !isMobile && "items-center"
        )}
      >
        {/* User Profile Section */}
        <div
          className={cn(
            "mb-6 flex items-center",
            isCollapsed && !isMobile ? "flex-col" : "space-x-3"
          )}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.photoUrl || ""}
              alt={user?.firstName || ""}
            />
            <AvatarFallback>
              {user?.firstName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col">
              <span className="font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                {user?.email}
              </span>
            </div>
          )}
        </div>

        <Separator className="my-2" />

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 pt-4">
          {profileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                pathname.includes(item.href)
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
                isCollapsed && !isMobile && "justify-center px-0"
              )}
            >
              <div
                className={cn(
                  "mr-2",
                  isCollapsed && !isMobile && "mr-0 text-center"
                )}
              >
                {item.icon}
              </div>
              {(!isCollapsed || isMobile) && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mt-auto self-end"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            </span>
          </Button>
        )}
      </div>
    );
  }
}