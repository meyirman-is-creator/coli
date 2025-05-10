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
  Users,
  Check 
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks";
import { 
  setAddress, 
  setPriceRange, 
  setRoommates 
} from "@/store/features/searchBar/searchBar";
import { fetchCities } from "@/store/features/address/addressSlice";
import { useClientTranslation } from "@/i18n/client";
import { AddressType } from "@/types/common";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { RangeSlider } from "@/components/ui/range-slider";

interface SearchBarProps {
  locale?: "en" | "ru";
  variant?: "default" | "compact";
  className?: string;
  hideOnMobile?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  locale = "ru", 
  variant = "default",
  className = "",
  hideOnMobile = false
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
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [pricePopoverOpen, setPricePopoverOpen] = useState(false);
  const [roommatesPopoverOpen, setRoommatesPopoverOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Track active filters for UI display
  useEffect(() => {
    const filters = [];
    if (address.regionName) filters.push('location');
    if (priceRange[0] > 0 || priceRange[1] < 500000) filters.push('price');
    if (roommates) filters.push('roommates');
    setActiveFilters(filters);
  }, [address, priceRange, roommates]);

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
    setCityPopoverOpen(false);
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
    setCityPopoverOpen(false);
  };

  const handlePriceChange = () => {
    dispatch(setPriceRange([priceMin, priceMax]));
    setPricePopoverOpen(false);
  };

  const handleRoommatesSelect = (count: number) => {
    const newSelected = selectedRoommates === count ? null : count;
    setSelectedRoommates(newSelected);
    
    if (newSelected === null) {
      dispatch(setRoommates(null));
    } else {
      dispatch(setRoommates({ 
        id: newSelected, 
        name: newSelected.toString() 
      }));
    }
    
    setRoommatesPopoverOpen(false);
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
    router.push(`/${queryString ? `?${queryString}` : ""}`);
  };

  // Compact variant for mobile or header use
  if (variant === "compact") {
    return (
      <form 
        onSubmit={handleSearch} 
        className={`flex items-center w-full ${className} ${hideOnMobile ? 'hidden md:flex' : ''}`}
      >
        {/* City Selection - Reduced width */}
        <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-auto min-w-[130px] max-w-[180px] justify-between border-r-0 rounded-r-none h-10"
              aria-expanded={cityPopoverOpen}
            >
              <MapPin className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="flex-grow text-left truncate text-sm">
                {getAddressDisplay()}
              </span>
              <ChevronDown className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[180px] p-0">
            <div className="max-h-[300px] overflow-y-auto py-1">
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none h-8 px-2 text-sm"
                onClick={handleClearCity}
              >
                {(!address.regionName) && <Check className="h-4 w-4 mr-2" />}
                {t("search.allCities", "Все города")}
              </Button>
              
              {cities.map((city: AddressType) => (
                <Button
                  key={city.id}
                  variant="ghost"
                  className="w-full justify-start rounded-none h-8 px-2 text-sm"
                  onClick={() => handleCitySelect(city)}
                >
                  {address.regionId === city.id && <Check className="h-4 w-4 mr-2" />}
                  {city.namerus}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Price Range Popover - Improved slider */}
        <Popover open={pricePopoverOpen} onOpenChange={setPricePopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={`border-x-0 rounded-none h-10 ${activeFilters.includes('price') ? 'bg-primary/10' : ''}`}
            >
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1.5 text-muted-foreground" />
                <span className="text-xs truncate max-w-[70px] hidden sm:block">
                  {t("search.price", "Цена")}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-3">
            <h4 className="font-medium mb-2 text-sm">{t("search.priceRange", "Диапазон цен")}</h4>
            <div className="space-y-4">
              <div className="pt-2">
                <RangeSlider
                  min={0}
                  max={500000}
                  step={5000}
                  value={[priceMin, priceMax]}
                  onValueChange={([min, max]) => {
                    setPriceMin(min);
                    setPriceMax(max);
                  }}
                  className="h-2 pb-5"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    type="number" 
                    placeholder={t("search.min", "От")}
                    value={priceMin || ""}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    className="pl-7 h-8 text-sm"
                  />
                </div>
                <span>-</span>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    type="number" 
                    placeholder={t("search.max", "До")}
                    value={priceMax || ""}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="pl-7 h-8 text-sm"
                  />
                </div>
              </div>
              
              <Button size="sm" onClick={handlePriceChange} className="w-full">
                {t("search.apply", "Применить")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Roommates Selection */}
        <Popover open={roommatesPopoverOpen} onOpenChange={setRoommatesPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={`border-l-0 rounded-l-none rounded-r-none h-10 ${activeFilters.includes('roommates') ? 'bg-primary/10' : ''}`}
            >
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
                <span className="text-xs truncate max-w-[70px] hidden sm:block">
                  {t("search.roommates", "Соседи")}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[180px] p-3">
            <h4 className="font-medium mb-2 text-sm">
              {t("search.selectRoommates", "Соседи")}
            </h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map((count) => (
                  <Button
                    key={count}
                    type="button"
                    variant={selectedRoommates === count ? "default" : "outline"}
                    size="sm"
                    className="h-7 px-0"
                    onClick={() => handleRoommatesSelect(count)}
                  >
                    {count}
                  </Button>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground">
                {t("search.selectRoommatesHelp", "Выберите количество соседей")}
              </p>
            </div>
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
    <form 
      onSubmit={handleSearch} 
      className={`space-y-4 ${className} ${hideOnMobile ? 'hidden md:block' : ''}`}
    >
      <div className="flex flex-col md:flex-row gap-3 w-full">
        {/* City Selection - Reduced width */}
        <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full md:w-auto md:min-w-[130px] md:max-w-[180px] justify-between"
              aria-expanded={cityPopoverOpen}
            >
              <MapPin className="h-5 w-5 mr-1.5 text-muted-foreground" />
              <span className="flex-grow text-left truncate">
                {getAddressDisplay()}
              </span>
              <ChevronDown className="h-4 w-4 ml-1.5 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[180px] p-0">
            <div className="max-h-[300px] overflow-y-auto py-1">
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none h-9 px-3"
                onClick={handleClearCity}
              >
                {(!address.regionName) && <Check className="h-4 w-4 mr-2" />}
                {t("search.allCities", "Все города")}
              </Button>
              
              {cities.map((city: AddressType) => (
                <Button
                  key={city.id}
                  variant="ghost"
                  className="w-full justify-start rounded-none h-9 px-3"
                  onClick={() => handleCitySelect(city)}
                >
                  {address.regionId === city.id && <Check className="h-4 w-4 mr-2" />}
                  {city.namerus}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex flex-1 gap-3">
          {/* Price Range - Improved slider */}
          <Popover open={pricePopoverOpen} onOpenChange={setPricePopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex-1 justify-between"
                aria-expanded={pricePopoverOpen}
              >
                <DollarSign className="h-5 w-5 mr-1.5 text-muted-foreground" />
                <span className="flex-grow text-left truncate">
                  {getPriceDisplay()}
                </span>
                <ChevronDown className="h-4 w-4 ml-1.5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4">
              <h4 className="font-medium mb-3">{t("search.priceRange", "Диапазон цен")}</h4>
              <div className="space-y-5">
                <div className="pt-2">
                  <RangeSlider
                    min={0}
                    max={500000}
                    step={5000}
                    value={[priceMin, priceMax]}
                    onValueChange={([min, max]) => {
                      setPriceMin(min);
                      setPriceMax(max);
                    }}
                    className="h-2"
                  />
                    {/* <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                      <span>0 ₸</span>
                      <span>500 000 ₸</span>
                    </div> */}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="number" 
                      placeholder={t("search.min", "От")}
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
                      placeholder={t("search.max", "До")}
                      value={priceMax || ""}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <Button onClick={handlePriceChange} className="w-full">
                  {t("search.apply", "Применить")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Roommates Selection - With slider */}
          <Popover open={roommatesPopoverOpen} onOpenChange={setRoommatesPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex-1 justify-between"
                aria-expanded={roommatesPopoverOpen}
              >
                <Users className="h-5 w-5 mr-1.5 text-muted-foreground" />
                <span className="flex-grow text-left truncate">
                  {getRoommatesDisplay()}
                </span>
                <ChevronDown className="h-4 w-4 ml-1.5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-4">
              <h4 className="font-medium mb-3">
                {t("search.selectRoommates", "Соседи")}
              </h4>
              
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2 mb-2">
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
                
                <div className="pt-2">
                  <RangeSlider
                    min={1}
                    max={5}
                    step={1}
                    value={selectedRoommates ? [selectedRoommates, selectedRoommates] : [3, 3]}
                    onValueChange={(values: [number, number]) => handleRoommatesSelect(values[0])}
                    className="h-2"
                  />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {t("search.selectRoommatesHelp", "Выберите количество соседей")}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <Button type="submit" className="w-full md:w-auto">
          <Search className="h-5 w-5 mr-2" />
          {t("search.searchButton", "Поиск")}
        </Button>
      </div>
      
      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
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
              {t("search.roommatesCount", `${roommates.id} соседей`)}
            </Badge>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;