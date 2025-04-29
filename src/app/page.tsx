"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  fetchApartments,
  setPage,
  setLimit,
} from "@/store/slices/apartmentSlice";
import { ApartmentCard } from "@/components/ui/ApartmentCard";
import Map from "@/components/ui/Map";
import Filter from "./apartments/Filter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useClientTranslation, useTranslation } from "@/i18n";
import { useMediaQuery } from "react-responsive";
import { Apartment, ApartmentFilter } from "@/types/apartment";
import {
  MapIcon,
  ListIcon,
  FilterIcon,
  Loader2,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function ApartmentsPage() {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { apartments, status, totalCount, page, limit } = useAppSelector(
    (state) => state.apartment
  );
  const filterState = useAppSelector((state) => state.filter);

  const [view, setView] = useState<"list" | "map">("list");
  const [selectedPoints, setSelectedPoints] = useState<
    { x: number; y: number }[]
  >([]);
  const [sortOrder, setSortOrder] = useState<string>("newest");

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

  // Load apartments on mount and when filter/sort changes
  useEffect(() => {
    const fetchData = async () => {
      dispatch(
        fetchApartments({
          filter: {
            ...(filterState as ApartmentFilter),
            selectedMapPoints: selectedPoints,
          },
          page: 1,
          limit: 12,
        })
      );
    };

    fetchData();
  }, [dispatch, filterState, sortOrder]);

  // Handle load more
  const handleLoadMore = () => {
    if (status !== "loading") {
      dispatch(setPage(page + 1));
      dispatch(
        fetchApartments({
          filter: {
            ...(filterState as ApartmentFilter),
            selectedMapPoints: selectedPoints,
          },
          page: page + 1,
          limit,
        })
      );
    }
  };

  const handleFilterSubmit = (filterData: any) => {
    // Implementation would depend on how your filter component works
    console.log("Filter submitted:", filterData);
    // This would typically update the filter state in Redux
  };

  const handleMapPointsSelected = (points: { x: number; y: number }[]) => {
    setSelectedPoints(points);

    // Re-fetch with the selected map area
    dispatch(
      fetchApartments({
        filter: {
          ...(filterState as ApartmentFilter),
          selectedMapPoints: points,
        },
        page: 1,
        limit,
      })
    );
  };

  const handleMarkerClick = (apartment: Apartment) => {
    router.push(`/apartments/${apartment.id}`);
  };

  const sortOptions = [
    { value: "newest", label: t("sort.newest") },
    { value: "price-asc", label: t("sort.priceAsc") },
    { value: "price-desc", label: t("sort.priceDesc") },
    { value: "relevance", label: t("sort.relevance") },
  ];

  return (
    <div className="container-custom">
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t("apartments.title")}</h1>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <Tabs
              defaultValue={view}
              onValueChange={(v) => setView(v as "list" | "map")}
              className="hidden md:flex"
            >
              <TabsList>
                <TabsTrigger value="list">
                  <ListIcon className="h-4 w-4 mr-2" />
                  {t("view.list")}
                </TabsTrigger>
                <TabsTrigger value="map">
                  <MapIcon className="h-4 w-4 mr-2" />
                  {t("view.map")}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Mobile View Toggle */}
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

            {/* Sort Dropdown */}
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
                    onClick={() => setSortOrder(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Filter Button */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] overflow-auto">
                  <Filter onSubmit={handleFilterSubmit} />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Desktop Filter */}
          {!isMobile && (
            <div className="hidden md:block">
              <Filter onSubmit={handleFilterSubmit} />
            </div>
          )}

          {/* Main Content */}
          <div>
            {/* Status Information */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {status === "loading" && page === 1
                  ? t("apartments.loading")
                  : t("apartments.found", { count: totalCount })}
              </p>
            </div>

            {/* List View */}
            {view === "list" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apartments.map((apartment) => (
                    <ApartmentCard key={apartment.id} apartment={apartment} />
                  ))}
                </div>

                {/* Loading or Load More */}
                {status === "loading" && page > 1 ? (
                  <div className="flex justify-center mt-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : apartments.length < totalCount ? (
                  <div className="flex justify-center mt-8">
                    <Button onClick={handleLoadMore} variant="outline">
                      {t("apartments.loadMore")}
                    </Button>
                  </div>
                ) : null}

                {/* Empty State */}
                {apartments.length === 0 && status !== "loading" && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-medium mb-2">
                      {t("apartments.noResults")}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t("apartments.tryAdjusting")}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Map View */}
            {view === "map" && (
              <div className="relative">
                <Map
                  apartments={apartments}
                  isLoading={status === "loading" && page === 1}
                  onPointsSelected={handleMapPointsSelected}
                  onMarkerClick={handleMarkerClick}
                  className="rounded-lg border"
                />

                {/* Map Side Panel for Listings on Tablet/Desktop */}
                {!isMobile && apartments.length > 0 && (
                  <div className="absolute top-4 right-4 w-80 max-h-[60vh] overflow-y-auto bg-white shadow-lg rounded-lg p-4 border">
                    <h3 className="text-sm font-medium mb-3">
                      {t("apartments.found", { count: totalCount })}
                    </h3>
                    <div className="space-y-3">
                      {apartments.slice(0, 5).map((apartment) => (
                        <ApartmentCard
                          key={apartment.id}
                          apartment={apartment}
                          variant="compact"
                        />
                      ))}
                      {apartments.length > 5 && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setView("list")}
                        >
                          {t("apartments.viewAll", { count: totalCount - 5 })}
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
