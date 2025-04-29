import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Apartment } from "@/types/apartment";
import { useTranslation } from "@/i18n";
import { formatDate, formatCurrency } from "@/lib/utils";
import { MapPin, Home, Bath, User, Calendar, BedDouble } from "lucide-react";

interface ApartmentCardProps {
  apartment: Apartment;
  variant?: "default" | "compact";
  className?: string;
}

export function ApartmentCard({
  apartment,
  variant = "default",
  className,
}: ApartmentCardProps) {
  const { t } = useTranslation("ru");

  const mainPhoto =
    apartment.photos.find((photo) => photo.isMain) || apartment.photos[0];
  const photoUrl = mainPhoto?.url || "/api/placeholder/400/300";

  if (variant === "compact") {
    return (
      <Card className={`overflow-hidden h-full ${className || ""}`}>
        <div className="relative">
          <img
            src={photoUrl}
            alt={apartment.title}
            className="w-full h-36 object-cover"
          />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
            {formatCurrency(apartment.price, apartment.currency)}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">
            {apartment.title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{apartment.location.address}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-2">
              <Badge variant="outline" className="flex items-center">
                <Home className="h-3 w-3 mr-1" /> {apartment.rooms}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <User className="h-3 w-3 mr-1" /> {apartment.maxOccupants}
              </Badge>
            </div>
            <Button variant="link" size="sm" asChild className="p-0">
              <Link href={`/apartments/${apartment.id}`}>
                {t("common.viewDetails")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`overflow-hidden hover:shadow-md transition-shadow ${
        className || ""
      }`}
    >
      <div className="relative">
        <img
          src={photoUrl}
          alt={apartment.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
          {formatCurrency(apartment.price, apartment.currency)}
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">
          {apartment.title}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{apartment.location.address}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-sm">
            <Home className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>
              {apartment.rooms} {t("apartment.rooms")}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>
              {apartment.bathrooms} {t("apartment.bathrooms")}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <BedDouble className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{apartment.area} m²</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>
              {formatDate(apartment.availableFrom, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage
                src={apartment.owner.photoUrl}
                alt={apartment.owner.name}
              />
              <AvatarFallback>{apartment.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{apartment.owner.name}</span>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/apartments/${apartment.id}`}>
              {t("common.details")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
