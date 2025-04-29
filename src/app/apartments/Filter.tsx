"use client";

import React, { useState, useEffect } from "react";
import { useClientTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  CalendarIcon,
  FilterIcon,
  Home,
  DollarSign,
  Users,
  Save,
  RotateCcw,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  setCurrentFilter,
  clearCurrentFilter,
  updateFilterValue,
  saveFilter,
} from "@/store/slices/filterSlice";
import { ApartmentFilter } from "@/types/apartment";
import { SaveFilterRequest } from "@/types/filter";

interface FilterProps {
  onSubmit?: (filterData: any) => void;
  onReset?: () => void;
}

export default function Filter({ onSubmit, onReset }: FilterProps) {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale);
  const dispatch = useAppDispatch();
  const filterState = useAppSelector((state) => state.filter.currentFilter);

  // Local state for filter values
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [rooms, setRooms] = useState<number>(1);
  const [gender, setGender] = useState<string | null>(null);
  const [moveInDate, setMoveInDate] = useState<Date | undefined>(undefined);
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(60);
  const [expandedOptions, setExpandedOptions] = useState<boolean>(false);
  const [petsAllowed, setPetsAllowed] = useState<boolean>(false);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState<boolean>(false);
  const [forStudents, setForStudents] = useState<boolean>(false);
  const [badHabitsAllowed, setBadHabitsAllowed] = useState<boolean>(false);
  const [apartmentType, setApartmentType] = useState<string | null>(null);
  const [leaseType, setLeaseType] = useState<string | null>(null);
  const [filterName, setFilterName] = useState<string>("");
  const [saveFilterOpen, setSaveFilterOpen] = useState<boolean>(false);
  const [minArea, setMinArea] = useState<number | undefined>(undefined);
  const [maxArea, setMaxArea] = useState<number | undefined>(undefined);
  const [minFloor, setMinFloor] = useState<number | undefined>(undefined);
  const [maxFloor, setMaxFloor] = useState<number | undefined>(undefined);
  const [isNotFirstFloor, setIsNotFirstFloor] = useState<boolean>(false);
  const [isNotLastFloor, setIsNotLastFloor] = useState<boolean>(false);
  const [roommates, setRoommates] = useState<number | null>(null);

  // Date selection helpers
  const [isToday, setIsToday] = useState(false);
  const [isTomorrow, setIsTomorrow] = useState(false);

  // Mock data for regions
  const [regions, setRegions] = useState([
    { id: 1, namerus: "Москва" },
    { id: 2, namerus: "Санкт-Петербург" },
    { id: 3, namerus: "Казань" },
  ]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [microDistricts, setMicroDistricts] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedMicroDistrict, setSelectedMicroDistrict] = useState<
    string | null
  >(null);

  // Initialize filter values from Redux state
  useEffect(() => {
    if (filterState) {
      setMinPrice(filterState.priceMin || 0);
      setMaxPrice(filterState.priceMax || 500000);
      setRooms(filterState.roomsMin || 1);
      setGender(filterState.gender || null);
      setMoveInDate(
        filterState.availableFrom
          ? new Date(filterState.availableFrom)
          : undefined
      );
      setMinAge(filterState.minAge || 18);
      setMaxAge(filterState.maxAge || 60);
      setPetsAllowed(filterState.features?.includes("pets_allowed") || false);
      setUtilitiesIncluded(filterState.utilitiesIncluded || false);
      setForStudents(filterState.forStudents || false);
      setBadHabitsAllowed(filterState.badHabitsAllowed || false);
      setApartmentType(filterState.type?.[0] || null);
      setLeaseType(filterState.termType || null);
      setMinArea(filterState.areaMin);
      setMaxArea(filterState.areaMax);
      setMinFloor(filterState.minFloor);
      setMaxFloor(filterState.maxFloor);
      setIsNotFirstFloor(filterState.isNotFirstFloor || false);
      setIsNotLastFloor(filterState.isNotLastFloor || false);
      setRoommates(filterState.roommates?.id || null);
    }
  }, [filterState]);

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    setSelectedDistrict(null);
    setSelectedMicroDistrict(null);

    // Mock districts based on selected region
    if (regionId) {
      setDistricts([
        { id: 1, namerus: "Центральный" },
        { id: 2, namerus: "Северный" },
        { id: 3, namerus: "Южный" },
      ]);
    } else {
      setDistricts([]);
    }

    // Update address in filter
    const selectedRegionObj = regions.find((r) => r.id.toString() === regionId);
    dispatch(
      updateFilterValue({
        key: "address",
        value: {
          regionId: selectedRegionObj?.id || null,
          regionName: selectedRegionObj?.namerus || "",
          districtId: null,
          districtName: "",
          microDistrictId: null,
          microDistrictName: "",
        },
      })
    );
  };

  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedMicroDistrict(null);

    // Mock microdistricts based on selected district
    if (districtId) {
      setMicroDistricts([
        { id: 1, namerus: "Район А" },
        { id: 2, namerus: "Район Б" },
        { id: 3, namerus: "Район В" },
      ]);
    } else {
      setMicroDistricts([]);
    }

    // Update address in filter
    const selectedDistrictObj = districts.find(
      (d) => d.id.toString() === districtId
    );
    const currentAddress = filterState.address || {};
    dispatch(
      updateFilterValue({
        key: "address",
        value: {
          ...currentAddress,
          districtId: selectedDistrictObj?.id || null,
          districtName: selectedDistrictObj?.namerus || "",
          microDistrictId: null,
          microDistrictName: "",
        },
      })
    );
  };

  const handleMicroDistrictSelect = (microId: string) => {
    setSelectedMicroDistrict(microId);

    // Update address in filter
    const selectedMicroObj = microDistricts.find(
      (m) => m.id.toString() === microId
    );
    const currentAddress = filterState.address || {};
    dispatch(
      updateFilterValue({
        key: "address",
        value: {
          ...currentAddress,
          microDistrictId: selectedMicroObj?.id || null,
          microDistrictName: selectedMicroObj?.namerus || "",
        },
      })
    );
  };

  const handlePriceChange = (values: number[]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
    dispatch(updateFilterValue({ key: "priceMin", value: values[0] }));
    dispatch(updateFilterValue({ key: "priceMax", value: values[1] }));
  };

  const handleRoommatesSelect = (count: number | null) => {
    setRoommates(count);
    const roommateOption = count ? { id: count, name: count.toString() } : null;
    dispatch(updateFilterValue({ key: "roommates", value: roommateOption }));
  };

  const decrementRooms = () => {
    if (rooms > 1) {
      const newValue = rooms - 1;
      setRooms(newValue);
      dispatch(updateFilterValue({ key: "roomsMin", value: newValue }));
    }
  };

  const incrementRooms = () => {
    const newValue = rooms + 1;
    setRooms(newValue);
    dispatch(updateFilterValue({ key: "roomsMin", value: newValue }));
  };

  const handleAgeChange = (values: number[]) => {
    setMinAge(values[0]);
    setMaxAge(values[1]);
    dispatch(updateFilterValue({ key: "minAge", value: values[0] }));
    dispatch(updateFilterValue({ key: "maxAge", value: values[1] }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setMoveInDate(date);
    setIsToday(false);
    setIsTomorrow(false);

    if (date) {
      dispatch(
        updateFilterValue({
          key: "availableFrom",
          value: date.toISOString(),
        })
      );
    } else {
      dispatch(updateFilterValue({ key: "availableFrom", value: null }));
    }
  };

  const handleTodayChange = () => {
    const newIsToday = !isToday;
    setIsToday(newIsToday);
    setIsTomorrow(false);

    if (newIsToday) {
      const today = new Date();
      setMoveInDate(today);
      dispatch(
        updateFilterValue({
          key: "availableFrom",
          value: today.toISOString(),
        })
      );
    }
  };

  const handleTomorrowChange = () => {
    const newIsTomorrow = !isTomorrow;
    setIsTomorrow(newIsTomorrow);
    setIsToday(false);

    if (newIsTomorrow) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setMoveInDate(tomorrow);
      dispatch(
        updateFilterValue({
          key: "availableFrom",
          value: tomorrow.toISOString(),
        })
      );
    }
  };

  const handlePropertyTypeSelect = (type: string | null) => {
    setApartmentType(type);
    dispatch(
      updateFilterValue({
        key: "type",
        value: type ? [type] : undefined,
      })
    );
  };

  const handleTermTypeSelect = (type: string | null) => {
    setLeaseType(type);
    dispatch(updateFilterValue({ key: "termType", value: type }));
  };

  const handleGenderSelect = (value: string) => {
    const genderValue = value === "" ? null : value;
    setGender(genderValue);
    dispatch(updateFilterValue({ key: "gender", value: genderValue }));
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;

    const saveRequest: SaveFilterRequest = {
      name: filterName,
      filter: filterState,
    };

    dispatch(saveFilter(saveRequest));
    setSaveFilterOpen(false);
    setFilterName("");
  };

  const handleReset = () => {
    // Reset all local state
    setMinPrice(0);
    setMaxPrice(500000);
    setRooms(1);
    setGender(null);
    setMoveInDate(undefined);
    setMinAge(18);
    setMaxAge(60);
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

    // Clear Redux filter
    dispatch(clearCurrentFilter());

    // Call parent reset handler if provided
    if (onReset) {
      onReset();
    }
  };

  const handleSubmit = () => {
    // Prepare features array
    const features = [];
    if (petsAllowed) features.push("pets_allowed");

    // Build complete filter object
    const filterData: ApartmentFilter = {
      ...filterState,
      priceMin: minPrice,
      priceMax: maxPrice,
      roomsMin: rooms,
      gender,
      availableFrom: moveInDate?.toISOString(),
      minAge,
      maxAge,
      features,
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

    // Update Redux state
    dispatch(setCurrentFilter(filterData));

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
                value={minPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    setMinPrice(value);
                    dispatch(updateFilterValue({ key: "priceMin", value }));
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
                value={maxPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value) && value >= minPrice) {
                    setMaxPrice(value);
                    dispatch(updateFilterValue({ key: "priceMax", value }));
                  }
                }}
                className="pl-8"
              />
            </div>
          </div>
          <Slider
            value={[minPrice, maxPrice]}
            min={0}
            max={500000}
            step={5000}
            onValueChange={handlePriceChange}
            className="mt-6"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0 ₽</span>
            <span>500,000 ₽</span>
          </div>
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
              {minAge} - {maxAge}
            </span>
          </div>
          <Slider
            value={[minAge, maxAge]}
            min={18}
            max={80}
            step={1}
            onValueChange={handleAgeChange}
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>18</span>
            <span>80</span>
          </div>
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
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="any">{t("filter.any", "Любая")}</TabsTrigger>
              <TabsTrigger value="long">
                {t("filter.longTerm", "Долгосрочно")}
              </TabsTrigger>
              <TabsTrigger value="short">
                {t("filter.shortTerm", "Краткосрочно")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Move-in Date */}
        <div>
          <Label className="mb-2 block">
            {t("filter.moveInDate", "Дата заселения")}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {moveInDate ? (
                  format(moveInDate, "PPP", { locale: ru })
                ) : (
                  <span>{t("filter.pickDate", "Выберите дату")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={moveInDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="today"
                checked={isToday}
                onCheckedChange={handleTodayChange}
              />
              <Label htmlFor="today">{t("filter.today", "Сегодня")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tomorrow"
                checked={isTomorrow}
                onCheckedChange={handleTomorrowChange}
              />
              <Label htmlFor="tomorrow">{t("filter.tomorrow", "Завтра")}</Label>
            </div>
          </div>
        </div>

        {/* Apartment Type */}
        <div>
          <Label className="mb-2 block">
            {t("filter.apartmentType", "Тип жилья")}
          </Label>
          <Tabs
            defaultValue={apartmentType || "any"}
            onValueChange={(value) =>
              handlePropertyTypeSelect(value === "any" ? null : value)
            }
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="any">{t("filter.any", "Любой")}</TabsTrigger>
              <TabsTrigger value="apartment">
                {t("filter.apartment", "Квартира")}
              </TabsTrigger>
              <TabsTrigger value="house">
                {t("filter.house", "Дом")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Expand Button */}
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => setExpandedOptions(!expandedOptions)}
        >
          {expandedOptions
            ? t("filter.lessOptions", "Меньше опций")
            : t("filter.moreOptions", "Больше опций")}
        </Button>

        {/* Additional Options */}
        {expandedOptions && (
          <div className="space-y-4 pt-2">
            <Separator />

            {/* Area Range */}
            <div>
              <Label className="mb-2 block">
                {t("filter.areaRange", "Площадь (м²)")}
              </Label>
              <div className="flex space-x-3">
                <Input
                  type="number"
                  placeholder={t("filter.minArea", "От")}
                  value={minArea || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setMinArea(isNaN(value) ? undefined : value);
                    dispatch(
                      updateFilterValue({
                        key: "areaMin",
                        value: isNaN(value) ? undefined : value,
                      })
                    );
                  }}
                />
                <Input
                  type="number"
                  placeholder={t("filter.maxArea", "До")}
                  value={maxArea || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setMaxArea(isNaN(value) ? undefined : value);
                    dispatch(
                      updateFilterValue({
                        key: "areaMax",
                        value: isNaN(value) ? undefined : value,
                      })
                    );
                  }}
                />
              </div>
            </div>

            {/* Floor Range */}
            <div>
              <Label className="mb-2 block">
                {t("filter.floorRange", "Этаж")}
              </Label>
              <div className="flex space-x-3 mb-2">
                <Input
                  type="number"
                  placeholder={t("filter.minFloor", "От")}
                  value={minFloor || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setMinFloor(isNaN(value) ? undefined : value);
                    dispatch(
                      updateFilterValue({
                        key: "minFloor",
                        value: isNaN(value) ? undefined : value,
                      })
                    );
                  }}
                />
                <Input
                  type="number"
                  placeholder={t("filter.maxFloor", "До")}
                  value={maxFloor || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setMaxFloor(isNaN(value) ? undefined : value);
                    dispatch(
                      updateFilterValue({
                        key: "maxFloor",
                        value: isNaN(value) ? undefined : value,
                      })
                    );
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="not-first-floor"
                    checked={isNotFirstFloor}
                    onCheckedChange={(checked) => {
                      setIsNotFirstFloor(checked as boolean);
                      dispatch(
                        updateFilterValue({
                          key: "isNotFirstFloor",
                          value: checked,
                        })
                      );
                    }}
                  />
                  <Label htmlFor="not-first-floor">
                    {t("filter.notFirstFloor", "Не первый этаж")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="not-last-floor"
                    checked={isNotLastFloor}
                    onCheckedChange={(checked) => {
                      setIsNotLastFloor(checked as boolean);
                      dispatch(
                        updateFilterValue({
                          key: "isNotLastFloor",
                          value: checked,
                        })
                      );
                    }}
                  />
                  <Label htmlFor="not-last-floor">
                    {t("filter.notLastFloor", "Не последний этаж")}
                  </Label>
                </div>
              </div>
            </div>

            {/* Additional Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="pets-allowed" className="cursor-pointer">
                  {t("filter.petsAllowed", "Разрешены домашние животные")}
                </Label>
                <Switch
                  id="pets-allowed"
                  checked={petsAllowed}
                  onCheckedChange={setPetsAllowed}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="utilities-included" className="cursor-pointer">
                  {t(
                    "filter.utilitiesIncluded",
                    "Коммунальные услуги включены"
                  )}
                </Label>
                <Switch
                  id="utilities-included"
                  checked={utilitiesIncluded}
                  onCheckedChange={(checked) => {
                    setUtilitiesIncluded(checked);
                    dispatch(
                      updateFilterValue({
                        key: "utilitiesIncluded",
                        value: checked,
                      })
                    );
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="for-students" className="cursor-pointer">
                  {t("filter.forStudents", "Для студентов")}
                </Label>
                <Switch
                  id="for-students"
                  checked={forStudents}
                  onCheckedChange={(checked) => {
                    setForStudents(checked);
                    dispatch(
                      updateFilterValue({
                        key: "forStudents",
                        value: checked,
                      })
                    );
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="bad-habits" className="cursor-pointer">
                  {t("filter.badHabitsAllowed", "Разрешены вредные привычки")}
                </Label>
                <Switch
                  id="bad-habits"
                  checked={badHabitsAllowed}
                  onCheckedChange={(checked) => {
                    setBadHabitsAllowed(checked);
                    dispatch(
                      updateFilterValue({
                        key: "badHabitsAllowed",
                        value: checked,
                      })
                    );
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Filter Dialog */}
        <Popover open={saveFilterOpen} onOpenChange={setSaveFilterOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {t("filter.saveFilter", "Сохранить фильтр")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">
                {t("filter.saveFilterTitle", "Сохранить фильтр")}
              </h4>
              <Input
                placeholder={t("filter.filterName", "Название фильтра")}
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSaveFilterOpen(false)}
                >
                  {t("common.cancel", "Отмена")}
                </Button>
                <Button size="sm" onClick={handleSaveFilter}>
                  {t("common.save", "Сохранить")}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Submit Button */}
        <Button type="button" onClick={handleSubmit} className="w-full">
          <FilterIcon className="mr-2 h-4 w-4" />
          {t("filter.apply", "Применить фильтр")}
        </Button>
      </div>
    </div>
  );
}
