"use client";

import React, { useState, useEffect } from "react";
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
  FilterIcon,
  Save,
  RotateCcw,
  MinusCircle,
  PlusCircle,
  DollarSign,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Import our custom components
import { RangeSlider } from "@/components/ui/range-slider";
import { DatePicker } from "@/components/ui/date-picker";

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
}

/**
 * ApartmentFilter component - A comprehensive filter for apartment listings
 */
export default function ApartmentFilter({ 
  onSubmit, 
  onReset,
  initialFilter = {}
}: ApartmentFilterProps) {
  // For internationalization
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale);
  
  // Filter state - grouped by categories for better organization
  // Basic filter criteria
  const [gender, setGender] = useState<string | null>(initialFilter.gender || null);
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
  const [expandedOptions, setExpandedOptions] = useState<boolean>(false);
  const [filterName, setFilterName] = useState<string>("");
  const [saveFilterOpen, setSaveFilterOpen] = useState<boolean>(false);

  // Location selection state
  const [regions, setRegions] = useState([
    { id: 1, namerus: "Москва" },
    { id: 2, namerus: "Санкт-Петербург" },
    { id: 3, namerus: "Казань" },
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

  /**
   * Initialize districts based on selected region
   */
  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    setSelectedDistrict(null);
    setSelectedMicroDistrict(null);

    // Mock districts based on selected region (in a real app, this would be an API call)
    if (regionId && regionId !== "any") {
      setDistricts([
        { id: 1, namerus: "Центральный" },
        { id: 2, namerus: "Северный" },
        { id: 3, namerus: "Южный" },
      ]);
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
  };

  /**
   * Initialize microdistricts based on selected district
   */
  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedMicroDistrict(null);

    // Mock microdistricts based on selected district
    if (districtId && districtId !== "any") {
      setMicroDistricts([
        { id: 1, namerus: "Район А" },
        { id: 2, namerus: "Район Б" },
        { id: 3, namerus: "Район В" },
      ]);
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
  };

  /**
   * Update address with selected microdistrict
   */
  const handleMicroDistrictSelect = (microId: string) => {
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
  };

  /**
   * Toggle the selection of a roommate count button
   */
  const handleRoommatesSelect = (count: number | null) => {
    setRoommates(count);
  };

  /**
   * Decrement the room count
   */
  const decrementRooms = () => {
    if (rooms > 1) {
      setRooms(rooms - 1);
    }
  };

  /**
   * Increment the room count
   */
  const incrementRooms = () => {
    setRooms(rooms + 1);
  };

  /**
   * Handle the date picker change
   */
  const handleDateChange = (date: Date | undefined) => {
    setMoveInDate(date);
    setIsToday(false);
    setIsTomorrow(false);
  };

  /**
   * Handle the "Today" checkbox for move-in date
   */
  const handleTodayChange = () => {
    const newIsToday = !isToday;
    setIsToday(newIsToday);
    setIsTomorrow(false);

    if (newIsToday) {
      const today = new Date();
      setMoveInDate(today);
    }
  };

  /**
   * Handle the "Tomorrow" checkbox for move-in date
   */
  const handleTomorrowChange = () => {
    const newIsTomorrow = !isTomorrow;
    setIsTomorrow(newIsTomorrow);
    setIsToday(false);

    if (newIsTomorrow) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setMoveInDate(tomorrow);
    }
  };

  /**
   * Set the property type filter
   */
  const handlePropertyTypeSelect = (type: string | null) => {
    setApartmentType(type);
  };

  /**
   * Set the lease term type filter
   */
  const handleTermTypeSelect = (type: string | null) => {
    setLeaseType(type);
  };

  /**
   * Set the gender filter
   */
  const handleGenderSelect = (value: string) => {
    const genderValue = value === "" || value === "any" ? null : value;
    setGender(genderValue);
  };

  /**
   * Format currency for display
   */
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('ru-RU')} ₽`;
  };

  /**
   * Save the current filter with a name
   */
  const handleSaveFilter = () => {
    if (!filterName.trim()) return;

    // Build the filter object
    const filterToSave = buildFilterObject();

    // For now, just close the save dialog
    setSaveFilterOpen(false);
    setFilterName("");
    
    // Show a notification or feedback that the filter was saved
    console.log("Filter saved:", filterName, filterToSave);
  };

  /**
   * Reset all filter values to defaults
   */
  const handleReset = () => {
    // Reset all local state to default values
    setRooms(1);
    setGender(null);
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
    setExpandedOptions(false);
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
  };

  /**
   * Build a complete filter object from all the current filter state
   */
  const buildFilterObject = () => {
    // Prepare features array
    const features = [];
    if (petsAllowed) features.push("pets_allowed");

    // Build complete filter object
    return {
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      roomsMin: rooms,
      gender,
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
  };

  /**
   * Submit the filter to parent component
   */
  const handleSubmit = () => {
    // Build the complete filter object
    const filterData = buildFilterObject();

    // Call parent submit handler if provided
    if (onSubmit) {
      onSubmit(filterData);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4 md:p-6 shadow-sm space-y-5 h-fit">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t("filter.title", "Фильтр")}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 px-2 text-muted-foreground"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          {t("filter.reset", "Сбросить все")}
        </Button>
      </div>

      <div className="space-y-5">
        {/* Gender Filter */}
        <div>
          <Label className="mb-2 block">{t("filter.gender", "Пол")}</Label>
          <Select value={gender || ""} onValueChange={handleGenderSelect}>
            <SelectTrigger>
              <SelectValue placeholder={t("filter.anyGender", "Любой пол")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">
                {t("filter.anyGender", "Любой пол")}
              </SelectItem>
              <SelectItem value="male">
                {t("filter.male", "Мужской")}
              </SelectItem>
              <SelectItem value="female">
                {t("filter.female", "Женский")}
              </SelectItem>
              <SelectItem value="other">
                {t("filter.other", "Другой")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location selection */}
        <div>
          <Label className="mb-2 block">{t("filter.region", "Регион")}</Label>
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

        {/* District selection - only show if a region is selected */}
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

        {/* Microdistrict selection - only show if a district is selected */}
        {microDistricts.length > 0 && (
          <div>
            <Label className="mb-2 block">
              {t("filter.microDistrict", "Микрорайон")}
            </Label>
            <Select
              value={selectedMicroDistrict || ""}
              onValueChange={handleMicroDistrictSelect}
            >
              <SelectTrigger>
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

        {/* Price Range */}
        <div>
          <Label className="mb-2 block">
            {t("filter.priceRange", "Диапазон цен")}
          </Label>
          <div className="flex space-x-3 mb-4">
            <div className="relative flex-1">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder={t("filter.min", "От")}
                value={priceRange[0]}
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
                value={priceRange[1]}
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
          
          {/* Use our custom RangeSlider component */}
          <RangeSlider
            value={priceRange}
            min={0}
            max={500000}
            step={5000}
            onValueChange={setPriceRange}
            formatLabel={formatCurrency}
            className="mt-6"
          />
        </div>

        {/* Roommates */}
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

        {/* Rooms */}
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

        {/* Age Range */}
        <div>
          <Label className="mb-2 block">
            {t("filter.ageRange", "Возрастной диапазон")}
          </Label>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">
              {ageRange[0]} - {ageRange[1]}
            </span>
          </div>
          
          {/* Use our custom RangeSlider component */}
          <RangeSlider
            value={ageRange}
            min={18}
            max={80}
            step={1}
            onValueChange={setAgeRange}
          />
        </div>

        {/* Lease Type */}
        <div>
          <Label className="mb-2 block">
            {t("filter.leaseType", "Продолжительность")}
          </Label>
          <Tabs
            defaultValue={leaseType || "any"}
            onValueChange={(value) =>
              handleTermTypeSelect(value === "any" ? null : value)
            }
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="any">
                {t("filter.anyTerm", "Любая")}
              </TabsTrigger>
              <TabsTrigger value="long">
                {t("filter.longTerm", "Долгосрочная")}
              </TabsTrigger>
              <TabsTrigger value="short">
                {t("filter.shortTerm", "Краткосрочная")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Area Range */}
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
              />
            </div>
          </div>
        </div>

        {/* Floor Range */}
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
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notFirstFloor"
                checked={isNotFirstFloor}
                onCheckedChange={(checked) => setIsNotFirstFloor(checked as boolean)}
              />
              <Label htmlFor="notFirstFloor">
                {t("filter.notFirstFloor", "Не первый этаж")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notLastFloor"
                checked={isNotLastFloor}
                onCheckedChange={(checked) => setIsNotLastFloor(checked as boolean)}
              />
              <Label htmlFor="notLastFloor">
                {t("filter.notLastFloor", "Не последний этаж")}
              </Label>
            </div>
          </div>
        </div>

        {/* Move-in Date */}
        <div>
          <Label className="mb-2 block">
            {t("filter.moveInDate", "Дата заезда")}
          </Label>
          <div className="space-y-4">
            <DatePicker
              date={moveInDate}
              onSelect={handleDateChange}
              placeholder={t("filter.selectDate", "Выберите дату")}
            />
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="today"
                  checked={isToday}
                  onCheckedChange={handleTodayChange}
                />
                <Label htmlFor="today">
                  {t("filter.today", "Сегодня")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tomorrow"
                  checked={isTomorrow}
                  onCheckedChange={handleTomorrowChange}
                />
                <Label htmlFor="tomorrow">
                  {t("filter.tomorrow", "Завтра")}
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <Label className="mb-2 block">
            {t("filter.additionalOptions", "Дополнительные опции")}
          </Label>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="petsAllowed"
                checked={petsAllowed}
                onCheckedChange={setPetsAllowed}
              />
              <Label htmlFor="petsAllowed">
                {t("filter.petsAllowed", "Можно с животными")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="utilitiesIncluded"
                checked={utilitiesIncluded}
                onCheckedChange={setUtilitiesIncluded}
              />
              <Label htmlFor="utilitiesIncluded">
                {t("filter.utilitiesIncluded", "Коммунальные включены")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="forStudents"
                checked={forStudents}
                onCheckedChange={setForStudents}
              />
              <Label htmlFor="forStudents">
                {t("filter.forStudents", "Для студентов")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="badHabitsAllowed"
                checked={badHabitsAllowed}
                onCheckedChange={setBadHabitsAllowed}
              />
              <Label htmlFor="badHabitsAllowed">
                {t("filter.badHabitsAllowed", "Можно курить")}
              </Label>
            </div>
          </div>
        </div>

        {/* Save Filter */}
        <div className="flex justify-between items-center pt-4">
          <Popover open={saveFilterOpen} onOpenChange={setSaveFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
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

          <Button onClick={handleSubmit}>
            <FilterIcon className="h-4 w-4 mr-2" />
            {t("filter.apply", "Применить")}
          </Button>
        </div>
      </div>
    </div>
  );
}