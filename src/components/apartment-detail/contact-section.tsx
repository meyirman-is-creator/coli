"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, MessageSquare, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ContactSection({ apartment, isDesktop = false }: { apartment: any, isDesktop: boolean }) {
  const [showPhoneNumbers, setShowPhoneNumbers] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);
  
  // Extract phone numbers
  const phoneNumbers = Array.isArray(apartment.ownersPhoneNumbers) 
    ? apartment.ownersPhoneNumbers 
    : [];
  
  const primaryPhone = phoneNumbers.length > 0 ? phoneNumbers[0].replace(/\s/g, '') : '';
  
  // Format resident type
  const formatResidentType = (type: any) => {
    switch (type) {
      case "OWNER":
        return "Хозяин";
      case "RESIDENT":
        return "Житель";
      default:
        return type;
    }
  };
  
  // Open WhatsApp
  const handleWhatsAppClick = (e: any) => {
    e.preventDefault();
    if (primaryPhone) {
      window.open(`https://wa.me/${primaryPhone.replace(/[^0-9]/g, '')}`, '_blank');
    }
  };
  
  // Open resident profile
  const openResidentProfile = (resident: any) => {
    setSelectedResident(resident);
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 mb-2">
          {isDesktop ? "Контактная информация" : "Связаться с сожителями"}
        </h3>
        
        <div className={`flex ${isDesktop ? "items-start gap-4" : "items-center justify-between"}`}>
          <div className="flex items-center gap-3">
            <Avatar className={isDesktop ? "h-12 w-12" : "h-10 w-10"}>
              <AvatarImage src={apartment.user.profilePhoto} alt={apartment.user.firstName} />
              <AvatarFallback>{apartment.user.firstName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{apartment.user.firstName} {apartment.user.lastName}</p>
              <p className="text-sm text-gray-500">Владелец объявления</p>
            </div>
          </div>
          
          <div className={`flex gap-2 ${isDesktop ? "mt-2" : ""}`}>
            {showPhoneNumbers ? (
              <div className="text-sm text-gray-700 font-medium">
                {primaryPhone}
              </div>
            ) : (
              <>
                {primaryPhone && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="gap-1"
                  >
                    <Link href={`tel:${primaryPhone}`}>
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">Позвонить</span>
                    </Link>
                  </Button>
                )}
                
                {primaryPhone && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleWhatsAppClick}
                    className="gap-1"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Написать</span>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        
        {!showPhoneNumbers && primaryPhone && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPhoneNumbers(true)}
            className="text-sm text-blue-600 hover:text-blue-700 px-0 py-0 h-auto"
          >
            Показать номер телефона
          </Button>
        )}
        
        {/* Residents Table */}
        {apartment.residentsDataResponse && apartment.residentsDataResponse.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Проживающие:</h4>
            
            <div className={isDesktop ? "border rounded-md" : ""}>
              <Table>
                {isDesktop && (
                  <TableHeader>
                    <TableRow>
                      <TableHead>Имя</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                )}
                <TableBody>
                  {apartment.residentsDataResponse.map((resident: any) => (
                    <TableRow key={resident.id}>
                      <TableCell className="flex items-center gap-2 py-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={resident.profilePhoto} alt={resident.name} />
                          <AvatarFallback>{resident.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{resident.name}</span>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm py-2">
                        {formatResidentType(resident.residentType)}
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openResidentProfile(resident)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Анкета
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
      
      {/* Resident Profile Dialog */}
      {selectedResident && (
        <Dialog open={!!selectedResident} onOpenChange={() => setSelectedResident(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Анкета жителя</DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={selectedResident.profilePhoto} alt={selectedResident.name} />
                <AvatarFallback>{selectedResident.name[0]}</AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-semibold">{selectedResident.name}</h3>
              <p className="text-gray-500">{formatResidentType(selectedResident.residentType)}</p>
            </div>
            
            <div className="space-y-4 mt-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">О себе:</h4>
                <p className="text-gray-600 text-sm">
                  Информация отсутствует
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Интересы:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-200 px-2 py-1 rounded-md text-xs">Чтение</span>
                  <span className="bg-gray-200 px-2 py-1 rounded-md text-xs">Кино</span>
                  <span className="bg-gray-200 px-2 py-1 rounded-md text-xs">Спорт</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedResident(null)}>
                Закрыть
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}