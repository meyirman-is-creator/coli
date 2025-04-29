import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Apartment } from "@/types/apartment";
import { formatDate, formatCurrency } from "@/lib/utils";
import { MapPin, Home, Users, Bath, AreaChart } from "lucide-react";

interface ApartmentCardProps {
  apartment: Apartment;
  variant?: "default" | "compact";
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({
  apartment,
  variant = "default",
}) => {
  const {
    id,
    title,
    price,
    currency,
    location,
    photos,
    rooms,
    bathrooms,
    area,
    areaMeasurement,
    currentOccupants,
    maxOccupants,
    availableFrom,
  } = apartment;

  const mainPhoto = photos.find((photo) => photo.isMain) || photos[0];

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={mainPhoto?.url || `/api/placeholder/300/200`}
            alt={title}
            className="w-full h-36 object-cover"
          />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
            {formatCurrency(price, currency)}
          </div>
        </div>
        <div className="p-3 flex-grow flex flex-col">
          <h3 className="font-medium text-base line-clamp-1">{title}</h3>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            {location.cityName}, {location.address}
          </p>
          <div className="flex mt-2 text-xs gap-3">
            <span className="flex items-center">
              <Home className="h-3 w-3 mr-1" />
              {rooms}
            </span>
            <span className="flex items-center">
              <Bath className="h-3 w-3 mr-1" />
              {bathrooms}
            </span>
            <span className="flex items-center">
              <AreaChart className="h-3 w-3 mr-1" />
              {area} {areaMeasurement}
            </span>
          </div>
          <div className="mt-auto pt-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/apartments/${id}`}>Подробнее</Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={mainPhoto?.url || `/api/placeholder/400/250`}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
          {formatCurrency(price, currency)}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {location.cityName}, {location.address}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-secondary rounded-full px-2 py-1 flex items-center">
            <Home className="h-3 w-3 mr-1" />
            {rooms} комн.
          </span>
          <span className="text-xs bg-secondary rounded-full px-2 py-1 flex items-center">
            <Bath className="h-3 w-3 mr-1" />
            {bathrooms} ванн.
          </span>
          <span className="text-xs bg-secondary rounded-full px-2 py-1 flex items-center">
            <AreaChart className="h-3 w-3 mr-1" />
            {area} {areaMeasurement}
          </span>
          <span className="text-xs bg-secondary rounded-full px-2 py-1 flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {currentOccupants.length}/{maxOccupants}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-sm">
            <span className="text-muted-foreground">Доступно с:</span>{" "}
            {formatDate(availableFrom)}
          </p>
        </div>

        <div className="mt-auto">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/apartments/${id}`}>Подробнее</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
