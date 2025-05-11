// src/components/add-announcement/StepApartmentDetails.tsx
"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useClientTranslation } from "@/i18n/client";
import { AddressType, roommateOptions } from "@/types/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepApartmentDetailsProps {
  citiesData: AddressType[];
  districtsData: AddressType[];
  setDistrictsData: React.Dispatch<React.SetStateAction<AddressType[]>>;
  microDistrictsData: AddressType[];
  setMicroDistrictsData: React.Dispatch<React.SetStateAction<AddressType[]>>;
  fetchCities: () => Promise<void>;
  fetchDistricts: (cityId: number) => Promise<void>;
  fetchMicroDistricts: (districtId: number) => Promise<void>;
  isAddressLoading: boolean;
}

const StepApartmentDetails: React.FC<StepApartmentDetailsProps> = ({
  citiesData,
  districtsData,
  setDistrictsData,
  microDistrictsData,
  setMicroDistrictsData,
  fetchCities,
  fetchDistricts,
  fetchMicroDistricts,
  isAddressLoading,
}) => {
  const [locale, setLocale] = React.useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "profile");
  const { watch, setValue } = useFormContext();

  const address = watch("address") || "";
  const regionValue = watch("region") || null;
  const districtValue = watch("district") || null;
  const microDistrictValue = watch("microDistrict") || null;
  const monthlyPayment = watch("monthlyPayment") || "";
  const rooms = watch("rooms") || "1";
  const deposit = watch("deposit") || false;
  const depositAmount = watch("depositAmount") || 0;
  const moveInDate = watch("moveInDate") || '';

  useEffect(() => {
    const loadInitialData = async () => {
      if (citiesData.length === 0) {
        await fetchCities();
      }

      if (regionValue && districtsData.length === 0) {
        await fetchDistricts(regionValue);
      }

      if (districtValue && microDistrictsData.length === 0) {
        await fetchMicroDistricts(districtValue);
      }
    };

    loadInitialData();
  }, []);

  const handleRegionSelect = (value: string) => {
    const regionId = parseInt(value);
    setValue("region", regionId);
    setValue("district", null);
    setValue("microDistrict", null);
    setDistrictsData([]);
    setMicroDistrictsData([]);
    
    if (regionId) {
      fetchDistricts(regionId);
    }
  };

  const handleDistrictSelect = (value: string) => {
    const districtId = parseInt(value);
    setValue("district", districtId);
    setValue("microDistrict", null);
    setMicroDistrictsData([]);
    
    if (districtId) {
      fetchMicroDistricts(districtId);
    }
  };

  const handleMicroDistrictSelect = (value: string) => {
    setValue("microDistrict", parseInt(value));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue("moveInDate", format(date, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Region Selection */}
      <div className="space-y-2">
        <Label htmlFor="region">
          {t("addAnnouncement.fields.location.region", "Регион")}
        </Label>
        <Select
          value={regionValue ? regionValue.toString() : ""}
          onValueChange={handleRegionSelect}
        >
          <SelectTrigger id="region" className="w-full" disabled={isAddressLoading && !citiesData.length}>
            <SelectValue placeholder={t("addAnnouncement.placeholders.region", "Выберите регион")} />
          </SelectTrigger>
          <SelectContent>
            {citiesData.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.namerus}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District Selection - Only show if there are districts */}
      {districtsData.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="district">
            {t("addAnnouncement.fields.location.district", "Район")}
          </Label>
          <Select
            value={districtValue ? districtValue.toString() : ""}
            onValueChange={handleDistrictSelect}
          >
            <SelectTrigger id="district" className="w-full" disabled={isAddressLoading}>
              <SelectValue placeholder={t("addAnnouncement.placeholders.district", "Выберите район")} />
            </SelectTrigger>
            <SelectContent>
              {districtsData.map((district) => (
                <SelectItem key={district.id} value={district.id.toString()}>
                  {district.namerus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Microdistrict Selection - Only show if there are microdistricts */}
      {microDistrictsData.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="microDistrict">
            {t("addAnnouncement.fields.location.microdistrict", "Микрорайон")}
          </Label>
          <Select
            value={microDistrictValue ? microDistrictValue.toString() : ""}
            onValueChange={handleMicroDistrictSelect}
          >
            <SelectTrigger id="microDistrict" className="w-full" disabled={isAddressLoading}>
              <SelectValue placeholder={t("addAnnouncement.placeholders.microdistrict", "Выберите микрорайон")} />
            </SelectTrigger>
            <SelectContent>
              {microDistrictsData.map((microDistrict) => (
                <SelectItem key={microDistrict.id} value={microDistrict.id.toString()}>
                  {microDistrict.namerus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Address Input */}
      <div className="space-y-2">
        <Label htmlFor="address">
          {t("addAnnouncement.fields.location.address", "Адрес:")}
        </Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setValue("address", e.target.value)}
          placeholder={t("addAnnouncement.placeholders.address", "Введите адрес")}
        />
      </div>

      {/* Move-in Date */}
      <div className="space-y-2">
        <Label htmlFor="moveInDate">
          {t("addAnnouncement.fields.arriveDate", "Дата начала заселения")}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="moveInDate"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !moveInDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {moveInDate ? format(new Date(moveInDate), "PPP") : t("addAnnouncement.placeholders.date", "Выберите дату")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={moveInDate ? new Date(moveInDate) : undefined}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Monthly Payment */}
      <div className="space-y-2">
        <Label htmlFor="monthlyPayment">
          {t("addAnnouncement.fields.cost", "Ежемесячный платеж:")}
        </Label>
        <Input
          id="monthlyPayment"
          type="number"
          value={monthlyPayment}
          onChange={(e) => setValue("monthlyPayment", e.target.value)}
          placeholder={t("addAnnouncement.placeholders.cost", "Введите сумму")}
        />
      </div>

      {/* Rooms */}
      <div className="space-y-2">
        <Label>
          {t("addAnnouncement.fields.rooms", "Сколько комнат в квартире?")}
        </Label>
        <div className="flex flex-wrap gap-2">
          {roommateOptions.map((option) => (
            <Button
              key={option.id}
              type="button"
              variant={rooms === option.id ? "default" : "outline"}
              onClick={() => setValue("rooms", option.id)}
            >
              {option.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Deposit */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="deposit"
            checked={deposit}
            onCheckedChange={(checked) => setValue("deposit", checked === true)}
          />
          <Label htmlFor="deposit" className="cursor-pointer">
            {t("addAnnouncement.fields.deposit.required", "Есть ли депозит?")}
          </Label>
        </div>
        
        {deposit && (
          <div className="pl-6">
            <Label htmlFor="depositAmount" className="block mb-2">
              {t("addAnnouncement.fields.deposit.amount", "Сумма депозита:")}
            </Label>
            <Input
              id="depositAmount"
              type="number"
              value={depositAmount.toString()}
              onChange={(e) => setValue("depositAmount", parseInt(e.target.value) || 0)}
              placeholder={t("addAnnouncement.placeholders.depositAmount", "Введите сумму депозита")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StepApartmentDetails;