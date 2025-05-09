"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

export default function ApartmentInfoList({ apartment, isDesktop = false }: { apartment: any, isDesktop: boolean }) {
  // Information entries with their labels and values
  const infoEntries = [
    { 
      label: "Город",
      value: `${apartment.regionText}${apartment.districtText ? `, ${apartment.districtText}` : ''}` 
    },
    { 
      label: "Тип жилья", 
      value: apartment.typeOfHousing === "APARTMENT" ? "Квартира" : "Дом" 
    },
    { 
      label: "Сдача в аренду", 
      value: apartment.forALongTime ? "Долгосрочно" : "Краткосрочно" 
    },
    { 
      label: "Этаж", 
      value: `${apartment.numberOfFloor} из ${apartment.maxFloorInTheBuilding}` 
    },
    { 
      label: "Площадь", 
      value: `${apartment.areaOfTheApartment} м²` 
    },
    { 
      label: "Состояние", 
      value: apartment.areBadHabitsAllowed ? "С вредными привычками" : "Без вредных привычек" 
    },
    { 
      label: "Людей проживают", 
      value: apartment.howManyPeopleLiveInThisApartment 
    },
    { 
      label: "Людей ищут", 
      value: apartment.numberOfPeopleAreYouAccommodating 
    },
    { 
      label: "Гендер", 
      value: apartment.selectedGender === "ANY" ? "Любой" : 
             apartment.selectedGender === "MALE" ? "Мужской" : 
             apartment.selectedGender === "FEMALE" ? "Женский" : apartment.selectedGender
    },
    { 
      label: "Для студентов", 
      value: apartment.intendedForStudents ? "Да" : "Нет" 
    }
  ];

  if (isDesktop) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {infoEntries.map((entry, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-gray-500 text-sm mb-1">{entry.label}:</span>
            <span className="font-medium text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }

  // Mobile version
  return (
    <div className="space-y-0 divide-y divide-gray-100">
      {infoEntries.map((entry, index) => (
        <div key={index} className="flex justify-between py-3">
          <span className="text-gray-600 text-sm">{entry.label}:</span>
          <span className="font-medium text-gray-900 text-right">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}