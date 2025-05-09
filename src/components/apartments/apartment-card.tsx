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
  Heart
} from "lucide-react";
import { formatPrice } from "@/utils/helpers";

export interface ApartmentCardProps {
  card?: {
    announcementId: number;
    image: string;
    title: string;
    address: string;
    arriveDate: string;
    roomCount: string;
    selectedGender: string;
    roommates: number;
    cost: number;
    coordsX?: string;
    coordsY?: string;
    isArchived?: boolean;
    consideringOnlyNPeople?: boolean;
  };
  variant?: "default" | "compact" | "featured";
  className?: string;
  onFavoriteToggle?: (id: number) => void;
  isFavorite?: boolean;
}
const defaultCard = {
    announcementId: 0,
    image: "/api/placeholder/400/300",
    title: "Loading...",
    address: "Loading...",
    arriveDate: "Loading...",
    roomCount: "0",
    selectedGender: "ANY",
    roommates: 0,
    cost: 0
  };

export default function ApartmentCard({
  card = defaultCard,
  variant = "default",
  className = "",
  onFavoriteToggle,
  isFavorite = false
}: ApartmentCardProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  
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

  const getGenderLabel = (gender: string): string => {
    const genderMap: Record<string, string> = {
      "MALE": "Мужской",
      "FEMALE": "Женский",
      "ANY": "Любой пол",
      "OTHER": "Другой"
    };
    return genderMap[gender] || "Любой пол";
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
                <span className="truncate">{card.address}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs flex items-center">
                <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                <span>{getGenderLabel(card.selectedGender)} · {card.roommates} чел.</span>
              </div>
              
              <Button variant="ghost" size="sm" className="p-0 h-auto" asChild>
                <Link href={`/apartments/${card.announcementId}`}>
                  Подробнее
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
              <Star className="h-3 w-3 mr-1" /> Рекомендуемое
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
              <span className="truncate">{card.address}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 mb-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{card.arriveDate}</span>
              </div>
              <div className="flex items-center text-sm">
                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{card.roomCount} комнат{Number(card.roomCount) > 1 ? 'ы' : 'а'}</span>
              </div>
              <div className="flex items-center text-sm col-span-2">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{getGenderLabel(card.selectedGender)} · {card.roommates} чел.</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-4 pb-4 pt-0">
            <Button className="w-full group-hover:bg-primary/90" asChild>
              <Link href={`/apartments/${card.announcementId}`} className="flex items-center justify-center">
                Подробнее
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </div>
        
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Поделиться объявлением</DialogTitle>
              <DialogDescription>
                Скопируйте ссылку и поделитесь с друзьями
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
                <span className="sr-only">Copy</span>
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
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative md:w-2/5">
          <div className="w-full h-48 md:h-full overflow-hidden">
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
        
        <CardContent className="p-5 md:w-3/5 flex flex-col h-full">
          <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{card.address}</span>
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{card.arriveDate}</span>
            </div>
            <div className="flex items-center text-sm">
              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{card.roomCount} комнат{Number(card.roomCount) > 1 ? 'ы' : 'а'}</span>
            </div>
            <div className="flex items-center text-sm col-span-2">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{getGenderLabel(card.selectedGender)} · {card.roommates} чел.</span>
            </div>
          </div>
          
          {card.consideringOnlyNPeople && (
            <Badge variant="outline" className="mb-4 self-start">
              Рассматривается как единое целое
            </Badge>
          )}

          <div className="mt-auto">
            <Button className="w-full md:w-auto" asChild>
              <Link href={`/apartments/${card.announcementId}`} className="flex items-center justify-center">
                Узнать больше
                <ArrowRight className={`h-4 w-4 ml-2 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
      
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Поделиться объявлением</DialogTitle>
            <DialogDescription>
              Скопируйте ссылку и поделитесь с друзьями
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
              <span className="sr-only">Copy</span>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}