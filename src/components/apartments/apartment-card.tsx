import React, { useState } from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useClientTranslation } from "@/i18n/client";
import {
  Calendar,
  Home,
  MapPin,
  Users,
  Share as ShareIcon,
  Copy,
  Check,
  Star,
  ArrowRight,
  Heart,
  Building,
  VenusAndMars
} from "lucide-react";

interface ApartmentCardProps {
  card: {
    announcementId: number;
    image: string;
    title: string;
    address: string;
    arriveDate: string | null;
    roomCount: string;
    selectedGender: string;
    roommates: number;
    cost: number;
    coordsX: string;
    coordsY: string;
    isArchived: boolean;
    consideringOnlyNPeople: boolean;
  };
  variant?: "default" | "compact" | "featured";
  className?: string;
  onFavoriteToggle?: (id: number) => void;
  isFavorite?: boolean;
  locale?: "en" | "ru";
}

export default function ApartmentCard({
  card,
  variant = "default",
  className = "",
  onFavoriteToggle,
  isFavorite = false,
  locale = "ru"
}: ApartmentCardProps) {
  const { t } = useClientTranslation(locale, "apartments");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  
  // Format available date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("cards.availableFrom");
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === "en" ? 'en-US' : 'ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
  };
  
  // Initialize the share URL when needed
  const handleShareClick = () => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/apartments/${card.announcementId}`);
    }
    setShareDialogOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Get gender label using translations
  const getGenderLabel = (gender: string): string => {
    return t(`cards.gender.${gender}`) || t("cards.gender.ANY");
  };

  // Compact variant for sidebar/map views
  if (variant === "compact") {
    return (
      <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 ${className}`}>
        <div className="flex flex-col sm:flex-row h-full">
          <div className="relative w-full sm:w-1/3 h-28 sm:h-auto">
            <img
              src={card.image || "/api/placeholder/400/300"}
              alt={card.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
              {formatPrice(card.cost)}
            </div>
          </div>
          
          <div className="p-3 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="font-medium text-sm line-clamp-1">{card.title}</h3>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{card.address || "Адрес не указан"}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs flex items-center">
                <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                <span>{getGenderLabel(card.selectedGender)} · {card.roommates} {t("cards.peopleCount", { count: card.roommates })}</span>
              </div>
              
              <Button variant="ghost" size="sm" className="p-0 h-auto" asChild>
                <Link href={`/apartments/${card.announcementId}`}>
                  {t("cards.details")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Featured variant with special styling
  if (variant === "featured") {
    return (
      <Card className={`overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/20 ${className}`}>
        <div 
          className="relative" 
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={card.image || "/api/placeholder/400/300"}
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>
            <Badge className="absolute top-3 left-3 bg-yellow-500 hover:bg-yellow-600">
              <Star className="h-3 w-3 mr-1" /> {t("cards.featured")}
            </Badge>
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2.5 py-1.5 rounded-md text-sm font-semibold shadow-md">
              {formatPrice(card.cost)}
            </div>
            
            <div className="absolute bottom-3 right-3 flex space-x-2">
              <button 
                className="p-2 bg-background/90 hover:bg-background rounded-full transition-colors"
                onClick={handleShareClick} 
              >
                <ShareIcon className="h-4 w-4 text-foreground" />
              </button>
              {onFavoriteToggle && (
                <button 
                  className="p-2 bg-background/90 hover:bg-background rounded-full transition-colors"
                  onClick={() => onFavoriteToggle(card.announcementId)}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-foreground"}`} />
                </button>
              )}
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2 line-clamp-1">{card.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{card.address || t("address.notSpecified")}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 mb-4">
              {card.arriveDate && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formatDate(card.arriveDate)}</span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{card.roomCount} {t("cards.roomCount", { count: parseInt(card.roomCount) })}</span>
              </div>
              <div className="flex items-center text-sm col-span-2">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{getGenderLabel(card.selectedGender)} · {card.roommates} {t("cards.peopleCount", { count: card.roommates })}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-4 pb-4 pt-0">
            <Button className="w-full group-hover:bg-primary/90" asChild>
              <Link href={`/apartments/${card.announcementId}`} className="flex items-center justify-center">
                {t("cards.details")}
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </div>
        
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("cards.shareListingTitle")}</DialogTitle>
              <DialogDescription>
                {t("cards.shareListingDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  id="link"
                  readOnly
                  value={shareUrl}
                  className="w-full"
                />
              </div>
              <Button size="sm" className="px-3" onClick={handleCopy}>
                <span className="sr-only">{t("cards.copy")}</span>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    );
  }
  
  // Default apartment card
  return (
    <Card 
      className={`overflow-hidden hover:shadow-md transition-transform duration-300 hover:-translate-y-1 ${className}`}
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className="relative">
          <div className="w-full h-48 overflow-hidden">
            <img
              src={card.image || "/api/placeholder/400/300"}
              alt={card.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
            />
          </div>
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium shadow-md">
            {formatPrice(card.cost)}
          </div>
          
          <div className="absolute top-3 left-3 flex space-x-2">
            <button 
              className="p-1.5 bg-background/70 hover:bg-background/90 rounded-full transition-colors"
              onClick={handleShareClick}
            >
              <ShareIcon className="h-4 w-4 text-primary" />
            </button>
            {onFavoriteToggle && (
              <button 
                className="p-1.5 bg-background/70 hover:bg-background/90 rounded-full transition-colors"
                onClick={() => onFavoriteToggle(card.announcementId)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-primary"}`} />
              </button>
            )}
          </div>
        </div>
        
        <CardContent className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{card.address || t("address.notSpecified")}</span>
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6">
            {card.arriveDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatDate(card.arriveDate)}</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <Building className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{card.roomCount} {t("cards.roomCount", { count: parseInt(card.roomCount) })}</span>
            </div>
            <div className="flex items-center text-sm">
              <VenusAndMars className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{getGenderLabel(card.selectedGender)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{card.roommates} {t("cards.peopleCount", { count: card.roommates })}</span>
            </div>
          </div>
          
          {card.consideringOnlyNPeople && (
            <Badge variant="outline" className="mb-4 self-start">
              {t("cards.consideringAsWhole")}
            </Badge>
          )}

          <div className="mt-auto">
            <Button className="w-full" asChild>
              <Link href={`/apartments/${card.announcementId}`} className="flex items-center justify-center">
                {t("cards.learnMore")}
                <ArrowRight className={`h-4 w-4 ml-2 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
      
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("cards.shareListingTitle")}</DialogTitle>
            <DialogDescription>
              {t("cards.shareListingDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                id="link"
                readOnly
                value={shareUrl}
                className="w-full"
              />
            </div>
            <Button size="sm" className="px-3" onClick={handleCopy}>
              <span className="sr-only">{t("cards.copy")}</span>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}