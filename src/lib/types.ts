

export interface Skill {
  id: string;
  name: string;
  referenceUrl?: string;
}

export interface Feedback {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  location?: string;
  profilePhotoUrl?: string;
  isPublic: boolean;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  availability: string[];
  rating: number;
  feedbackCount: number;
  feedback: Feedback[];
  role?: 'user' | 'admin';
  isBanned?: boolean;
}

export interface Swap {
  id: string;
  requesterId: string;
  responderId: string;
  offeredSkillId: string;
  wantedSkillId: string;
  offeredSkillName?: string;
  wantedSkillName?: string;
  participantIds: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: any; // Allow ISO string date
  requester?: User;
  responder?: User;
  offeredSkill?: Skill;
  wantedSkill?: Skill;
  feedbackGivenBy?: string[]; // Array of user IDs who have given feedback
}

export interface Message {
    id: string;
    senderId: string;
    sender: User;
    content?: string;
    timestamp: any; // Allow ISO string date
    fileUrl?: string;
    fileType?: string;
    fileName?: string;
}

export interface Conversation {
    id: string;
    participants: User[];
    participantIds: string[];
    messages: Message[];
    relatedSwap: Swap;
    deletedFor?: string[]; // Array of user IDs for whom the conversation is deleted
}
