"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Users, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function InterestGroupSection({ apartment, isDesktop = false }) {
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // Parse groups data
  const groupData = {
    interestedPeopleCount: apartment.groupDataResponse?.reduce(
      (count, group) => count + (group.groupMembers?.length || 0), 
      0
    ) || 0,
    interestedGroupCount: apartment.groupDataResponse?.length || 0,
    groups: apartment.groupDataResponse?.map((group) => ({
      id: group.id || 0,
      name: group.group || "Группа", 
      freeSlots: group.freeSlots,
      people: group.groupMembers.map((member) => ({
        id: member.id,
        firstName: member.name.split(' ')[0] || "",
        lastName: member.name.split(' ')[1] || "",
        role: member.me ? "Вы" : "Участник группы",
        avatar: member.profilePhoto,
      })),
    })) || [],
  };
  
  const toggleExpandGroup = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };
  
  const handleOpenProfile = (person) => {
    setSelectedPerson(person);
  };
  
  const handleApplyToGroup = (group) => {
    setSelectedGroup(group);
    setApplyDialogOpen(true);
  };
  
  if (groupData.interestedGroupCount === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800">
            Заинтересованы в объявлении
          </h3>
          <Badge variant="outline" className="bg-gray-50">
            0 групп
          </Badge>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500 mb-4">Пока нет групп. Создайте свою группу!</p>
          
          <Button 
            onClick={() => setCreateGroupDialogOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Создать группу
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-semibold text-gray-800">
            Заинтересованы в объявлении
          </h3>
          <p className="text-sm text-gray-500">
            {groupData.interestedPeopleCount} человек
          </p>
        </div>
        <Badge variant="outline" className="bg-gray-50">
          {groupData.interestedGroupCount} {
            groupData.interestedGroupCount === 1 ? "группа" : 
            groupData.interestedGroupCount < 5 ? "группы" : "групп"
          }
        </Badge>
      </div>
      
      <div className="space-y-4">
        {groupData.groups.map((group) => (
          <Card key={group.id} className={`border ${
            isDesktop ? "hover:border-gray-300 transition-all" : ""
          }`}>
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold">{group.name}</CardTitle>
                  <CardDescription>
                    Свободных мест: {group.freeSlots}
                  </CardDescription>
                </div>
                
                {group.people.length > 0 && (
                  <AvatarGroup>
                    {group.people.slice(0, 3).map((person) => (
                      <Avatar key={person.id} className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={person.avatar} alt={`${person.firstName} ${person.lastName}`} />
                        <AvatarFallback>{person.firstName[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                    {group.people.length > 3 && (
                      <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 border-2 border-white text-xs font-medium">
                          +{group.people.length - 3}
                        </div>
                      </div>
                    )}
                  </AvatarGroup>
                )}
              </div>
            </CardHeader>
            
            <CardFooter className="p-4 flex flex-col gap-3">
              <div className="flex justify-between w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpandGroup(group.id)}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  {expandedGroups.includes(group.id) ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Скрыть
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Подробнее
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="default"
                  size="sm"
                  disabled={group.freeSlots <= 0}
                  onClick={() => handleApplyToGroup(group)}
                >
                  Подать заявку
                </Button>
              </div>
              
              {expandedGroups.includes(group.id) && (
                <div className="mt-2 space-y-3 w-full">
                  <Separator />
                  {group.people.map((person) => (
                    <div key={person.id} className="flex justify-between items-center py-2">
                      <div className