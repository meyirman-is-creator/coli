// src/components/add-announcement/StepApartmentFullDetails.tsx
"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useClientTranslation } from "@/i18n/client";
import { propertyTypeOptions, Resident } from "@/types/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash, User, Phone } from "lucide-react";

const StepApartmentFullDetails: React.FC = () => {
  const [locale, setLocale] = React.useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "profile");
  const { watch, setValue } = useFormContext();

  // Watch form values
  const propertyType = watch("apartmentDetails.propertyType") || "";
  const floorsFrom = watch("apartmentDetails.floorsFrom") || 1;
  const floorsTo = watch("apartmentDetails.floorsTo") || 1;
  const roomSize = watch("apartmentDetails.roomSize") || 0;
  const longTerm = watch("apartmentDetails.longTerm") || false;
  const ownerName = watch("apartmentDetails.ownerName") || "";
  const ownerPhones = watch("apartmentDetails.ownerPhones") || [];
  const residents = watch("apartmentDetails.residents") || [];
  const peopleInApartment = watch("peopleInApartment") || "1";

  // Local state for UI
  const [newOwnerPhone, setNewOwnerPhone] = useState("");
  const [showAddOwnerPhone, setShowAddOwnerPhone] = useState(false);
  const [newResidentName, setNewResidentName] = useState("");
  const [newResidentPhone, setNewResidentPhone] = useState("");
  const [showAddResidentForm, setShowAddResidentForm] = useState(false);
  const [selectedResidentIndex, setSelectedResidentIndex] = useState<number | null>(null);
  const [newPhoneForResident, setNewPhoneForResident] = useState("");
  const [showAddResidentPhone, setShowAddResidentPhone] = useState(false);

  // Get max number of residents allowed
  const getMaxResidents = () => {
    if (peopleInApartment === "5+") return 5;
    return parseInt(peopleInApartment);
  };

  // Form validation helpers
  const isPhoneValid = (phone: string) => {
    // Basic validation - you can enhance this
    return phone.length >= 10;
  };

  // Handle adding a new owner phone
  const handleAddOwnerPhone = () => {
    if (newOwnerPhone && isPhoneValid(newOwnerPhone)) {
      setValue("apartmentDetails.ownerPhones", [...ownerPhones, newOwnerPhone]);
      setNewOwnerPhone("");
      setShowAddOwnerPhone(false);
    }
  };

  // Handle removing an owner phone
  const handleRemoveOwnerPhone = (index: number) => {
    setValue(
      "apartmentDetails.ownerPhones",
      ownerPhones.filter((_: string, i: number) => i !== index)
    );
  };

  // Handle adding a new resident
  const handleAddResident = () => {
    if (newResidentName && newResidentPhone && isPhoneValid(newResidentPhone)) {
      setValue("apartmentDetails.residents", [
        ...residents,
        {
          name: newResidentName,
          phones: [newResidentPhone],
        },
      ]);
      setNewResidentName("");
      setNewResidentPhone("");
      setShowAddResidentForm(false);
    }
  };

  // Handle adding a phone to an existing resident
  const handleAddPhoneToResident = (residentIndex: number) => {
    if (newPhoneForResident && isPhoneValid(newPhoneForResident)) {
      const updatedResidents = [...residents];
      updatedResidents[residentIndex].phones.push(newPhoneForResident);
      setValue("apartmentDetails.residents", updatedResidents);
      setNewPhoneForResident("");
      setShowAddResidentPhone(false);
      setSelectedResidentIndex(null);
    }
  };

  // Handle removing a resident
  const handleRemoveResident = (index: number) => {
    setValue(
      "apartmentDetails.residents",
      residents.filter((_: Resident, i: number) => i !== index)
    );
  };

  // Handle removing a phone from a resident
  const handleRemoveResidentPhone = (residentIndex: number, phoneIndex: number) => {
    const updatedResidents = [...residents];
    updatedResidents[residentIndex].phones = updatedResidents[residentIndex].phones.filter(
      (_: string, i: number) => i !== phoneIndex
    );
    setValue("apartmentDetails.residents", updatedResidents);
  };

  return (
    <div className="space-y-6">
      {/* Property Type */}
      <div className="space-y-2">
        <Label>
          {t("addAnnouncement.fields.propertyType.label", "Тип жилья:")}
        </Label>
        <RadioGroup
          value={propertyType}
          onValueChange={(value) => setValue("apartmentDetails.propertyType", value)}
          className="space-y-2"
        >
          {propertyTypeOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.code} id={option.code} />
              <Label htmlFor={option.code} className="cursor-pointer">
                {t(`addAnnouncement.fields.propertyType.${option.code.toLowerCase()}`, option.namerus)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Floor Information */}
      <div className="space-y-2">
        <Label>
          {t("addAnnouncement.fields.floor.label", "Этаж:")}
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="floorsFrom" className="text-xs text-muted-foreground">
              {t("addAnnouncement.fields.floor.current", "Текущий этаж")}
            </Label>
            <Input
              id="floorsFrom"
              type="number"
              value={floorsFrom}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1) {
                  setValue("apartmentDetails.floorsFrom", value);
                }
              }}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="floorsTo" className="text-xs text-muted-foreground">
              {t("addAnnouncement.fields.floor.total", "Всего этажей")}
            </Label>
            <Input
              id="floorsTo"
              type="number"
              value={floorsTo}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= floorsFrom) {
                  setValue("apartmentDetails.floorsTo", value);
                }
              }}
            />
          </div>
        </div>
        {floorsFrom > floorsTo && (
          <p className="text-sm text-destructive">
            {t("addAnnouncement.validation.floor", "Текущий этаж не может быть больше общего количества этажей")}
          </p>
        )}
      </div>

      {/* Room Size */}
      <div className="space-y-2">
        <Label htmlFor="roomSize">
          {t("addAnnouncement.fields.area", "Площадь комнаты (кв. м):")}
        </Label>
        <Input
          id="roomSize"
          type="number"
          value={roomSize || ""}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 0) {
              setValue("apartmentDetails.roomSize", value);
            } else {
              setValue("apartmentDetails.roomSize", 0);
            }
          }}
          placeholder={t("addAnnouncement.placeholders.area", "Введите площадь")}
        />
      </div>

      {/* Long Term Option */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="longTerm"
          checked={longTerm}
          onCheckedChange={(checked) => setValue("apartmentDetails.longTerm", checked === true)}
        />
        <Label htmlFor="longTerm" className="cursor-pointer">
          {t("addAnnouncement.fields.longTerm", "На долгий срок?")}
        </Label>
      </div>

      <Separator className="my-6" />

      {/* Owner Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {t("addAnnouncement.sections.contactInfo", "Контактная информация владельца")}
        </h3>

        {/* Owner Name */}
        <div className="space-y-2">
          <Label htmlFor="ownerName">
            {t("addAnnouncement.fields.owner.name", "Имя владельца")}
          </Label>
          <Input
            id="ownerName"
            value={ownerName}
            onChange={(e) => setValue("apartmentDetails.ownerName", e.target.value)}
            placeholder={t("addAnnouncement.placeholders.ownerName", "Введите имя владельца")}
          />
        </div>

        {/* Owner Phones */}
        <div className="space-y-3">
          <Label>
            {t("addAnnouncement.fields.owner.phones", "Контактные телефоны")}
          </Label>

          {/* Display existing phones */}
          {ownerPhones.length > 0 && (
            <div className="space-y-2">
              {ownerPhones.map((phone: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{phone}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOwnerPhone(index)}
                  >
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add new phone */}
          {showAddOwnerPhone ? (
            <div className="space-y-2">
              <Input
                value={newOwnerPhone}
                onChange={(e) => setNewOwnerPhone(e.target.value)}
                placeholder="+7 ___ ___ ____"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleAddOwnerPhone}
                  disabled={!isPhoneValid(newOwnerPhone)}
                >
                  {t("addAnnouncement.buttons.add", "Добавить")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddOwnerPhone(false);
                    setNewOwnerPhone("");
                  }}
                >
                  {t("addAnnouncement.buttons.cancel", "Отмена")}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddOwnerPhone(true)}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("addAnnouncement.buttons.addPhone", "Добавить телефон")}
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Residents Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {t("addAnnouncement.sections.residents", "Жители")}
        </h3>

        {/* Existing residents */}
        {residents.map((resident: Resident, residentIndex: number) => (
          <Card key={residentIndex}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">
                  {t("addAnnouncement.sections.residentContact", "Контакты жителя")}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveResident(residentIndex)}
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Resident Name */}
              <div className="space-y-2">
                <Label>
                  {t("addAnnouncement.fields.residents.name", "Имя в личных сообщениях")}
                </Label>
                <Input
                  value={resident.name}
                  onChange={(e) => {
                    const updatedResidents = [...residents];
                    updatedResidents[residentIndex].name = e.target.value;
                    setValue("apartmentDetails.residents", updatedResidents);
                  }}
                  placeholder={t("addAnnouncement.placeholders.residentName", "Введите имя")}
                />
              </div>

              {/* Resident Phones */}
              <div className="space-y-3">
                <Label>
                  {t("addAnnouncement.fields.residents.phones", "Контактные телефоны")}
                </Label>

                {/* Display existing phones */}
                <div className="space-y-2">
                  {resident.phones.map((phone, phoneIndex) => (
                    <div key={phoneIndex} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{phone}</span>
                      </div>
                      {phoneIndex > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveResidentPhone(residentIndex, phoneIndex)}
                        >
                          <Trash className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add phone to resident */}
                {selectedResidentIndex === residentIndex && showAddResidentPhone ? (
                  <div className="space-y-2">
                    <Input
                      value={newPhoneForResident}
                      onChange={(e) => setNewPhoneForResident(e.target.value)}
                      placeholder="+7 ___ ___ ____"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => handleAddPhoneToResident(residentIndex)}
                        disabled={!isPhoneValid(newPhoneForResident)}
                      >
                        {t("addAnnouncement.buttons.add", "Добавить")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddResidentPhone(false);
                          setNewPhoneForResident("");
                          setSelectedResidentIndex(null);
                        }}
                      >
                        {t("addAnnouncement.buttons.cancel", "Отмена")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedResidentIndex(residentIndex);
                      setShowAddResidentPhone(true);
                    }}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addAnnouncement.buttons.addMorePhones", "Добавить еще телефоны")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add new resident form */}
        {showAddResidentForm ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {t("addAnnouncement.sections.newResident", "Новый житель")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Resident Name */}
              <div className="space-y-2">
                <Label htmlFor="newResidentName">
                  {t("addAnnouncement.fields.residents.name", "Имя в личных сообщениях")}
                </Label>
                <Input
                  id="newResidentName"
                  value={newResidentName}
                  onChange={(e) => setNewResidentName(e.target.value)}
                  placeholder={t("addAnnouncement.placeholders.residentName", "Введите имя")}
                />
              </div>

              {/* New Resident Phone */}
              <div className="space-y-2">
                <Label htmlFor="newResidentPhone">
                  {t("addAnnouncement.fields.residents.phone", "Контактный телефон")}
                </Label>
                <Input
                  id="newResidentPhone"
                  value={newResidentPhone}
                  onChange={(e) => setNewResidentPhone(e.target.value)}
                  placeholder="+7 ___ ___ ____"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleAddResident}
                  disabled={!newResidentName || !isPhoneValid(newResidentPhone)}
                >
                  {t("addAnnouncement.buttons.add", "Добавить")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddResidentForm(false);
                    setNewResidentName("");
                    setNewResidentPhone("");
                  }}
                >
                  {t("addAnnouncement.buttons.cancel", "Отмена")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          residents.length < getMaxResidents() && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddResidentForm(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("addAnnouncement.buttons.addResidents", "Добавить контакты жителей")}
            </Button>
          )
        )}

        {/* Show max residents message if needed */}
        {residents.length >= getMaxResidents() && !showAddResidentForm && (
          <div className="bg-muted p-4 rounded-md text-center text-muted-foreground">
            <p>
              {t("addAnnouncement.messages.maxResidents", "Достигнуто максимальное количество жителей")} 
              ({getMaxResidents()})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepApartmentFullDetails;