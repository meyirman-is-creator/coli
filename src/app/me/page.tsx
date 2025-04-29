"use client";

import React, { useState, useEffect } from "react";
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
import { useClientTranslation } from "@/i18n/client"; // Теперь используем правильный импорт

export default function HomePage() {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="heading-1 text-4xl font-bold md:text-5xl lg:text-6xl">
                {t("homePage.hero.title")}
              </h1>
              <p className="body-text text-muted-foreground">
                {t("homePage.hero.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/">
                    <Search className="mr-2 h-5 w-5" />
                    {t("homePage.hero.findHousing")}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/profile/add/announcements">
                    <Home className="mr-2 h-5 w-5" />
                    {t("homePage.hero.postListing")}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -right-4 -top-4 h-72 w-72 bg-primary/10 rounded-full blur-3xl"></div>
                <img
                  src="/coliving.png"
                  alt="Coli - поиск жилья и соседей"
                  className="rounded-lg shadow-lg relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="heading-2">{t("homePage.search.title")}</h2>
            <p className="body-text text-muted-foreground mt-4 max-w-3xl mx-auto">
              {t("homePage.search.description")}
            </p>
          </div>

          <div className="bg-card shadow-lg rounded-lg p-6 md:p-8 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("homePage.search.city")}
                </label>
                <select className="input-primary w-full bg-background">
                  <option>{t("homePage.search.selectCity")}</option>
                  <option>Москва</option>
                  <option>Санкт-Петербург</option>
                  <option>Новосибирск</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("homePage.search.price")}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder={t("homePage.search.from")}
                    className="input-primary w-1/2"
                  />
                  <input
                    type="number"
                    placeholder={t("homePage.search.to")}
                    className="input-primary w-1/2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("homePage.search.rooms")}
                </label>
                <select className="input-primary w-full bg-background">
                  <option>{t("homePage.search.anyNumber")}</option>
                  <option>{t("homePage.search.oneRoom")}</option>
                  <option>{t("homePage.search.twoRooms")}</option>
                  <option>{t("homePage.search.threeRooms")}</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  {t("homePage.search.find")}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Button variant="link" asChild>
                <Link href="/">
                  {t("homePage.search.advancedSearch")}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-accent/50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <h2 className="heading-2">
              {t("homePage.featuredListings.title")}
            </h2>
            <Button variant="outline" asChild>
              <Link href="/">
                {t("homePage.featuredListings.viewAll")}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card-primary h-full flex flex-col">
                <div className="relative">
                  <img
                    src="/coliving.png"
                    alt="Apartment"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
                    65 000 ₽/мес
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">
                    2-комнатная квартира в центре
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Москва, улица Арбат, 24
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-secondary rounded-full px-2 py-1">
                      2 {t("homePage.featuredListings.roomsLabel")}
                    </span>
                    <span className="text-xs bg-secondary rounded-full px-2 py-1">
                      60 м²
                    </span>
                    <span className="text-xs bg-secondary rounded-full px-2 py-1">
                      3/9 {t("homePage.featuredListings.floorLabel")}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/apartments/${item}`}>
                        {t("homePage.featuredListings.detail")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2">{t("homePage.problems.title")}</h2>
            <p className="body-text text-muted-foreground mt-4 max-w-3xl mx-auto">
              {t("homePage.problems.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t("homePage.problems.highPrice.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("homePage.problems.highPrice.description")}
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t("homePage.problems.findingRoommates.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("homePage.problems.findingRoommates.description")}
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t("homePage.problems.contractSecurity.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("homePage.problems.contractSecurity.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="heading-2 mb-4">{t("homePage.cta.title")}</h2>
              <p className="body-text mb-6">{t("homePage.cta.description")}</p>
              <Button
                size="lg"
                variant="secondary"
                className="text-primary"
                asChild
              >
                <Link href="/profile/add/announcements">
                  <Home className="mr-2 h-5 w-5" />
                  {t("homePage.cta.button")}
                </Link>
              </Button>
            </div>
            <div className="order-first md:order-last">
              <img
                src="/api/placeholder/600/400"
                alt="Post your property"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2">{t("homePage.advantages.title")}</h2>
            <p className="body-text text-muted-foreground mt-4 max-w-3xl mx-auto">
              {t("homePage.advantages.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Search className="h-6 w-6" />,
                titleKey: "homePage.advantages.quickSearch.title",
                descriptionKey: "homePage.advantages.quickSearch.description",
              },
              {
                icon: <Users className="h-6 w-6" />,
                titleKey: "homePage.advantages.compatibleRoommates.title",
                descriptionKey:
                  "homePage.advantages.compatibleRoommates.description",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                titleKey: "homePage.advantages.security.title",
                descriptionKey: "homePage.advantages.security.description",
              },
              {
                icon: <CheckCircle className="h-6 w-6" />,
                titleKey: "homePage.advantages.convenience.title",
                descriptionKey: "homePage.advantages.convenience.description",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="bg-primary/10 text-primary rounded-full p-3 w-14 h-14 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t(item.titleKey)}
                </h3>
                <p className="text-muted-foreground">
                  {t(item.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
