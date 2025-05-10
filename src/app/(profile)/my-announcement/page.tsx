"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useClientTranslation } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/helpers";
import { Pencil, MapPin, Users, Calendar } from "lucide-react";

// Mock data for announcements
const mockAnnouncements = [
    {
        id: 1,
        title: "2-комнатная квартира в центре",
        address: "Москва, улица Арбат, 24",
        price: 65000,
        arriveDate: "2025-04-01",
        gender: "Мужской",
        roomCount: "2",
        roommates: 2,
        image: "/coliving.png",
        isArchived: false,
    },
    {
        id: 2,
        title: "Студия возле метро",
        address: "Санкт-Петербург, Невский проспект, 110",
        price: 45000,
        arriveDate: "2025-05-15",
        gender: "Женский",
        roomCount: "1",
        roommates: 1,
        image: "/coliving.png",
        isArchived: false,
    },
    {
        id: 3,
        title: "Комната в 3-комнатной квартире",
        address: "Москва, Ленинградский проспект, 80",
        price: 25000,
        arriveDate: "2025-03-10",
        gender: "Любой",
        roomCount: "3",
        roommates: 3,
        image: "/coliving.png",
        isArchived: true,
    },
];

export default function MyAnnouncementsPage() {
    const [locale, setLocale] = useState<"en" | "ru">("ru");
    const { t } = useClientTranslation(locale, "profile");
    const [activeTab, setActiveTab] = useState("active");

    const activeAnnouncements = mockAnnouncements.filter(
        (a) => !a.isArchived
    );
    const archivedAnnouncements = mockAnnouncements.filter(
        (a) => a.isArchived
    );

    const renderAnnouncements = (announcements: typeof mockAnnouncements) => {
        if (announcements.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="mb-4 text-muted-foreground">
                        {activeTab === "active"
                            ? t("announcements.noActiveAnnouncements")
                            : t("announcements.noArchivedAnnouncements")}
                    </p>
                    {activeTab === "active" && (
                        <Button asChild>
                            <Link href="/add-announcement">
                                {t("announcements.createFirst")}
                            </Link>
                        </Button>
                    )}
                </div>
            );
        }

        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {announcements.map((announcement) => (
                    <AnnouncementCard
                        key={announcement.id}
                        announcement={announcement}
                        locale={locale}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto py-6">
            <h1 className="mb-6 text-3xl font-bold">
                {t("announcements.title")}
            </h1>

            <Tabs
                defaultValue="active"
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="mb-6 grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="active">{t("announcements.active")}</TabsTrigger>
                    <TabsTrigger value="archived">
                        {t("announcements.archived")}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                    {renderAnnouncements(activeAnnouncements)}
                </TabsContent>
                <TabsContent value="archived">
                    {renderAnnouncements(archivedAnnouncements)}
                </TabsContent>
            </Tabs>
        </div>
    );
}

type AnnouncementCardProps = {
    announcement: (typeof mockAnnouncements)[0];
    locale: "en" | "ru";
};

function AnnouncementCard({ announcement, locale }: AnnouncementCardProps) {
    const { t } = useClientTranslation(locale, "profile");

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            locale === "en" ? "en-US" : "ru-RU",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    };

    return (
        <Card className="h-full overflow-hidden">
            <div className="relative">
                <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="h-48 w-full object-cover"
                />
                <div className="absolute right-2 top-2 flex gap-2">
                    <Badge className="bg-primary text-primary-foreground">
                        {formatPrice(announcement.price)}
                    </Badge>
                    <Link href={`/add-announcement?id=${announcement.id}`}>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            title={t("announcements.edit")}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
            <CardContent className="p-4">
                <h3 className="mb-2 line-clamp-1 text-xl font-semibold">
                    {announcement.title}
                </h3>
                <div className="mb-4 flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span className="line-clamp-1">{announcement.address}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{formatDate(announcement.arriveDate)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Users className="mr-1 h-4 w-4" />
                        <span>
                            {announcement.roommates} {locale === "en" ? "people" : "чел."}
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
                <span className="text-sm">
                    {announcement.roomCount} {t("announcements.rooms")}
                </span>
                <span className="text-sm font-medium">
                    {announcement.gender === "Мужской"
                        ? locale === "en"
                            ? "Male"
                            : "Мужской"
                        : announcement.gender === "Женский"
                            ? locale === "en"
                                ? "Female"
                                : "Женский"
                            : locale === "en"
                                ? "Any"
                                : "Любой"}
                </span>
            </CardFooter>
        </Card>
    );
}