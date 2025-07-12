
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { User, Swap } from "@/lib/types";
import { UserPlus } from "lucide-react";
import { Loader2 } from "lucide-react";
import { addSwap } from "@/lib/local-storage";
import { v4 as uuidv4 } from 'uuid';


interface RequestSwapDialogProps {
  responderUser: User;
  currentUser: User | null;
}

export function RequestSwapDialog({ responderUser, currentUser }: RequestSwapDialogProps) {
  const [open, setOpen] = useState(false);
  const [offeredSkillId, setOfferedSkillId] = useState("");
  const [wantedSkillId, setWantedSkillId] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!offeredSkillId || !wantedSkillId) {
      toast({
        title: "Incomplete Selection",
        description: "Please select a skill to offer and a skill to request.",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentUser) {
        toast({ title: "Error", description: "You must be logged in to request a swap.", variant: "destructive" });
        return;
    }
    
    setLoading(true);

    try {
      const offeredSkill = currentUser.skillsOffered.find(s => s.id === offeredSkillId);
      const wantedSkill = responderUser.skillsOffered.find(s => s.id === wantedSkillId);

      if (!offeredSkill || !wantedSkill) {
        throw new Error("Selected skill not found.");
      }

      const newSwap: Swap = {
        id: uuidv4(),
        requesterId: currentUser.id,
        responderId: responderUser.id,
        offeredSkillId: offeredSkillId,
        wantedSkillId: wantedSkillId,
        offeredSkillName: offeredSkill.name,
        wantedSkillName: wantedSkill.name,
        participantIds: [currentUser.id, responderUser.id],
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      
      addSwap(newSwap);

      toast({
        title: "Swap Request Sent!",
        description: `Your request to swap skills with ${responderUser.name} has been sent.`,
      });
      setOpen(false);
      setOfferedSkillId("");
      setWantedSkillId("");
    } catch(error) {
       console.error("Error creating swap:", error);
       toast({
        title: "Error",
        description: "Could not send swap request. Please try again.",
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  };
  
  const isLoading = !currentUser;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <UserPlus className="mr-2 h-4 w-4" /> Request Swap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Request a Swap with {responderUser.name}</DialogTitle>
          <DialogDescription>
            Choose what you'll offer and what you'd like in return.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
            <div className="flex justify-center items-center h-24">
                <Loader2 className="animate-spin" />
            </div>
        ) : (
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="offer" className="text-right">
                You Offer
                </Label>
                <Select value={offeredSkillId} onValueChange={setOfferedSkillId}>
                <SelectTrigger id="offer" className="col-span-3">
                    <SelectValue placeholder="Select your skill" />
                </SelectTrigger>
                <SelectContent>
                    {currentUser?.skillsOffered.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                        {skill.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="want" className="text-right">
                You Want
                </Label>
                <Select value={wantedSkillId} onValueChange={setWantedSkillId}>
                <SelectTrigger id="want" className="col-span-3">
                    <SelectValue placeholder={`Select ${responderUser.name}'s skill`} />
                </SelectTrigger>
                <SelectContent>
                    {responderUser.skillsOffered.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                        {skill.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            </div>
        )}
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={loading || isLoading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
