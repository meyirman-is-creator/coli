"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  setGender,
  setMinPrice,
  setMaxPrice,
  setRoommates,
  setRooms,
  setMinAge,
  setMaxAge,
  setMoveInDate,
  setPetsAllowed,
  setBadHabitsAllowed,
  resetFilter,
} from "@/lib/redux/features/filter/filterSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { CalendarIcon, XIcon } from "lucide-react";
import { format } from "date-fns";

interface PropertyFilterProps {
  onSubmit: (filterData: any) => void;
}

export default function PropertyFilter({ onSubmit }: PropertyFilterProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const filterState = useAppSelector((state) => state.filter);

  const [localMoveInDate, setLocalMoveInDate] = useState<Date | undefined>(
    filterState.moveInDate ? new Date(filterState.moveInDate) : undefined
  );

  const handlePriceRangeChange = (values: number[]) => {
    dispatch(setMinPrice(values[0]));
    dispatch(setMaxPrice(values[1]));
  };

  const handleAgeRangeChange = (values: number[]) => {
    dispatch(setMinAge(values[0]));
    dispatch(setMaxAge(values[1]));
  };

  const handleDateChange = (date: Date | undefined) => {
    setLocalMoveInDate(date);
    if (date) {
      dispatch(setMoveInDate(date.toISOString()));
    } else {
      dispatch(setMoveInDate(null));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(filterState);
  };

  const handleResetFilter = () => {
    dispatch(resetFilter());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t("filter")}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilter}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            {t("reset")}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>{t("gender")}</Label>
              <Select
                value={filterState.selectedGender?.code || ""}
                onValueChange={(value) => {
                  const genderOption = [
                    { id: 1, namerus: "Мужской", namekaz: "Ер", code: "MALE" },
                    {
                      id: 2,
                      namerus: "Женский",
                      namekaz: "Әйел",
                      code: "FEMALE",
                    },
                    {
                      id: 3,
                      namerus: "Любой",
                      namekaz: "Кез-келген",
                      code: "OTHER",
                    },
                  ].find((g) => g.code === value);

                  dispatch(setGender(genderOption || null));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectGender")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("any")}</SelectItem>
                  <SelectItem value="MALE">{t("male")}</SelectItem>
                  <SelectItem value="FEMALE">{t("female")}</SelectItem>
                  <SelectItem value="OTHER">{t("other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t("priceRange")}</Label>
              <div className="pt-2 px-1">
                <Slider
                  defaultValue={[
                    filterState.minPrice || 0,
                    filterState.maxPrice || 500000,
                  ]}
                  max={500000}
                  step={5000}
                  onValueChange={handlePriceRangeChange}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{filterState.minPrice || 0} ₸</span>
                  <span>{filterState.maxPrice || 500000} ₸</span>
                </div>
              </div>
            </div>

            <div>
              <Label>{t("roommates")}</Label>
              <RadioGroup
                value={filterState.roommates?.id.toString() || ""}
                onValueChange={(value) => {
                  const roommate = { id: parseInt(value), name: value };
                  dispatch(setRoommates(roommate));
                }}
                className="flex gap-2 mt-2"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex items-center space-x-1">
                    <RadioGroupItem
                      value={num.toString()}
                      id={`roommate-${num}`}
                    />
                    <Label htmlFor={`roommate-${num}`}>
                      {num}
                      {num === 5 ? "+" : ""}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label>{t("rooms")}</Label>
              <Select
                value={filterState.rooms ? filterState.rooms.toString() : ""}
                onValueChange={(value) => dispatch(setRooms(parseInt(value)))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectRooms")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("any")}</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t("ageRange")}</Label>
              <div className="pt-2 px-1">
                <Slider
                  defaultValue={[
                    filterState.minAge || 18,
                    filterState.maxAge || 50,
                  ]}
                  min={18}
                  max={70}
                  step={1}
                  onValueChange={handleAgeRangeChange}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{filterState.minAge || 18}</span>
                  <span>{filterState.maxAge || 50}</span>
                </div>
              </div>
            </div>

            <div>
              <Label>{t("moveInDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localMoveInDate ? (
                      format(localMoveInDate, "PPP")
                    ) : (
                      <span>{t("selectDate")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={localMoveInDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t("additionalFilters")}</Label>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pets-allowed"
                  checked={filterState.petsAllowed}
                  onCheckedChange={(checked) =>
                    dispatch(setPetsAllowed(checked as boolean))
                  }
                />
                <Label htmlFor="pets-allowed">{t("petsAllowed")}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bad-habits-allowed"
                  checked={filterState.badHabitsAllowed}
                  onCheckedChange={(checked) =>
                    dispatch(setBadHabitsAllowed(checked as boolean))
                  }
                />
                <Label htmlFor="bad-habits-allowed">
                  {t("badHabitsAllowed")}
                </Label>
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          {t("applyFilter")}
        </Button>
      </CardFooter>
    </Card>
  );
}
