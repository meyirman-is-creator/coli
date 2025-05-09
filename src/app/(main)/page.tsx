"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClientTranslation } from "@/i18n/client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "react-responsive";
import {
  MapIcon,
  ListIcon,
  FilterIcon,
  Loader2,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

import ApartmentFilter from "@/components/apartments/apartment-filter";
import ApartmentCard from "@/components/apartments/apartment-card";
import Map from "@/components/apartments/map";

// Temporarily comment out the Redux actions until we're ready to connect to backend
// import { fetchApartments, setPage, setLimit } from "@/store/slices/apartmentSlice";

export default function ApartmentsPage() {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // For now, use mock data instead of Redux state
  // const { apartments, status, totalCount, page, limit } = useAppSelector(
  //   (state) => state.apartment
  // );
  // const filterState = useAppSelector((state) => state.filter);

  // Mock data
  const [apartments, setApartments] = useState([
    {
      id: "1",
      title: "Уютная 2-комнатная квартира в центре",
      description: "Светлая квартира с современным ремонтом в историческом центре города.",
      type: "apartment",
      price: 65000,
      currency: "RUB",
      location: {
        cityName: "Москва",
        address: "ул. Арбат, 24"
      },
      rooms: 2,
      bathrooms: 1,
      area: 60,
      maxOccupants: 3,
      availableFrom: "2025-05-01T00:00:00Z",
      features: ["wifi", "washing_machine"],
      photos: [
        {
          id: "photo1",
          url: "/api/placeholder/800/600",
          isMain: true
        }
      ],
      owner: {
        name: "Алексей Петров",
        photoUrl: "/api/placeholder/100/100"
      }
    },
    {
      id: "2",
      title: "Просторная комната в 3-комнатной квартире",
      description: "Ищем соседа в трехкомнатную квартиру. Комната светлая, с балконом.",
      type: "room",
      price: 25000,
      currency: "RUB",
      location: {
        cityName: "Москва",
        address: "ул. Ленина, 43"
      },
      rooms: 1,
      bathrooms: 1,
      area: 18,
      maxOccupants: 1,
      availableFrom: "2025-05-15T00:00:00Z",
      features: ["wifi", "washing_machine"],
      photos: [
        {
          id: "photo3",
          url: "/api/placeholder/800/600",
          isMain: true
        }
      ],
      owner: {
        name: "Ирина Смирнова",
        photoUrl: "/api/placeholder/100/100"
      }
    },
    {
      id: "3",
      title: "Студия в новом ЖК",
      description: "Современная студия с панорамными окнами и видом на парк.",
      type: "studio",
      price: 45000,
      currency: "RUB",
      location: {
        cityName: "Москва",
        address: "Проспект Мира, 120"
      },
      rooms: 1,
      bathrooms: 1,
      area: 30,
      maxOccupants: 2,
      availableFrom: "2025-05-10T00:00:00Z",
      features: ["parking", "wifi", "air_conditioning"],
      photos: [
        {
          id: "photo4",
          url: "/api/placeholder/800/600",
          isMain: true
        }
      ],
      owner: {
        name: "Алексей Петров",
        photoUrl: "/api/placeholder/100/100"
      }
    }
  ]);
  
  const [status, setStatus] = useState("succeeded");
  const [totalCount, setTotalCount] = useState(3);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [view, setView] = useState<"list" | "map">("list");
  const [selectedPoints, setSelectedPoints] = useState<
    { x: number; y: number }[]
  >([]);
  const [sortOrder, setSortOrder] = useState<string>("newest");

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

  // Mock the loading and data fetching
  const handleLoadMore = () => {
    setStatus("loading");
    
    // Simulate loading new data
    setTimeout(() => {
      setStatus("succeeded");
      setPage(page + 1);
      
      // Simulate adding new apartments
      if (page < 3) {
        setApartments([...apartments, ...apartments.slice(0, 2)]);
        setTotalCount(totalCount + 2);
      }
    }, 1000);
  };

  const handleFilterSubmit = (filterData: any) => {
    console.log("Filter submitted:", filterData);
    
    // Simulate filtering process
    setStatus("loading");
    
    setTimeout(() => {
      setStatus("succeeded");
      // In a real app, we'd filter the apartments based on the filter data
    }, 1000);
  };

  const handleMapPointsSelected = (points: { x: number; y: number }[]) => {
    setSelectedPoints(points);
    // Simulate data fetching after map points selection
    setStatus("loading");
    
    setTimeout(() => {
      setStatus("succeeded");
      // In a real app, we'd update the apartments based on the selected points
    }, 1000);
  };

  const handleMarkerClick = (apartment: any) => {
    router.push(`/apartments/${apartment.id}`);
  };

  const sortOptions = [
    { value: "newest", label: t("sort.newest", "Новые") },
    { value: "price-asc", label: t("sort.priceAsc", "Цена: по возрастанию") },
    { value: "price-desc", label: t("sort.priceDesc", "Цена: по убыванию") },
    { value: "relevance", label: t("sort.relevance", "По релевантности") },
  ];

  const handleSort = (value: string) => {
    setSortOrder(value);
    setStatus("loading");
    
    setTimeout(() => {
      setStatus("succeeded");
      
      // Simulate sorting
      let sortedApartments = [...apartments];
      if (value === "price-asc") {
        sortedApartments.sort((a, b) => a.price - b.price);
      } else if (value === "price-desc") {
        sortedApartments.sort((a, b) => b.price - a.price);
      }
      
      setApartments(sortedApartments);
    }, 500);
  };

  return (
    <div className="container-custom">
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t("apartments.title", "Поиск жилья")}</h1>

          <div className="flex items-center gap-2">
            <Tabs
              defaultValue={view}
              onValueChange={(v) => setView(v as "list" | "map")}
              className="hidden md:flex"
            >
              <TabsList>
                <TabsTrigger value="list">
                  <ListIcon className="h-4 w-4 mr-2" />
                  {t("view.list", "Список")}
                </TabsTrigger>
                <TabsTrigger value="map">
                  <MapIcon className="h-4 w-4 mr-2" />
                  {t("view.map", "Карта")}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setView(view === "list" ? "map" : "list")}
              >
                {view === "list" ? (
                  <MapIcon className="h-4 w-4" />
                ) : (
                  <ListIcon className="h-4 w-4" />
                )}
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <SlidersHorizontal className="h-4 w-4 mr-1" />
                  {sortOptions.find((opt) => opt.value === sortOrder)?.label}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSort(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] overflow-auto">
                  <ApartmentFilter onSubmit={handleFilterSubmit} />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {!isMobile && (
            <div className="hidden md:block">
              <ApartmentFilter onSubmit={handleFilterSubmit} />
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {status === "loading" && page === 1
                  ? t("apartments.loading", "Загрузка...")
                  : t("apartments.found", `Найдено: ${totalCount} вариантов`, { count: totalCount })}
              </p>
            </div>

            {view === "list" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apartments.map((apartment) => (
                    <ApartmentCard key={apartment.id} 
                    //card={apartment} 
                    />
                  ))}
                </div>

                {status === "loading" && page > 1 ? (
                  <div className="flex justify-center mt-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : apartments.length < totalCount || page < 3 ? (
                  <div className="flex justify-center mt-8">
                    <Button onClick={handleLoadMore} variant="outline">
                      {t("apartments.loadMore", "Загрузить еще")}
                    </Button>
                  </div>
                ) : null}

                {apartments.length === 0 && status !== "loading" && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-medium mb-2">
                      {t("apartments.noResults", "Нет результатов")}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t("apartments.tryAdjusting", "Попробуйте изменить параметры поиска")}
                    </p>
                  </div>
                )}
              </>
            )}

            {view === "map" && (
              <div className="relative">
                <Map
                  apartments={apartments}
                  isLoading={status === "loading" && page === 1}
                  onPointsSelected={handleMapPointsSelected}
                  onMarkerClick={handleMarkerClick}
                  className="rounded-lg border h-[70vh]"
                />

                {!isMobile && apartments.length > 0 && (
                  <div className="absolute top-4 right-4 w-80 max-h-[60vh] overflow-y-auto bg-white shadow-lg rounded-lg p-4 border">
                    <h3 className="text-sm font-medium mb-3">
                      {t("apartments.found", `Найдено: ${totalCount} вариантов`, { count: totalCount })}
                    </h3>
                    <div className="space-y-3">
                      {apartments.slice(0, 5).map((apartment) => (
                        <ApartmentCard
                          key={apartment.id}
                        //   card={apartment}
                          variant="compact"
                        />
                      ))}
                      {apartments.length > 5 && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setView("list")}
                        >
                          {t("apartments.viewAll", `Посмотреть все (${totalCount - 5})`, { count: totalCount - 5 })}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}