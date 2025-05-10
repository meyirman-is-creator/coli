"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  DollarSign,
  Users 
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks";
import { 
  setAddress, 
  setPriceRange, 
  setRoommates 
} from "@/store/features/searchBar/searchBar";
import { fetchCities } from "@/store/slices/addressSlice";
import { useClientTranslation } from "@/i18n/client";
import { AddressType } from "@/types/common";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SearchBarProps {
  locale?: "en" | "ru";
  variant?: "default" | "compact";
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  locale = "ru", 
  variant = "default",
  className = ""
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useClientTranslation(locale);

  const searchBarState = useAppSelector((state) => state.searchBar);
  const addressState = useAppSelector((state) => state.address);
  const { address, priceRange, roommates } = searchBarState;
  const { cities } = addressState;
  
  const [priceMin, setPriceMin] = useState(priceRange[0]);
  const [priceMax, setPriceMax] = useState(priceRange[1]);
  const [selectedRoommates, setSelectedRoommates] = useState<number | null>(
    roommates ? roommates.id : null
  );

  // Fetch cities on component mount
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  // Format price
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
  };

  // Get display values for UI
  const getAddressDisplay = () => {
    return address.regionName || (locale === "en" ? "All cities" : "Все города");
  };

  const getPriceDisplay = () => {
    if (priceRange[0] === 0 && priceRange[1] >= 500000) {
      return locale === "en" ? "Any price" : "Любая цена";
    }
    return `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`;
  };

  const getRoommatesDisplay = () => {
    if (!roommates) {
      return locale === "en" ? "Any roommates" : "Любое количество";
    }
    return locale === "en" 
      ? `${roommates.id} roommates` 
      : `${roommates.id} соседей`;
  };

  // Handle selection changes
  const handleCitySelect = (city: AddressType) => {
    dispatch(
      setAddress({
        regionId: city.id,
        regionName: city.namerus,
        districtId: null,
        districtName: "",
        microDistrictId: null,
        microDistrictName: "",
      })
    );
  };

  const handleClearCity = () => {
    dispatch(
      setAddress({
        regionId: null,
        regionName: "",
        districtId: null,
        districtName: "",
        microDistrictId: null,
        microDistrictName: "",
      })
    );
  };

  const handlePriceChange = () => {
    dispatch(setPriceRange([priceMin, priceMax]));
  };

  const handleRoommatesSelect = (count: number) => {
    setSelectedRoommates(count);
    dispatch(setRoommates({ 
      id: count, 
      name: count.toString() 
    }));
  };

  const handleClearRoommates = () => {
    setSelectedRoommates(null);
    dispatch(setRoommates(null));
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams: Record<string, string> = {};

    if (address.regionId && address.regionId > 0) {
      queryParams.region = address.regionId.toString();
    }

    if (priceRange[0] > 0) {
      queryParams.priceMin = priceRange[0].toString();
    }
    
    if (priceRange[1] < 500000) {
      queryParams.priceMax = priceRange[1].toString();
    }

    if (roommates) {
      queryParams.roommates = roommates.id.toString();
    }

    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/apartments${queryString ? `?${queryString}` : ""}`);
  };

  // Compact variant for mobile or header use
  if (variant === "compact") {
    return (
      <form onSubmit={handleSearch} className={`flex items-center w-full ${className}`}>
        {/* City Selection */}
        <div className="flex-1 relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between border-r-0 rounded-r-none h-10">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="flex-grow text-left truncate text-sm">
                  {getAddressDisplay()}
                </span>
                <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px] max-h-[300px] overflow-y-auto">
              <DropdownMenuItem
                onClick={handleClearCity}
                className="cursor-pointer"
              >
                {locale === "en" ? "All cities" : "Все города"}
              </DropdownMenuItem>
              {cities.map((city) => (
                <DropdownMenuItem
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className="cursor-pointer"
                >
                  {city.namerus}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Price Range Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-x-0 rounded-none h-10 px-3">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-4">
            <h4 className="font-medium mb-2">{locale === "en" ? "Price range" : "Диапазон цен"}</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder={locale === "en" ? "Min" : "От"}
                  value={priceMin || ""}
                  onChange={(e) => setPriceMin(Number(e.target.value))}
                  className="h-8"
                />
                <span>-</span>
                <Input 
                  type="number" 
                  placeholder={locale === "en" ? "Max" : "До"}
                  value={priceMax || ""}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="h-8"
                />
              </div>
              <Slider
                min={0}
                max={500000}
                step={5000}
                value={[priceMin, priceMax]}
                onValueChange={([min, max]) => {
                  setPriceMin(min);
                  setPriceMax(max);
                }}
              />
              <Button size="sm" onClick={handlePriceChange} className="w-full">
                {locale === "en" ? "Apply" : "Применить"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Roommates Selection */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-l-0 rounded-l-none rounded-r-none h-10 px-3">
              <Users className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-4">
            <h4 className="font-medium mb-2">
              {locale === "en" ? "Roommates" : "Соседи"}
            </h4>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((count) => (
                <Button
                  key={count}
                  type="button"
                  variant={selectedRoommates === count ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => handleRoommatesSelect(count)}
                >
                  {count}
                </Button>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearRoommates}
              className="w-full text-xs"
            >
              {locale === "en" ? "Clear" : "Сбросить"}
            </Button>
          </PopoverContent>
        </Popover>
        
        {/* Search Button */}
        <Button type="submit" size="icon" className="rounded-l-none h-10">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  // Full variant for main search on pages
  return (
    <form onSubmit={handleSearch} className={`space-y-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-3 w-full">
        {/* City Selection */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-between">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="flex-grow text-left truncate">
                {getAddressDisplay()}
              </span>
              <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[250px] max-h-[300px] overflow-y-auto">
            <DropdownMenuItem
              onClick={handleClearCity}
              className="cursor-pointer"
            >
              {locale === "en" ? "All cities" : "Все города"}
            </DropdownMenuItem>
            <Separator className="my-1" />
            {cities.map((city) => (
              <DropdownMenuItem
                key={city.id}
                onClick={() => handleCitySelect(city)}
                className="cursor-pointer"
              >
                {city.namerus}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Price Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-between">
              <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="flex-grow text-left truncate">
                {getPriceDisplay()}
              </span>
              <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-4">
            <h4 className="font-medium mb-3">{locale === "en" ? "Price range" : "Диапазон цен"}</h4>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="number" 
                    placeholder={locale === "en" ? "Min" : "От"}
                    value={priceMin || ""}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    className="pl-8"
                  />
                </div>
                <span>-</span>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="number" 
                    placeholder={locale === "en" ? "Max" : "До"}
                    value={priceMax || ""}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Slider
                  min={0}
                  max={500000}
                  step={5000}
                  value={[priceMin, priceMax]}
                  onValueChange={([min, max]) => {
                    setPriceMin(min);
                    setPriceMax(max);
                  }}
                />
                <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                  <span>0 ₸</span>
                  <span>500 000 ₸</span>
                </div>
              </div>
              <Button onClick={handlePriceChange} className="w-full">
                {locale === "en" ? "Apply price range" : "Применить"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Roommates Selection */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-between">
              <Users className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="flex-grow text-left truncate">
                {getRoommatesDisplay()}
              </span>
              <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-4">
            <h4 className="font-medium mb-3">
              {locale === "en" ? "Roommates" : "Соседи"}
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((count) => (
                <Button
                  key={count}
                  type="button"
                  variant={selectedRoommates === count ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRoommatesSelect(count)}
                >
                  {count}
                </Button>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearRoommates}
              className="w-full text-sm text-muted-foreground"
            >
              {locale === "en" ? "Clear selection" : "Сбросить выбор"}
            </Button>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <Button type="submit" className="w-full md:w-auto">
          <Search className="h-5 w-5 mr-2" />
          {locale === "en" ? "Search" : "Поиск"}
        </Button>
      </div>
      
      {/* Active Filters Display */}
      {(address.regionName || priceRange[0] > 0 || priceRange[1] < 500000 || roommates) && (
        <div className="flex flex-wrap gap-2 pt-2">
          {address.regionName && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {address.regionName}
            </Badge>
          )}
          
          {(priceRange[0] > 0 || priceRange[1] < 500000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </Badge>
          )}
          
          {roommates && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {locale === "en" ? `${roommates.id} roommates` : `${roommates.id} соседей`}
            </Badge>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;