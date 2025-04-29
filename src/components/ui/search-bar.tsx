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
import { Search, MapPin, DollarSign, Users, ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks";
import {
  initialState,
  setGender,
  setPriceRange,
  setRoommates,
  setAddress,
} from "@/store/features/searchBar/searchBar";
import {
  fetchCities,
  fetchDistricts,
  fetchMicroDistricts,
} from "@/store/slices/addressSlice";
import { useClientTranslation } from "@/i18n/client";
import { formatPrice } from "@/utils/helpers";
import { AddressType } from "@/types/common";

interface SearchBarProps {
  locale: "en" | "ru";
}

const SearchBar: React.FC<SearchBarProps> = ({ locale }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useClientTranslation(locale);

  const searchBarState = useAppSelector((state) => state.searchBar);
  const addressState = useAppSelector((state) => state.address);
  const { gender, priceRange, roommates, address } = searchBarState;
  const { cities } = addressState;

  // Fetch cities on component mount
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  const getAddressDisplay = () => {
    if (address.microDistrictName) return address.microDistrictName;
    if (address.districtName) return address.districtName;
    return (
      address.regionName ||
      (locale === "en" ? "All of Kazakhstan" : "Весь Казахстан")
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams: Record<string, string> = {};

    if (address.regionId && address.regionId > 0) {
      queryParams.region = address.regionId.toString();
    }
    if (address.districtId && address.districtId > 0) {
      queryParams.district = address.districtId.toString();
    }
    if (address.microDistrictId && address.microDistrictId > 0) {
      queryParams.microDistrict = address.microDistrictId.toString();
    }

    queryParams.minPrice = priceRange[0].toString();
    queryParams.maxPrice = priceRange[1].toString();

    if (gender) {
      queryParams.selectedGender = gender.code;
    }

    if (roommates) {
      queryParams.numberOfPeopleAreYouAccommodating = roommates.id.toString();
    }

    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/apartments?${queryString}`);
  };

  const handleCitySelect = (city: AddressType) => {
    dispatch(
      setAddress({
        ...address,
        regionId: city.id,
        regionName: city.namerus,
        districtId: null,
        districtName: "",
        microDistrictId: null,
        microDistrictName: "",
      })
    );

    if (city.haschild) {
      dispatch(fetchDistricts(city.id));
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex justify-between w-[180px]">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="flex-grow text-left truncate">
              {getAddressDisplay()}
            </span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[220px] max-h-[300px] overflow-y-auto">
          <DropdownMenuItem
            onClick={() => dispatch(setAddress(initialState.address))}
            className="cursor-pointer"
          >
            {locale === "en" ? "All of Kazakhstan" : "Весь Казахстан"}
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

      <Button type="submit" className="bg-primary text-primary-foreground">
        <Search className="h-4 w-4 mr-2" />
        {locale === "en" ? "Search" : "Поиск"}
      </Button>
    </form>
  );
};

export default SearchBar;
