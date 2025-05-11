// src/components/add-announcement/StepRole.tsx
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { useClientTranslation } from "@/i18n/client";
import { roleOptions } from "@/types/form-types";
import { Card, CardContent } from "@/components/ui/card";

const StepRole: React.FC = () => {
  const [locale, setLocale] = React.useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "profile");
  const { watch, setValue } = useFormContext();
  
  const selectedRole = watch("role");

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {t("addAnnouncement.roleDescription", "Выберите вашу роль в объявлении")}
      </p>
      
      <div className="space-y-4">
        {roleOptions.map((option) => (
          <Card 
            key={option.code}
            className={`cursor-pointer transition-colors ${
              selectedRole === option.code 
                ? "border-primary bg-primary/5" 
                : "hover:bg-accent"
            }`}
            onClick={() => setValue("role", option.code)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="md:w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {/* We'll use a simple div with the first letter instead of an image */}
                  <span className="text-2xl font-bold text-primary">
                    {option.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {t(`addAnnouncement.roles.${option.code.toLowerCase()}.name`, option.name)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(`addAnnouncement.roles.${option.code.toLowerCase()}.description`, option.description)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StepRole;