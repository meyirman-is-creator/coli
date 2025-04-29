"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import {
  fetchApartmentById,
  resetSelectedApartment,
} from "@/store/slices/apartmentSlice";
import { useAppDispatch, useAppSelector } from "@/store/index";
import Container from "@/components/layouts/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslation } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Home,
  MapPin,
  Phone,
  MessageCircle,
  Bath,
  Users,
  AreaChart,
  Heart,
  Share,
} from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function ApartmentDetailPage() {
  const { t } = useTranslation("ru");
  const { apartmentId } = useParams();
  const dispatch = useAppDispatch();
  const {
    selectedApartment: apartment,
    status,
    error,
  } = useAppSelector((state) => state.apartment);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    if (apartmentId) {
      dispatch(fetchApartmentById(String(apartmentId)));
    }

    return () => {
      dispatch(resetSelectedApartment());
    };
  }, [dispatch, apartmentId]);

  if (status === "loading" || !apartment) {
    return (
      <Container>
        <div className="py-8">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/apartments">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("back")}
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
              <div>
                <Skeleton className="h-60 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/apartments">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("back")}
              </Link>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">{t("error.title")}</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild>
              <Link href="/apartments">{t("error.backToList")}</Link>
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const mainPhoto =
    apartment.photos.find((photo) => photo.isMain) || apartment.photos[0];

  return (
    <Container>
      <div className="py-8">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/apartments">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t("back")}
            </Link>
          </Button>
        </div>

        {/* Photos */}
        <div className="mb-8">
          {apartment.photos.length > 0 ? (
            isMobile ? (
              <Carousel>
                <CarouselContent>
                  {apartment.photos.map((photo, index) => (
                    <CarouselItem key={photo.id}>
                      <img
                        src={photo.url}
                        alt={
                          photo.description ||
                          `${apartment.title} - photo ${index + 1}`
                        }
                        className="w-full h-[300px] object-cover rounded-lg"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2 row-span-2">
                  <img
                    src={mainPhoto.url}
                    alt={mainPhoto.description || apartment.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                {apartment.photos.slice(1, 5).map((photo, index) => (
                  <div key={photo.id}>
                    <img
                      src={photo.url}
                      alt={
                        photo.description ||
                        `${apartment.title} - photo ${index + 1}`
                      }
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-muted h-[300px] rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">{t("noPhotos")}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse md:grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{apartment.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {apartment.location.address}, {apartment.location.cityName}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  {apartment.rooms} {t("apartment.rooms")}
                </Badge>
                <Badge className="flex items-center gap-1">
                  <Bath className="h-3 w-3" />
                  {apartment.bathrooms} {t("apartment.bathrooms")}
                </Badge>
                <Badge className="flex items-center gap-1">
                  <AreaChart className="h-3 w-3" />
                  {apartment.area}{" "}
                  {apartment.areaMeasurement === "sqm" ? "м²" : "ft²"}
                </Badge>
                <Badge className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {t("apartment.maxOccupants", {
                    count: apartment.maxOccupants,
                  })}
                </Badge>
                <Badge className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {t("apartment.availableFrom", {
                    date: formatDate(apartment.availableFrom, {
                      day: "numeric",
                      month: "short",
                    }),
                  })}
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">
                  {t("apartment.tabs.description")}
                </TabsTrigger>
                <TabsTrigger value="details">
                  {t("apartment.tabs.details")}
                </TabsTrigger>
                <TabsTrigger value="features">
                  {t("apartment.tabs.features")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="pt-4">
                <div className="prose max-w-none">
                  <p>{apartment.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="details" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("apartment.type")}
                      </span>
                      <span className="font-medium">
                        {t(`apartment.types.${apartment.type}`)}
                      </span>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("apartment.rooms")}
                      </span>
                      <span className="font-medium">{apartment.rooms}</span>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("apartment.bathrooms")}
                      </span>
                      <span className="font-medium">{apartment.bathrooms}</span>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("apartment.area")}
                      </span>
                      <span className="font-medium">
                        {apartment.area}{" "}
                        {apartment.areaMeasurement === "sqm" ? "м²" : "ft²"}
                      </span>
                    </div>
                    <Separator />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("apartment.maxOccupants")}
                      </span>
                      <span className="font-medium">
                        {apartment.maxOccupants}
                      </span>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("apartment.rentalPeriod")}
                      </span>
                      <span className="font-medium">
                        {t(`apartment.periods.${apartment.rentalPeriod}`)}
                      </span>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("apartment.deposit")}
                      </span>
                      <span className="font-medium">
                        {apartment.deposit
                          ? formatCurrency(
                              apartment.deposit,
                              apartment.currency
                            )
                          : t("apartment.noDeposit")}
                      </span>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("apartment.availableFrom")}
                      </span>
                      <span className="font-medium">
                        {formatDate(apartment.availableFrom)}
                      </span>
                    </div>
                    <Separator />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="pt-4">
                {apartment.features.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {apartment.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{t(`apartment.features.${feature}`)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {t("apartment.noFeatures")}
                  </p>
                )}
              </TabsContent>
            </Tabs>

            {/* Current Occupants */}
            {apartment.currentOccupants.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  {t("apartment.currentOccupants")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {apartment.currentOccupants.map((occupant) => (
                    <div key={occupant.id} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={occupant.photoUrl} />
                        <AvatarFallback>{occupant.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{occupant.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {occupant.age && `${occupant.age} ${t("years")}`}
                          {occupant.occupation && `, ${occupant.occupation}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {formatCurrency(apartment.price, apartment.currency)} /{" "}
                  {t(`apartment.periodsShort.${apartment.rentalPeriod}`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Owner Info */}
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={apartment.owner.photoUrl} />
                      <AvatarFallback>{apartment.owner.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{apartment.owner.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {apartment.owner.livesInProperty
                          ? t("apartment.ownerLivesHere")
                          : t("apartment.owner")}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    {apartment.owner.phone && (
                      <Button className="w-full gap-2" asChild>
                        <Link href={`tel:${apartment.owner.phone}`}>
                          <Phone className="h-4 w-4" />
                          {t("apartment.call")}
                        </Link>
                      </Button>
                    )}

                    <Button variant="outline" className="w-full gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {t("apartment.message")}
                    </Button>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Heart className="h-4 w-4" />
                      {t("apartment.save")}
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Share className="h-4 w-4" />
                      {t("apartment.share")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
