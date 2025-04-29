import { ApartmentRoommate, QuestionnaireResponse } from "./apartment";
import { ResponseStatus } from "./index";

export type GroupMember = ApartmentRoommate & {
  joinedAt: string;
};

export type GroupApplication = {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  questionnaireResponse?: QuestionnaireResponse;
  message?: string;
  status: ResponseStatus;
  createdAt: string;
  updatedAt: string;
};

export type Group = {
  id: string;
  apartmentId: string;
  apartmentTitle: string;
  creatorId: string;
  name?: string;
  description?: string;
  maxMembers: number;
  members: GroupMember[];
  applications: GroupApplication[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateGroupRequest = {
  apartmentId: string;
  name?: string;
  description?: string;
  maxMembers: number;
  message?: string;
};

export type JoinGroupRequest = {
  groupId: string;
  message?: string;
};

export type UpdateGroupApplicationRequest = {
  applicationId: string;
  status: "accepted" | "rejected";
  message?: string;
};

export type GroupState = {
  myGroups: Group[];
  groupApplications: GroupApplication[];
  selectedGroup: Group | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};
