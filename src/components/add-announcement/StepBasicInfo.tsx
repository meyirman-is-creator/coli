// src/components/add-announcement/StepBasicInfo.tsx
"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useClientTranslation } from "@/i18n/client";
import { genderOptions, roommateOptions } from "@/types/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus } from "lucide-react";

const StepBasicInfo: React.FC = () => {
  const [locale, setLocale] = React.useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "profile");
  const { control, watch, setValue } = useFormContext();

  const title = watch("title") || "";
  const gender = watch("gender") || "";
  const livingInHome = watch("livingInHome") || false;
  const peopleInApartment = watch("peopleInApartment") || "1";
  const roommates = watch("roommates") || 1;
  const ageRange = watch("ageRange") || [18, 50];
  const selectedRole = watch("role") === "RESIDENT";

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-foreground">
          {t("addAnnouncement.fields.title", "Заголовок объявления:")}
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setValue("title", e.target.value)}
          placeholder={t("addAnnouncement.placeholders.title", "Введите заголовок объявления")}
          className="w-full"
        />
      </div>

      {/* Gender Selection */}
      <div className="space-y-2">
        <Label className="text-foreground">
          {t("addAnnouncement.fields.gender.label", "Кого вы подселяете?")}
        </Label>
        <RadioGroup
          value={gender}
          onValueChange={(value) => setValue("gender", value)}
          className="space-y-3"
        >
          {genderOptions.map((option) => (
            <div className="flex items-center space-x-2" key={option.code}>
              <RadioGroupItem value={option.code} id={option.code} />
              <Label htmlFor={option.code} className="cursor-pointer">
                {t(`addAnnouncement.fields.gender.${option.code.toLowerCase()}`, option.namerus)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Only show if role is RESIDENT */}
      {selectedRole && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="livingInHome"
              checked={livingInHome}
              onCheckedChange={(checked) => setValue("livingInHome", checked === true)}
            />
            <Label htmlFor="livingInHome" className="cursor-pointer">
              {t("addAnnouncement.fields.liveIn", "Вы проживаете в этом доме?")}
            </Label>
          </div>
        </div>
      )}

      {/* People in Apartment */}
      <div className="space-y-2">
        <Label className="text-foreground">
          {t("addAnnouncement.fields.currentResidents", "Сколько людей проживают в квартире? (не включая вас)")}
        </Label>
        <div className="flex flex-wrap gap-2">
          {roommateOptions.map((option) => (
            <Button
              key={option.id}
              type="button"
              variant={peopleInApartment === option.id ? "default" : "outline"}
              onClick={() => setValue("peopleInApartment", option.id)}
              className="px-4"
            >
              {option.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Roommates Count */}
      <div className="space-y-2">
        <Label className="text-foreground">
          {t("addAnnouncement.fields.lookingFor", "Сколько человек подселяете?")}
        </Label>
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => setValue("roommates", Math.max(1, roommates - 1))}
            disabled={roommates <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="text-xl font-medium w-8 text-center">{roommates}</span>
          
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => setValue("roommates", Math.min(10, roommates + 1))}
            disabled={roommates >= 10}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Age Range */}
      <div className="space-y-4">
        <Label className="text-foreground">
          {t("addAnnouncement.fields.ageRange", "Возрастной диапазон")}
        </Label>
        
        <Controller
          name="ageRange"
          control={control}
          render={({ field }) => (
            <Slider
              value={field.value}
              min={18}
              max={70}
              step={1}
              onValueChange={field.onChange}
              className="my-6"
            />
          )}
        />
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="minAge" className="text-xs text-muted-foreground">
              {t("addAnnouncement.fields.ageMin", "Мин. возраст")}
            </Label>
            <Input
              id="minAge"
              type="number"
              value={ageRange[0]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 18 && val <= ageRange[1]) {
                  setValue("ageRange", [val, ageRange[1]]);
                }
              }}
              className="w-20"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="maxAge" className="text-xs text-muted-foreground">
              {t("addAnnouncement.fields.ageMax", "Макс. возраст")}
            </Label>
            <Input
              id="maxAge"
              type="number"
              value={ageRange[1]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= ageRange[0] && val <= 70) {
                  setValue("ageRange", [ageRange[0], val]);
                }
              }}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepBasicInfo;