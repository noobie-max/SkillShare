

import type { Swap, User } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, X, Trash2, MessageSquare, Star } from "lucide-react";
import { SwapEvaluation } from "./SwapEvaluation";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { deleteSwap, getSwaps, updateSwap, getOrCreateConversationForSwap, getAuthenticatedUser } from "@/lib/local-storage";
import Link from 'next/link';
import { LeaveFeedbackDialog } from "./LeaveFeedbackDialog";


interface SwapRequestCardProps {
  swap: Swap;
  currentUserId: string;
  onUpdate: (swaps: Swap[]) => void;
}


export function SwapRequestCard({ swap, currentUserId, onUpdate }: SwapRequestCardProps) {
  const isRequester = swap.requesterId === currentUserId;
  const otherUser = isRequester ? swap.responder : swap.requester;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (swap.status === 'accepted') {
      const conv = getOrCreateConversationForSwap(swap);
      if (conv) {
        setConversationId(conv.id);
      }
    }
  }, [swap]);


  if (!otherUser || !swap.offeredSkillName || !swap.wantedSkillName || !swap.requester || !swap.responder) {
    return (
        <Card className="w-full p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin h-4 w-4"/>
                <p>Loading swap details...</p>
            </div>
        </Card>
    );
  }

  const handleUpdate = () => {
    // This is a bit of a hack to force a re-render of the parent
    onUpdate(getSwaps().map(s => ({...s})));
  }

  const handleUpdateStatus = async (status: 'accepted' | 'rejected') => {
      setLoading(true);
      let updatedSwap = { ...swap, status };
      updateSwap(updatedSwap);

      if (status === 'accepted') {
        const conversation = getOrCreateConversationForSwap(updatedSwap);
        setConversationId(conversation.id);
      } else if (status === 'rejected') {
        updatedSwap = {...updatedSwap, status: 'rejected' } // ensure it's set for update
      }
      
      handleUpdate();
      toast({
          title: "Swap Updated",
          description: `The swap has been ${status}.`
      });
      setLoading(false);
  };

  const handleCancel = async () => {
      setLoading(true);
      deleteSwap(swap.id);
      handleUpdate();
      toast({ title: "Swap Cancelled", description: "The swap request has been cancelled or deleted."});
      setLoading(false);
  };

  const getStatusBadgeVariant = (status: Swap['status']) => {
    switch (status) {
      case "pending": return "secondary";
      case "accepted": return "default";
      case "completed": return "outline";
      case "rejected":
      case "cancelled": return "destructive";
      default: return "default";
    }
  };
  
  const currentUser = getAuthenticatedUser();
  const hasGivenFeedback = swap.feedbackGivenBy?.includes(currentUserId);

  const renderActions = () => {
    if (swap.status === "pending") {
      if (isRequester) {
        return (
          <Button variant="destructive" size="sm" onClick={handleCancel} disabled={loading}>
             {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
             Cancel Request
          </Button>
        );
      } else {
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleUpdateStatus('accepted')} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} 
              Accept
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus('rejected')} disabled={loading}>
               {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
               Reject
            </Button>
          </div>
        );
      }
    }
    if (swap.status === 'accepted') {
        return (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/chat?conversationId=${conversationId}`}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Chat with {otherUser.name}
                    </Link>
                </Button>
                 <Button variant="destructive" size="sm" onClick={handleCancel} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Cancel Swap
                 </Button>
            </div>
        )
    }
     if (swap.status === 'completed' && currentUser) {
        return (
          <LeaveFeedbackDialog 
            swap={swap}
            currentUser={currentUser}
            otherUser={otherUser}
            onFeedbackSubmitted={handleUpdate}
            hasGivenFeedback={!!hasGivenFeedback}
           />
        )
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={otherUser.profilePhotoUrl} alt={otherUser.name} data-ai-hint="person face" />
            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold font-headline">{otherUser.name}</p>
            <p className="text-sm text-muted-foreground">
              {isRequester ? `You requested a swap` : `${otherUser.name} sent you a request`}
            </p>
          </div>
        </div>
        <Badge variant={getStatusBadgeVariant(swap.status)} className="capitalize">{swap.status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-center text-center gap-4 md:gap-8">
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">You Offer</p>
                <p className="font-semibold">{isRequester ? swap.offeredSkillName : swap.wantedSkillName}</p>
            </div>
            <ArrowRight className="text-muted-foreground hidden md:block" />
             <div className="flex-1">
                <p className="text-sm text-muted-foreground">You Get</p>
                <p className="font-semibold">{isRequester ? swap.wantedSkillName : swap.offeredSkillName}</p>
            </div>
        </div>

        {swap.status === 'pending' && !isRequester && swap.offeredSkill && swap.wantedSkill && (
            <SwapEvaluation swap={{...swap, offeredSkill: swap.offeredSkill, wantedSkill: swap.wantedSkill}} />
        )}
      </CardContent>
      <CardFooter className="flex justify-end">{renderActions()}</CardFooter>
    </Card>
  );
}
