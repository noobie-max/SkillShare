

import type { User, Swap, Skill, Conversation, Message, Feedback } from './types';
import { v4 as uuidv4 } from 'uuid';

export const availabilities = ["Weekends", "Weekdays", "Evenings", "Mornings"];

export const predefinedSkills: Skill[] = [
  { id: '1', name: 'React Development' },
  { id: '2', name: 'Node.js Backend' },
  { id: '3', name: 'UI/UX Design' },
  { id: '4', name: 'Digital Marketing' },
  { id: '5', name: 'Creative Writing' },
  { id: '6', name: 'Photography' },
  { id: '7', name: 'Data Analysis' },
  { id: '8', name: 'Project Management' },
  { id: '9', name: 'Public Speaking' },
  { id: '10', name: 'Graphic Design' },
  { id: '11', name: 'Video Editing' },
  { id: '12', name: 'Guitar Lessons' },
  { id: '13', name: 'Cooking Indian Cuisine' },
  { id: '14', name: 'Yoga Instruction' },
];

const mockFeedback: Feedback[] = [
    {
        id: 'feedback-1',
        fromUserId: 'user-2',
        fromUserName: 'Priya Sharma',
        fromUserAvatar: undefined,
        toUserId: 'user-1',
        rating: 5,
        comment: 'Admin was an amazing React teacher. Highly recommend!',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
        id: 'feedback-2',
        fromUserId: 'user-4',
        fromUserName: 'Rohan Mehta',
        fromUserAvatar: undefined,
        toUserId: 'user-1',
        rating: 4.5,
        comment: 'Great design session. Learned a lot about UX principles.',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    }
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    location: 'Ahmedabad, Gujarat',
    profilePhotoUrl: undefined,
    isPublic: true,
    skillsOffered: [
        { id: '1', name: 'React Development', referenceUrl: 'https://github.com/example/react-project' },
        { id: '3', name: 'UI/UX Design', referenceUrl: 'https://dribbble.com/example' }
    ],
    skillsWanted: [
        { ...predefinedSkills.find(s => s.name === 'Creative Writing')! }, 
        { ...predefinedSkills.find(s => s.name === 'Photography')! }
    ],
    availability: ['Weekends', 'Evenings'],
    rating: 4.75,
    feedbackCount: 2,
    feedback: mockFeedback,
    role: 'admin',
    isBanned: false,
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    location: 'Surat, Gujarat',
    profilePhotoUrl: undefined,
    isPublic: true,
    skillsOffered: [
        { ...predefinedSkills.find(s => s.name === 'Creative Writing')!, referenceUrl: 'https://medium.com/@example' }, 
        { ...predefinedSkills.find(s => s.name === 'Video Editing')! }
    ],
    skillsWanted: [
        { ...predefinedSkills.find(s => s.name === 'React Development')! }, 
        { ...predefinedSkills.find(s => s.name === 'Public Speaking')! }
    ],
    availability: ['Weekdays'],
    rating: 4.5,
    feedbackCount: 8,
    feedback: [],
    role: 'user',
    isBanned: false,
  },
  {
    id: 'user-3',
    name: 'Sameer Desai',
    email: 'sameer@example.com',
    location: 'Vadodara, Gujarat',
    profilePhotoUrl: undefined,
    isPublic: true,
    skillsOffered: [predefinedSkills.find(s => s.name === 'Digital Marketing')!, predefinedSkills.find(s => s.name === 'Data Analysis')!],
    skillsWanted: [predefinedSkills.find(s => s.name === 'UI/UX Design')!, predefinedSkills.find(s => s.name === 'Graphic Design')!],
    availability: ['Evenings'],
    rating: 5.0,
    feedbackCount: 20,
    feedback: [],
    role: 'user',
    isBanned: false,
  },
  {
    id: 'user-4',
    name: 'Rohan Mehta',
    email: 'rohan@example.com',
    profilePhotoUrl: undefined,
    isPublic: true,
    location: 'Rajkot, Gujarat',
    skillsOffered: [predefinedSkills.find(s => s.name === 'Project Management')!, predefinedSkills.find(s => s.name === 'Public Speaking')!],
    skillsWanted: [predefinedSkills.find(s => s.name === 'Node.js Backend')!, predefinedSkills.find(s => s.name === 'Video Editing')!],
    availability: ['Weekends', 'Mornings'],
    rating: 4.7,
    feedbackCount: 15,
    feedback: [],
    role: 'user',
    isBanned: false,
  },
    {
    id: 'user-5',
    name: 'Isha Shah',
    email: 'isha@example.com',
    location: 'Gandhinagar, Gujarat',
    profilePhotoUrl: undefined,
    isPublic: true,
    skillsOffered: [predefinedSkills.find(s => s.name === 'Graphic Design')!, predefinedSkills.find(s => s.name === 'Cooking Indian Cuisine')!],
    skillsWanted: [predefinedSkills.find(s => s.name === 'Digital Marketing')!, predefinedSkills.find(s => s.name === 'Data Analysis')!],
    availability: ['Weekdays', 'Evenings'],
    rating: 4.9,
    feedbackCount: 18,
    feedback: [],
    role: 'user',
    isBanned: false,
  },
  {
    id: 'user-6',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    location: 'Anand, Gujarat',
    isPublic: false,
    profilePhotoUrl: undefined,
    skillsOffered: [predefinedSkills.find(s => s.name === 'Node.js Backend')!, predefinedSkills.find(s => s.name === 'Yoga Instruction')!],
    skillsWanted: [predefinedSkills.find(s => s.name === 'React Development')!, predefinedSkills.find(s => s.name === 'UI/UX Design')!],
    availability: ['Weekends'],
    rating: 4.6,
    feedbackCount: 5,
    feedback: [],
    role: 'user',
    isBanned: false,
  },
];

const findUser = (id: string) => mockUsers.find(u => u.id === id);

export const mockSwaps: Swap[] = [
  {
    id: 'swap-1',
    requesterId: 'user-2',
    responderId: 'user-1',
    participantIds: ['user-2', 'user-1'],
    offeredSkillId: '11', 
    wantedSkillId: '1', // React Development
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    offeredSkillName: findUser('user-2')?.skillsOffered.find(s => s.id === '11')?.name,
    wantedSkillName: findUser('user-1')?.skillsOffered.find(s => s.id === '1')?.name,
  },
  {
    id: 'swap-2',
    requesterId: 'user-1',
    responderId: 'user-3',
    participantIds: ['user-1', 'user-3'],
    offeredSkillId: '3', // UI/UX Design
    wantedSkillId: '4', // Digital Marketing
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    offeredSkillName: findUser('user-1')?.skillsOffered.find(s => s.id === '3')?.name,
    wantedSkillName: findUser('user-3')?.skillsOffered.find(s => s.id === '4')?.name,
  },
  {
    id: 'swap-3',
    requesterId: 'user-4',
    responderId: 'user-1',
    participantIds: ['user-4', 'user-1'],
    offeredSkillId: '8', // Project Management
    wantedSkillId: '3', // UI/UX Design
    status: 'accepted',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    offeredSkillName: findUser('user-4')?.skillsOffered.find(s => s.id === '8')?.name,
    wantedSkillName: findUser('user-1')?.skillsOffered.find(s => s.id === '3')?.name,
  },
  {
    id: 'swap-4',
    requesterId: 'user-1',
    responderId: 'user-5',
    participantIds: ['user-1', 'user-5'],
    offeredSkillId: '1', // React Development
    wantedSkillId: '13', // Cooking Indian Cuisine
    status: 'completed',
    feedbackGivenBy: [],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    offeredSkillName: findUser('user-1')?.skillsOffered.find(s => s.id === '1')?.name,
    wantedSkillName: findUser('user-5')?.skillsOffered.find(s => s.id === '13')?.name,
  },
   {
    id: 'swap-5',
    requesterId: 'user-2',
    responderId: 'user-4',
    participantIds: ['user-2', 'user-4'],
    offeredSkillId: '5', // Creative Writing
    wantedSkillId: '8', // Project Management
    status: 'completed',
    feedbackGivenBy: ['user-2', 'user-4'],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    offeredSkillName: findUser('user-2')?.skillsOffered.find(s => s.id === '5')?.name,
    wantedSkillName: findUser('user-4')?.skillsOffered.find(s => s.id === '8')?.name,
  },
];


const mockMessages: Message[] = [
    { id: 'msg-1', senderId: 'user-4', sender: findUser('user-4')!, content: 'Hey Admin! I saw you accepted our swap. I\'m excited to learn about UI/UX from you.', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { id: 'msg-2', senderId: 'user-1', sender: findUser('user-1')!, content: 'Hi Rohan! Likewise. When would be a good time to start?', timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
    { id: 'msg-3', senderId: 'user-4', sender: findUser('user-4')!, content: 'I\'m free this weekend. Does Saturday morning work?', timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString() },
    { id: 'msg-4', senderId: 'user-1', sender: findUser('user-1')!, content: 'Perfect! I\'ve attached a Figma file with some basics we can go over.', fileUrl: '/intro-to-figma.png', fileType: 'image/png', fileName: 'intro-to-figma.png', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 'msg-5', senderId: 'user-4', sender: findUser('user-4')!, content: 'Awesome, thanks! Looking forward to it.', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
];

export const mockConversations: Conversation[] = [
    {
        id: 'conv-1',
        participantIds: ['user-1', 'user-4'],
        participants: [findUser('user-1')!, findUser('user-4')!],
        messages: mockMessages,
        relatedSwap: mockSwaps.find(s => s.id === 'swap-3')!,
    },
    {
        id: 'conv-2',
        participantIds: ['user-1', 'user-3'],
        participants: [findUser('user-1')!, findUser('user-3')!],
        messages: [
            { id: 'c2-msg-1', senderId: 'user-3', sender: findUser('user-3')!, content: 'Hi, ready to talk about the marketing plan?', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
            { id: 'c2-msg-2', senderId: 'user-1', sender: findUser('user-1')!, content: 'Yep, sending over the proposal now.', fileUrl: '#', fileType: 'application/pdf', fileName: 'marketing-proposal.pdf', timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString() },
        ],
        relatedSwap: mockSwaps.find(s => s.id === 'swap-2')!,
    }
];

// Add an AI agent user for chat interactions
export const aiAgentUser: User = {
    id: 'ai-agent',
    name: 'SkillSync AI',
    profilePhotoUrl: undefined, // Will use initials "SA"
    isPublic: false,
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    rating: 5,
    feedbackCount: 999,
    feedback: [],
    role: 'user',
    isBanned: false,
};
