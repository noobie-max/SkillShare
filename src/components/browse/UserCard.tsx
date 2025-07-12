
"use client";

import type { User } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SkillTag } from "@/components/shared/SkillTag";
import { StarRating } from "@/components/shared/StarRating";
import { MapPin } from "lucide-react";
import { RequestSwapDialog } from "@/components/swaps/RequestSwapDialog";
import { UserProfileDialog } from "../shared/UserProfileDialog";

interface UserCardProps {
  user: User;
  currentUser: User | null;
}

export function UserCard({ user, currentUser }: UserCardProps) {

  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1">
      <UserProfileDialog user={user}>
        <div className="flex flex-col flex-grow cursor-pointer">
            <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4 border-4 border-border">
                <AvatarImage src={user.profilePhotoUrl} alt={user.name} data-ai-hint="person portrait" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-xl">{user.name}</CardTitle>
            {user.location && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {user.location}
                </div>
            )}
            <div className="mt-2">
                <StarRating rating={user.rating} count={user.feedbackCount} />
            </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
            <div>
                <h4 className="font-semibold text-sm mb-2 font-headline text-muted-foreground">Offers:</h4>
                <div className="flex flex-wrap gap-2">
                {user.skillsOffered.slice(0, 3).map((skill) => (
                    <SkillTag key={skill.id} skill={skill} variant="secondary" />
                ))}
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-sm mb-2 font-headline text-muted-foreground">Wants:</h4>
                <div className="flex flex-wrap gap-2">
                {user.skillsWanted.slice(0, 3).map((skill) => (
                    <SkillTag key={skill.id} skill={skill} />
                ))}
                </div>
            </div>
            </CardContent>
        </div>
      </UserProfileDialog>
      <CardFooter>
        {currentUser && currentUser.id !== user.id && (
           <RequestSwapDialog responderUser={user} currentUser={currentUser} />
        )}
      </CardFooter>
    </Card>
  );
}
