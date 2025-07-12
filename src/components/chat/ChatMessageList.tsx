
'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Conversation, User, Message } from '@/lib/types';
import { MessageInput } from './MessageInput';
import { File, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getConversationById } from '@/lib/local-storage';
import { UserProfileDialog } from '../shared/UserProfileDialog';

interface ChatMessageListProps {
  conversation: Conversation;
  currentUser: User;
}

const ChatMessage = ({ message, isCurrentUser }: { message: Message, isCurrentUser: boolean}) => {
    const isFile = message.fileUrl;
    const isImage = isFile && (message.fileType?.startsWith('image/'));
    const messageTimestamp = new Date(message.timestamp);
    const isAIAgent = message.sender.id === 'ai-agent';

    return (
        <div className={cn('flex items-start gap-3', isCurrentUser && 'flex-row-reverse')}>
            <Avatar className={cn('h-8 w-8', isAIAgent && 'border-2 border-primary')}>
                <AvatarImage src={message.sender.profilePhotoUrl || undefined} alt={message.sender.name} data-ai-hint={isAIAgent ? "robot face" : "person face"} />
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                  {message.sender.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className={cn(
                'max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3', 
                isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary',
                isAIAgent && 'bg-primary/20'
            )}>
                {!isCurrentUser && <p className={cn('text-xs font-semibold mb-1', isAIAgent && 'text-primary')}>{message.sender.name}</p>}
                
                {isImage ? (
                    <Image src={message.fileUrl!} alt="Uploaded image" width={300} height={200} className="rounded-md object-cover" data-ai-hint="chat image" />
                ) : isFile ? (
                    <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-background/50 rounded-md hover:bg-background">
                       <File className="w-6 h-6"/>
                       <span>{message.fileName || 'View Attachment'}</span>
                    </a>
                ) : null}

                {message.content && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
                
                <p className="text-xs text-right mt-1 opacity-70">
                    {messageTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    )
}

export function ChatMessageList({
  conversation: initialConversation,
  currentUser,
}: ChatMessageListProps) {
  const [conversation, setConversation] = useState(initialConversation);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);

  useEffect(() => {
    setConversation(initialConversation);
  }, [initialConversation]);
  
  const handleNewMessage = () => {
    const updatedConvo = getConversationById(conversation.id);
    if(updatedConvo) {
      setConversation(updatedConvo);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  if (!otherParticipant) {
    return <div className="flex h-full items-center justify-center">Loading chat...</div>
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-lg">
        <div className="flex items-center gap-4 p-4 border-b">
           <UserProfileDialog user={otherParticipant}>
            <div className="flex items-center gap-4 cursor-pointer">
              <Avatar className="h-10 w-10">
                  <AvatarImage src={otherParticipant?.profilePhotoUrl || undefined} alt={otherParticipant?.name} data-ai-hint="person face" />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    {otherParticipant?.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                  </AvatarFallback>
              </Avatar>
              <div>
                  <h2 className="text-lg font-headline font-semibold">{otherParticipant?.name}</h2>
                  <p className="text-sm text-muted-foreground">Discussing: {conversation.relatedSwap.offeredSkill.name} for {conversation.relatedSwap.wantedSkill.name}</p>
              </div>
            </div>
           </UserProfileDialog>
        </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          conversation.messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isCurrentUser={message.sender.id === currentUser.id} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <MessageInput conversation={conversation} currentUser={currentUser} onMessageSent={handleNewMessage} />
      </div>
    </div>
  );
}
