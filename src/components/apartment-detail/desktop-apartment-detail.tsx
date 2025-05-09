"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Home, 
  Calendar, 
  Users, 
  Building, 
  Share2, 
  Heart, 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight,
  Maximize
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ApartmentFeaturesList from "./ApartmentFeaturesList";
import ApartmentInfoList from "./ApartmentInfoList";
import ContactSection from "./ContactSection";
import InterestGroupSection from "./InterestGroupSection";
import ApartmentPhotoGallery from "./ApartmentPhotoGallery";

export default function DesktopApartmentDetail({ apartment }) {
  const [activeTab, setActiveTab] = useState("description");
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Format price
  const formatPrice = (price) => {
    return price.toLocaleString() + " ₸";
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Не указано";
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="text-gray-600">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к объявлениям
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-gray-600">
            <Share2 className="h-4 w-4 mr-2" />
            Поделиться
          </Button>
          
          <Button 
            variant={isFavorite ? "default" : "outline"} 
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className={isFavorite ? "bg-rose-100 text-rose-600 hover:bg-rose-200 border-rose-200" : "text-gray-600"}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-rose-500" : ""}`} />
            {isFavorite ? "В избранном" : "В избранное"}
          </Button>
        </div>
      </div>
      
      {/* Photo Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-8">
        <div className="h-[450px] rounded-lg overflow-hidden bg-gray-100 relative">
          <Image
            src={apartment.photos[0]?.url || "/images/placeholder.jpg"}
            alt={apartment.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-4">
          {apartment.photos.slice(1, 5).map((photo, index) => (
            <div key={index} className="relative h-[218px] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={photo.url}
                alt={`Фото ${index + 2}`}
                fill
                className="object-cover"
              />
              
              {index === 3 && apartment.photos.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                  <span className="font-semibold">+{apartment.photos.length - 5} фото</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left Column - Information */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{apartment.title}</h1>
          
          <div className="flex items-center text-gray-500 mb-6">
            <MapPin className="h-4 w-4 mr-1 inline" />
            <span>
              {apartment.regionText}
              {apartment.districtText ? `, ${apartment.districtText}` : ''}
              {apartment.microDistrictText ? `, ${apartment.microDistrictText}` : ''}
              {apartment.address ? `, ${apartment.address}` : ''}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary" className="py-1.5 px-3 font-normal text-sm">
              <Home className="h-4 w-4 mr-2" />
              {apartment.quantityOfRooms} комнат
            </Badge>
            
            <Badge variant="secondary" className="py-1.5 px-3 font-normal text-sm">
              <Maximize className="h-4 w-4 mr-2" />
              {apartment.areaOfTheApartment} м²
            </Badge>
            
            <Badge variant="secondary" className="py-1.5 px-3 font-normal text-sm">
              <Building className="h-4 w-4 mr-2" />
              {apartment.typeOfHousing === "APARTMENT" ? "Квартира" : "Дом"}
            </Badge>
            
            <Badge variant="secondary" className="py-1.5 px-3 font-normal text-sm">
              <Users className="h-4 w-4 mr-2" />
              {apartment.numberOfPeopleAreYouAccommodating} чел.
            </Badge>
            
            <Badge variant="secondary" className="py-1.5 px-3 font-normal text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              С {formatDate(apartment.arriveDate)}
            </Badge>
          </div>
          
          <Tabs defaultValue="description" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="w-full border-b pb-0 mb-6">
              <TabsTrigger value="description" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Описание
              </TabsTrigger>
              <TabsTrigger value="info" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Информация
              </TabsTrigger>
              <TabsTrigger value="features" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Качества
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-0">
              <div className="text-gray-700 leading-relaxed">
                <p>{apartment.apartmentsInfo}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="info" className="mt-0">
              <ApartmentInfoList apartment={apartment} isDesktop={true} />
            </TabsContent>
            
            <TabsContent value="features" className="mt-0">
              <ApartmentFeaturesList apartment={apartment} isDesktop={true} />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column - Contact & Apply */}
        <div>
          {/* Price Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(apartment.cost)}</p>
                <p className="text-sm text-gray-500">/ месяц</p>
              </div>
              
              {apartment.deposit > 0 && (
                <div>
                  <p className="text-sm text-gray-500 text-right">Залог</p>
                  <p className="font-semibold text-gray-800">{formatPrice(apartment.deposit)}</p>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Коммунальные услуги:</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(apartment.minAmountOfCommunalService)} - {formatPrice(apartment.maxAmountOfCommunalService)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Доступно с:</span>
                <span className="font-medium text-gray-900">{formatDate(apartment.arriveDate)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Сроки аренды:</span>
                <span className="font-medium text-gray-900">{apartment.forALongTime ? "Долгосрочно" : "Краткосрочно"}</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              <Button className="w-full">Подать заявку</Button>
              <Button variant="outline" className="w-full">Связаться с владельцем</Button>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <ContactSection apartment={apartment} isDesktop={true} />
          </div>
          
          {/* Interest Groups Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <InterestGroupSection apartment={apartment} isDesktop={true} />
          </div>
        </div>
      </div>
    </div>
  );
}