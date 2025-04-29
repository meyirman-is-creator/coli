"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "@/i18n/client";

// Типы для контекста i18n
interface I18nContextType {
  locale: "en" | "ru";
  setLocale: (locale: "en" | "ru") => void;
  t: (key: string) => string;
}

// Создаем контекст
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Хук для использования i18n в компонентах
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

// Свойства провайдера
interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: "en" | "ru";
}

// Компонент провайдера
export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLocale = "ru",
}) => {
  const [locale, setLocaleState] = useState<"en" | "ru">(initialLocale);
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation(locale);

  // Функция для изменения языка
  const setLocale = (newLocale: "en" | "ru") => {
    setLocaleState(newLocale);

    // В реальном приложении здесь можно сохранить выбор пользователя в localStorage
    localStorage.setItem("locale", newLocale);

    // Изменить язык в i18next
    i18n.changeLanguage(newLocale);

    // В реальном приложении с поддержкой i18n в URL можно перенаправить на соответствующий путь
    // const newPath = pathname.replace(/^\/(en|ru)/, `/${newLocale}`);
    // router.push(newPath);
  };

  // При первой загрузке проверить localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as "en" | "ru" | null;
    if (savedLocale && (savedLocale === "en" || savedLocale === "ru")) {
      setLocaleState(savedLocale);
      i18n.changeLanguage(savedLocale);
    }
  }, [i18n]);

  const value = {
    locale,
    setLocale,
    t: (key: string) => t(key),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
