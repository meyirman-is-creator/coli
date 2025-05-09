"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClientTranslation } from "@/i18n/client";
import {
  ArrowLeft,
  Calendar,
  Home,
  MapPin,
  Users,
  Share as ShareIcon,
  Heart,
  Check,
  Copy,
  Phone,
  Mail,
  MessageSquare,
  Building,
  Info,
  Wifi,
  ParkingSquare,
  Cat,
  Wind,
  Utensils,
  X,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TriangleAlert,
  Shield,
  Clock
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Map from "@/components/apartments/map";

export default function ApartmentDetailPage({ params }: { params: { id: string } }) {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale);
  const router = useRouter();
  const id = params.id;

  const [apartment, setApartment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [messageText, setMessageText] = useState("");
  const [revealContacts, setRevealContacts] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Fetch apartment data
  useEffect(() => {
    const fetchApartmentData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call to get the apartment data
        // const response = await fetch(`/api/apartments/${id}`);
        // const data = await response.json();
        
        // For demo, simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Example apartment data based on the format from your API
        const mockApartment = {
          announcementId: parseInt(id),
          image: "https://i.pinimg.com/originals/d4/7b/e2/d47be28251f9931b33fb37816bc32143.png",
          title: "Ищу людей для квартиры",
          address: "Жибек жолы, зерде 5",
          arriveDate: "2025-04-01",
          roomCount: "2",
          selectedGender: "MALE",
          roommates: 2,
          cost: 45000,
          coordsX: "50.281484",
          coordsY: "57.296383",
          isArchived: false,
          consideringOnlyNPeople: false,
          description: "Квартира находится в новом жилом комплексе с хорошей инфраструктурой. Рядом есть магазины, кафе, парк и остановки общественного транспорта. Квартира полностью меблирована, есть вся необходимая бытовая техника. Ищу ответственных соседей, которые будут поддерживать чистоту и порядок.\n\nТребования к соседям:\n- Не курящие\n- Ответственные и аккуратные\n- Без домашних животных\n- Работающие или студенты\n\nПредпочтение мужчинам, так как уже живут двое парней. Коммунальные услуги оплачиваются отдельно, примерно 15000 тенге в месяц. Интернет и кабельное ТВ включены в стоимость аренды.",
          features: ["wifi", "parking", "pets_allowed", "air_conditioning", "washing_machine"],
          images: [
            "https://i.pinimg.com/originals/d4/7b/e2/d47be28251f9931b33fb37816bc32143.png",
            "https://i.pinimg.com/originals/0c/71/07/0c7107b8ee09b17f87de5cfd883932f9.jpg",
            "https://findroommate.s3.eu-north-1.amazonaws.com/1743106179200_1.avif",
            "https://i.pinimg.com/originals/2d/81/d5/2d81d5b0ab403c8f0933fcc37e77c94e.jpg"
          ],
          owner: {
            name: "Александр",
            image: "/api/placeholder/100/100",
            phone: "+7 (777) 123-45-67",
            email: "alexander@example.com",
            responseRate: 95,
            responseTime: "В течение часа",
            id: 123456
          },
          bathrooms: 1,
          area: 65,
          floor: 5,
          totalFloors: 9,
          yearBuilt: 2018,
          furnished: true,
          deposit: 45000,
          utilityIncluded: false,
          utilityApproxCost: 15000,
          petFriendly: true,
          smokingAllowed: false,
          drinkingAllowed: true,
          createdAt: "2025-02-15T14:30:00Z",
          viewsCount: 243,
          applicationsCount: 5,
          hasActiveApplication: false,
          nearbyPlaces: [
            { type: "shop", name: "Магазин 'Продукты'", distance: "100 м" },
            { type: "cafe", name: "Кафе 'Встреча'", distance: "150 м" },
            { type: "park", name: "Парк отдыха", distance: "300 м" },
            { type: "bus_stop", name: "Остановка 'Улица Жибек жолы'", distance: "50 м" },
            { type: "pharmacy", name: "Аптека 'Здоровье'", distance: "200 м" }
          ],
          security: {
            concierge: true,
            cctv: true,
            intercom: true,
            securedEntrance: true
          },
          averageBills: {
            electricity: 5000,
            water: 3000,
            heating: 7000,
            internet: 5000
          },
          rules: [
            "Без шума после 22:00",
            "Не курить в помещении",
            "Поддерживать чистоту в общих зонах",
            "Гости могут оставаться не более двух дней"
          ]
        };
        
        setApartment(mockApartment);
      } catch (err) {
        console.error('Error fetching apartment data:', err);
        setError('Не удалось загрузить данные объявления. Пожалуйста, попробуйте снова позже.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApartmentData();
    }
  }, [id]);

  // Set share URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Format price
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Вчера";
    
    return `${diffDays} дней назад`;
  };

  // Get gender label
  const getGenderLabel = (gender: string): string => {
    const genderMap: Record<string, string> = {
      "MALE": "Мужской",
      "FEMALE": "Женский",
      "OTHER": "Любой пол"
    };
    return genderMap[gender] || "Любой пол";
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would call an API to save the favorite status
  };

  // Handle contacting owner
  const handleContactOwner = () => {
    if (!messageText.trim()) return;
    
    // In a real app, this would call an API to send the message
    alert(`Сообщение отправлено: ${messageText}`);
    setMessageText("");
    setContactDialogOpen(false);
  };

  // Handle application submission
  const handleApply = () => {
    // In a real app, this would open a form or call an API to submit an application
    setApplicationsDialogOpen(true);
  };

  // Get feature icon
  const getFeatureIcon = (feature: string) => {
    const featureIcons: Record<string, React.ReactNode> = {
      "wifi": <Wifi className="h-5 w-5" />,
      "parking": <ParkingSquare className="h-5 w-5" />,
      "pets_allowed": <Cat className="h-5 w-5" />,
      "air_conditioning": <Wind className="h-5 w-5" />,
      "washing_machine": <Utensils className="h-5 w-5" />
    };
    
    return featureIcons[feature] || <Check className="h-5 w-5" />;
  };

  // Get feature label
  const getFeatureLabel = (feature: string) => {
    const featureLabels: Record<string, string> = {
      "wifi": "Wi-Fi",
      "parking": "Парковка",
      "pets_allowed": "Можно с животными",
      "air_conditioning": "Кондиционер",
      "washing_machine": "Стиральная машина"
    };
    
    return featureLabels[feature] || feature.replace('_', ' ');
  };

  // Loading state
  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <Skeleton className="h-8 w-1/3" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div>
            <Skeleton className="h-96 w-full rounded-lg mb-6" />
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-20 w-20 rounded-md" />
              <Skeleton className="h-20 w-20 rounded-md" />
              <Skeleton className="h-20 w-20 rounded-md" />
            </div>
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div>
            <Skeleton className="h-64 w-full rounded-lg mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !apartment) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </div>
        
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Ошибка загрузки</CardTitle>
            <CardDescription>
              Не удалось загрузить данные объявления.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {error || "Объявление не найдено или недоступно."}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/apartments')}>
              Вернуться к списку объявлений
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Top Navigation & Actions */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к объявлениям
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShareDialogOpen(true)}
          >
            <ShareIcon className="h-4 w-4 mr-2" />
            Поделиться
          </Button>
          
          <Button 
            variant={isFavorite ? "default" : "outline"} 
            size="sm"
            onClick={handleFavoriteToggle}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-primary-foreground" : ""}`} />
            {isFavorite ? "В избранном" : "В избранное"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left Column - Apartment Details */}
        <div>
          {/* Image Carousel */}
          <div className="relative">
            <Carousel className="w-full mb-4">
              <CarouselContent>
                {(apartment.images || [apartment.image]).map((image: string, index: number) => (
                  <CarouselItem key={index}>
                    <div className="h-[400px] w-full relative rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${apartment.title} - фото ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
            
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
              {activeImage + 1} / {(apartment.images || [apartment.image]).length}
            </div>
          </div>
          
          {/* Thumbnails */}
          {apartment.images && apartment.images.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {apartment.images.map((image: string, index: number) => (
                <div 
                  key={index}
                  className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border cursor-pointer transition-all ${index === activeImage ? 'border-primary border-2' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${apartment.title} - миниатюра ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Apartment Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{apartment.title}</h1>
              <p className="text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1 inline" />
                {apartment.address}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatPrice(apartment.cost)}</div>
              <p className="text-sm text-muted-foreground">
                {apartment.utilityIncluded ? "Коммунальные включены" : "Без коммунальных"}
              </p>
            </div>
          </div>
          
          {/* Key Features */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {apartment.roomCount && (
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Комнаты</p>
                  <p className="text-muted-foreground">{apartment.roomCount}</p>
                </div>
              </div>
            )}
            
            {apartment.bathrooms && (
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Санузлы</p>
                  <p className="text-muted-foreground">{apartment.bathrooms}</p>
                </div>
              </div>
            )}
            
            {apartment.area && (
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Площадь</p>
                  <p className="text-muted-foreground">{apartment.area} м²</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <div>
                <p className="text-sm font-medium">Соседи</p>
                <p className="text-muted-foreground">{apartment.roommates} чел.</p>
              </div>
            </div>
            
            {apartment.arriveDate && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-sm font-medium">Дата заезда</p>
                  <p className="text-muted-foreground">{formatDate(apartment.arriveDate)}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary" />
              <div>
                <p className="text-sm font-medium">Пол</p>
                <p className="text-muted-foreground">{getGenderLabel(apartment.selectedGender)}</p>
              </div>
            </div>
          </div>
          
          {/* Detailed Tabs */}
          <Tabs defaultValue="details" onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Описание</TabsTrigger>
              <TabsTrigger value="features">Особенности</TabsTrigger>
              <TabsTrigger value="rules">Правила</TabsTrigger>
              <TabsTrigger value="location">Расположение</TabsTrigger>
            </TabsList>
            
            {/* Description Tab */}
            <TabsContent value="details" className="pt-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Описание</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {apartment.description || "Описание отсутствует"}
                </p>
              </div>
              
              {apartment.consideringOnlyNPeople && (
                <div className="mb-6 p-4 bg-accent/40 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-base font-semibold">Рассматривается как единое целое</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Владелец рассматривает заявки только от группы людей, которые будут снимать жилье вместе.
                  </p>
                </div>
              )}
              
              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Детали помещения</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Этаж:</span>
                      </div>
                      <div className="text-sm font-medium">
                        {apartment.floor} из {apartment.totalFloors}
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Год постройки:</span>
                      </div>
                      <div className="text-sm font-medium">
                        {apartment.yearBuilt}
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Мебель:</span>
                      </div>
                      <div className="text-sm font-medium">
                        {apartment.furnished ? "Есть" : "Нет"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Безопасность</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-3">
                      {apartment.security && Object.entries(apartment.security).map(([key, value]) => (
                        value ? (
                          <React.Fragment key={key}>
                            <div className="text-sm">
                              <span className="text-muted-foreground">{
                                {
                                  concierge: "Консьерж:",
                                  cctv: "Видеонаблюдение:",
                                  intercom: "Домофон:",
                                  securedEntrance: "Охраняемый вход:"
                                }[key]
                              }</span>
                            </div>
                            <div className="text-sm font-medium flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-1" />
                              Есть
                            </div>
                          </React.Fragment>
                        ) : null
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-xs text-muted-foreground mt-8 flex justify-between items-center">
                <span>Объявление создано: {formatTimeAgo(apartment.createdAt)}</span>
                <span>Просмотров: {apartment.viewsCount}</span>
              </div>
            </TabsContent>
            
            {/* Features Tab */}
            <TabsContent value="features" className="pt-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Особенности и удобства</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {apartment.features && apartment.features.map((feature: string) => (
                    <div key={feature} className="flex items-center p-3 border rounded-lg">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        {getFeatureIcon(feature)}
                      </div>
                      <span className="font-medium">{getFeatureLabel(feature)}</span>
                    </div>
                  ))}
                  
                  {apartment.furnished && (
                    <div className="flex items-center p-3 border rounded-lg">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">Мебелировано</span>
                    </div>
                  )}
                  
                  {apartment.petFriendly && (
                    <div className="flex items-center p-3 border rounded-lg">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Cat className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">Можно с животными</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Financial Terms */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Финансовые условия</h3>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Аренда</p>
                        <p className="font-semibold">{formatPrice(apartment.cost)}</p>
                      </div>
                      
                      {apartment.deposit !== undefined && (
                        <div>
                          <p className="text-sm text-muted-foreground">Залог</p>
                          <p className="font-semibold">{formatPrice(apartment.deposit)}</p>
                        </div>
                      )}
                      
                      {apartment.utilityApproxCost !== undefined && (
                        <div>
                          <p className="text-sm text-muted-foreground">Коммунальные (~)</p>
                          <p className="font-semibold">{formatPrice(apartment.utilityApproxCost)}</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Всего (~)</p>
                        <p className="font-semibold">
                          {formatPrice(
                            apartment.cost + (apartment.utilityIncluded ? 0 : (apartment.utilityApproxCost || 0))
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Average Bills */}
              {apartment.averageBills && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Средние счета</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(apartment.averageBills).map(([key, value]) => (
                      <Card key={key}>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                          <div className="mb-2">
                            {
                              {
                                electricity: <DollarSign className="h-6 w-6 text-yellow-500" />,
                                water: <DollarSign className="h-6 w-6 text-blue-500" />,
                                heating: <DollarSign className="h-6 w-6 text-red-500" />,
                                internet: <DollarSign className="h-6 w-6 text-green-500" />
                              }[key]
                            }
                          </div>
                          <p className="text-sm text-muted-foreground capitalize">
                            {
                              {
                                electricity: "Электричество",
                                water: "Вода",
                                heating: "Отопление",
                                internet: "Интернет"
                              }[key]
                            }
                          </p>
                          <p className="font-semibold">{formatPrice(value as number)}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Rules Tab */}
            <TabsContent value="rules" className="pt-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Правила проживания</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center p-3 border rounded-lg">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      {apartment.smokingAllowed ? <Check className="h-5 w-5 text-primary" /> : <X className="h-5 w-5 text-destructive" />}
                    </div>
                    <span className="font-medium">{apartment.smokingAllowed ? "Курение разрешено" : "Курение запрещено"}</span>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      {apartment.drinkingAllowed ? <Check className="h-5 w-5 text-primary" /> : <X className="h-5 w-5 text-destructive" />}
                    </div>
                    <span className="font-medium">{apartment.drinkingAllowed ? "Алкоголь разрешен" : "Алкоголь запрещен"}</span>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      {apartment.petFriendly ? <Check className="h-5 w-5 text-primary" /> : <X className="h-5 w-5 text-destructive" />}
                    </div>
                    <span className="font-medium">{apartment.petFriendly ? "Животные разрешены" : "Животные запрещены"}</span>
                  </div>
                </div>
                
                {apartment.rules && apartment.rules.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-semibold mb-3">Дополнительные правила</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {apartment.rules.map((rule: string, index: number) => (
                        <li key={index} className="text-muted-foreground">{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="bg-accent/40 p-4 rounded-lg">
                  <div className="flex items-start mb-2">
                    <TriangleAlert className="h-5 w-5 mr-2 text-primary mt-0.5" />
                    <div>
                      <h3 className="text-base font-semibold">Важно знать</h3>
                      <p className="text-sm text-muted-foreground">
                        Правила устанавливаются владельцем и применяются ко всем жильцам. 
                        Перед подачей заявки убедитесь, что вы согласны с ними.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Location Tab */}
            <TabsContent value="location" className="pt-4">
              <h3 className="text-lg font-semibold mb-3">Расположение на карте</h3>
              
              <div className="h-[400px] rounded-lg overflow-hidden mb-6">
                <Map
                  apartments={[apartment]}
                  isLoading={false}
                  center={[parseFloat(apartment.coordsY), parseFloat(apartment.coordsX)]}
                  zoom={14}
                  className="rounded-lg border h-full"
                />
              </div>
              
              {apartment.nearbyPlaces && apartment.nearbyPlaces.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3">Что рядом</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {apartment.nearbyPlaces.map((place: any, index: number) => (
                      <div key={index} className="flex items-center border rounded-lg p-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{place.name}</p>
                          <p className="text-xs text-muted-foreground">{place.distance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-start mb-4">
                <MapPin className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  Точный адрес будет доступен после одобрения вашей заявки владельцем. 
                  Указанное на карте местоположение является приблизительным.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column - Contact & Apply */}
        <div>
          {/* Owner Card */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Владелец</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={apartment.owner.image} alt={apartment.owner.name} />
                  <AvatarFallback>{apartment.owner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{apartment.owner.name}</p>
                  <p className="text-xs text-muted-foreground">
                    На платформе с {new Date(apartment.createdAt).getFullYear()} г.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-sm">
                  <p className="text-muted-foreground">Отвечает</p>
                  <p className="font-medium">{apartment.owner.responseRate}%</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Время ответа</p>
                  <p className="font-medium">{apartment.owner.responseTime}</p>
                </div>
              </div>
              
              {revealContacts ? (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-primary" />
                    <p>{apartment.owner.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-primary" />
                    <p>{apartment.owner.email}</p>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setRevealContacts(true)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Показать контакты
                </Button>
              )}
            </CardContent>
          </Card>
          
          {/* Application Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-2xl font-bold">{formatPrice(apartment.cost)}</p>
                  {!apartment.utilityIncluded && apartment.utilityApproxCost && (
                    <p className="text-sm text-muted-foreground">
                      + ~{formatPrice(apartment.utilityApproxCost)} за коммунальные
                    </p>
                  )}
                </div>
                {apartment.deposit && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Залог</p>
                    <p className="font-medium">{formatPrice(apartment.deposit)}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <p className="flex items-center text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Дата заезда: {apartment.arriveDate ? formatDate(apartment.arriveDate) : "Гибкая"}
                </p>
                <p className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {getGenderLabel(apartment.selectedGender)}, {apartment.roommates} соседей
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleApply}
                  disabled={apartment.hasActiveApplication}
                >
                  {apartment.hasActiveApplication ? "Заявка отправлена" : "Отправить заявку"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setContactDialogOpen(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Написать сообщение
                </Button>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex items-start">
                <Shield className="h-5 w-5 mr-3 text-primary mt-1" />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-1">Не отправляйте деньги без подписания договора.</p>
                  <p>Общайтесь только через платформу для вашей безопасности.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Application Status */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Статус</CardTitle>
                <Badge>
                  {apartment.applicationsCount} заявок
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">
                    {apartment.consideringOnlyNPeople 
                      ? "Принимаются групповые заявки" 
                      : "Активный поиск соседей"}
                  </p>
                  <p className="text-muted-foreground">
                    {apartment.consideringOnlyNPeople 
                      ? "Владелец рассматривает заявки от групп людей" 
                      : "Можно подать индивидуальную заявку"}
                  </p>
                </div>
              </div>
              
              <div className="p-3 bg-accent/40 rounded-lg text-sm">
                <p>
                  {apartment.consideringOnlyNPeople 
                    ? "Обратите внимание, что это объявление предназначено для групп. Соберите друзей и подайте совместную заявку." 
                    : "Владелец активно ищет соседей. Рекомендуем подать заявку как можно скорее."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Share Dialog */}
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
              <span className="sr-only">Копировать</span>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Связаться с владельцем</DialogTitle>
            <DialogDescription>
              Отправьте сообщение владельцу, чтобы узнать подробности
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={apartment.owner.image} alt={apartment.owner.name} />
                <AvatarFallback>{apartment.owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{apartment.owner.name}</p>
                <p className="text-xs text-muted-foreground">Владелец</p>
              </div>
            </div>
            
            <Textarea
              placeholder="Напишите ваше сообщение..."
              value={messageText}
              onChange={(e: any) => setMessageText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setContactDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Отмена
            </Button>
            <Button 
              onClick={handleContactOwner}
              disabled={!messageText.trim()}
              className="w-full sm:w-auto"
            >
              Отправить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Applications Dialog */}
      <Dialog open={applicationsDialogOpen} onOpenChange={setApplicationsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Отправить заявку</DialogTitle>
            <DialogDescription>
              Заполните форму для отправки заявки на проживание
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="p-3 bg-accent/40 rounded-lg flex items-start">
              <Info className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Важно!</p>
                <p className="text-muted-foreground">
                  {apartment.consideringOnlyNPeople 
                    ? "Владелец рассматривает заявки только от групп. Если вы подаете заявку один, она может быть отклонена." 
                    : "После отправки заявки владелец рассмотрит её и свяжется с вами."}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Дата заезда</label>
                <Input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  defaultValue={apartment.arriveDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Срок проживания</label>
                <select className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="1-3">1-3 месяца</option>
                  <option value="3-6">3-6 месяцев</option>
                  <option value="6-12" selected>6-12 месяцев</option>
                  <option value="12+">Более года</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Сообщение владельцу</label>
              <Textarea 
                placeholder="Расскажите о себе, своих привычках и почему вы заинтересованы в этом жилье..."
                className="min-h-[120px]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="rules-agree" 
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="rules-agree" className="text-sm cursor-pointer">
                Я соглашаюсь с правилами проживания и условиями оплаты
              </label>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Отмена
              </Button>
            </DialogClose>
            <Button className="w-full sm:w-auto">
              Отправить заявку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}