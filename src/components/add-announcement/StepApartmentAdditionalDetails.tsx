// src/components/add-announcement/StepApartmentAdditionalDetails.tsx
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { useClientTranslation } from "@/i18n/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  FileImage,
  Upload,
  X
} from "lucide-react";

const StepApartmentAdditionalDetails: React.FC = () => {
  const [locale, setLocale] = React.useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "profile");
  const { watch, setValue } = useFormContext();

  const petsAllowed = watch("apartmentDetails.petsAllowed") || false;
  const utilitiesIncluded = watch("apartmentDetails.utilitiesIncluded") || false;
  const utilitiesAmount = watch("apartmentDetails.utilitiesAmount") || [0, 5000];
  const forStudents = watch("apartmentDetails.forStudents") || false;
  const badHabitsAllowed = watch("apartmentDetails.badHabitsAllowed") || false;
  const description = watch("apartmentDetails.description") || "";
  const photos = watch("apartmentDetails.photos") || [];

  const handleUtilitiesAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newAmount = [...utilitiesAmount];
    newAmount[index] = parseInt(e.target.value || "0");
    setValue("apartmentDetails.utilitiesAmount", newAmount);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = [...photos];
      
      // Convert FileList to array and add to photos
      Array.from(e.target.files).forEach(file => {
        // In a real app, you'd upload these to a server and get URLs back
        // For now, we'll use URLs created from the files
        newPhotos.push(file);
      });
      
      setValue("apartmentDetails.photos", newPhotos);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setValue("apartmentDetails.photos", newPhotos);
  };
  
  // For display purposes in this demo
  const getPhotoUrl = (photo: File) => {
    return URL.createObjectURL(photo);
  };

  return (
    <div className="space-y-6">
      {/* Pets Allowed */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="petsAllowed"
          checked={petsAllowed}
          onCheckedChange={(checked) => setValue("apartmentDetails.petsAllowed", checked === true)}
        />
        <Label htmlFor="petsAllowed" className="cursor-pointer">
          {t("addAnnouncement.fields.pets", "Разрешено ли с животными?")}
        </Label>
      </div>

      {/* Utilities Included */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="utilitiesIncluded"
          checked={utilitiesIncluded}
          onCheckedChange={(checked) => setValue("apartmentDetails.utilitiesIncluded", checked === true)}
        />
        <Label htmlFor="utilitiesIncluded" className="cursor-pointer">
          {t("addAnnouncement.fields.utilities.included", "Включены ли коммунальные услуги?")}
        </Label>
      </div>

      {/* Utilities Amount (conditionally rendered) */}
      {utilitiesIncluded && (
        <div className="pl-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utilitiesMin">
                {t("addAnnouncement.fields.utilities.min", "Минимальная сумма за коммунальные:")}
              </Label>
              <Input
                id="utilitiesMin"
                type="number"
                value={utilitiesAmount[0].toString()}
                onChange={(e) => handleUtilitiesAmountChange(e, 0)}
                placeholder={t("addAnnouncement.placeholders.min", "Минимум")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utilitiesMax">
                {t("addAnnouncement.fields.utilities.max", "Максимальная сумма за коммунальные:")}
              </Label>
              <Input
                id="utilitiesMax"
                type="number"
                value={utilitiesAmount[1].toString()}
                onChange={(e) => handleUtilitiesAmountChange(e, 1)}
                placeholder={t("addAnnouncement.placeholders.max", "Максимум")}
              />
            </div>
          </div>
        </div>
      )}

      {/* For Students */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="forStudents"
          checked={forStudents}
          onCheckedChange={(checked) => setValue("apartmentDetails.forStudents", checked === true)}
        />
        <Label htmlFor="forStudents" className="cursor-pointer">
          {t("addAnnouncement.fields.forStudents", "Можно ли студентам?")}
        </Label>
      </div>

      {/* Bad Habits Allowed */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="badHabitsAllowed"
          checked={badHabitsAllowed}
          onCheckedChange={(checked) => setValue("apartmentDetails.badHabitsAllowed", checked === true)}
        />
        <Label htmlFor="badHabitsAllowed" className="cursor-pointer">
          {t("addAnnouncement.fields.badHabits", "С вредными привычками")}
        </Label>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          {t("addAnnouncement.fields.description", "Описание квартиры:")}
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setValue("apartmentDetails.description", e.target.value)}
          placeholder={t("addAnnouncement.placeholders.description", "Введите описание квартиры...")}
          rows={5}
        />
        {description && description.length < 10 && (
          <p className="text-sm text-destructive">
            {t("addAnnouncement.validation.description", "Минимум 10 символов")}
          </p>
        )}
      </div>

      {/* Photos Upload */}
      <div className="space-y-4">
        <Label>
          {t("addAnnouncement.fields.photos", "Загрузите фотографии:")}
        </Label>
        
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <FileImage className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="mb-2 text-sm text-muted-foreground">
              {t("addAnnouncement.dropPhotos", "Перетащите фото сюда или нажмите, чтобы выбрать")}
            </p>
            <input
              type="file"
              id="photoUpload"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => document.getElementById("photoUpload")?.click()}
              className="mt-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              {t("addAnnouncement.uploadPhotos", "Выберите фото")}
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("addAnnouncement.photoLimit", "Максимум 20 фотографий")}
            </p>
          </CardContent>
        </Card>
        
        {/* Preview uploaded photos */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {photos.map((photo: File, index: number) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={getPhotoUrl(photo as File)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepApartmentAdditionalDetails;