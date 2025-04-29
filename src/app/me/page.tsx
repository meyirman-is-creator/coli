// src/app/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Search,
  Home,
  Users,
  DollarSign,
  Shield,
  CheckCircle,
  ChevronRight,
  Globe,
  X,
} from "lucide-react";

export default function HomePage() {
  const [locale, setLocale] = useState<"en" | "ru">("en");

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="heading-1 text-4xl font-bold md:text-5xl lg:text-6xl">
                {locale === "en"
                  ? "Find ideal roommates and suitable housing"
                  : "Найдите идеальных соседей и подходящее жилье"}
              </h1>
              <p className="body-text text-muted-foreground">
                {locale === "en"
                  ? "Globally 1.6 billion are affected by the housing crisis. Our platform helps you quickly find housing or roommates for collaborative living."
                  : "Глобально 1.6 миллиарда людей затронуты жилищным кризисом. Наша платформа помогает быстро найти жилье или соседей для совместного проживания."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/apartments">
                    <Search className="mr-2 h-5 w-5" />
                    {locale === "en" ? "Find Housing" : "Найти жилье"}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/profile/add/announcements">
                    <Home className="mr-2 h-5 w-5" />
                    {locale === "en"
                      ? "Post a Listing"
                      : "Разместить объявление"}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -right-4 -top-4 h-72 w-72 bg-primary/10 rounded-full blur-3xl"></div>
                <img
                  src="/api/placeholder/600/400"
                  alt={
                    locale === "en"
                      ? "Coli - Find housing and roommates"
                      : "Coli - Поиск жилья и соседей"
                  }
                  className="rounded-lg shadow-lg relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2">
              {locale === "en"
                ? "Your Platform for Collaborative Housing"
                : "Ваша Платформа для Совместного Проживания"}
            </h2>
            <p className="body-text text-muted-foreground mt-4 max-w-3xl mx-auto">
              {locale === "en"
                ? "Connect - Choose - Colive"
                : "Соединяйтесь - Выбирайте - Живите вместе"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === "en"
                  ? "Find ideal roommates"
                  : "Найдите идеальных соседей"}
              </h3>
              <p className="text-muted-foreground">
                {locale === "en"
                  ? "Our personality-oriented search helps you find compatible roommates with similar lifestyles."
                  : "Наш поиск по личностным характеристикам помогает найти совместимых соседей с похожим образом жизни."}
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === "en"
                  ? "Discover co-living spaces"
                  : "Найдите пространства для совместного проживания"}
              </h3>
              <p className="text-muted-foreground">
                {locale === "en"
                  ? "Browse housing options tailored to your preferences and budget requirements."
                  : "Просматривайте варианты жилья, соответствующие вашим предпочтениям и бюджету."}
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === "en" ? "Flexible leases" : "Гибкая аренда"}
              </h3>
              <p className="text-muted-foreground">
                {locale === "en"
                  ? "Enjoy flexible leasing options and seamless communication with potential roommates."
                  : "Пользуйтесь гибкими условиями аренды и легко общайтесь с потенциальными соседями."}
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === "en"
                  ? "Manage shared living"
                  : "Управляйте совместным проживанием"}
              </h3>
              <p className="text-muted-foreground">
                {locale === "en"
                  ? "Simplify communication, agreements, and maintenance for stress-free co-living."
                  : "Упростите общение, соглашения и обслуживание для беззаботного совместного проживания."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 bg-accent/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2">
              {locale === "en"
                ? "Problems We Solve"
                : "Проблемы, которые мы решаем"}
            </h2>
            <p className="body-text text-muted-foreground mt-4 max-w-3xl mx-auto">
              {locale === "en"
                ? "Our platform addresses common challenges in finding housing and roommates"
                : "Наша платформа решает распространенные проблемы при поиске жилья и соседей"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === "en" ? "Cost of Housing" : "Стоимость жилья"}
              </h3>
              <p className="text-muted-foreground">
                {locale === "en"
                  ? "Collaborative living significantly reduces housing costs for each participant."
                  : "Совместное проживание значительно снижает затраты на жилье для каждого участника."}
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === "en"
                  ? "Low interaction between roommates"
                  : "Низкое взаимодействие между соседями"}
              </h3>
              <p className="text-muted-foreground">
                {locale === "en"
                  ? "Our matching system helps find roommates with compatible lifestyles and interests."
                  : "Наша система подбора помогает найти соседей с совместимым образом жизни и интересами."}
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === "en"
                  ? "Security Contract Agreement"
                  : "Безопасность договорных соглашений"}
              </h3>
              <p className="text-muted-foreground">
                {locale === "en"
                  ? "We help formalize agreements to protect the interests of all parties involved."
                  : "Мы помогаем формализовать соглашения для защиты интересов всех сторон."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Information Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2">
              {locale === "en" ? "Market Opportunity" : "Рыночные возможности"}
            </h2>
            <p className="body-text text-muted-foreground mt-4 max-w-3xl mx-auto">
              {locale === "en"
                ? "A growing market with significant potential"
                : "Растущий рынок со значительным потенциалом"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-primary text-primary-foreground rounded-lg p-8">
              <h3 className="text-3xl font-bold mb-2">
                {locale === "en" ? "World" : "Мир"}
              </h3>
              <p className="text-sm mb-4">TAM</p>
              <p className="text-4xl font-bold">
                {locale === "en" ? "$13B" : "$13 млрд"}
              </p>
            </div>
            <div className="bg-primary text-primary-foreground rounded-lg p-8">
              <h3 className="text-3xl font-bold mb-2">
                {locale === "en" ? "South-East Asia" : "Юго-Восточная Азия"}
              </h3>
              <p className="text-sm mb-4">SAM</p>
              <p className="text-4xl font-bold">
                {locale === "en" ? "$5B" : "$5 млрд"}
              </p>
            </div>
            <div className="bg-primary text-primary-foreground rounded-lg p-8">
              <h3 className="text-3xl font-bold mb-2">
                {locale === "en" ? "Singapore" : "Сингапур"}
              </h3>
              <p className="text-sm mb-4">SOM</p>
              <p className="text-4xl font-bold">
                {locale === "en" ? "$200M" : "$200 млн"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Comparison */}
      <section className="py-16 bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2">
              {locale === "en" ? "Our Advantages" : "Наши преимущества"}
            </h2>
            <p className="body-text text-muted-foreground mt-4 max-w-3xl mx-auto">
              {locale === "en"
                ? "What sets our platform apart from competitors"
                : "Что отличает нашу платформу от конкурентов"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left"></th>
                  <th className="p-4 text-center">
                    {locale === "en"
                      ? "Personality Oriented Search"
                      : "Поиск по личностным характеристикам"}
                  </th>
                  <th className="p-4 text-center">
                    {locale === "en"
                      ? "Interest Consideration"
                      : "Учет интересов"}
                  </th>
                  <th className="p-4 text-center">
                    {locale === "en" ? "Affordability" : "Доступность"}
                  </th>
                  <th className="p-4 text-center">
                    {locale === "en"
                      ? "Contract Agreement"
                      : "Договорные соглашения"}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Coli</td>
                  <td className="p-4 text-center text-green-500">
                    <CheckCircle className="mx-auto h-5 w-5" />
                  </td>
                  <td className="p-4 text-center text-green-500">
                    <CheckCircle className="mx-auto h-5 w-5" />
                  </td>
                  <td className="p-4 text-center text-green-500">
                    <CheckCircle className="mx-auto h-5 w-5" />
                  </td>
                  <td className="p-4 text-center text-green-500">
                    <CheckCircle className="mx-auto h-5 w-5" />
                  </td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Competitor A</td>
                  <td className="p-4 text-center text-red-500">
                    <X className="mx-auto h-5 w-5" />
                  </td>
                  <td className="p-4 text-center text-red-500">
                    <X className="mx-auto h-5 w-5" />
                  </td>
                  <td className="p-4 text-center text-green-500">
                    <CheckCircle className="mx-auto h-5 w-5" />
                  </td>
                  <td className="p-4 text-center text-red-500">
                    <X className="mx-auto h-5 w-5" />
                  </td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Competitor B</td>
                  <td className="p-4 text-center text-red-500">
                    <X className="mx-auto h-5 w-5" />
                  </td>
                  <td className="p-4 text-center text-green-500">
                    <CheckCircle className="mx-auto h-5 w-5" />
                  </td>
                  <td className="p-4 text-center text-green-500">
                    <CheckCircle className="mx-auto h-5 w-5" />
                  </td>
                  <td className="p-4 text-center text-green-500">
                    <CheckCircle className="mx-auto h-5 w-5" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="text-center space-y-6">
            <h2 className="heading-2 mb-4">
              {locale === "en"
                ? "Ready to find your perfect housing match?"
                : "Готовы найти идеальное жилье?"}
            </h2>
            <p className="body-text mb-6 max-w-2xl mx-auto">
              {locale === "en"
                ? "Join our platform today to connect with potential roommates, discover co-living spaces, and simplify your housing search."
                : "Присоединяйтесь к нашей платформе сегодня, чтобы связаться с потенциальными соседями, открыть для себя пространства для совместного проживания и упростить поиск жилья."}
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-primary"
              asChild
            >
              <Link href="/auth/register">
                <Users className="mr-2 h-5 w-5" />
                {locale === "en" ? "Get Started" : "Начать"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
