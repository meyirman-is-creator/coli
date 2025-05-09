import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useClientTranslation } from "@/i18n/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  ArrowRight
} from "lucide-react";

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
  };
  mini?: boolean;
  isLast?: boolean;
  loadMoreApartments?: () => void;
  disabledButton?: boolean;
  variant?: "default" | "compact";
  className?: string;
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
  mini = false,
  isLast = false,
  loadMoreApartments,
  disabledButton = false,
  variant = "default",
  className = "",
}: ApartmentCardProps) {
  const { t } = useClientTranslation("ru");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && card?.announcementId) {
      setShareUrl(`${window.location.origin}/apartments/${card.announcementId}`);
    }
  }, [card?.announcementId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatCost = (cost: number) => {
    return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const getRoomWord = (count: number): string => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastDigit === 1 && lastTwoDigits !== 11) {
      return "комната";
    } else if (
      (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) &&
      (lastTwoDigits < 10 || lastTwoDigits > 20)
    ) {
      return "комнаты";
    } else {
      return "комнат";
    }
  };

  const getGender = (code: string): string => {
    const genderMap: Record<string, string> = {
      "MALE": "Мужской",
      "FEMALE": "Женский",
      "ANY": "Любой пол",
      "OTHER": "Другой"
    };
    return genderMap[code] || "Любой пол";
  };

  const imageWidth = mini ? 240 : 280;
  const imageHeight = mini ? 120 : 180;

  if (variant === "compact" || mini) {
    return (
      <Card className={`overflow-hidden h-full hover:shadow-md transition-shadow ${className}`}>
        <div className="relative">
          <div className="w-full h-36 overflow-hidden">
            <Image
              src={card.image}
              alt={card.title}
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
            {formatCost(card.cost)} ₸
          </div>
          <button 
            className="absolute top-2 left-2 p-1 bg-background/70 rounded-full" 
            onClick={() => setShareDialogOpen(true)}
          >
            <ShareIcon className="h-4 w-4 text-primary" />
          </button>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{card.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{card.address}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mb-3">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
              <span>{card.arriveDate}</span>
            </div>
            <div className="flex items-center">
              <Home className="h-3 w-3 mr-1 text-muted-foreground" />
              <span>{card.roomCount} {getRoomWord(Number(card.roomCount))}</span>
            </div>
            <div className="flex items-center col-span-2">
              <Users className="h-3 w-3 mr-1 text-muted-foreground" />
              <span>{getGender(card.selectedGender)} · {card.roommates} чел.</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={`/apartments/${card.announcementId}`}>
              Узнать больше
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <Card className={`overflow-hidden h-full hover:shadow-md transition-shadow ${className}`}>
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/3">
            <div className="w-full h-48 md:h-full overflow-hidden">
              <Image
                src={card.image}
                alt={card.title}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
              {formatCost(card.cost)} ₸
            </div>
            <button 
              className="absolute top-3 left-3 p-1.5 bg-background/70 rounded-full hover:bg-background/90 transition-colors" 
              onClick={() => setShareDialogOpen(true)}
            >
              <ShareIcon className="h-4 w-4 text-primary" />
            </button>
          </div>
          
          <CardContent className="p-5 md:w-2/3 flex flex-col">
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{card.address}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{card.arriveDate}</span>
              </div>
              <div className="flex items-center text-sm">
                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{card.roomCount} {getRoomWord(Number(card.roomCount))}</span>
              </div>
              <div className="flex items-center text-sm col-span-2">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{getGender(card.selectedGender)} · {card.roommates} чел.</span>
              </div>
            </div>

            <div className="mt-auto">
              <Button className="w-full md:w-auto" asChild>
                <Link href={`/apartments/${card.announcementId}`} className="flex items-center justify-center">
                  Узнать больше
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {isLast && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
          <Button 
            onClick={loadMoreApartments} 
            disabled={disabledButton}
            size="lg"
            className="font-medium"
          >
            Загрузить еще объявления
          </Button>
        </div>
      )}

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
    </div>
  );
}