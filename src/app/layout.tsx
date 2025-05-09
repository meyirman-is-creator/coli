import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { ReduxProvider } from "@/store/provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Coli - Сервис для поиска жилья и соседей",
  description:
    "Найдите идеальный вариант проживания или подходящих соседей с помощью нашего сервиса",
  alternates: {
    languages: {
      en: "/en",
      ru: "/ru",
    },
  },
};

export default function RootLayout({
  children,
  params = { lng: "ru" },
}: {
  children: React.ReactNode;
  params?: { lng?: string };
}) {
  // Default language to Russian
  const lng = params.lng || "ru";

  return (
    <html lang={lng} suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-montserrat min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer locale={lng === "en" ? "en" : "ru"} />
            <Toaster position="top-right" />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
