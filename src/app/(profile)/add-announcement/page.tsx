"use client";

import React, { useState, useEffect } from "react";
import { useClientTranslation } from "@/i18n/client";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Check,
  ChevronsRight,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import step components
import StepRole from "@/components/add-announcement/StepRole";
import StepBasicInfo from "@/components/add-announcement/StepBasicInfo";
import StepApartmentDetails from "@/components/add-announcement/StepApartmentDetails";
import StepApartmentAdditionalDetails from "@/components/add-announcement/StepApartmentAdditionalDetails";
import StepApartmentFullDetails from "@/components/add-announcement/StepApartmentFullDetails";
import StepSuccess from "@/components/add-announcement/StepSuccess";
import { AddressType } from "@/types/form-types";

// Schema validation
const formSchema = z.object({
  role: z.string().min(1, { message: "Required" }),
  title: z.string(),
  gender: z.string(),
  livingInHome: z.boolean(),
  peopleInApartment: z.string(),
  roommates: z.number(),
  ageRange: z.array(z.number())
});

export default function AddAnnouncementPage() {
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "profile");
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [citiesData, setCitiesData] = useState<AddressType[]>([]);
  const [districtsData, setDistrictsData] = useState<AddressType[]>([]);
  const [microDistrictsData, setMicroDistrictsData] = useState<AddressType[]>([]);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [announcementId, setAnnouncementId] = useState<number | null>(null);

  // Setup form with react-hook-form and zod validation
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      role: "RESIDENT",
      title: "",
      gender: "",
      livingInHome: false,
      peopleInApartment: "1",
      roommates: 1,
      ageRange: [18, 50],
      // Add other default values
    },
    resolver: zodResolver(formSchema),
  });

  // Load cities and address data
  useEffect(() => {
    const fetchCities = async () => {
      // Fetch cities from API
      setIsAddressLoading(true);
      try {
        // API call would go here
        setCitiesData([]); // Put your cities data here
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error(t("addAnnouncement.errors.citiesLoad", "Не удалось загрузить список городов"));
      } finally {
        setIsAddressLoading(false);
      }
    };

    fetchCities();

    // If editing, load existing data
    if (id) {
      loadAnnouncementData(parseInt(id));
    }
  }, [id, t]);

  const fetchDistricts = async (cityId: number) => {
    // Implement district fetching
  };

  const fetchMicroDistricts = async (districtId: number) => {
    // Implement microdistrict fetching
  };

  // Load existing announcement data
  const loadAnnouncementData = async (announcementId: number) => {
    // Implement data loading for editing
  };

  // Handle next step button
  const handleNext = async () => {
    // Implement validation and next step handling
    try {
      // Form validation
      // API calls for saving data
      if (step < 6) {
        setStep(step + 1);
      } else {
        // Final submission
        toast.success(t("addAnnouncement.success.message", "Объявление успешно создано"));
        router.push("/profile/my-announcement");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(t("addAnnouncement.errors.generic", "Произошла ошибка"));
    }
  };

  // Handle previous step button
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  // Define step labels
  const steps = [
    { id: 1, title: t("addAnnouncement.steps.1", "Роль"), completed: step > 1 },
    { id: 2, title: t("addAnnouncement.steps.2", "Основная информация"), completed: step > 2 },
    { id: 3, title: t("addAnnouncement.steps.3", "Детали объявления"), completed: step > 3 },
    { id: 4, title: t("addAnnouncement.steps.4", "Дополнительные детали"), completed: step > 4 },
    { id: 5, title: t("addAnnouncement.steps.5", "Подробная информация"), completed: step > 5 },
    { id: 6, title: t("addAnnouncement.steps.6", "Завершение"), completed: step > 6 },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-6">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold">
              {id ? t("addAnnouncement.loading.edit", "Загрузка объявления...") : 
                   t("addAnnouncement.loading.create", "Подготовка формы...")}
            </h2>
            <p className="text-muted-foreground mt-2">
              {t("addAnnouncement.loading.wait", "Пожалуйста, подождите")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto max-w-4xl py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            {id ? t("addAnnouncement.edit", "Редактирование объявления") : 
                 t("addAnnouncement.title", "Создание объявления")}
          </h1>
          
          <Button
            variant="ghost"
            onClick={handlePrevious}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("addAnnouncement.back", "Назад")}
          </Button>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
            {steps.map((s, index) => (
              <li 
                key={s.id} 
                className={cn(
                  "flex md:w-full items-center",
                  step === s.id ? "text-primary" : s.completed ? "text-primary/80" : "text-muted-foreground"
                )}
              >
                <span className="flex items-center justify-center">
                  <span
                    className={cn(
                      "flex items-center justify-center w-8 h-8 me-2 rounded-full shrink-0",
                      step === s.id
                        ? "border-2 border-primary text-primary"
                        : s.completed
                          ? "bg-primary text-primary-foreground"
                          : "border border-muted-foreground"
                    )}
                  >
                    {s.completed ? <Check className="w-4 h-4" /> : s.id}
                  </span>
                  <span className={`hidden md:inline-flex ${index < steps.length - 1 ? 'me-3' : ''}`}>
                    {s.title}
                  </span>
                </span>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 ${s.completed ? 'bg-primary' : 'bg-muted'}`}></div>
                )}
              </li>
            ))}
          </ol>
        </div>

        <Card className="border rounded-xl shadow-sm bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">
              {t(`addAnnouncement.steps.${step}`)}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t(`addAnnouncement.stepDescription.${step}`, "Заполните информацию для этого шага")}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {step === 1 && <StepRole />}
            {step === 2 && <StepBasicInfo />}
            {step === 3 && (
              <StepApartmentDetails
                citiesData={citiesData}
                districtsData={districtsData}
                setDistrictsData={setDistrictsData}
                microDistrictsData={microDistrictsData}
                setMicroDistrictsData={setMicroDistrictsData}
                fetchCities={() => Promise.resolve()}
                fetchDistricts={fetchDistricts}
                fetchMicroDistricts={fetchMicroDistricts}
                isAddressLoading={isAddressLoading}
              />
            )}
            {step === 4 && <StepApartmentAdditionalDetails />}
            {step === 5 && <StepApartmentFullDetails />}
            {step === 6 && <StepSuccess />}
          </CardContent>
          
          <CardFooter className="flex justify-between py-6 border-t bg-muted/20">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              {step === 1 ? 
                t("addAnnouncement.cancel", "Отмена") : 
                t("addAnnouncement.previous", "Назад")
              }
            </Button>
            <Button onClick={handleNext} disabled={isSubmitting} className="gap-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("addAnnouncement.saving", "Сохранение...")}
                </>
              ) : step < 6 ? (
                <>
                  {t("addAnnouncement.next", "Далее")}
                  <ChevronsRight className="h-4 w-4" />
                </>
              ) : (
                t("addAnnouncement.submit", "Отправить")
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Help text */}
        {step < 6 && (
          <div className="flex items-start mt-6 p-4 border rounded-lg bg-muted/30">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-foreground">
                {t("addAnnouncement.help.title", "Подсказка")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t(`addAnnouncement.help.step${step}`, "Заполните все необходимые поля на этом шаге")}
              </p>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
}