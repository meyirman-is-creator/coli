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
import { useClientTranslation } from "@/i18n/client";

export default function ContactSection({ apartment, isDesktop = false }: { apartment: any, isDesktop: boolean }) {
  const [showPhoneNumbers, setShowPhoneNumbers] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "apartment");
  
  // Extract phone numbers
  const phoneNumbers = Array.isArray(apartment.ownersPhoneNumbers) 
    ? apartment.ownersPhoneNumbers 
    : [];
  
  const primaryPhone = phoneNumbers.length > 0 ? phoneNumbers[0].replace(/\s/g, '') : '';
  
  // Format resident type
  const formatResidentType = (type: any) => {
    switch (type) {
      case "OWNER":
        return t("contacts.owner");
      case "RESIDENT":
        return t("contacts.resident");
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
        <h3 className="font-semibold text-foreground mb-2">
          {isDesktop ? t("sections.contacts") : t("contacts.connectWithResidents")}
        </h3>
        
        <div className={`flex ${isDesktop ? "items-start gap-4" : "items-center justify-between"}`}>
          <div className="flex items-center gap-3">
            <Avatar className={isDesktop ? "h-12 w-12" : "h-10 w-10"}>
              <AvatarImage src={apartment.user.profilePhoto} alt={apartment.user.firstName} />
              <AvatarFallback>{apartment.user.firstName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{apartment.user.firstName} {apartment.user.lastName}</p>
              <p className="text-sm text-muted-foreground">{t("contacts.listingOwner")}</p>
            </div>
          </div>
          
          <div className={`flex gap-2 ${isDesktop ? "mt-2" : ""}`}>
            {showPhoneNumbers ? (
              <div className="text-sm text-foreground font-medium">
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
                      <span className="hidden sm:inline">{t("contacts.call")}</span>
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
                    <span className="hidden sm:inline">{t("contacts.message")}</span>
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
            className="text-sm text-primary hover:text-primary/90 px-0 py-0 h-auto"
          >
            {t("contacts.showPhoneNumber")}
          </Button>
        )}
        
        {/* Residents Table */}
        {apartment.residentsDataResponse && apartment.residentsDataResponse.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-foreground mb-2">{t("contacts.residents")}:</h4>
            
            <div className={isDesktop ? "border border-border rounded-md" : ""}>
              <Table>
                {isDesktop && (
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("contacts.name")}</TableHead>
                      <TableHead>{t("contacts.role")}</TableHead>
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
                        <span className="text-foreground">{resident.name}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm py-2">
                        {formatResidentType(resident.residentType)}
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openResidentProfile(resident)}
                          className="text-primary hover:text-primary/90"
                        >
                          {t("contacts.profile")}
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
              <DialogTitle>{t("contacts.residentProfile")}</DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={selectedResident.profilePhoto} alt={selectedResident.name} />
                <AvatarFallback>{selectedResident.name[0]}</AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-semibold text-foreground">{selectedResident.name}</h3>
              <p className="text-muted-foreground">{formatResidentType(selectedResident.residentType)}</p>
            </div>
            
            <div className="space-y-4 mt-2">
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground">{t("contacts.aboutMe")}:</h4>
                <p className="text-muted-foreground text-sm">
                  {t("contacts.noInformation")}
                </p>
              </div>
              
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground">{t("contacts.interests")}:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-muted px-2 py-1 rounded-md text-xs text-foreground">{t("contacts.reading")}</span>
                  <span className="bg-muted px-2 py-1 rounded-md text-xs text-foreground">{t("contacts.movies")}</span>
                  <span className="bg-muted px-2 py-1 rounded-md text-xs text-foreground">{t("contacts.sports")}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedResident(null)}>
                {t("contacts.close")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}