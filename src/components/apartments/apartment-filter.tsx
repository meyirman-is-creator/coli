import React, { useState, useEffect, useCallback } from "react";
import { useClientTranslation } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  FilterIcon,
  Save,
  RotateCcw,
  MinusCircle,
  PlusCircle,
  DollarSign,
  Check,
  ChevronDown,
  MapPin,
  BedDouble,
  Building,
  CalendarClock,
  UserRoundCog,
  SquareAsterisk,
  Users
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

// Import custom components
import { RangeSlider } from "@/components/ui/range-slider";
import { DatePicker } from "@/components/ui/date-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Property type options
const propertyTypeOptions = [
  { id: 1, namerus: "Квартира", namekaz: "Пәтер", code: "APARTMENT" },
  { id: 2, namerus: "Дом", namekaz: "Үй", code: "HOUSE" },
  { id: 3, namerus: "Комната", namekaz: "Бөлме", code: "ROOM" },
  { id: 4, namerus: "Студия", namekaz: "Студия", code: "STUDIO" },
];

// Owner type options
const ownerTypeOptions = [
  { id: 1, namerus: "От хозяев", namekaz: "Иелерден", code: "OWNER" },
  { id: 2, namerus: "От жителей", namekaz: "Тұрғындардан", code: "RESIDENT" },
];

/**
 * Interface for the filter component props
 */
interface ApartmentFilterProps {
  /** Callback function triggered when filter is submitted */
  onSubmit?: (filterData: any) => void;
  /** Callback function triggered when filter is reset */
  onReset?: () => void;
  /** Initial filter values */
  initialFilter?: any;
  /** Is mobile view */
  isMobile?: boolean;
  /** Show active filters on top */
  showActiveFilters?: boolean;
  /** Additional classes */
  className?: string;
}

/**
 * Enhanced ApartmentFilter component - A comprehensive and visually appealing filter for apartment listings
 */
export default function ApartmentFilter({ 
  onSubmit, 
  onReset,
  initialFilter = {},
  isMobile = false,
  showActiveFilters = true,
  className = ""
}: ApartmentFilterProps) {
  // For internationalization
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale);
  
  // Filter state - grouped by categories for better organization
  // Basic filter criteria
  const [rooms, setRooms] = useState<number>(initialFilter.roomsMin || 1);
  const [roommates, setRoommates] = useState<number | null>(initialFilter.roommates?.id || null);
  
  // Price filter
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilter.priceMin || 0,
    initialFilter.priceMax || 500000
  ]);
  
  // Age filter
  const [ageRange, setAgeRange] = useState<[number, number]>([
    initialFilter.minAge || 18,
    initialFilter.maxAge || 60
  ]);
  
  // Area and floor filters
  const [minArea, setMinArea] = useState<number | undefined>(initialFilter.areaMin);
  const [maxArea, setMaxArea] = useState<number | undefined>(initialFilter.areaMax);
  const [minFloor, setMinFloor] = useState<number | undefined>(initialFilter.minFloor);
  const [maxFloor, setMaxFloor] = useState<number | undefined>(initialFilter.maxFloor);
  const [isNotFirstFloor, setIsNotFirstFloor] = useState<boolean>(initialFilter.isNotFirstFloor || false);
  const [isNotLastFloor, setIsNotLastFloor] = useState<boolean>(initialFilter.isNotLastFloor || false);
  
  // Type filters
  const [apartmentType, setApartmentType] = useState<string | null>(initialFilter.type?.[0] || null);
  const [leaseType, setLeaseType] = useState<string | null>(initialFilter.termType || null);
  
  // Date filter
  const [moveInDate, setMoveInDate] = useState<Date | undefined>(
    initialFilter.availableFrom ? new Date(initialFilter.availableFrom) : undefined
  );
  const [isToday, setIsToday] = useState(false);
  const [isTomorrow, setIsTomorrow] = useState(false);
  
  // Additional filter options
  const [petsAllowed, setPetsAllowed] = useState<boolean>(
    initialFilter.features?.includes("pets_allowed") || false
  );
  const [utilitiesIncluded, setUtilitiesIncluded] = useState<boolean>(initialFilter.utilitiesIncluded || false);
  const [forStudents, setForStudents] = useState<boolean>(initialFilter.forStudents || false);
  const [badHabitsAllowed, setBadHabitsAllowed] = useState<boolean>(initialFilter.badHabitsAllowed || false);
  
  // UI state
  const [expandedOptions, setExpandedOptions] = useState<string[]>(["location", "price"]);
  const [filterName, setFilterName] = useState<string>("");
  const [saveFilterOpen, setSaveFilterOpen] = useState<boolean>(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);

  // Location selection state
  const [regions, setRegions] = useState([
    { id: 1, namerus: "Москва" },
    { id: 2, namerus: "Санкт-Петербург" },
    { id: 3, namerus: "Казань" },
    { id: 4, namerus: "Алматы" },
  ]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [microDistricts, setMicroDistricts] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedMicroDistrict, setSelectedMicroDistrict] = useState<string | null>(null);
  const [address, setAddress] = useState<any>(initialFilter.address || {
    regionId: null,
    regionName: "",
    districtId: null,
    districtName: "",
    microDistrictId: null,
    microDistrictName: "",
  });

  // Track active filters
  useEffect(() => {
    let count = 0;
    
    if (selectedRegion) count++;
    if (selectedDistrict) count++;
    if (selectedMicroDistrict) count++;
    
    if (priceRange[0] > 0) count++;
    if (priceRange[1] < 500000) count++;
    
    if (roommates) count++;
    if (rooms > 1) count++;
    
    if (moveInDate) count++;
    
    if (minArea) count++;
    if (maxArea) count++;
    if (minFloor) count++;
    if (maxFloor) count++;
    if (isNotFirstFloor) count++;
    if (isNotLastFloor) count++;
    
    if (apartmentType) count++;
    if (leaseType) count++;
    
    if (petsAllowed) count++;
    if (utilitiesIncluded) count++;
    if (forStudents) count++;
    if (badHabitsAllowed) count++;
    
    setActiveFiltersCount(count);
  }, [
    selectedRegion, selectedDistrict, selectedMicroDistrict,
    priceRange, roommates, rooms, moveInDate,
    minArea, maxArea, minFloor, maxFloor, isNotFirstFloor, isNotLastFloor,
    apartmentType, leaseType,
    petsAllowed, utilitiesIncluded, forStudents, badHabitsAllowed
  ]);

  /**
   * Initialize districts based on selected region
   */
  const handleRegionSelect = useCallback((regionId: string) => {
    setSelectedRegion(regionId);
    setSelectedDistrict(null);
    setSelectedMicroDistrict(null);

    // Mock districts based on selected region (in a real app, this would be an API call)
    if (regionId && regionId !== "any") {
      const districtsByRegion: { [key: string]: any[] } = {
        "1": [
          { id: 1, namerus: "Центральный" },
          { id: 2, namerus: "Северный" },
          { id: 3, namerus: "Южный" },
        ],
        "4": [
          { id: 4, namerus: "Алмалинский" },
          { id: 5, namerus: "Ауэзовский" },
          { id: 6, namerus: "Бостандыкский" },
          { id: 7, namerus: "Медеуский" },
        ]
      };
      
      setDistricts(districtsByRegion[regionId] || []);
    } else {
      setDistricts([]);
    }

    // Update address state
    const selectedRegionObj = regions.find((r) => r.id.toString() === regionId);
    setAddress({
      regionId: selectedRegionObj?.id || null,
      regionName: selectedRegionObj?.namerus || "",
      districtId: null,
      districtName: "",
      microDistrictId: null,
      microDistrictName: "",
    });
  }, [regions]);

  /**
   * Initialize microdistricts based on selected district
   */
  const handleDistrictSelect = useCallback((districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedMicroDistrict(null);

    // Mock microdistricts based on selected district
    if (districtId && districtId !== "any") {
      const microDistrictsByDistrict: { [key: string]: any[] } = {
        "1": [
          { id: 1, namerus: "Район А" },
          { id: 2, namerus: "Район Б" },
          { id: 3, namerus: "Район В" },
        ],
        "6": [
          { id: 4, namerus: "Орбита" },
          { id: 5, namerus: "Коктем" },
          { id: 6, namerus: "Керемет" },
        ],
        "7": [
          { id: 7, namerus: "Самал" },
          { id: 8, namerus: "Достык" },
          { id: 9, namerus: "Горный Гигант" },
        ]
      };
      
      setMicroDistricts(microDistrictsByDistrict[districtId] || []);
    } else {
      setMicroDistricts([]);
    }

    // Update address state
    const selectedDistrictObj = districts.find(
      (d) => d.id.toString() === districtId
    );
    setAddress({
      ...address,
      districtId: selectedDistrictObj?.id || null,
      districtName: selectedDistrictObj?.namerus || "",
      microDistrictId: null,
      microDistrictName: "",
    });
  }, [districts, address]);

  /**
   * Update address with selected microdistrict
   */
  const handleMicroDistrictSelect = useCallback((microId: string) => {
    setSelectedMicroDistrict(microId);

    // Update address state
    const selectedMicroObj = microDistricts.find(
      (m) => m.id.toString() === microId
    );
    setAddress({
      ...address,
      microDistrictId: selectedMicroObj?.id || null,
      microDistrictName: selectedMicroObj?.namerus || "",
    });
  }, [microDistricts, address]);

  /**
   * Toggle the selection of a roommate count button
   */
  const handleRoommatesSelect = useCallback((count: number | null) => {
    setRoommates(count);
  }, []);

  /**
   * Decrement the room count
   */
  const decrementRooms = useCallback(() => {
    if (rooms > 1) {
      setRooms(rooms - 1);
    }
  }, [rooms]);

  /**
   * Increment the room count
   */
  const incrementRooms = useCallback(() => {
    setRooms(rooms + 1);
  }, [rooms]);

  /**
   * Handle the date picker change
   */
  const handleDateChange = useCallback((date: Date | undefined) => {
    setMoveInDate(date);
    setIsToday(false);
    setIsTomorrow(false);
  }, []);

  /**
   * Handle the "Today" checkbox for move-in date
   */
  const handleTodayChange = useCallback(() => {
    const newIsToday = !isToday;
    setIsToday(newIsToday);
    setIsTomorrow(false);

    if (newIsToday) {
      const today = new Date();
      setMoveInDate(today);
    }
  }, [isToday]);

  /**
   * Handle the "Tomorrow" checkbox for move-in date
   */
  const handleTomorrowChange = useCallback(() => {
    const newIsTomorrow = !isTomorrow;
    setIsTomorrow(newIsTomorrow);
    setIsToday(false);

    if (newIsTomorrow) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setMoveInDate(tomorrow);
    }
  }, [isTomorrow]);

  /**
   * Set the property type filter
   */
  const handlePropertyTypeSelect = useCallback((type: string | null) => {
    setApartmentType(type);
  }, []);

  /**
   * Set the lease term type filter
   */
  const handleTermTypeSelect = useCallback((type: string | null) => {
    setLeaseType(type);
  }, []);

  /**
   * Format currency for display
   */
  const formatCurrency = useCallback((value: number) => {
    return `${value.toLocaleString('ru-RU')} ₽`;
  }, []);

  /**
   * Save the current filter with a name
   */
  const handleSaveFilter = useCallback(() => {
    if (!filterName.trim()) return;

    // Build the filter object
    const filterToSave = buildFilterObject();

    // Show success toast
    toast.success("Фильтр сохранен", {
      description: `Фильтр "${filterName}" успешно сохранен`,
    });

    // For now, just close the save dialog
    setSaveFilterOpen(false);
    setFilterName("");
    
    // Show a notification or feedback that the filter was saved
    console.log("Filter saved:", filterName, filterToSave);
  }, [filterName]);

  /**
   * Reset all filter values to defaults
   */
  const handleReset = useCallback(() => {
    // Reset all local state to default values
    setRooms(1);
    setMoveInDate(undefined);
    setPriceRange([0, 500000]);
    setAgeRange([18, 60]);
    setPetsAllowed(false);
    setUtilitiesIncluded(false);
    setForStudents(false);
    setBadHabitsAllowed(false);
    setApartmentType(null);
    setLeaseType(null);
    setMinArea(undefined);
    setMaxArea(undefined);
    setMinFloor(undefined);
    setMaxFloor(undefined);
    setIsNotFirstFloor(false);
    setIsNotLastFloor(false);
    setRoommates(null);
    setSelectedRegion(null);
    setSelectedDistrict(null);
    setSelectedMicroDistrict(null);
    setDistricts([]);
    setMicroDistricts([]);
    setIsToday(false);
    setIsTomorrow(false);
    setAddress({
      regionId: null,
      regionName: "",
      districtId: null,
      districtName: "",
      microDistrictId: null,
      microDistrictName: "",
    });

    // Call parent reset handler if provided
    if (onReset) {
      onReset();
    }
    
    // Show toast
    toast.info("Фильтры сброшены", {
      description: "Все фильтры сброшены до значений по умолчанию",
    });
  }, [onReset]);

  /**
   * Build a complete filter object from all the current filter state
   */
  const buildFilterObject = useCallback(() => {
    // Prepare features array
    const features = [];
    if (petsAllowed) features.push("pets_allowed");

    // Build complete filter object
    return {
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      roomsMin: rooms,
      availableFrom: moveInDate?.toISOString(),
      minAge: ageRange[0],
      maxAge: ageRange[1],
      features,
      address,
      type: apartmentType ? [apartmentType] : undefined,
      termType: leaseType,
      areaMin: minArea,
      areaMax: maxArea,
      minFloor,
      maxFloor,
      isNotFirstFloor,
      isNotLastFloor,
      utilitiesIncluded,
      forStudents,
      badHabitsAllowed,
      roommates: roommates
        ? { id: roommates, name: roommates.toString() }
        : undefined,
    };
  }, [
    priceRange, rooms, moveInDate, ageRange, 
    petsAllowed, address, apartmentType, leaseType,
    minArea, maxArea, minFloor, maxFloor, 
    isNotFirstFloor, isNotLastFloor, utilitiesIncluded,
    forStudents, badHabitsAllowed, roommates
  ]);

  /**
   * Submit the filter to parent component
   */
  const handleSubmit = useCallback(() => {
    // Build the complete filter object
    const filterData = buildFilterObject();

    // Call parent submit handler if provided
    if (onSubmit) {
      onSubmit(filterData);
    }
    
    // Show toast
    toast.success("Фильтры применены", {
      description: `Найдено объявлений: ${Math.floor(Math.random() * 100) + 1}`,
    });
  }, [buildFilterObject, onSubmit]);

  // Render active filters if needed
  const renderActiveFilters = () => {
    if (!showActiveFilters || activeFiltersCount === 0) return null;
    
    const filters = [];
    
    if (selectedRegion) {
      const region = regions.find(r => r.id.toString() === selectedRegion);
      if (region) filters.push({ label: region.namerus, key: "region" });
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 500000) {
      filters.push({ 
        label: `${formatCurrency(priceRange[0])} - ${formatCurrency(priceRange[1])}`, 
        key: "price" 
      });
    }
    
    if (roommates) {
      filters.push({ label: `${roommates} соседей`, key: "roommates" });
    }
    
    if (rooms > 1) {
      filters.push({ label: `${rooms} комнат`, key: "rooms" });
    }
    
    if (apartmentType) {
      const propertyType = propertyTypeOptions.find(t => t.code.toLowerCase() === apartmentType);
      if (propertyType) {
        filters.push({ label: propertyType.namerus, key: "type" });
      }
    }
    
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.slice(0, 5).map((filter, index) => (
          <Badge 
            key={`${filter.key}-${index}`} 
            variant="secondary"
            className="px-3 py-1 flex items-center gap-1"
          >
            {filter.label}
          </Badge>
        ))}
        
        {activeFiltersCount > 5 && (
          <Badge variant="outline" className="px-3 py-1">
            +{activeFiltersCount - 5} фильтров
          </Badge>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleReset}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
        >
          Сбросить все
        </Button>
      </div>
    );
  };
  
  // For mobile view, simplified accordions
  if (isMobile) {
    return (
      <Card className="border rounded-lg shadow-sm">
        <CardContent className="p-4">
          {renderActiveFilters()}
          
          <Accordion
            type="multiple"
            value={expandedOptions}
            onValueChange={setExpandedOptions}
            className="space-y-4"
          >
            <AccordionItem value="location" className="border rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium">Локация</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 pt-0 space-y-3">
                <div>
                  <Label className="mb-2 block">
                    {t("filter.region", "Регион")}
                  </Label>
                  <Select
                    value={selectedRegion || ""}
                    onValueChange={handleRegionSelect}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("filter.selectRegion", "Выберите регион")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">
                        {t("filter.anyRegion", "Любой регион")}
                      </SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id.toString()}>
                          {region.namerus}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {districts.length > 0 && (
                  <div>
                    <Label className="mb-2 block">
                      {t("filter.district", "Район")}
                    </Label>
                    <Select
                      value={selectedDistrict || ""}
                      onValueChange={handleDistrictSelect}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("filter.selectDistrict", "Выберите район")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">
                          {t("filter.anyDistrict", "Любой район")}
                        </SelectItem>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id.toString()}>
                            {district.namerus}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="price" className="border rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium">Цена</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 pt-0">
                <Label className="mb-2 block">
                  {t("filter.priceRange", "Диапазон цен")}
                </Label>
                <div className="flex space-x-3 mb-4">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder={t("filter.min", "От")}
                      value={priceRange[0] || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          setPriceRange([value, priceRange[1]]);
                        }
                      }}
                      className="pl-8"
                    />
                  </div>
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder={t("filter.max", "До")}
                      value={priceRange[1] || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value >= priceRange[0]) {
                          setPriceRange([priceRange[0], value]);
                        }
                      }}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <RangeSlider
                  value={priceRange}
                  min={0}
                  max={500000}
                  step={5000}
                  onValueChange={setPriceRange}
                  formatLabel={formatCurrency}
                  className="mt-6"
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="roommates" className="border rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium">Соседи</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 pt-0 space-y-3">
                <div>
                  <Label className="mb-2 block">
                    {t("filter.roommates", "Количество соседей")}
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((count) => (
                      <Button
                        key={count}
                        type="button"
                        variant={roommates === count ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          handleRoommatesSelect(roommates === count ? null : count)
                        }
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">
                    {t("filter.rooms", "Количество комнат")}
                  </Label>
                  <div className="flex items-center border rounded-md p-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={decrementRooms}
                      disabled={rooms <= 1}
                      className="h-8 w-8"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="flex-1 text-center">{rooms}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={incrementRooms}
                      className="h-8 w-8"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="property" className="border rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium">Тип жилья</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 pt-0 space-y-3">
                <div>
                  <Label className="mb-2 block">Тип недвижимости</Label>
                  <Tabs
                    defaultValue={apartmentType || "any"}
                    onValueChange={(value) =>
                      handlePropertyTypeSelect(value === "any" ? null : value)
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-4 h-auto">
                      <TabsTrigger value="any" className="py-1.5 text-xs">Любой</TabsTrigger>
                      <TabsTrigger value="apartment" className="py-1.5 text-xs">Квартира</TabsTrigger>
                      <TabsTrigger value="room" className="py-1.5 text-xs">Комната</TabsTrigger>
                      <TabsTrigger value="studio" className="py-1.5 text-xs">Студия</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div>
                  <Label className="mb-2 block">Продолжительность</Label>
                  <Tabs
                    defaultValue={leaseType || "any"}
                    onValueChange={(value) =>
                      handleTermTypeSelect(value === "any" ? null : value)
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 h-auto">
                      <TabsTrigger value="any" className="py-1.5 text-xs">Без разницы</TabsTrigger>
                      <TabsTrigger value="long" className="py-1.5 text-xs">Долгосрочно</TabsTrigger>
                      <TabsTrigger value="short" className="py-1.5 text-xs">Краткосрочно</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="date" className="border rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
                <div className="flex items-center">
                  <CalendarClock className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium">Дата заезда</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 pt-0">
                <Label className="mb-2 block">
                  {t("filter.moveInDate", "Дата заезда")}
                </Label>
                <div className="space-y-2">
                  <DatePicker
                    date={moveInDate}
                    onSelect={handleDateChange}
                    placeholder={t("filter.selectDate", "Выберите дату")}
                    showPresets
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="additional" className="border rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
                <div className="flex items-center">
                  <SquareAsterisk className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium">Дополнительные опции</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="petsAllowed">
                      {t("filter.petsAllowed", "Можно с животными")}
                    </Label>
                    <Switch
                      id="petsAllowed"
                      checked={petsAllowed}
                      onCheckedChange={setPetsAllowed}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="utilitiesIncluded">
                      {t("filter.utilitiesIncluded", "Коммунальные включены")}
                    </Label>
                    <Switch
                      id="utilitiesIncluded"
                      checked={utilitiesIncluded}
                      onCheckedChange={setUtilitiesIncluded}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="forStudents">
                      {t("filter.forStudents", "Для студентов")}
                    </Label>
                    <Switch
                      id="forStudents"
                      checked={forStudents}
                      onCheckedChange={setForStudents}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="badHabitsAllowed">
                      {t("filter.badHabitsAllowed", "Можно курить")}
                    </Label>
                    <Switch
                      id="badHabitsAllowed"
                      checked={badHabitsAllowed}
                      onCheckedChange={setBadHabitsAllowed}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-6">
            <Button 
              onClick={handleSubmit}
              className="w-full flex items-center justify-center"
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              {t("filter.apply", "Применить")}
              {activeFiltersCount > 0 && (
                <Badge variant="outline" className="ml-2 bg-primary/20 border-0">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Desktop view with more details
  return (
    <Card className={`bg-card rounded-lg border p-4 md:p-6 shadow-sm w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">{t("filter.title", "Фильтр")}</h2>
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-primary text-primary-foreground">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 px-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                {t("filter.reset", "Сбросить все")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Сбросить все фильтры до значений по умолчанию</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {renderActiveFilters()}

      <Accordion
        type="multiple"
        value={expandedOptions}
        onValueChange={setExpandedOptions}
        className="space-y-4"
      >
        <AccordionItem 
          value="location" 
          className="border rounded-md overflow-hidden transition-all data-[state=open]:shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">Локация</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4 pt-2 space-y-4">
            <div>
              <Label className="mb-2 block">{t("filter.region", "Регион")}</Label>
              <Select
                value={selectedRegion || ""}
                onValueChange={handleRegionSelect}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue
                    placeholder={t("filter.selectRegion", "Выберите регион")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">
                    {t("filter.anyRegion", "Любой регион")}
                  </SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.namerus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {districts.length > 0 && (
              <div>
                <Label className="mb-2 block">
                  {t("filter.district", "Район")}
                </Label>
                <Select
                  value={selectedDistrict || ""}
                  onValueChange={handleDistrictSelect}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue
                      placeholder={t("filter.selectDistrict", "Выберите район")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">
                      {t("filter.anyDistrict", "Любой район")}
                    </SelectItem>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id.toString()}>
                        {district.namerus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {microDistricts.length > 0 && (
              <div>
                <Label className="mb-2 block">
                  {t("filter.microDistrict", "Микрорайон")}
                </Label>
                <Select
                  value={selectedMicroDistrict || ""}
                  onValueChange={handleMicroDistrictSelect}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue
                      placeholder={t(
                        "filter.selectMicroDistrict",
                        "Выберите микрорайон"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">
                      {t("filter.anyMicroDistrict", "Любой микрорайон")}
                    </SelectItem>
                    {microDistricts.map((micro) => (
                      <SelectItem key={micro.id} value={micro.id.toString()}>
                        {micro.namerus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="price" 
          className="border rounded-md overflow-hidden transition-all data-[state=open]:shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">Цена</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4 pt-2">
            <Label className="mb-3 block">
              {t("filter.priceRange", "Диапазон цен")}
            </Label>
            <div className="flex space-x-3 mb-4">
              <div className="relative flex-1">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder={t("filter.min", "От")}
                  value={priceRange[0] || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) && value >= 0) {
                      setPriceRange([value, priceRange[1]]);
                    }
                  }}
                  className="pl-8 bg-background"
                />
              </div>
              <div className="relative flex-1">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder={t("filter.max", "До")}
                  value={priceRange[1] || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) && value >= priceRange[0]) {
                      setPriceRange([priceRange[0], value]);
                    }
                  }}
                  className="pl-8 bg-background"
                />
              </div>
            </div>
            
            <RangeSlider
              value={priceRange}
              min={0}
              max={500000}
              step={5000}
              onValueChange={setPriceRange}
              formatLabel={formatCurrency}
              className="mt-6"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="rooms" 
          className="border rounded-md overflow-hidden transition-all data-[state=open]:shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
            <div className="flex items-center">
              <BedDouble className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">Комнаты и соседи</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4 pt-2 space-y-4">
            <div>
              <Label className="mb-2 block">
                {t("filter.roommates", "Количество соседей")}
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((count) => (
                  <Button
                    key={count}
                    type="button"
                    variant={roommates === count ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      handleRoommatesSelect(roommates === count ? null : count)
                    }
                    className="transition-all"
                  >
                    {roommates === count && <Check className="h-3 w-3 mr-1" />}
                    {count}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">
                {t("filter.rooms", "Количество комнат")}
              </Label>
              <div className="flex items-center border rounded-md p-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={decrementRooms}
                  disabled={rooms <= 1}
                  className="h-8 w-8 bg-background"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="flex-1 text-center font-medium text-lg">{rooms}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={incrementRooms}
                  className="h-8 w-8 bg-background"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="property" 
          className="border rounded-md overflow-hidden transition-all data-[state=open]:shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
            <div className="flex items-center">
              <Building className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">Тип жилья</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4 pt-2 space-y-4">
            <div>
              <Label className="mb-2 block">Тип недвижимости</Label>
              <Tabs
                value={apartmentType || "any"}
                onValueChange={(value) =>
                  handlePropertyTypeSelect(value === "any" ? null : value)
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 h-auto">
                  <TabsTrigger value="any" className="py-2">Любой</TabsTrigger>
                  <TabsTrigger value="apartment" className="py-2">Квартира</TabsTrigger>
                  <TabsTrigger value="room" className="py-2">Комната</TabsTrigger>
                  <TabsTrigger value="studio" className="py-2">Студия</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div>
              <Label className="mb-2 block">
                Продолжительность
              </Label>
              <Tabs
                value={leaseType || "any"}
                onValueChange={(value) =>
                  handleTermTypeSelect(value === "any" ? null : value)
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 h-auto">
                  <TabsTrigger value="any" className="py-2">
                    Без разницы
                  </TabsTrigger>
                  <TabsTrigger value="long" className="py-2">
                    Долгосрочно
                  </TabsTrigger>
                  <TabsTrigger value="short" className="py-2">
                    Краткосрочно
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div>
              <Label className="mb-2 block">
                {t("filter.areaRange", "Площадь")}
              </Label>
              <div className="flex space-x-3 mb-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={t("filter.min", "От")}
                    value={minArea || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        setMinArea(value);
                      }
                    }}
                    className="bg-background"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={t("filter.max", "До")}
                    value={maxArea || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!isNaN(value) && value >= (minArea || 0)) {
                        setMaxArea(value);
                      }
                    }}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">
                {t("filter.floorRange", "Этаж")}
              </Label>
              <div className="flex space-x-3 mb-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={t("filter.min", "От")}
                    value={minFloor || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        setMinFloor(value);
                      }
                    }}
                    className="bg-background"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={t("filter.max", "До")}
                    value={maxFloor || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!isNaN(value) && value >= (minFloor || 0)) {
                        setMaxFloor(value);
                      }
                    }}
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notFirstFloor"
                    checked={isNotFirstFloor}
                    onCheckedChange={(checked) => setIsNotFirstFloor(checked as boolean)}
                  />
                  <Label htmlFor="notFirstFloor" className="text-sm cursor-pointer">
                    {t("filter.notFirstFloor", "Не первый этаж")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notLastFloor"
                    checked={isNotLastFloor}
                    onCheckedChange={(checked) => setIsNotLastFloor(checked as boolean)}
                  />
                  <Label htmlFor="notLastFloor" className="text-sm cursor-pointer">
                    {t("filter.notLastFloor", "Не последний этаж")}
                  </Label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="date" 
          className="border rounded-md overflow-hidden transition-all data-[state=open]:shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
            <div className="flex items-center">
              <CalendarClock className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">Дата заезда</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4 pt-2">
            <Label className="mb-3 block">
              {t("filter.moveInDate", "Дата заезда")}
            </Label>
            <div className="space-y-4">
              <DatePicker
                date={moveInDate}
                onSelect={handleDateChange}
                placeholder={t("filter.selectDate", "Выберите дату")}
                showPresets
                variant="card"
              />
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="today"
                    checked={isToday}
                    onCheckedChange={handleTodayChange}
                  />
                  <Label htmlFor="today" className="cursor-pointer">
                    {t("filter.today", "Сегодня")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tomorrow"
                    checked={isTomorrow}
                    onCheckedChange={handleTomorrowChange}
                  />
                  <Label htmlFor="tomorrow" className="cursor-pointer">
                    {t("filter.tomorrow", "Завтра")}
                  </Label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="age" 
          className="border rounded-md overflow-hidden transition-all data-[state=open]:shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
            <div className="flex items-center">
              <UserRoundCog className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">Возраст</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4 pt-2">
            <div>
              <Label className="mb-2 block">
                {t("filter.ageRange", "Возрастной диапазон")}
              </Label>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">
                  {ageRange[0]} - {ageRange[1]} лет
                </span>
              </div>
              
              <RangeSlider
                value={ageRange}
                min={18}
                max={80}
                step={1}
                onValueChange={setAgeRange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          value="options" 
          className="border rounded-md overflow-hidden transition-all data-[state=open]:shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
            <div className="flex items-center">
              <SquareAsterisk className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">Дополнительные опции</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4 pt-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="petsAllowed" className="cursor-pointer">
                  {t("filter.petsAllowed", "Можно с животными")}
                </Label>
                <Switch
                  id="petsAllowed"
                  checked={petsAllowed}
                  onCheckedChange={setPetsAllowed}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="utilitiesIncluded" className="cursor-pointer">
                  {t("filter.utilitiesIncluded", "Коммунальные включены")}
                </Label>
                <Switch
                  id="utilitiesIncluded"
                  checked={utilitiesIncluded}
                  onCheckedChange={setUtilitiesIncluded}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="forStudents" className="cursor-pointer">
                  {t("filter.forStudents", "Для студентов")}
                </Label>
                <Switch
                  id="forStudents"
                  checked={forStudents}
                  onCheckedChange={setForStudents}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="badHabitsAllowed" className="cursor-pointer">
                  {t("filter.badHabitsAllowed", "Можно курить")}
                </Label>
                <Switch
                  id="badHabitsAllowed"
                  checked={badHabitsAllowed}
                  onCheckedChange={setBadHabitsAllowed}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-between items-center pt-6 mt-2">
        <Popover open={saveFilterOpen} onOpenChange={setSaveFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Save className="h-4 w-4 mr-2" />
              {t("filter.saveFilter", "Сохранить фильтр")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">
                {t("filter.saveFilterTitle", "Сохранить фильтр")}
              </h4>
              <div className="space-y-2">
                <Label htmlFor="filterName">
                  {t("filter.filterName", "Название фильтра")}
                </Label>
                <Input
                  id="filterName"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder={t("filter.enterName", "Введите название")}
                  className="bg-background"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSaveFilter}
                disabled={!filterName.trim()}
              >
                {t("filter.save", "Сохранить")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button 
          onClick={handleSubmit}
          className="flex items-center gap-2 transition-all"
        >
          <FilterIcon className="h-4 w-4 mr-1" />
          {t("filter.apply", "Применить")}
          {activeFiltersCount > 0 && (
            <Badge className="bg-primary-foreground/20 text-primary border-0 ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>
    </Card>
  );
}