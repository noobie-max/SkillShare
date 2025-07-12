
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/shared/StarRating";
import { Mail, MapPin } from "lucide-react";
import type { User } from "@/lib/types";
import { SkillTag } from "./SkillTag";
import { TooltipProvider } from "../ui/tooltip";

interface UserProfileDialogProps {
  user: User;
  children: React.ReactNode;
}

export function UserProfileDialog({ user, children }: UserProfileDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <TooltipProvider>
          <DialogHeader>
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <Avatar className="w-24 h-24 border-4 border-border">
                <AvatarImage src={user.profilePhotoUrl} alt={user.name} data-ai-hint="person portrait" />
                <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="font-headline text-3xl">{user.name}</DialogTitle>
                 <div className="flex items-center justify-center md:justify-start text-muted-foreground mt-2 gap-4">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{user.location}</span>
                    </div>
                  )}
                   <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      <span>{user?.email}</span>
                    </div>
                </div>
                <div className="mt-4 flex justify-center md:justify-start">
                  <StarRating rating={user.rating} count={user.feedbackCount} size={20} />
                </div>
              </div>
            </div>
          </DialogHeader>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-headline font-semibold text-muted-foreground">Skills They Offer</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsOffered.map((skill) => (
                    <SkillTag key={skill.id} skill={skill} variant="default" className="text-sm px-3 py-1" />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-headline font-semibold text-muted-foreground">Skills They Want</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted.map((skill) => (
                    <SkillTag key={skill.id} skill={skill} variant="secondary" className="text-sm px-3 py-1" />
                  ))}
                </div>
              </div>
          </div>
           <div className="space-y-2 mt-6">
                <h3 className="font-headline font-semibold text-muted-foreground">Availability</h3>
                 <div className="flex flex-wrap gap-2">
                  {user.availability.map((item) => (
                    <SkillTag key={item} skill={{id: item, name: item}} variant="outline" className="text-sm px-3 py-1" />
                  ))}
                </div>
              </div>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}
