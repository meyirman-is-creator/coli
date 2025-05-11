// src/components/add-announcement/StepSuccess.tsx
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { useClientTranslation } from "@/i18n/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, CheckCircle } from "lucide-react";

const StepSuccess: React.FC = () => {
  const [locale, setLocale] = React.useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "profile");
  const { watch, setValue } = useFormContext();

  // Watch form values
  const selectedAdjectives = watch("selectedAdjectives") || [];

  // List of adjectives
  const adjectives = [
    "Платежеспособная/ный",
    "Чистоплотная/ный",
    "Ответственная/ный",
    "Порядочная/ный",
    "Неконфликтная/ный",
    "Религиозная/ный",
    "Аккуратная/ный",
  ];

  // Handle adjective selection
  const handleAdjectiveChange = (adj: string) => {
    const updatedAdjectives = selectedAdjectives.includes(adj)
      ? selectedAdjectives.filter((item: string) => item !== adj)
      : [...selectedAdjectives, adj];

    setValue("selectedAdjectives", updatedAdjectives);
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      <div className="flex flex-col items-center text-center p-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">
          {t("addAnnouncement.success.title", "Поздравляем! Ваше объявление успешно загружено")}
        </h2>
        <p className="text-muted-foreground max-w-md">
          {t("addAnnouncement.success.description", "Ваше объявление теперь доступно для просмотра. Вы можете редактировать его в любое время в разделе \"Мои объявления\".")}
        </p>
      </div>

      {/* Adjectives Selection */}
      <div className="space-y-4 bg-muted/40 p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4">
          {t("addAnnouncement.preferences.title", "Каким вы предпочитаете видеть своего соседа?")}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t("addAnnouncement.preferences.description", "Выберите характеристики, которые важны для вас в соседе")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {adjectives.map((adj, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`adjective-${index}`}
                checked={selectedAdjectives.includes(adj)}
                onCheckedChange={() => handleAdjectiveChange(adj)}
              />
              <Label htmlFor={`adjective-${index}`} className="cursor-pointer">
                {t(`addAnnouncement.preferences.adjectives.${adj.toLowerCase().replace(/[\/\s]/g, '_')}`, adj)}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepSuccess;