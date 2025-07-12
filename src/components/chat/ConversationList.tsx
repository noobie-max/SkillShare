
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Conversation, User } from '@/lib/types';
import { Archive, ArchiveX } from 'lucide-react';
import { deleteConversation, getConversations } from '@/lib/local-storage';
import { useToast } from '@/hooks/use-toast';

interface ConversationListProps {
  isCollapsed: boolean;
  conversations: Conversation[];
  currentUser: User;
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation | null) => void;
  onConversationsUpdate: (conversations: Conversation[]) => void;
}

export function ConversationList({
  isCollapsed,
  conversations,
  currentUser,
  selectedConversation,
  onSelectConversation,
  onConversationsUpdate,
}: ConversationListProps) {
  const { toast } = useToast();

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.id !== currentUser.id);
  };

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    deleteConversation(conversationId, currentUser.id);
    const updatedConversations = getConversations().filter(c => c.participantIds.includes(currentUser.id));
    onConversationsUpdate(updatedConversations);
    onSelectConversation(null);
    toast({
        title: "Conversation Archived",
        description: "The conversation has been removed from your list."
    });
  }

  return (
    <div className="flex h-full flex-col" data-collapsed={isCollapsed}>
      <div className="p-2">
        <h2
          className={cn(
            'text-xl font-headline font-bold p-2',
            isCollapsed && 'hidden'
          )}
        >
          Conversations
        </h2>
        {isCollapsed && (
          <div className="flex justify-center my-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.profilePhotoUrl || undefined} alt={currentUser.name} />
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                  {currentUser.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      <nav className="flex-grow space-y-1 px-2">
        <TooltipProvider delayDuration={0}>
          {conversations.map((conversation) => {
            const otherUser = getOtherParticipant(conversation);
            if (!otherUser) return null;
            
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            const lastMessageContent = lastMessage ? (lastMessage.content || 'Sent an attachment') : 'No messages yet';
            
            return isCollapsed ? (
              <Tooltip key={conversation.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'flex h-12 w-12 items-center justify-center p-0',
                      selectedConversation?.id === conversation.id &&
                        'bg-accent text-accent-foreground'
                    )}
                    onClick={() => onSelectConversation(conversation)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={otherUser.profilePhotoUrl || undefined}
                        alt={otherUser.name}
                        data-ai-hint="person face"
                      />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {otherUser.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">{otherUser.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                  {otherUser.name}
                </TooltipContent>
              </Tooltip>
            ) : (
              <div key={conversation.id} className="relative group">
                <Button
                    variant="ghost"
                    className={cn(
                    'w-full justify-start h-auto p-2 text-left',
                    selectedConversation?.id === conversation.id &&
                        'bg-accent text-accent-foreground'
                    )}
                    onClick={() => onSelectConversation(conversation)}
                >
                    <Avatar className="mr-3 h-8 w-8">
                    <AvatarImage
                        src={otherUser.profilePhotoUrl || undefined}
                        alt={otherUser.name}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {otherUser.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                    </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow truncate">
                    <p className="font-semibold">{otherUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                        {lastMessageContent}
                    </p>
                    </div>
                </Button>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100"
                            onClick={(e) => handleDeleteConversation(e, conversation.id)}
                        >
                            <ArchiveX className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        Archive Conversation
                    </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </TooltipProvider>
      </nav>
    </div>
  );
}
