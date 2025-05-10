"use client";

import React, { useState } from "react";
import { useClientTranslation } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { genderOptions } from "@/types/common";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Camera, Pencil, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data based on the API response
const mockProfile = {
    firstName: "Meyirman",
    lastName: "Sarsenbay",
    email: "sarsenbaymeyirman@gmail.com",
    birthDate: "",
    phoneNumber: null,
    gender: "Любой",
    profilePhoto: null as string | null,
    isPasswordHas: true,
    status: "looking_for_apartment",
};

export default function ProfilePage() {
    const [locale, setLocale] = useState<"en" | "ru">("ru");
    const { t } = useClientTranslation(locale, "profile");

    const [profile, setProfile] = useState(mockProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(profile);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [date, setDate] = useState<Date | undefined>(
        profile.birthDate ? new Date(profile.birthDate) : undefined
    );

    const statusOptions = [
        {
            value: "looking_for_apartment",
            label: t("profile.status.lookingForApartment"),
        },
        {
            value: "looking_for_roommate",
            label: t("profile.status.lookingForRoommate"),
        },
        {
            value: "not_looking",
            label: t("profile.status.notLooking"),
        },
    ];

    const handleEditToggle = () => {
        if (isEditing) {
            // Save changes
            setProfile(editedProfile);
            toast.success(t("profile.saveSuccess"));
        }
        setIsEditing(!isEditing);
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (value: string) => {
        setEditedProfile((prev) => ({ ...prev, gender: value }));
    };

    const handleStatusChange = (value: string) => {
        setEditedProfile((prev) => ({ ...prev, status: value }));
    };

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
        if (newDate) {
            setEditedProfile((prev) => ({
                ...prev,
                birthDate: newDate.toISOString().split("T")[0],
            }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = () => {
        // Here you would call an API to change the password
        // For now, we'll just simulate a successful response
        toast.success(t("profile.passwordSuccess"));
        setIsPasswordModalOpen(false);
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Here you would upload the file to a server
            // For now, we'll just simulate setting a local URL
            const reader = new FileReader();
            reader.onload = () => {
                setEditedProfile((prev) => ({
                    ...prev,
                    profilePhoto: reader.result as string | null,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoDelete = () => {
        setEditedProfile((prev) => ({ ...prev, profilePhoto: null }));
    };

    return (
        <div className="container mx-auto max-w-3xl py-6">
            <h1 className="mb-6 text-3xl font-bold">{t("profile.title")}</h1>

            <Card>
                <CardHeader>
                    <CardTitle>{t("profile.personalInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Profile Photo */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={editedProfile.profilePhoto || ""}
                                    alt={editedProfile.firstName}
                                />
                                <AvatarFallback className="text-2xl">
                                    {editedProfile.firstName?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <div className="absolute -right-1 -top-1 flex">
                                    <label
                                        htmlFor="profile-photo"
                                        className="rounded-full bg-primary p-1 text-primary-foreground hover:bg-primary/90"
                                    >
                                        <Camera className="h-4 w-4" />
                                        <input
                                            id="profile-photo"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                        />
                                    </label>
                                    {editedProfile.profilePhoto && (
                                        <button
                                            onClick={handlePhotoDelete}
                                            className="ml-1 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div>
                            {isEditing ? (
                                <div className="space-y-2">
                                    <label
                                        htmlFor="profile-photo-upload"
                                        className="inline-block cursor-pointer text-sm text-primary hover:underline"
                                    >
                                        {t("profile.uploadPhoto")}
                                        <input
                                            id="profile-photo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                        />
                                    </label>
                                    {editedProfile.profilePhoto && (
                                        <div>
                                            <button
                                                onClick={handlePhotoDelete}
                                                className="text-sm text-destructive hover:underline"
                                            >
                                                {t("profile.deletePhoto")}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {editedProfile.firstName} {editedProfile.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Status selection */}
                    <div className="grid gap-2">
                        <Label htmlFor="status">{t("profile.status.label")}</Label>
                        <Select
                            value={editedProfile.status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger id="status">
                                <SelectValue
                                    placeholder={t("profile.status.lookingForApartment")}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Personal Information Form */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">{t("profile.firstName")}</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={editedProfile.firstName}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">{t("profile.lastName")}</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={editedProfile.lastName}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">{t("profile.email")}</Label>
                        <Input
                            id="email"
                            name="email"
                            value={editedProfile.email}
                            disabled
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="gender">{t("profile.gender.label")}</Label>
                            <Select
                                value={editedProfile.gender}
                                onValueChange={handleGenderChange}
                                disabled={!isEditing}
                            >
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder={t("profile.gender.male")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Мужской">
                                        {t("profile.gender.male")}
                                    </SelectItem>
                                    <SelectItem value="Женский">
                                        {t("profile.gender.female")}
                                    </SelectItem>
                                    <SelectItem value="Любой">
                                        {t("profile.gender.other")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="birthDate">{t("profile.birthDate")}</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                        disabled={!isEditing}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : t("profile.birthDate")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={handleDateChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setIsPasswordModalOpen(true)}
                        >
                            {t("profile.changePassword")}
                        </Button>
                        <Button onClick={handleEditToggle}>
                            {isEditing ? (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {t("profile.save")}
                                </>
                            ) : (
                                <>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    {t("profile.edit")}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Password Change Modal */}
            <Dialog
                open={isPasswordModalOpen}
                onOpenChange={setIsPasswordModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("profile.passwordModal.title")}</DialogTitle>
                        <DialogDescription>
                            {t("profile.passwordModal.description")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="currentPassword">
                                {t("profile.passwordModal.currentPassword")}
                            </Label>
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="newPassword">
                                {t("profile.passwordModal.newPassword")}
                            </Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">
                                {t("profile.passwordModal.confirmPassword")}
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsPasswordModalOpen(false)}
                        >
                            {t("profile.passwordModal.cancel")}
                        </Button>
                        <Button onClick={handlePasswordSubmit}>
                            {t("profile.passwordModal.changePassword")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}