
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatLayout } from '@/components/chat/ChatLayout';
import type { Conversation, User } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { getAuthenticatedUser, getConversations, getUserById } from '@/lib/local-storage';

function ChatPageContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversationId');

  useEffect(() => {
    const authUser = getAuthenticatedUser();
    
    if (!authUser) {
      router.push('/login');
      return;
    }
    setCurrentUser(authUser);

    const allConversations = getConversations();
    const userConversations = allConversations.filter(c => c.participantIds && c.participantIds.includes(authUser.id));
    
    // Enrich conversation data with full user objects for participants and message senders
    const enrichedConversations = userConversations.map(convo => ({
        ...convo,
        participants: convo.participantIds.map(id => getUserById(id)).filter(Boolean) as User[],
        messages: convo.messages.map(msg => ({
            ...msg,
            sender: getUserById(msg.senderId)!,
        }))
    }));
    
    setConversations(enrichedConversations);
    setLoading(false);
  }, [router]);
  
  const handleConversationsUpdate = (updatedConversations: Conversation[]) => {
     const enrichedConversations = updatedConversations.map(convo => ({
        ...convo,
        participants: convo.participantIds.map(id => getUserById(id)).filter(Boolean) as User[],
        messages: convo.messages.map(msg => ({
            ...msg,
            sender: getUserById(msg.senderId)!,
        }))
    }));
    setConversations(enrichedConversations);
  }


  if (loading || !currentUser) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <ChatLayout
        currentUser={currentUser}
        conversations={conversations}
        initialConversationId={conversationId}
        onConversationsUpdate={handleConversationsUpdate}
        defaultLayout={[320, 1]}
        defaultCollapsed={false}
      />
    </div>
  );
}


export default function ChatPage() {
    return (
        <Suspense fallback={<div className="flex h-[calc(100vh-8rem)] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>}>
            <ChatPageContent />
        </Suspense>
    )
}
