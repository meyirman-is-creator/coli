"use client";

import React, { useState } from "react";
import { useClientTranslation } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react";

// Mock data to simulate if the user has completed the survey
const mockHasCompletedSurvey = true;

export default function SurveyPage() {
    const [locale, setLocale] = useState<"en" | "ru">("ru");
    const { t } = useClientTranslation(locale, "profile");
    const [showSurvey, setShowSurvey] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [hasCompletedSurvey, setHasCompletedSurvey] = useState(
        mockHasCompletedSurvey
    );
    const [responses, setResponses] = useState<Record<string, string>>({
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": "",
    });

    const totalSteps = 2;
    const questionsPerStep = 4;

    const handleResponseChange = (question: string, value: string) => {
        setResponses((prev) => ({ ...prev, [question]: value }));
    };

    const handleNext = () => {
        // Check if all questions in the current step are answered
        const startIndex = (currentStep - 1) * questionsPerStep + 1;
        const endIndex = Math.min(startIndex + questionsPerStep - 1, 8);

        let allAnswered = true;
        for (let i = startIndex; i <= endIndex; i++) {
            if (!responses[i.toString()]) {
                allAnswered = false;
                break;
            }
        }

        if (!allAnswered) {
            toast.error("Пожалуйста, ответьте на все вопросы");
            return;
        }

        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit the survey
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        // Here you would call an API to submit the survey
        // For now, we'll just simulate a successful response
        setHasCompletedSurvey(true);
        setShowSurvey(false);
        toast.success(t("survey.success"));
    };

    const handleStartAgain = () => {
        setResponses({
            "1": "",
            "2": "",
            "3": "",
            "4": "",
            "5": "",
            "6": "",
            "7": "",
            "8": "",
        });
        setCurrentStep(1);
        setShowSurvey(true);
    };

    const handleViewResponses = () => {
        // Here you would call an API to get the user's responses
        // For now, we'll just show the current responses
        setShowModal(true);
    };

    // Get the questions for the current step
    const getCurrentQuestions = () => {
        const startIndex = (currentStep - 1) * questionsPerStep + 1;
        const endIndex = Math.min(startIndex + questionsPerStep - 1, 8);

        const questions = [];
        for (let i = startIndex; i <= endIndex; i++) {
            questions.push(i.toString());
        }

        return questions;
    };

    return (
        <div className="container mx-auto max-w-3xl py-6">
            <h1 className="mb-6 text-3xl font-bold">{t("survey.title")}</h1>

            {!showSurvey ? (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {hasCompletedSurvey
                                ? t("survey.complete")
                                : t("survey.notCompleted")}
                        </CardTitle>
                        <CardDescription>
                            {hasCompletedSurvey
                                ? ""
                                : t("survey.description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-6">
                            {hasCompletedSurvey ? (
                                <CheckCircle className="mb-4 h-16 w-16 text-primary" />
                            ) : (
                                <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-4">
                        {hasCompletedSurvey ? (
                            <>
                                <Button variant="outline" onClick={handleViewResponses}>
                                    {t("survey.view")}
                                </Button>
                                <Button onClick={handleStartAgain}>
                                    {t("survey.fillAgain")}
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setShowSurvey(true)}>
                                {t("survey.startSurvey")}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>{t("survey.title")}</CardTitle>
                        <CardDescription>
                            {t("survey.step", {
                                current: currentStep,
                                total: totalSteps,
                            })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {getCurrentQuestions().map((questionId) => (
                                <div key={questionId} className="space-y-3">
                                    <h3 className="text-lg font-medium">
                                        {t(`survey.questions.${questionId}`)}
                                    </h3>
                                    <RadioGroup
                                        value={responses[questionId]}
                                        onValueChange={(value) =>
                                            handleResponseChange(questionId, value)
                                        }
                                    >
                                        {questionId === "1" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="home"
                                                        id={`q${questionId}-1`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-1`}>
                                                        {t("survey.options.schedule.home")}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="out"
                                                        id={`q${questionId}-2`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-2`}>
                                                        {t("survey.options.schedule.out")}
                                                    </Label>
                                                </div>
                                            </>
                                        )}
                                        {questionId === "2" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="practice"
                                                        id={`q${questionId}-1`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-1`}>
                                                        {t("survey.options.religion.practice")}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="respect"
                                                        id={`q${questionId}-2`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-2`}>
                                                        {t("survey.options.religion.respect")}
                                                    </Label>
                                                </div>
                                            </>
                                        )}
                                        {questionId === "3" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="tolerant"
                                                        id={`q${questionId}-1`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-1`}>
                                                        {t("survey.options.smoking.tolerant")}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="against"
                                                        id={`q${questionId}-2`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-2`}>
                                                        {t("survey.options.smoking.against")}
                                                    </Label>
                                                </div>
                                            </>
                                        )}
                                        {questionId === "4" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="okay"
                                                        id={`q${questionId}-1`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-1`}>
                                                        {t("survey.options.guests.okay")}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="neutral"
                                                        id={`q${questionId}-2`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-2`}>
                                                        {t("survey.options.guests.neutral")}
                                                    </Label>
                                                </div>
                                            </>
                                        )}
                                        {questionId === "5" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="like"
                                                        id={`q${questionId}-1`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-1`}>
                                                        {t("survey.options.pets.like")}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="dislike"
                                                        id={`q${questionId}-2`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-2`}>
                                                        {t("survey.options.pets.dislike")}
                                                    </Label>
                                                </div>
                                            </>
                                        )}
                                        {questionId === "6" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="equal"
                                                        id={`q${questionId}-1`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-1`}>
                                                        {t("survey.options.chores.equal")}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="more"
                                                        id={`q${questionId}-2`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-2`}>
                                                        {t("survey.options.chores.more")}
                                                    </Label>
                                                </div>
                                            </>
                                        )}
                                        {questionId === "7" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="neutral"
                                                        id={`q${questionId}-1`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-1`}>
                                                        {t("survey.options.calls.neutral")}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="quiet"
                                                        id={`q${questionId}-2`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-2`}>
                                                        {t("survey.options.calls.quiet")}
                                                    </Label>
                                                </div>
                                            </>
                                        )}
                                        {questionId === "8" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="tolerant"
                                                        id={`q${questionId}-1`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-1`}>
                                                        {t("survey.options.noise.tolerant")}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="quiet"
                                                        id={`q${questionId}-2`}
                                                    />
                                                    <Label htmlFor={`q${questionId}-2`}>
                                                        {t("survey.options.noise.quiet")}
                                                    </Label>
                                                </div>
                                            </>
                                        )}
                                    </RadioGroup>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={
                                currentStep === 1
                                    ? () => setShowSurvey(false)
                                    : handlePrevious
                            }
                        >
                            {currentStep === 1 ? t("survey.cancel") : t("survey.previous")}
                        </Button>
                        <Button onClick={handleNext}>
                            {currentStep < totalSteps ? t("survey.next") : t("survey.submit")}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Modal to view responses */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t("survey.title")}</DialogTitle>
                        <DialogDescription>
                            {t("survey.description")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {Object.keys(responses).map((questionId) => (
                            <div key={questionId} className="space-y-2">
                                <h3 className="font-medium">
                                    {t(`survey.questions.${questionId}`)}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {responses[questionId]
                                        ? t(
                                            `survey.options.${questionId === "1"
                                                ? "schedule"
                                                : questionId === "2"
                                                    ? "religion"
                                                    : questionId === "3"
                                                        ? "smoking"
                                                        : questionId === "4"
                                                            ? "guests"
                                                            : questionId === "5"
                                                                ? "pets"
                                                                : questionId === "6"
                                                                    ? "chores"
                                                                    : questionId === "7"
                                                                        ? "calls"
                                                                        : "noise"
                                            }.${responses[questionId]}`
                                        )
                                        : "Не указано"}
                                </p>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowModal(false)}>
                            {t("survey.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}