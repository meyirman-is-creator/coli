"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useClientTranslation } from "@/i18n/client";

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
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "apartment");
  
  // Parse groups data
  const groupData: GroupData = {
    interestedPeopleCount: apartment.groupDataResponse?.reduce(
      (count: number, group) => count + (group.groupMembers?.length || 0), 
      0
    ) || 0,
    interestedGroupCount: apartment.groupDataResponse?.length || 0,
    groups: apartment.groupDataResponse?.map((group) => ({
      id: group.id || 0,
      name: group.group || t("groups.defaultGroupName"), 
      freeSlots: group.freeSlots,
      people: group.groupMembers.map((member) => ({
        id: member.id,
        firstName: member.name.split(' ')[0] || "",
        lastName: member.name.split(' ')[1] || "",
        role: member.me ? t("groups.you") : t("groups.groupMember"),
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
      toast.error(t("groups.enterGroupName"));
      return;
    }
    
    // In a real app, this would be an API call
    toast.success(t("groups.groupCreated"), {
      description: t("groups.groupCreatedDescription", { name: groupName })
    });
    
    setCreateGroupDialogOpen(false);
    setGroupName("");
  };
  
  const handleSubmitApplication = () => {
    if (!coverLetter.trim()) {
      toast.error(t("groups.writeCoverLetter"));
      return;
    }
    
    // In a real app, this would be an API call
    toast.success(t("groups.applicationSent"), {
      description: t("groups.applicationSentDescription")
    });
    
    setApplyDialogOpen(false);
    setCoverLetter("");
  };
  
  if (groupData.interestedGroupCount === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-foreground">
            {t("groups.interestedInListing")}
          </h3>
          <Badge variant="outline" className="bg-accent/10">
            {t("groups.zeroGroups")}
          </Badge>
        </div>
        
        <div className="bg-accent/10 p-4 rounded-lg text-center">
          <p className="text-muted-foreground mb-4">{t("groups.noGroupsYet")}</p>
          
          <Button 
            onClick={() => setCreateGroupDialogOpen(true)}
            className="bg-foreground hover:bg-foreground/90 text-background"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("groups.createGroup")}
          </Button>
        </div>
        
        <Dialog open={createGroupDialogOpen} onOpenChange={setCreateGroupDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("groups.createNewGroup")}</DialogTitle>
              <DialogDescription>
                {t("groups.createGroupDescription")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">{t("groups.groupName")}</Label>
                <Input 
                  id="groupName" 
                  placeholder={t("groups.groupNamePlaceholder")}
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateGroupDialogOpen(false)}>
                {t("groups.cancel")}
              </Button>
              <Button onClick={handleCreateGroup}>
                {t("groups.create")}
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
          <h3 className="font-semibold text-foreground">
            {t("groups.interestedInListing")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("groups.peopleCount", { count: groupData.interestedPeopleCount })}
          </p>
        </div>
        <Badge variant="outline" className="bg-accent/10">
          {t("groups.groupCount", { count: groupData.interestedGroupCount })}
        </Badge>
      </div>
      
      <div className="space-y-4">
        {groupData.groups.map((group: any) => (
          <Card key={group.id} className={`border ${
            isDesktop ? "hover:border-border/80 transition-all" : ""
          }`}>
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold text-foreground">{group.name}</CardTitle>
                  <CardDescription>
                    {t("groups.freeSlots", { count: group.freeSlots })}
                  </CardDescription>
                </div>
                
                {group.people.length > 0 && (
                  <AvatarGroup>
                    {group.people.slice(0, 3).map((person: any) => (
                      <Avatar key={person.id} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={person.avatar} alt={`${person.firstName} ${person.lastName}`} />
                        <AvatarFallback>{person.firstName[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                    {group.people.length > 3 && (
                      <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted border-2 border-background text-xs font-medium">
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
                  className="flex items-center text-muted-foreground hover:text-foreground"
                >
                  {expandedGroups.includes(group.id) ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      {t("groups.hide")}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      {t("groups.details")}
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="default"
                  size="sm"
                  disabled={group.freeSlots <= 0}
                  onClick={() => handleApplyToGroup(group)}
                >
                  {t("groups.apply")}
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
                          <p className="font-medium text-sm text-foreground">{person.firstName} {person.lastName}</p>
                          <p className="text-xs text-muted-foreground">{person.role}</p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenProfile(person)}
                        className="text-primary hover:text-primary/90"
                      >
                        {t("groups.viewProfile")}
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
          {t("groups.createYourGroup")}
        </Button>
      </div>
      
      {/* Create Group Dialog */}
      <Dialog open={createGroupDialogOpen} onOpenChange={setCreateGroupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("groups.createNewGroup")}</DialogTitle>
            <DialogDescription>
              {t("groups.createGroupDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">{t("groups.groupName")}</Label>
              <Input 
                id="groupName" 
                placeholder={t("groups.groupNamePlaceholder")}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateGroupDialogOpen(false)}>
              {t("groups.cancel")}
            </Button>
            <Button onClick={handleCreateGroup}>
              {t("groups.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Apply to Group Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("groups.applyToGroup")}</DialogTitle>
            <DialogDescription>
              {selectedGroup && t("groups.applyToGroupDescription", { name: selectedGroup.name })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">{t("groups.coverLetter")}</Label>
              <Textarea 
                id="coverLetter" 
                placeholder={t("groups.coverLetterPlaceholder")}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
              {t("groups.cancel")}
            </Button>
            <Button onClick={handleSubmitApplication}>
              {t("groups.sendApplication")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Person Profile Dialog */}
      {selectedPerson && (
        <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("groups.userProfile")}</DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={selectedPerson.avatar} alt={`${selectedPerson.firstName} ${selectedPerson.lastName}`} />
                <AvatarFallback>{selectedPerson.firstName[0]}</AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-semibold text-foreground">{selectedPerson.firstName} {selectedPerson.lastName}</h3>
              {selectedPerson.age && <p className="text-sm text-muted-foreground">{t("groups.ageYears", { age: selectedPerson.age })}</p>}
              <p className="text-muted-foreground">{selectedPerson.role}</p>
              
              {selectedPerson.appliedDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t("groups.appliedDate", { date: new Date(selectedPerson.appliedDate).toLocaleDateString() })}
                </p>
              )}
            </div>
            
            <div className="space-y-4 mt-2">
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground">{t("groups.aboutMe")}:</h4>
                <p className="text-muted-foreground text-sm">
                  {t("groups.noInformation")}
                </p>
              </div>
              
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground">{t("groups.interests")}:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-muted px-2 py-1 rounded-md text-xs text-foreground">{t("groups.reading")}</span>
                  <span className="bg-muted px-2 py-1 rounded-md text-xs text-foreground">{t("groups.music")}</span>
                  <span className="bg-muted px-2 py-1 rounded-md text-xs text-foreground">{t("groups.sports")}</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedPerson(null)}>
                {t("groups.close")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}