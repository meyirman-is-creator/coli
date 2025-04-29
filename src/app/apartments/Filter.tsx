"use client";

import React, { useState, useEffect } from "react";
import { useClientTranslation, useTranslation } from "@/i18n";
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
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  FilterIcon,
  Home,
  DollarSign,
  Users,
  Calendar as CalendarIcon2,
  Save,
  RotateCcw,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface FilterProps {
  onSubmit?: (filterData: any) => void;
  onReset?: () => void;
}

export default function Filter({ onSubmit, onReset }: FilterProps) {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale);
  const dispatch = useAppDispatch();
  const filterState = useAppSelector((state) => state.filter);

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

  // Initialize filter values from Redux state
  useEffect(() => {
    if (filterState) {
      setMinPrice(filterState.minPrice || 0);
      setMaxPrice(filterState.maxPrice || 500000);
      setRooms(filterState.rooms || 1);
      setGender(filterState.selectedGender?.code || null);
      setMoveInDate(
        filterState.moveInDate ? new Date(filterState.moveInDate) : undefined
      );
      setMinAge(filterState.minAge || 18);
      setMaxAge(filterState.maxAge || 60);
      setPetsAllowed(filterState.petsAllowed || false);
      setUtilitiesIncluded(filterState.utilitiesIncluded || false);
      setForStudents(filterState.forStudents || false);
      setBadHabitsAllowed(filterState.badHabitsAllowed || false);
      setApartmentType(filterState.propertyType || null);
      setLeaseType(filterState.termType || null);
    }
  }, [filterState]);

  const handleSubmit = () => {
    if (onSubmit) {
      const filterData = {
        minPrice,
        maxPrice,
        rooms,
        gender,
        moveInDate: moveInDate?.toISOString(),
        minAge,
        maxAge,
        petsAllowed,
        utilitiesIncluded,
        forStudents,
        badHabitsAllowed,
        apartmentType,
        leaseType,
      };

      onSubmit(filterData);
    }
  };

  const handleReset = () => {
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

    if (onReset) {
      onReset();
    }
  };

  const decrementRooms = () => {
    if (rooms > 1) {
      setRooms(rooms - 1);
    }
  };

  const incrementRooms = () => {
    setRooms(rooms + 1);
  };

  return (
    <div className="bg-card rounded-lg border p-4 md:p-6 shadow-sm space-y-5 h-fit">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t("filter.title")}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 px-2 text-muted-foreground"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          {t("filter.reset")}
        </Button>
      </div>

      <div className="space-y-5">
        {/* Gender Filter */}
        <div>
          <Label className="mb-2 block">{t("filter.gender")}</Label>
          <Select value={gender || ""} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder={t("filter.anyGender")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("filter.anyGender")}</SelectItem>
              <SelectItem value="MALE">{t("filter.male")}</SelectItem>
              <SelectItem value="FEMALE">{t("filter.female")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label className="mb-2 block">{t("filter.priceRange")}</Label>
          <div className="flex space-x-3 mb-4">
            <div className="relative flex-1">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder={t("filter.min")}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="pl-8"
              />
            </div>
            <div className="relative flex-1">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder={t("filter.max")}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="pl-8"
              />
            </div>
          </div>
          <Slider
            value={[minPrice, maxPrice]}
            min={0}
            max={500000}
            step={5000}
            onValueChange={(range) => {
              setMinPrice(range[0]);
              setMaxPrice(range[1]);
            }}
            className="mt-6"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0 ₽</span>
            <span>500,000 ₽</span>
          </div>
        </div>

        {/* Rooms */}
        <div>
          <Label className="mb-2 block">{t("filter.rooms")}</Label>
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

        {/* Move-in Date */}
        <div>
          <Label className="mb-2 block">{t("filter.moveInDate")}</Label>
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
                  <span>{t("filter.pickDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={moveInDate}
                onSelect={setMoveInDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Age Range */}
        <div>
          <Label className="mb-2 block">{t("filter.ageRange")}</Label>
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
            onValueChange={(range) => {
              setMinAge(range[0]);
              setMaxAge(range[1]);
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>18</span>
            <span>80</span>
          </div>
        </div>

        {/* Apartment Type */}
        <div>
          <Label className="mb-2 block">{t("filter.apartmentType")}</Label>
          <Tabs
            defaultValue={apartmentType || "any"}
            onValueChange={(v) => setApartmentType(v === "any" ? null : v)}
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="any">{t("filter.any")}</TabsTrigger>
              <TabsTrigger value="APARTMENT">
                {t("filter.apartment")}
              </TabsTrigger>
              <TabsTrigger value="HOUSE">{t("filter.house")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Lease Type */}
        <div>
          <Label className="mb-2 block">{t("filter.leaseType")}</Label>
          <Tabs
            defaultValue={leaseType || "any"}
            onValueChange={(v) => setLeaseType(v === "any" ? null : v)}
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="any">{t("filter.any")}</TabsTrigger>
              <TabsTrigger value="long">{t("filter.longTerm")}</TabsTrigger>
              <TabsTrigger value="short">{t("filter.shortTerm")}</TabsTrigger>
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
          {expandedOptions ? t("filter.lessOptions") : t("filter.moreOptions")}
        </Button>

        {/* Additional Options */}
        {expandedOptions && (
          <div className="space-y-4 pt-2">
            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="pets-allowed" className="cursor-pointer">
                  {t("filter.petsAllowed")}
                </Label>
                <Switch
                  id="pets-allowed"
                  checked={petsAllowed}
                  onCheckedChange={setPetsAllowed}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="utilities-included" className="cursor-pointer">
                  {t("filter.utilitiesIncluded")}
                </Label>
                <Switch
                  id="utilities-included"
                  checked={utilitiesIncluded}
                  onCheckedChange={setUtilitiesIncluded}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="for-students" className="cursor-pointer">
                  {t("filter.forStudents")}
                </Label>
                <Switch
                  id="for-students"
                  checked={forStudents}
                  onCheckedChange={setForStudents}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="bad-habits" className="cursor-pointer">
                  {t("filter.badHabitsAllowed")}
                </Label>
                <Switch
                  id="bad-habits"
                  checked={badHabitsAllowed}
                  onCheckedChange={setBadHabitsAllowed}
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button type="button" onClick={handleSubmit} className="w-full">
          <FilterIcon className="mr-2 h-4 w-4" />
          {t("filter.apply")}
        </Button>

        {/* Save Filter Button */}
        <Button type="button" variant="outline" className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {t("filter.saveFilter")}
        </Button>
      </div>
    </div>
  );
}
