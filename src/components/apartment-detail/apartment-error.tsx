"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

interface ApartmentErrorProps {
  error?: string | null;
  onRetry?: () => void;
}

export default function ApartmentError({ 
  error = "Не удалось загрузить объявление", 
  onRetry 
}: ApartmentErrorProps) {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[70vh] py-10">
      <div className="bg-white rounded-lg border shadow-md p-8 text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-2">
          Ошибка загрузки
        </h2>
        
        <p className="text-gray-600 mb-6">
          {error || "Произошла ошибка при загрузке данных объявления. Пожалуйста, попробуйте позже."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться назад
          </Button>
          
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Попробовать снова
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}