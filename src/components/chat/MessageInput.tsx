
'use client';

import { Paperclip, Send, Loader2, AtSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useRef, useState, FormEvent, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { User, Message, Conversation } from '@/lib/types';
import { getConversationById, updateConversation } from '@/lib/local-storage';
import { v4 as uuidv4 } from 'uuid';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '../ui/popover';
import { chatWithAgent } from '@/ai/flows/chat-agent-flow';
import { aiAgentUser } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageInputProps {
  conversation: Conversation;
  currentUser: User;
  onMessageSent: () => void;
}

export function MessageInput({ conversation, currentUser, onMessageSent }: MessageInputProps) {
  const [messageText, setMessageText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAgentPopover, setShowAgentPopover] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { toast } = useToast();
  
  useEffect(() => {
    if (messageText.endsWith('@')) {
        setShowAgentPopover(true);
    } else {
        setShowAgentPopover(false);
    }
  }, [messageText])

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "File Selected",
        description: `${selectedFile.name} is ready to be sent.`,
      });
    }
  };
  
  const handleMentionClick = () => {
    setMessageText(prev => prev + 'SkillSyncAI ');
    setShowAgentPopover(false);
    textareaRef.current?.focus();
  }

  const resetForm = () => {
      setMessageText('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  }

  const sendMessage = async () => {
    if (!messageText.trim() && !file) {
      return;
    }
    setLoading(true);

    const currentConversation = getConversationById(conversation.id);
    if(!currentConversation){
        setLoading(false);
        return;
    }

    try {
      let fileUrl: string | undefined;
      let fileName: string | undefined;
      let fileType: string | undefined;
      if (file) {
          fileUrl = URL.createObjectURL(file); // Temporary URL
          fileName = file.name;
          fileType = file.type;
      }

      const newMessage: Message = {
        id: uuidv4(),
        senderId: currentUser.id,
        sender: currentUser,
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
        ...(fileUrl && { fileUrl, fileName, fileType }),
      };
      
      currentConversation.messages.push(newMessage);
      updateConversation(currentConversation);
      const textForAI = messageText.trim();
      resetForm();
      onMessageSent();
      
      if (textForAI.includes('@SkillSyncAI')) {
        await triggerAIAgent(textForAI, currentConversation);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerAIAgent = async (query: string, currentConversation: Conversation) => {
    setIsAiLoading(true);
    try {
        const history = currentConversation.messages.map(m => ({
            role: m.senderId === currentUser.id ? 'user' as const : 'model' as const,
            content: m.content || '',
        }));

        const aiResponse = await chatWithAgent({ query, history });

        const aiMessage: Message = {
            id: uuidv4(),
            senderId: aiAgentUser.id,
            sender: aiAgentUser,
            content: aiResponse.response,
            timestamp: new Date().toISOString(),
        };

        const updatedConvo = getConversationById(conversation.id);
        if (updatedConvo) {
            updatedConvo.messages.push(aiMessage);
            updateConversation(updatedConvo);
            onMessageSent();
        }

    } catch (error) {
        console.error("AI agent error:", error);
        toast({ title: "AI Error", description: "The AI agent failed to respond.", variant: "destructive" });
    } finally {
        setIsAiLoading(false);
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <form
      className="relative"
      onSubmit={handleSubmit}
    >
      <Popover open={showAgentPopover} onOpenChange={setShowAgentPopover}>
        <PopoverAnchor asChild>
          <Textarea
            ref={textareaRef}
            name="message"
            placeholder={file ? `Attached: ${file.name}` : "Type your message here... Use '@' to mention AI."}
            className="pr-20 resize-none"
            rows={1}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={loading || isAiLoading}
          />
        </PopoverAnchor>
        <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-auto p-1">
            <Button variant="ghost" className="w-full justify-start" onClick={handleMentionClick}>
                <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={aiAgentUser.profilePhotoUrl} />
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">SkillSyncAI</p>
                    <p className="text-xs text-muted-foreground">Get help from the AI assistant</p>
                </div>
            </Button>
        </PopoverContent>
      </Popover>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        disabled={loading || isAiLoading}
      />
      <div className="absolute top-1/2 right-3 -translate-y-1/2 flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleFileClick}
          disabled={loading || isAiLoading}
        >
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
        </Button>
        <Button type="submit" variant="ghost" size="icon" disabled={loading || isAiLoading || (!messageText.trim() && !file)}>
          {loading || isAiLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
