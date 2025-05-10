"use client";

import React, { useState, useEffect } from "react";
import { useClientTranslation } from "@/i18n/client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Check,
    ChevronsRight,
    Trash,
    Upload,
    Home,
    Users,
    MapPin,
    DollarSign,
    ImageIcon,
    Building,
    CheckSquare,
} from "lucide-react";

export default function AddAnnouncementPage() {
    const [locale, setLocale] = useState<"en" | "ru">("ru");
    const { t } = useClientTranslation(locale, "profile");
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1
        role: "owner",

        // Step 2
        title: "",
        selectedGender: "MALE",
        doYouLiveInThisHouse: "true",
        howManyPeopleLiveInThisApartment: "0",
        numberOfPeopleAreYouAccommodating: "1",
        ageMin: "18",
        ageMax: "65",

        // Step 3
        regionId: "",
        districtId: "",
        microDistrictId: "",
        address: "",
        arriveDate: "",
        cost: "0",
        roomCount: "1",
        depositRequired: "false",
        depositAmount: "0",

        // Step 4
        pets: "false",
        utilitiesIncluded: "false",
        utilitiesMin: "0",
        utilitiesMax: "0",
        forStudents: "false",
        badHabits: "false",
        description: "",
        photos: [] as File[],

        // Step 5
        propertyType: "apartment",
        floor: "1",
        totalFloors: "5",
        area: "0",
        longTerm: "true",
        ownerName: "",
        ownerPhone: "",
        residents: [{ name: "", phones: [""] }],

        // Step 6
        preferences: [] as string[],
    });

    // Simulating loading existing data when editing
    useEffect(() => {
        if (id) {
            // In a real app, you would fetch the announcement data here
            // For now, we'll just simulate pre-populated data
            setFormData({
                role: "owner",
                title: "2-комнатная квартира в центре",
                selectedGender: "MALE",
                doYouLiveInThisHouse: "false",
                howManyPeopleLiveInThisApartment: "1",
                numberOfPeopleAreYouAccommodating: "2",
                ageMin: "20",
                ageMax: "35",
                regionId: "1",
                districtId: "2",
                microDistrictId: "3",
                address: "Москва, улица Арбат, 24",
                arriveDate: "2025-04-01",
                cost: "65000",
                roomCount: "2",
                depositRequired: "true",
                depositAmount: "65000",
                pets: "true",
                utilitiesIncluded: "false",
                utilitiesMin: "3000",
                utilitiesMax: "5000",
                forStudents: "false",
                badHabits: "false",
                description: "Уютная квартира в центре города с хорошим ремонтом.",
                photos: [],
                propertyType: "apartment",
                floor: "3",
                totalFloors: "9",
                area: "60",
                longTerm: "true",
                ownerName: "Иван Иванов",
                ownerPhone: "+7 (900) 123-45-67",
                residents: [{ name: "Мария", phones: ["+7 (900) 765-43-21"] }],
                preferences: ["clean", "quiet", "organized"],
            });
        }
    }, [id]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        if (name === "preferences") {
            // Handle multi-select preferences
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: checked.toString() }));
    };

    const handlePreferencesChange = (value: string) => {
        setFormData((prev) => {
            const preferences = [...prev.preferences];
            const index = preferences.indexOf(value);
            if (index === -1) {
                preferences.push(value);
            } else {
                preferences.splice(index, 1);
            }
            return { ...prev, preferences };
        });
    };

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setFormData((prev) => ({
                ...prev,
                arriveDate: date.toISOString().split("T")[0],
            }));
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                photos: [...prev.photos, ...Array.from(files)],
            }));
        }
    };

    const handlePhotoDelete = (index: number) => {
        setFormData((prev) => {
            const photos = [...prev.photos];
            photos.splice(index, 1);
            return { ...prev, photos };
        });
    };

    const handleResidentChange = (
        index: number,
        field: "name" | "phones",
        value: string | string[]
    ) => {
        setFormData((prev) => {
            const residents = [...prev.residents];
            if (field === "name") {
                residents[index].name = value as string;
            } else {
                residents[index].phones = value as string[];
            }
            return { ...prev, residents };
        });
    };

    const addResident = () => {
        setFormData((prev) => ({
            ...prev,
            residents: [...prev.residents, { name: "", phones: [""] }],
        }));
    };

    const removeResident = (index: number) => {
        setFormData((prev) => {
            const residents = [...prev.residents];
            residents.splice(index, 1);
            return { ...prev, residents };
        });
    };

    const addResidentPhone = (residentIndex: number) => {
        setFormData((prev) => {
            const residents = [...prev.residents];
            residents[residentIndex].phones.push("");
            return { ...prev, residents };
        });
    };

    const removeResidentPhone = (residentIndex: number, phoneIndex: number) => {
        setFormData((prev) => {
            const residents = [...prev.residents];
            residents[residentIndex].phones.splice(phoneIndex, 1);
            return { ...prev, residents };
        });
    };

    const handleResidentPhoneChange = (
        residentIndex: number,
        phoneIndex: number,
        value: string
    ) => {
        setFormData((prev) => {
            const residents = [...prev.residents];
            residents[residentIndex].phones[phoneIndex] = value;
            return { ...prev, residents };
        });
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleSubmit = () => {
        // Here you would call an API to submit the announcement
        // For now, we'll just simulate a successful response
        toast.success(t("addAnnouncement.success"));
        // Reset the form or redirect to another page
    };

    const steps = [
        { id: 1, title: t("addAnnouncement.steps.1"), icon: <Users /> },
        { id: 2, title: t("addAnnouncement.steps.2"), icon: <Home /> },
        { id: 3, title: t("addAnnouncement.steps.3"), icon: <MapPin /> },
        { id: 4, title: t("addAnnouncement.steps.4"), icon: <ImageIcon /> },
        { id: 5, title: t("addAnnouncement.steps.5"), icon: <Building /> },
        { id: 6, title: t("addAnnouncement.steps.6"), icon: <CheckSquare /> },
    ];

    return (
        <div className="container mx-auto max-w-4xl py-6">
            <h1 className="mb-6 text-3xl font-bold">
                {id ? t("addAnnouncement.edit") : t("addAnnouncement.title")}
            </h1>

            {/* Step Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((s) => (
                        <React.Fragment key={s.id}>
                            <div
                                className={cn(
                                    "flex flex-col items-center",
                                    step === s.id ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-full border-2",
                                        step === s.id
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : step > s.id
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-muted bg-card"
                                    )}
                                >
                                    {step > s.id ? <Check className="h-5 w-5" /> : s.icon}
                                </div>
                                <span className="mt-2 text-xs sm:text-sm">{s.title}</span>
                            </div>
                            {s.id < steps.length && (
                                <ChevronsRight
                                    className={cn(
                                        "h-5 w-5",
                                        step > s.id ? "text-primary" : "text-muted-foreground"
                                    )}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {t(`addAnnouncement.steps.${step}`)}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && t("addAnnouncement.stepDescription.1")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step 1: Role */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t("addAnnouncement.fields.role.label")}</Label>
                                <RadioGroup
                                    value={formData.role}
                                    onValueChange={(value) =>
                                        handleSelectChange("role", value)
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="owner" id="role-owner" />
                                        <Label htmlFor="role-owner">
                                            {t("addAnnouncement.fields.role.owner")}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="resident" id="role-resident" />
                                        <Label htmlFor="role-resident">
                                            {t("addAnnouncement.fields.role.resident")}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="looking" id="role-looking" />
                                        <Label htmlFor="role-looking">
                                            {t("addAnnouncement.fields.role.looking")}
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    {/* Step 2: General Information */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">{t("addAnnouncement.fields.title")}</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{t("addAnnouncement.fields.gender.label")}</Label>
                                <RadioGroup
                                    value={formData.selectedGender}
                                    onValueChange={(value) =>
                                        handleSelectChange("selectedGender", value)
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="MALE" id="gender-male" />
                                        <Label htmlFor="gender-male">
                                            {t("addAnnouncement.fields.gender.male")}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="FEMALE" id="gender-female" />
                                        <Label htmlFor="gender-female">
                                            {t("addAnnouncement.fields.gender.female")}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="OTHER" id="gender-any" />
                                        <Label htmlFor="gender-any">
                                            {t("addAnnouncement.fields.gender.any")}
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label>{t("addAnnouncement.fields.liveIn")}</Label>
                                <RadioGroup
                                    value={formData.doYouLiveInThisHouse}
                                    onValueChange={(value) =>
                                        handleSelectChange("doYouLiveInThisHouse", value)
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="true" id="live-in-yes" />
                                        <Label htmlFor="live-in-yes">
                                            {t("addAnnouncement.yes")}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="false" id="live-in-no" />
                                        <Label htmlFor="live-in-no">
                                            {t("addAnnouncement.no")}
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="currentResidents">
                                        {t("addAnnouncement.fields.currentResidents")}
                                    </Label>
                                    <Select
                                        value={formData.howManyPeopleLiveInThisApartment}
                                        onValueChange={(value) =>
                                            handleSelectChange(
                                                "howManyPeopleLiveInThisApartment",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger id="currentResidents">
                                            <SelectValue
                                                placeholder={formData.howManyPeopleLiveInThisApartment}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[0, 1, 2, 3, 4, 5].map((num) => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lookingFor">
                                        {t("addAnnouncement.fields.lookingFor")}
                                    </Label>
                                    <Select
                                        value={formData.numberOfPeopleAreYouAccommodating}
                                        onValueChange={(value) =>
                                            handleSelectChange(
                                                "numberOfPeopleAreYouAccommodating",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger id="lookingFor">
                                            <SelectValue
                                                placeholder={
                                                    formData.numberOfPeopleAreYouAccommodating
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>{t("addAnnouncement.fields.ageRange")}</Label>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="ageMin">От</Label>
                                        <Input
                                            id="ageMin"
                                            name="ageMin"
                                            type="number"
                                            min="18"
                                            max="100"
                                            value={formData.ageMin}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ageMax">До</Label>
                                        <Input
                                            id="ageMax"
                                            name="ageMax"
                                            type="number"
                                            min="18"
                                            max="100"
                                            value={formData.ageMax}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Location and Price */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="regionId">
                                    {t("addAnnouncement.fields.location.region")}
                                </Label>
                                <Select
                                    value={formData.regionId}
                                    onValueChange={(value) =>
                                        handleSelectChange("regionId", value)
                                    }
                                >
                                    <SelectTrigger id="regionId">
                                        <SelectValue
                                            placeholder={
                                                formData.regionId
                                                    ? "Выбранный регион"
                                                    : "Выберите регион"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Москва</SelectItem>
                                        <SelectItem value="2">Санкт-Петербург</SelectItem>
                                        <SelectItem value="3">Казань</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="districtId">
                                    {t("addAnnouncement.fields.location.district")}
                                </Label>
                                <Select
                                    value={formData.districtId}
                                    onValueChange={(value) =>
                                        handleSelectChange("districtId", value)
                                    }
                                    disabled={!formData.regionId}
                                >
                                    <SelectTrigger id="districtId">
                                        <SelectValue
                                            placeholder={
                                                formData.districtId
                                                    ? "Выбранный район"
                                                    : "Выберите район"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Центральный</SelectItem>
                                        <SelectItem value="2">Адмиралтейский</SelectItem>
                                        <SelectItem value="3">Приморский</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="microDistrictId">
                                    {t("addAnnouncement.fields.location.microdistrict")}
                                </Label>
                                <Select
                                    value={formData.microDistrictId}
                                    onValueChange={(value) =>
                                        handleSelectChange("microDistrictId", value)
                                    }
                                    disabled={!formData.districtId}
                                >
                                    <SelectTrigger id="microDistrictId">
                                        <SelectValue
                                            placeholder={
                                                formData.microDistrictId
                                                    ? "Выбранный микрорайон"
                                                    : "Выберите микрорайон"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Арбат</SelectItem>
                                        <SelectItem value="2">Тверской</SelectItem>
                                        <SelectItem value="3">Пресненский</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">
                                    {t("addAnnouncement.fields.location.address")}
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="arriveDate">
                                    {t("addAnnouncement.fields.arriveDate")}
                                </Label>
                                <DatePicker
                                    date={
                                        formData.arriveDate
                                            ? new Date(formData.arriveDate)
                                            : undefined
                                    }
                                    onSelect={handleDateChange}
                                    locale={locale === "en" ? undefined : undefined}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cost">
                                    {t("addAnnouncement.fields.cost")}
                                </Label>
                                <Input
                                    id="cost"
                                    name="cost"
                                    type="number"
                                    min="0"
                                    value={formData.cost}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="roomCount">
                                    {t("addAnnouncement.fields.rooms")}
                                </Label>
                                <Select
                                    value={formData.roomCount}
                                    onValueChange={(value) =>
                                        handleSelectChange("roomCount", value)
                                    }
                                >
                                    <SelectTrigger id="roomCount">
                                        <SelectValue
                                            placeholder={formData.roomCount || "1"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <SelectItem key={num} value={num.toString()}>
                                                {num}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="depositRequired"
                                        checked={formData.depositRequired === "true"}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange("depositRequired", !!checked)
                                        }
                                    />
                                    <Label htmlFor="depositRequired">
                                        {t("addAnnouncement.fields.deposit.required")}
                                    </Label>
                                </div>
                                {formData.depositRequired === "true" && (
                                    <div className="ml-6 mt-2">
                                        <Label htmlFor="depositAmount">
                                            {t("addAnnouncement.fields.deposit.amount")}
                                        </Label>
                                        <Input
                                            id="depositAmount"
                                            name="depositAmount"
                                            type="number"
                                            min="0"
                                            value={formData.depositAmount}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Apartment Details */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="pets">
                                    {t("addAnnouncement.fields.pets")}
                                </Label>
                                <Switch
                                    id="pets"
                                    checked={formData.pets === "true"}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange("pets", checked)
                                    }
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="utilitiesIncluded">
                                        {t("addAnnouncement.fields.utilities.included")}
                                    </Label>
                                    <Switch
                                        id="utilitiesIncluded"
                                        checked={formData.utilitiesIncluded === "true"}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange("utilitiesIncluded", checked)
                                        }
                                    />
                                </div>
                                {formData.utilitiesIncluded === "false" && (
                                    <div className="ml-6 space-y-2">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="utilitiesMin">
                                                    {t("addAnnouncement.fields.utilities.min")}
                                                </Label>
                                                <Input
                                                    id="utilitiesMin"
                                                    name="utilitiesMin"
                                                    type="number"
                                                    min="0"
                                                    value={formData.utilitiesMin}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="utilitiesMax">
                                                    {t("addAnnouncement.fields.utilities.max")}
                                                </Label>
                                                <Input
                                                    id="utilitiesMax"
                                                    name="utilitiesMax"
                                                    type="number"
                                                    min="0"
                                                    value={formData.utilitiesMax}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="forStudents">
                                    {t("addAnnouncement.fields.forStudents")}
                                </Label>
                                <Switch
                                    id="forStudents"
                                    checked={formData.forStudents === "true"}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange("forStudents", checked)
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="badHabits">
                                    {t("addAnnouncement.fields.badHabits")}
                                </Label>
                                <Switch
                                    id="badHabits"
                                    checked={formData.badHabits === "true"}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange("badHabits", checked)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    {t("addAnnouncement.fields.description")}
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="photos">
                                    {t("addAnnouncement.fields.photos")}
                                </Label>
                                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-border px-6 pb-6 pt-5">
                                    <div className="space-y-2 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <div className="flex text-sm text-muted-foreground">
                                            <label
                                                htmlFor="photo-upload"
                                                className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                                            >
                                                <span>{t("addAnnouncement.uploadPhotos")}</span>
                                                <input
                                                    id="photo-upload"
                                                    name="photos"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="sr-only"
                                                    onChange={handlePhotoUpload}
                                                />
                                            </label>
                                            <p className="pl-1">
                                                {t("addAnnouncement.dropPhotos")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {formData.photos.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                                        {formData.photos.map((photo, index) => (
                                            <div
                                                key={index}
                                                className="relative rounded-md bg-black/10"
                                            >
                                                <img
                                                    src={URL.createObjectURL(photo)}
                                                    alt={`Photo ${index + 1}`}
                                                    className="h-24 w-full rounded-md object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                                                    onClick={() => handlePhotoDelete(index)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 5: Building and Residents */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="propertyType">
                                    {t("addAnnouncement.fields.propertyType.label")}
                                </Label>
                                <Select
                                    value={formData.propertyType}
                                    onValueChange={(value) =>
                                        handleSelectChange("propertyType", value)
                                    }
                                >
                                    <SelectTrigger id="propertyType">
                                        <SelectValue
                                            placeholder={t(
                                                `addAnnouncement.fields.propertyType.${formData.propertyType}`
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="apartment">
                                            {t("addAnnouncement.fields.propertyType.apartment")}
                                        </SelectItem>
                                        <SelectItem value="house">
                                            {t("addAnnouncement.fields.propertyType.house")}
                                        </SelectItem>
                                        <SelectItem value="room">
                                            {t("addAnnouncement.fields.propertyType.room")}
                                        </SelectItem>
                                        <SelectItem value="studio">
                                            {t("addAnnouncement.fields.propertyType.studio")}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="floor">
                                        {t("addAnnouncement.fields.floor.current")}
                                    </Label>
                                    <Input
                                        id="floor"
                                        name="floor"
                                        type="number"
                                        min="1"
                                        value={formData.floor}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="totalFloors">
                                        {t("addAnnouncement.fields.floor.total")}
                                    </Label>
                                    <Input
                                        id="totalFloors"
                                        name="totalFloors"
                                        type="number"
                                        min="1"
                                        value={formData.totalFloors}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="area">
                                    {t("addAnnouncement.fields.area")}
                                </Label>
                                <Input
                                    id="area"
                                    name="area"
                                    type="number"
                                    min="0"
                                    value={formData.area}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="longTerm">
                                    {t("addAnnouncement.fields.longTerm")}
                                </Label>
                                <Switch
                                    id="longTerm"
                                    checked={formData.longTerm === "true"}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange("longTerm", checked)
                                    }
                                />
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label>{t("addAnnouncement.fields.owner.name")}</Label>
                                <Input
                                    id="ownerName"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{t("addAnnouncement.fields.owner.phone")}</Label>
                                <Input
                                    id="ownerPhone"
                                    name="ownerPhone"
                                    value={formData.ownerPhone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>
                                        {t("addAnnouncement.fields.residents.label")}
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addResident}
                                    >
                                        {t("addAnnouncement.fields.residents.add")}
                                    </Button>
                                </div>

                                {formData.residents.map((resident, index) => (
                                    <div key={index} className="space-y-4 rounded-md border p-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium">
                                                {t("addAnnouncement.fields.residents.label")} {index + 1}
                                            </h4>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeResident(index)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                                {t("addAnnouncement.fields.residents.name")}
                                            </Label>
                                            <Input
                                                value={resident.name}
                                                onChange={(e) =>
                                                    handleResidentChange(index, "name", e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>
                                                    {t("addAnnouncement.fields.residents.phone")}
                                                </Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addResidentPhone(index)}
                                                >
                                                    +
                                                </Button>
                                            </div>

                                            {resident.phones.map((phone, phoneIndex) => (
                                                <div
                                                    key={phoneIndex}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Input
                                                        value={phone}
                                                        onChange={(e) =>
                                                            handleResidentPhoneChange(
                                                                index,
                                                                phoneIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    {resident.phones.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeResidentPhone(index, phoneIndex)
                                                            }
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 6: Preferences */}
                    {step === 6 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>{t("addAnnouncement.fields.preferences.label")}</Label>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {[
                                        {
                                            id: "clean",
                                            label: t("addAnnouncement.fields.preferences.clean"),
                                        },
                                        {
                                            id: "quiet",
                                            label: t("addAnnouncement.fields.preferences.quiet"),
                                        },
                                        {
                                            id: "sociable",
                                            label: t("addAnnouncement.fields.preferences.sociable"),
                                        },
                                        {
                                            id: "organized",
                                            label: t("addAnnouncement.fields.preferences.organized"),
                                        },
                                        {
                                            id: "studious",
                                            label: t("addAnnouncement.fields.preferences.studious"),
                                        },
                                        {
                                            id: "active",
                                            label: t("addAnnouncement.fields.preferences.active"),
                                        },
                                        {
                                            id: "respectful",
                                            label: t("addAnnouncement.fields.preferences.respectful"),
                                        },
                                        {
                                            id: "friendly",
                                            label: t("addAnnouncement.fields.preferences.friendly"),
                                        },
                                    ].map((preference) => (
                                        <div
                                            key={preference.id}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={`preference-${preference.id}`}
                                                checked={formData.preferences.includes(preference.id)}
                                                onCheckedChange={() =>
                                                    handlePreferencesChange(preference.id)
                                                }
                                            />
                                            <Label
                                                htmlFor={`preference-${preference.id}`}
                                                className="cursor-pointer"
                                            >
                                                {preference.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
                        {t("addAnnouncement.previous")}
                    </Button>
                    <Button
                        onClick={step < 6 ? handleNext : handleSubmit}
                    >
                        {step < 6 ? t("addAnnouncement.next") : t("addAnnouncement.submit")}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}