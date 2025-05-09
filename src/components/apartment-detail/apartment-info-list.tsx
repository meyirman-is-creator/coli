"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useClientTranslation } from "@/i18n/client";

export default function ApartmentInfoList({ apartment, isDesktop = false }: { apartment: any, isDesktop: boolean }) {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "apartment");
  
  // Helper function to translate gender
  const translateGender = (gender: string) => {
    switch (gender) {
      case "ANY": return t("gender.any");
      case "MALE": return t("gender.male");
      case "FEMALE": return t("gender.female");
      default: return gender;
    }
  };
  
  // Information entries with their labels and values
  const infoEntries = [
    { 
      label: t("info.city"),
      value: `${apartment.regionText}${apartment.districtText ? `, ${apartment.districtText}` : ''}` 
    },
    { 
      label: t("info.propertyType"), 
      value: apartment.typeOfHousing === "APARTMENT" ? t("propertyType.apartment") : t("propertyType.house") 
    },
    { 
      label: t("info.rentalType"), 
      value: apartment.forALongTime ? t("leaseType.longTerm") : t("leaseType.shortTerm") 
    },
    { 
      label: t("info.floor"), 
      value: t("info.floorValue", { floor: apartment.numberOfFloor, total: apartment.maxFloorInTheBuilding }) 
    },
    { 
      label: t("info.area"), 
      value: t("info.squareMeters", { area: apartment.areaOfTheApartment }) 
    },
    { 
      label: t("info.condition"), 
      value: apartment.areBadHabitsAllowed ? t("info.withBadHabits") : t("info.noBadHabits") 
    },
    { 
      label: t("info.residentsCount"), 
      value: apartment.howManyPeopleLiveInThisApartment 
    },
    { 
      label: t("info.lookingFor"), 
      value: apartment.numberOfPeopleAreYouAccommodating 
    },
    { 
      label: t("info.gender"), 
      value: translateGender(apartment.selectedGender)
    },
    { 
      label: t("info.forStudents"), 
      value: apartment.intendedForStudents ? t("common.yes") : t("common.no") 
    }
  ];

  if (isDesktop) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {infoEntries.map((entry, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-muted-foreground text-sm mb-1">{entry.label}:</span>
            <span className="font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }

  // Mobile version
  return (
    <div className="space-y-0 divide-y divide-border">
      {infoEntries.map((entry, index) => (
        <div key={index} className="flex justify-between py-3">
          <span className="text-muted-foreground text-sm">{entry.label}:</span>
          <span className="font-medium text-foreground text-right">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}