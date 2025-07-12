

import { mockUsers, mockSwaps, mockConversations, aiAgentUser } from "./mock-data";
import type { User, Swap, Conversation, Feedback } from "./types";
import { v4 as uuidv4 } from 'uuid';

const USERS_KEY = 'skillSyncUsers';
const SWAPS_KEY = 'skillSyncSwaps';
const CONVERSATIONS_KEY = 'skillSyncConversations';
const AUTH_USER_KEY = 'skillSyncAuthUser';


const initializeData = () => {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem(SWAPS_KEY)) {
        localStorage.setItem(SWAPS_KEY, JSON.stringify(mockSwaps));
    }
    if (!localStorage.getItem(CONVERSATIONS_KEY)) {
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(mockConversations));
    }
};

initializeData();

// --- User Functions ---
export const getUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

export const getUserById = (id: string): User | undefined => {
    if (id === aiAgentUser.id) return aiAgentUser;
    const users = getUsers();
    return users.find(u => u.id === id);
};

export const updateUser = (updatedUser: User) => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
};

export const addUser = (newUser: User) => {
    const users = getUsers();
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};


// --- Auth Functions ---
export const getAuthenticatedUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const setAuthenticatedUser = (user: User | null) => {
    if (typeof window === 'undefined') return;
    if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(AUTH_USER_KEY);
    }
    
    // Dispatch custom event to notify components of auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged'));
};

// --- Swap Functions ---
export const getSwaps = (): Swap[] => {
    if (typeof window === 'undefined') return [];
    const swaps = localStorage.getItem(SWAPS_KEY);
    const enrichedSwaps = JSON.parse(swaps || '[]').map((swap: Swap) => ({
        ...swap,
        requester: getUserById(swap.requesterId),
        responder: getUserById(swap.responderId),
    }));
    return enrichedSwaps;
};

export const addSwap = (newSwap: Swap) => {
    const swaps = getSwaps();
    swaps.push(newSwap);
    localStorage.setItem(SWAPS_KEY, JSON.stringify(swaps));
};

export const updateSwap = (updatedSwap: Swap) => {
    let swaps = JSON.parse(localStorage.getItem(SWAPS_KEY) || '[]').map((s: Swap) => {
        const { requester, responder, ...simpleSwap } = s;
        return simpleSwap;
    });
    const { requester, responder, ...simpleUpdatedSwap } = updatedSwap;
    swaps = swaps.map(s => s.id === simpleUpdatedSwap.id ? simpleUpdatedSwap : s);
    localStorage.setItem(SWAPS_KEY, JSON.stringify(swaps));
};

export const deleteSwap = (swapId: string) => {
    let swaps = JSON.parse(localStorage.getItem(SWAPS_KEY) || '[]');
    swaps = swaps.filter(s => s.id !== swapId);
    localStorage.setItem(SWAPS_KEY, JSON.stringify(swaps));
};

// --- Feedback Functions ---
export const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt'>, swap: Swap) => {
    const users = getUsers();
    const toUser = users.find(u => u.id === feedback.toUserId);
    if (!toUser) return;

    const newFeedback: Feedback = {
        ...feedback,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
    };
    
    // Add feedback to user
    if (!toUser.feedback) toUser.feedback = [];
    toUser.feedback.unshift(newFeedback);

    // Recalculate rating
    const totalRating = toUser.feedback.reduce((sum, f) => sum + f.rating, 0);
    toUser.rating = totalRating / toUser.feedback.length;
    toUser.feedbackCount = toUser.feedback.length;
    
    updateUser(toUser);
    
    // Mark feedback as given on the swap
    const updatedSwap = { ...swap };
    if (!updatedSwap.feedbackGivenBy) updatedSwap.feedbackGivenBy = [];
    updatedSwap.feedbackGivenBy.push(feedback.fromUserId);
    updateSwap(updatedSwap);

    return newFeedback;
}


// --- Conversation Functions ---
export const getConversations = (): Conversation[] => {
    if (typeof window === 'undefined') return [];
    const conversations = localStorage.getItem(CONVERSATIONS_KEY);
    return conversations ? JSON.parse(conversations) : [];
};

export const getConversationById = (id: string): Conversation | undefined => {
    const conversations = getConversations();
    const convo = conversations.find(c => c.id === id);
    if (convo) {
        // Enrich participants and message senders
        const enrichedParticipants = convo.participantIds.map(id => getUserById(id)).filter(Boolean) as User[];
        const enrichedMessages = convo.messages.map(msg => ({
            ...msg,
            sender: getUserById(msg.senderId)!,
        }));
        
        return {
            ...convo,
            participants: enrichedParticipants,
            messages: enrichedMessages,
        };
    }
    return undefined;
};

export const updateConversation = (updatedConversation: Conversation) => {
    let conversations = getConversations();
    // Strip rich objects before saving to avoid data duplication
    const simpleConversation = {
        ...updatedConversation,
        participants: undefined, // remove rich object
        relatedSwap: { // only store swap ID
            ...updatedConversation.relatedSwap,
            requester: undefined,
            responder: undefined,
        },
        messages: updatedConversation.messages.map(msg => ({
            ...msg,
            sender: undefined, // remove rich object
        }))
    }
    conversations = conversations.map(c => c.id === updatedConversation.id ? simpleConversation : c);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export const deleteConversation = (conversationId: string, userId: string) => {
    const conversation = getConversationById(conversationId);
    if (!conversation) return;

    if (!conversation.deletedFor) {
        conversation.deletedFor = [];
    }
    if (!conversation.deletedFor.includes(userId)) {
        conversation.deletedFor.push(userId);
    }
    
    updateConversation(conversation);
};

export const getOrCreateConversationForSwap = (swap: Swap): Conversation => {
    const conversations = getConversations();
    let conversation = conversations.find(c => c.relatedSwap.id === swap.id);

    if (conversation) {
        return conversation;
    }
    
    if (!swap.requester || !swap.responder) {
        throw new Error("Cannot create conversation for a swap with missing user details.");
    }

    const newConversation: Conversation = {
        id: uuidv4(),
        participantIds: [swap.requesterId, swap.responderId],
        participants: [swap.requester, swap.responder],
        messages: [],
        relatedSwap: swap,
    };

    const simpleConversation = {
        ...newConversation,
        participants: undefined, // remove rich object
        relatedSwap: { // only store swap ID
            ...newConversation.relatedSwap,
            requester: undefined,
            responder: undefined,
        },
    }

    conversations.push(simpleConversation);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    
    return newConversation;
}
