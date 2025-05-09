"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Users, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  avatar: string;
  age: number | null;
  appliedDate: string;
  permissionStatus: string;
}

interface Group {
  id: number;
  name: string;
  freeSlots: number;
  people: Person[];
}

interface GroupData {
  interestedPeopleCount: number;
  interestedGroupCount: number;
  groups: Group[];
}

interface Apartment {
  groupDataResponse?: {
    id: number;
    group: string;
    freeSlots: number;
    groupMembers: {
      id: number;
      name: string;
      me: boolean;
      profilePhoto: string;
      age: number | null;
      appliedDate: string;
      permissionStatus: string;
    }[];
  }[];
}

export default function InterestGroupSection({ apartment, isDesktop = false }: { apartment: Apartment, isDesktop: boolean }) {
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupName, setGroupName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  
  // Parse groups data
  const groupData: GroupData = {
    interestedPeopleCount: apartment.groupDataResponse?.reduce(
      (count: number, group) => count + (group.groupMembers?.length || 0), 
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
        age: member.age || null,
        appliedDate: member.appliedDate,
        permissionStatus: member.permissionStatus,
      })),
    })) || [],
  };
  
  const toggleExpandGroup = (groupId: number) => {
    setExpandedGroups((prev: any) => 
      prev.includes(groupId) 
        ? prev.filter((id: number) => id !== groupId)
        : [...prev, groupId]
    );
  };
  
  const handleOpenProfile = (person: any) => {
    setSelectedPerson(person);
  };
  
  const handleApplyToGroup = (group: any) => {
    setSelectedGroup(group);
    setApplyDialogOpen(true);
  };
  
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast.error("Введите название группы");
      return;
    }
    
    // In a real app, this would be an API call
    toast.success("Группа создана", {
      description: `Группа "${groupName}" успешно создана`
    });
    
    setCreateGroupDialogOpen(false);
    setGroupName("");
  };
  
  const handleSubmitApplication = () => {
    if (!coverLetter.trim()) {
      toast.error("Напишите сопроводительное письмо");
      return;
    }
    
    // In a real app, this would be an API call
    toast.success("Заявка отправлена", {
      description: "Ваша заявка была успешно отправлена"
    });
    
    setApplyDialogOpen(false);
    setCoverLetter("");
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
        
        <Dialog open={createGroupDialogOpen} onOpenChange={setCreateGroupDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Создать новую группу</DialogTitle>
              <DialogDescription>
                Создайте группу для поиска соседей в это жилье
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Название группы</Label>
                <Input 
                  id="groupName" 
                  placeholder="Например: Студенты-медики" 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateGroupDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleCreateGroup}>
                Создать группу
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
        {groupData.groups.map((group: any) => (
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
                    {group.people.slice(0, 3).map((person: any) => (
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
                  {group.people.map((person: any) => (
                    <div key={person.id} className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={person.avatar} alt={`${person.firstName} ${person.lastName}`} />
                          <AvatarFallback>{person.firstName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{person.firstName} {person.lastName}</p>
                          <p className="text-xs text-gray-500">{person.role}</p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenProfile(person)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Профиль
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
        
        <Button
          variant="outline"
          onClick={() => setCreateGroupDialogOpen(true)}
          className="w-full flex items-center justify-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Создать свою группу
        </Button>
      </div>
      
      {/* Create Group Dialog */}
      <Dialog open={createGroupDialogOpen} onOpenChange={setCreateGroupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Создать новую группу</DialogTitle>
            <DialogDescription>
              Создайте группу для поиска соседей в это жилье
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Название группы</Label>
              <Input 
                id="groupName" 
                placeholder="Например: Студенты-медики" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateGroupDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateGroup}>
              Создать группу
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Apply to Group Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Подать заявку в группу</DialogTitle>
            <DialogDescription>
              {selectedGroup && `Группа: ${selectedGroup.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Сопроводительное письмо</Label>
              <Textarea 
                id="coverLetter" 
                placeholder="Расскажите о себе и почему хотите присоединиться к этой группе..." 
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSubmitApplication}>
              Отправить заявку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Person Profile Dialog */}
      {selectedPerson && (
        <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Профиль пользователя</DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={selectedPerson.avatar} alt={`${selectedPerson.firstName} ${selectedPerson.lastName}`} />
                <AvatarFallback>{selectedPerson.firstName[0]}</AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-semibold">{selectedPerson.firstName} {selectedPerson.lastName}</h3>
              {selectedPerson.age && <p className="text-sm text-gray-500">{selectedPerson.age} лет</p>}
              <p className="text-gray-500">{selectedPerson.role}</p>
              
              {selectedPerson.appliedDate && (
                <p className="text-xs text-gray-400 mt-1">
                  Подал заявку: {new Date(selectedPerson.appliedDate).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <div className="space-y-4 mt-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">О себе:</h4>
                <p className="text-gray-600 text-sm">
                  Информация отсутствует
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Интересы:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-200 px-2 py-1 rounded-md text-xs">Чтение</span>
                  <span className="bg-gray-200 px-2 py-1 rounded-md text-xs">Музыка</span>
                  <span className="bg-gray-200 px-2 py-1 rounded-md text-xs">Спорт</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedPerson(null)}>
                Закрыть
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}