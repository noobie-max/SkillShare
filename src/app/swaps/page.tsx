
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SwapRequestCard } from "@/components/swaps/SwapRequestCard";
import type { Swap, User } from "@/lib/types";
import { Loader2 } from 'lucide-react';
import { getAuthenticatedUser, getSwaps, getUserById } from '@/lib/local-storage';

export default function SwapsPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [swapsLoading, setSwapsLoading] = useState(true);

  const fetchUserDetails = useCallback((userId: string): User | undefined => {
    return getUserById(userId);
  }, []);

  useEffect(() => {
    const authUser = getAuthenticatedUser();
    if (!authUser) {
      router.push('/login');
      return;
    }
    setUser(authUser);

    const allSwaps = getSwaps();
    const userSwaps = allSwaps.filter(swap => swap.participantIds && swap.participantIds.includes(authUser.id));

    const enrichedSwaps = userSwaps.map(swap => {
      const requester = fetchUserDetails(swap.requesterId);
      const responder = fetchUserDetails(swap.responderId);
      // In a real app with a skills table, you'd fetch these. For now, we rely on names stored in the swap.
      const offeredSkill = requester?.skillsOffered.find(s => s.id === swap.offeredSkillId);
      const wantedSkill = responder?.skillsOffered.find(s => s.id === swap.wantedSkillId);

      return {
        ...swap,
        requester,
        responder,
        offeredSkill,
        wantedSkill,
      } as Swap;
    });

    setSwaps(enrichedSwaps);
    setSwapsLoading(false);

  }, [router, fetchUserDetails]);
  
  if (swapsLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return null; // or a message, but redirect should handle it
  }

  const incomingPending = swaps.filter(
    (swap) => swap.responderId === user.id && swap.status === "pending"
  );
  const outgoingPending = swaps.filter(
    (swap) => swap.requesterId === user.id && swap.status === "pending"
  );
  const activeSwaps = swaps.filter(
    (swap) => (swap.requesterId === user.id || swap.responderId === user.id) && swap.status === "accepted"
  );
  const completedSwaps = swaps.filter(
    (swap) => (swap.requesterId === user.id || swap.responderId === user.id) && (swap.status === "completed" || swap.status === "rejected" || swap.status === "cancelled")
  );
  
  const renderSwapList = (swapList: Swap[], emptyMessage: string) => {
    if (swapList.length === 0) {
      return <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>;
    }
    return (
      <div className="space-y-4">
        {swapList.map((swap) => (
          <SwapRequestCard key={swap.id} swap={swap} currentUserId={user.id} onUpdate={setSwaps} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-4xl font-headline font-bold text-center mb-2">
          Manage Your Swaps
        </h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Keep track of all your skill swap requests and ongoing exchanges.
        </p>
      </div>

      <Tabs defaultValue="incoming">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="incoming">Incoming Requests</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing Requests</TabsTrigger>
          <TabsTrigger value="active">Active Swaps</TabsTrigger>
          <TabsTrigger value="completed">History</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-6">
          {renderSwapList(incomingPending, "No incoming swap requests.")}
        </TabsContent>
        <TabsContent value="outgoing" className="mt-6">
          {renderSwapList(outgoingPending, "You haven't sent any swap requests yet.")}
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          {renderSwapList(activeSwaps, "No active swaps.")}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {renderSwapList(completedSwaps, "No completed or rejected swaps.")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
