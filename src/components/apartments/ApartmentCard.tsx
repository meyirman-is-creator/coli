"use client";
import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/i18n";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

interface ApartmentCardProps {
  apartment: {
    announcementId: number;
    image: string;
    title: string;
    address: string;
    arriveDate: string;
    roomCount: string;
    selectedGender: string;
    roommates: number;
    cost: number;
    coordsX: string;
    coordsY: string;
    isArchived: boolean;
    consideringOnlyNPeople: boolean;
  };
  onClick?: () => void;
  mini?: boolean;
}

export default function ApartmentCard({
  apartment,
  onClick,
  mini = false,
}: ApartmentCardProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getGenderTranslation = (gender: string) => {
    switch (gender) {
      case "MALE":
        return t("male");
      case "FEMALE":
        return t("female");
      default:
        return t("any");
    }
  };

  if (mini) {
    return (
      <Card
        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="relative h-32">
          <Image
            src={imageError ? "/placeholder.jpg" : apartment.image}
            alt={apartment.title}
            fill
            className="object-cover"
            onError={handleImageError}
          />
          <Badge className="absolute top-2 right-2 bg-primary">
            {formatPrice(apartment.cost)}
          </Badge>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm line-clamp-1">
            {apartment.title}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <MapPinIcon className="h-3 w-3 mr-1" />
            <span className="truncate">{apartment.address}</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative h-48">
        <Image
          src={imageError ? "/placeholder.jpg" : apartment.image}
          alt={apartment.title}
          fill
          className="object-cover"
          onError={handleImageError}
        />
        <Badge className="absolute top-3 right-3 bg-primary text-white px-2 py-1">
          {formatPrice(apartment.cost)}
        </Badge>
      </div>

      <CardHeader className="px-4 py-3 pb-0">
        <CardTitle className="text-lg">{apartment.title}</CardTitle>
        <CardDescription className="flex items-center mt-1">
          <MapPinIcon className="h-4 w-4 mr-1" />
          {apartment.address}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 py-2 flex-grow">
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex items-center text-sm">
            <HomeIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>
              {apartment.roomCount} {t("rooms")}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <UsersIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>
              {apartment.roommates} {t("roommates")}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <UserIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{getGenderTranslation(apartment.selectedGender)}</span>
          </div>

          <div className="flex items-center text-sm">
            <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{formatDate(apartment.arriveDate)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 pt-2 mt-auto">
        <Button variant="secondary" className="w-full" onClick={onClick}>
          {t("viewDetails")}
        </Button>
      </CardFooter>
    </Card>
  );
}
