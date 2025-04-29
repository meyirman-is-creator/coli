"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search, MapPin, DollarSign, Users } from "lucide-react";
import { useClientTranslation } from "@/i18n/client"; // Исправленный импорт

// Mock data - would come from API in real implementation
const cities = [
  { id: 1, nameEn: "Moscow", nameRu: "Москва" },
  { id: 2, nameEn: "Saint Petersburg", nameRu: "Санкт-Петербург" },
  { id: 3, nameEn: "Novosibirsk", nameRu: "Новосибирск" },
];

const roommatesOptions = [1, 2, 3, 4, 5];

interface SearchBarProps {
  locale: "en" | "ru";
}

const SearchBar: React.FC<SearchBarProps> = ({ locale }) => {
  const router = useRouter();
  const { t } = useClientTranslation(locale);

  // State for search parameters
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [roommates, setRoommates] = useState<number | null>(null);

  // Dropdown states
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const [roommatesDropdownOpen, setRoommatesDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (location) params.append("location", location);
    params.append("minPrice", priceRange[0].toString());
    params.append("maxPrice", priceRange[1].toString());
    if (roommates) params.append("roommates", roommates.toString());

    router.push(`/apartments?${params.toString()}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-center">
      {/* Location */}
      <DropdownMenu
        open={locationDropdownOpen}
        onOpenChange={setLocationDropdownOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex justify-between w-[200px]">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="flex-grow text-left truncate">
              {location ||
                (locale === "en"
                  ? "Select Location"
                  : "Выберите местоположение")}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-y-auto">
          {cities.map((city) => (
            <DropdownMenuItem
              key={city.id}
              onClick={() => {
                setLocation(locale === "en" ? city.nameEn : city.nameRu);
                setLocationDropdownOpen(false);
              }}
            >
              {locale === "en" ? city.nameEn : city.nameRu}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Price Range */}
      <DropdownMenu
        open={priceDropdownOpen}
        onOpenChange={setPriceDropdownOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex justify-between w-[200px]">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="flex-grow text-left truncate">
              {`${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px] p-4">
          <h3 className="text-sm font-medium mb-4">
            {locale === "en" ? "Price Range" : "Диапазон цен"}
          </h3>

          <div className="flex space-x-2 mb-4">
            <Input
              type="number"
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  setPriceRange([value, priceRange[1]]);
                }
              }}
              className="w-1/2"
            />
            <Input
              type="number"
              min={priceRange[0]}
              value={priceRange[1]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!isNaN(value) && value >= priceRange[0]) {
                  setPriceRange([priceRange[0], value]);
                }
              }}
              className="w-1/2"
            />
          </div>

          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={() => setPriceDropdownOpen(false)}
          >
            {locale === "en" ? "Apply" : "Применить"}
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Roommates */}
      <DropdownMenu
        open={roommatesDropdownOpen}
        onOpenChange={setRoommatesDropdownOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex justify-between w-[200px]">
            <Users className="h-4 w-4 mr-2" />
            <span className="flex-grow text-left truncate">
              {roommates
                ? locale === "en"
                  ? `${roommates} roommate${roommates > 1 ? "s" : ""}`
                  : `${roommates} сосед${roommates > 1 ? "а" : ""}`
                : locale === "en"
                ? "Number of roommates"
                : "Количество соседей"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {roommatesOptions.map((count) => (
            <DropdownMenuItem
              key={count}
              onClick={() => {
                setRoommates(count);
                setRoommatesDropdownOpen(false);
              }}
            >
              {locale === "en"
                ? `${count} roommate${count > 1 ? "s" : ""}`
                : `${count} сосед${count > 1 ? "а" : ""}`}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search Button */}
      <Button type="submit" className="bg-primary text-primary-foreground">
        <Search className="h-4 w-4 mr-2" />
        {locale === "en" ? "Search" : "Поиск"}
      </Button>
    </form>
  );
};

export default SearchBar;
