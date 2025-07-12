
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { getAuthenticatedUser, updateUser, getUsers, setAuthenticatedUser } from '@/lib/local-storage';
import type { User, Skill } from '@/lib/types';
import { availabilities } from '@/lib/mock-data';
import { Checkbox } from '@/components/ui/checkbox';
import { SkillSelector } from '@/components/profile/SkillSelector';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  location: z.string().optional(),
  profilePhoto: z.any().optional(),
  availability: z.array(z.string()).optional(),
  skillsOffered: z.array(z.object({ id: z.string(), name: z.string(), referenceUrl: z.string().optional() })),
  skillsWanted: z.array(z.object({ id: z.string(), name: z.string(), referenceUrl: z.string().optional() })),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const authUser = getAuthenticatedUser();
    if (!authUser) {
      router.push('/login');
      return;
    }
    setUser(authUser);
    setPhotoPreview(authUser.profilePhotoUrl || null);
    reset({
        name: authUser.name,
        location: authUser.location,
        availability: authUser.availability,
        skillsOffered: authUser.skillsOffered,
        skillsWanted: authUser.skillsWanted
    });
    setLoading(false);
  }, [router, reset]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    let profilePhotoUrl = user.profilePhotoUrl;
    if (data.profilePhoto && data.profilePhoto[0]) {
      const file = data.profilePhoto[0];
      const reader = new FileReader();
      profilePhotoUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    }

    const updatedUser: User = { 
        ...user, 
        name: data.name,
        location: data.location,
        availability: data.availability,
        skillsOffered: data.skillsOffered,
        skillsWanted: data.skillsWanted,
        profilePhotoUrl,
    };
    
    updateUser(updatedUser);
    setAuthenticatedUser(updatedUser); // Update the session user

    toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
    });
    router.push('/profile');
    router.refresh();
  };
  
  const photoFile = watch('profilePhoto');
  useEffect(() => {
    if (photoFile && photoFile[0]) {
        const file = photoFile[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result as string);
        }
        reader.readAsDataURL(file);
    }
  }, [photoFile]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Edit Your Profile</CardTitle>
                <CardDescription>Update your personal details, skills, and availability.</CardDescription>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" {...register('location')} placeholder="e.g., San Francisco, CA" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profilePhoto">Profile Photo</Label>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    {photoPreview ? (
                                        <AvatarImage src={photoPreview} alt="Profile preview" />
                                    ) : (
                                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                                    )}
                                </Avatar>
                                <Input id="profilePhoto" type="file" accept="image/*" {...register('profilePhoto')} className="max-w-xs" />
                            </div>
                            {errors.profilePhoto && <p className="text-destructive text-sm">{errors.profilePhoto.message as string}</p>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-headline font-semibold text-muted-foreground">Availability</h3>
                        <Controller
                            name="availability"
                            control={control}
                            render={({ field }) => (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {availabilities.map((item) => (
                                    <div key={item} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={item}
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                        const newValue = checked
                                            ? [...(field.value || []), item]
                                            : field.value?.filter((value) => value !== item);
                                        field.onChange(newValue);
                                        }}
                                    />
                                    <Label htmlFor={item} className="font-normal">{item}</Label>
                                    </div>
                                ))}
                                </div>
                            )}
                         />
                    </div>
                    
                    <div className="space-y-4">
                         <h3 className="text-lg font-headline font-semibold text-muted-foreground">Skills I Offer</h3>
                         <Controller 
                            name="skillsOffered"
                            control={control}
                            render={({ field }) => <SkillSelector value={field.value} onChange={field.onChange} />}
                         />
                    </div>
                     <div className="space-y-4">
                         <h3 className="text-lg font-headline font-semibold text-muted-foreground">Skills I Want</h3>
                         <Controller 
                            name="skillsWanted"
                            control={control}
                            render={({ field }) => <SkillSelector value={field.value} onChange={field.onChange} />}
                         />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                 </form>
            </CardContent>
        </Card>
    </div>
  );
}
