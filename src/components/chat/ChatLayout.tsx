
'use client';

import * as React from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { ConversationList } from './ConversationList';
import { ChatMessageList } from './ChatMessageList';
import type { User, Conversation } from '@/lib/types';
import { Separator } from '../ui/separator';

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  currentUser: User;
  conversations: Conversation[];
  initialConversationId: string | null;
  onConversationsUpdate: (conversations: Conversation[]) => void;
}

export function ChatLayout({
  defaultLayout = [320, 1],
  defaultCollapsed = false,
  currentUser,
  conversations,
  initialConversationId,
  onConversationsUpdate,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const findInitialConversation = () => {
    if (initialConversationId) {
      return conversations.find(c => c.id === initialConversationId) || conversations[0] || null;
    }
    return conversations[0] || null;
  }

  const [selectedConversation, setSelectedConversation] =
    React.useState<Conversation | null>(findInitialConversation());

  React.useEffect(() => {
    const conversation = findInitialConversation();
    setSelectedConversation(conversation);
  }, [initialConversationId, conversations]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-full max-h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={10}
        collapsible={true}
        minSize={15}
        maxSize={20}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed && 'min-w-[80px] transition-all duration-300 ease-in-out',
          'bg-card rounded-lg'
        )}
      >
        <ConversationList
          isCollapsed={isCollapsed}
          conversations={conversations}
          currentUser={currentUser}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onConversationsUpdate={onConversationsUpdate}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
         {selectedConversation ? (
            <ChatMessageList
                key={selectedConversation.id}
                conversation={selectedConversation}
                currentUser={currentUser}
            />
        ) : (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-headline">No conversation selected</h2>
                    <p className="text-muted-foreground">Select a conversation to start chatting.</p>
                </div>
            </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
