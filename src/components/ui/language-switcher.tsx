// src/components/ui/language-switcher.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  locale: string;
  setLocale: (locale: "en" | "ru") => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  locale,
  setLocale,
}) => {
  return (
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
  );
};

export default LanguageSwitcher;
