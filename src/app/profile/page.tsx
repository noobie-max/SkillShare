

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SkillTag } from '@/components/shared/SkillTag';
import { StarRating } from '@/components/shared/StarRating';
import { Edit, Mail, MapPin, Loader2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { User, Feedback } from '@/lib/types';
import { getAuthenticatedUser, getUserById } from '@/lib/local-storage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { TooltipProvider } from '@/components/ui/tooltip';


export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = getAuthenticatedUser();
    if (!user) {
      router.push('/login');
      return;
    }
    // Make sure we have the latest user data, including feedback
    const latestUser = getUserById(user.id);
    setProfile(latestUser || user);
    setLoading(false);
  }, [router]);
  
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }
  
  if (!profile) {
     return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-headline">Profile not found.</h2>
          <p className="text-muted-foreground">Please try logging out and back in.</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <Card>
          <CardHeader className="relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-32 h-32 border-4 border-border">
                <AvatarImage src={profile.profilePhotoUrl} alt={profile.name} data-ai-hint="person portrait" />
                <AvatarFallback className="text-4xl">{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <CardTitle className="font-headline text-4xl">{profile.name}</CardTitle>
                <div className="flex items-center justify-center md:justify-start text-muted-foreground mt-2 gap-4">
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                   <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      <span>{profile?.email}</span>
                    </div>
                </div>
                <div className="mt-4">
                  <StarRating rating={profile.rating} count={profile.feedbackCount} size={20} />
                </div>
              </div>
            </div>
            <Button variant="outline" asChild className="absolute top-4 right-4">
              <Link href="/profile/edit">
                <Edit className="w-4 h-4 mr-2" /> Edit Profile
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Separator className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <h3 className="font-headline font-semibold text-muted-foreground">Skills I Offer</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsOffered.map((skill) => (
                    <SkillTag key={skill.id} skill={skill} variant="default" className="text-sm px-3 py-1" />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-headline font-semibold text-muted-foreground">Skills I Want</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsWanted.map((skill) => (
                    <SkillTag key={skill.id} skill={skill} variant="secondary" className="text-sm px-3 py-1" />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-headline font-semibold text-muted-foreground">Availability</h3>
                 <div className="flex flex-wrap gap-2">
                  {profile.availability.map((item) => (
                    <SkillTag key={item} skill={{id: item, name: item}} variant="outline" className="text-sm px-3 py-1" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Feedback</CardTitle>
            <CardDescription>What others are saying about their swaps.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile.feedback && profile.feedback.length > 0 ? (
              profile.feedback.map((fb) => (
                <div key={fb.id}>
                    <div className="flex gap-4">
                    <Avatar>
                        <AvatarImage src={fb.fromUserAvatar} data-ai-hint="person avatar" />
                        <AvatarFallback>{fb.fromUserName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                        <p className="font-semibold font-headline">{fb.fromUserName}</p>
                        <StarRating rating={fb.rating} count={0} />
                        </div>
                        <p className="text-muted-foreground text-sm italic">"{fb.comment}"</p>
                    </div>
                    </div>
                    <Separator className="mt-4" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="mx-auto h-8 w-8 mb-2" />
                <p>No feedback yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
