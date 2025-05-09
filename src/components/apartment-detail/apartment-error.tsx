"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { useClientTranslation } from "@/i18n/client";

interface ApartmentErrorProps {
  error?: string | null;
  onRetry?: () => void;
}

export default function ApartmentError({ 
  error = "Не удалось загрузить объявление", 
  onRetry 
}: ApartmentErrorProps) {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "apartment");

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[70vh] py-10">
      <div className="bg-card rounded-lg border border-border shadow-md p-8 text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-destructive/10 rounded-full">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-2 text-foreground">
          {t("error.loadingError")}
        </h2>
        
        <p className="text-muted-foreground mb-6">
          {error || t("error.defaultMessage")}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("error.goBack")}
          </Button>
          
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("error.tryAgain")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}