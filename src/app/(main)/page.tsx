"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClientTranslation } from "@/i18n/client";
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
  SearchX,
  RefreshCw
} from "lucide-react";

import ApartmentFilter from "@/components/apartments/apartment-filter";
import ApartmentCard from "@/components/apartments/apartment-card";
import ApartmentsMap from "@/components/apartments/map"; // Updated import name

export default function ApartmentsPage() {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale);
  const router = useRouter();

  // State for apartments data
  const [apartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Favorites state
  const [favorites, setFavorites] = useState<number[]>([]);

  const [view, setView] = useState<"list" | "map">("list");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [isFiltered, setIsFiltered] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

  // Fetch apartments data when component mounts
  useEffect(() => {
    fetchApartments();
  }, []);

  // Fetch apartments data
  const fetchApartments = async () => {
    setLoading(true);
    setIsFiltered(false);
    
    try {
      // In a real app, this would be a real API call
      // const response = await fetch('/api/apartments');
      // const data = await response.json();
      
      // For demo, simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data for demonstration
      const mockData = {
        data: [
          {
            "announcementId": 816,
            "image": "https://i.pinimg.com/originals/d4/7b/e2/d47be28251f9931b33fb37816bc32143.png",
            "title": "Ищу людей для квартиры",
            "address": "Жибек жолы, зерде 5",
            "arriveDate": "2025-04-01",
            "roomCount": "2",
            "selectedGender": "MALE",
            "roommates": 2,
            "cost": 45000,
            "coordsX": "50.281484",
            "coordsY": "57.296383",
            "isArchived": false,
            "consideringOnlyNPeople": false
          },
          {
            "announcementId": 500,
            "image": "https://i.pinimg.com/originals/0c/71/07/0c7107b8ee09b17f87de5cfd883932f9.jpg",
            "title": "Сдаю 5-комнатную квартиру на Жандосова",
            "address": "ул. Жандосова, 58",
            "arriveDate": "2025-04-05",
            "roomCount": "2",
            "selectedGender": "OTHER",
            "roommates": 4,
            "cost": 45000,
            "coordsX": "51.129547",
            "coordsY": "71.443112",
            "isArchived": false,
            "consideringOnlyNPeople": true
          },
          {
            "announcementId": 861,
            "image": "https://findroommate.s3.eu-north-1.amazonaws.com/1743106179200_1.avif",
            "title": "ищем 2 парней",
            "address": "Жандосова 84",
            "arriveDate": null,
            "roomCount": "2",
            "selectedGender": "MALE",
            "roommates": 2,
            "cost": 50000,
            "coordsX": "43.225903",
            "coordsY": "76.889329",
            "isArchived": false,
            "consideringOnlyNPeople": false
          },
          {
            "announcementId": 934,
            "image": "https://findroommate.s3.eu-north-1.amazonaws.com/1743422361279_1729236904628.jpeg",
            "title": "Ишу 2 парня рядом сду",
            "address": "Абылайхана 1 19",
            "arriveDate": null,
            "roomCount": "3",
            "selectedGender": "MALE",
            "roommates": 3,
            "cost": 60000,
            "coordsX": "43.200982",
            "coordsY": "76.652176",
            "isArchived": false,
            "consideringOnlyNPeople": false
          },
          {
            "announcementId": 748,
            "image": "https://i.pinimg.com/originals/2d/81/d5/2d81d5b0ab403c8f0933fcc37e77c94e.jpg",
            "title": "Сдаю 5-комнатную квартиру на Абая",
            "address": "ул. Абая, 118, город Алматы",
            "arriveDate": "2025-06-13",
            "roomCount": "5",
            "selectedGender": "FEMALE",
            "roommates": 1,
            "cost": 80194,
            "coordsX": "43.190938",
            "coordsY": "76.799136",
            "isArchived": false,
            "consideringOnlyNPeople": false
          },
          {
            "announcementId": 562,
            "image": "https://i.pinimg.com/originals/3a/2b/e6/3a2be6f7ca58396c413caad5eda6b1df.jpg",
            "title": "Сдаю 5-комнатную квартиру на Толе би",
            "address": "ул. Толе би, 89, город Алматы",
            "arriveDate": "2025-07-18",
            "roomCount": "5",
            "selectedGender": "FEMALE",
            "roommates": 1,
            "cost": 80605,
            "coordsX": "43.332757",
            "coordsY": "76.912222",
            "isArchived": false,
            "consideringOnlyNPeople": false
          },
          {
            "announcementId": 343,
            "image": "https://i.pinimg.com/originals/04/73/67/0473672670780ec9686f7c4f041d2fae.jpg",
            "title": "Сдаю 3-комнатную квартиру на Жибек Жолы",
            "address": "ул. Жибек Жолы, 104, город Алматы",
            "arriveDate": "2025-08-03",
            "roomCount": "3",
            "selectedGender": "OTHER",
            "roommates": 2,
            "cost": 80755,
            "coordsX": "43.261614",
            "coordsY": "76.941995",
            "isArchived": false,
            "consideringOnlyNPeople": true
          },
          {
            "announcementId": 900,
            "image": "https://images.pexels.com/photos/271682/pexels-photo-271682.jpeg?auto=compress&cs=tinysrgb&w=600",
            "title": "Сдаю 2-комнатную квартиру на Оркен",
            "address": "ул. Оркен, 12",
            "arriveDate": "2025-05-03",
            "roomCount": "2",
            "selectedGender": "OTHER",
            "roommates": 2,
            "cost": 81053,
            "coordsX": "43.200982",
            "coordsY": "76.652176",
            "isArchived": false,
            "consideringOnlyNPeople": true
          }
        ]
      };
      
      setApartments(mockData.data);
      setTotalCount(mockData.data.length);
      setHasMore(false); // For demo, no pagination
    } catch (err) {
      console.error('Error fetching apartments:', err);
      setError('Не удалось загрузить объявления. Пожалуйста, попробуйте снова позже.');
    } finally {
      setLoading(false);
    }
  };

  // Load more apartments (for pagination)
  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    setPage(prev => prev + 1);
    
    try {
      // This would be a real API call with pagination in production
      // const response = await fetch(`/api/apartments?page=${page + 1}`);
      // const data = await response.json();
      
      // For demo, simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration - in real app, this would append new data
      const mockNewData = [] as any[];
      
      setApartments(prev => [...prev, ...mockNewData]);
      setHasMore(mockNewData.length > 0);
    } catch (err) {
      console.error('Error loading more apartments:', err);
      setError('Не удалось загрузить больше объявлений.');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter submission
  const handleFilterSubmit = (filterData: any) => {
    console.log("Filter submitted:", filterData);
    
    // In production, this would make an API call with filter parameters
    setLoading(true);
    setIsFiltered(true);
    
    setTimeout(() => {
      // Simulate filtering by just showing the first few items
      setApartments(prevApartments => prevApartments.slice(0, 3));
      setTotalCount(3);
      setHasMore(false);
      setLoading(false);
    }, 1000);
  };

  // Handle toggling favorite status
  const handleFavoriteToggle = (id: number) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(favId => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle marker click on map - now directly navigates to the apartment page
  const handleMarkerClick = (apartment: any) => {
    if (apartment) {
      router.push(`/apartments/${apartment.announcementId}`);
    }
  };

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Новые" },
    { value: "price-asc", label: "Цена: по возрастанию" },
    { value: "price-desc", label: "Цена: по убыванию" },
    { value: "relevance", label: "По релевантности" },
  ];

  // Handle sorting
  const handleSort = (value: string) => {
    setSortOrder(value);
    setLoading(true);
    
    setTimeout(() => {
      const sortedApartments = [...apartments];
      
      if (value === "price-asc") {
        sortedApartments.sort((a, b) => a.cost - b.cost);
      } else if (value === "price-desc") {
        sortedApartments.sort((a, b) => b.cost - a.cost);
      } else if (value === "newest") {
        // Newest would likely sort by date in real app
        // For demo, just reverse the array
        sortedApartments.reverse();
      }
      
      setApartments(sortedApartments);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="container-custom">
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Поиск жилья</h1>

          <div className="flex items-center gap-2">
            <Tabs
              defaultValue={view}
              onValueChange={(v) => setView(v as "list" | "map")}
              className="hidden md:flex"
            >
              <TabsList>
                <TabsTrigger value="list">
                  <ListIcon className="h-4 w-4 mr-2" />
                  Список
                </TabsTrigger>
                <TabsTrigger value="map">
                  <MapIcon className="h-4 w-4 mr-2" />
                  Карта
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
                {loading && page === 1
                  ? "Загрузка..."
                  : `Найдено: ${totalCount} вариантов`}
              </p>
              
              {isFiltered && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchApartments}
                  className="text-xs flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Сбросить фильтры
                </Button>
              )}
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setError(null);
                    fetchApartments();
                  }}
                  className="ml-4"
                >
                  Попробовать снова
                </Button>
              </div>
            )}

            {view === "list" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apartments.map((apartment) => (
                    <ApartmentCard 
                      key={apartment.announcementId} 
                      card={apartment}
                      onFavoriteToggle={handleFavoriteToggle}
                      isFavorite={favorites.includes(apartment.announcementId)}
                    />
                  ))}
                </div>

                {loading && page > 1 ? (
                  <div className="flex justify-center mt-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : hasMore ? (
                  <div className="flex justify-center mt-8">
                    <Button onClick={handleLoadMore} variant="outline">
                      Загрузить еще
                    </Button>
                  </div>
                ) : null}

                {apartments.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted rounded-full p-4 mb-4">
                      <SearchX className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium mb-2">
                      Нет результатов
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                      По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска или сбросить фильтры.
                    </p>
                    <Button
                      variant="outline"
                      onClick={fetchApartments}
                    >
                      Сбросить фильтры
                    </Button>
                  </div>
                )}
              </>
            )}

            {view === "map" && (
              <ApartmentsMap
                apartments={apartments}
                isLoading={loading && page === 1}
                onMarkerClick={handleMarkerClick}
                className="rounded-lg border h-[70vh]"
                showMobileList={true}
                initialZoom={12}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}