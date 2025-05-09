"use client";

import React from "react";
import { CheckCircle2, Wifi, ParkingCircle, Cat, Wind, Warehouse, DollarSign, Coffee, Music, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ApartmentFeaturesList({ apartment, isDesktop = false }) {
  const featureIcons = {
    "Без вредных привычек": <X className="h-4 w-4 text-red-500" />,
    "Тишина после 22:00": <Music className="h-4 w-4 text-blue-500" />,
    "Уборка по расписанию": <CheckCircle2 className="h-4 w-4 text-green-500" />,
    "Интернет включен": <Wifi className="h-4 w-4 text-indigo-500" />,
    "Кондиционер": <Wind className="h-4 w-4 text-cyan-500" />,
    "Можно с животными": <Cat className="h-4 w-4 text-amber-500" />,
    "Парковка": <ParkingCircle className="h-4 w-4 text-violet-500" />,
    "Кладовая": <Warehouse className="h-4 w-4 text-orange-500" />,
    "Коммунальные включены": <DollarSign className="h-4 w-4 text-emerald-500" />,
    "Можно с детьми": <CheckCircle2 className="h-4 w-4 text-pink-500" />,
    "Кофемашина": <Coffee className="h-4 w-4 text-brown-500" />
  };

  const getDefaultIcon = (feature) => {
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  };

  if (!apartment.preferences || apartment.preferences.length === 0) {
    return (
      <div className="p-4 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Качества не указаны</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={isDesktop ? "grid grid-cols-2 md:grid-cols-3 gap-4" : ""}>
        {apartment.preferences.map((feature, index) => (
          <div 
            key={index}
            className={`flex items-center gap-2 ${
              isDesktop 
                ? "p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                : "mb-3"
            }`}
          >
            <div className={isDesktop ? "w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" : ""}>
              {featureIcons[feature] || getDefaultIcon(feature)}
            </div>
            <span className={`${isDesktop ? "font-medium" : "text-gray-700 text-sm"}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>
      
      {/* Additional apartment details */}
      {isDesktop && (
        <div className="mt-8 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Правила проживания</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {apartment.areBadHabitsAllowed ? 
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                    <X className="h-4 w-4 text-red-500" />
                  }
                </div>
                <span className="text-gray-700">
                  {apartment.areBadHabitsAllowed ? "Курение разрешено" : "Курение запрещено"}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {apartment.arePetsAllowed ? 
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                    <X className="h-4 w-4 text-red-500" />
                  }
                </div>
                <span className="text-gray-700">
                  {apartment.arePetsAllowed ? "Животные разрешены" : "Животные запрещены"}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {apartment.intendedForStudents ? 
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                    <X className="h-4 w-4 text-red-500" />
                  }
                </div>
                <span className="text-gray-700">
                  {apartment.intendedForStudents ? "Подходит для студентов" : "Не для студентов"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}