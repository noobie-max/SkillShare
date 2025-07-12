
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { addUser, getUsers, setAuthenticatedUser } from '@/lib/local-storage';
import { mockUsers } from '@/lib/mock-data';
import type { User, Skill } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Separator } from '../ui/separator';
import { SkillSelector } from '../profile/SkillSelector';

const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  skillsOffered: z.array(z.object({ id: z.string(), name: z.string(), referenceUrl: z.string().optional() })).min(1, 'Please add at least one skill you can offer.'),
  skillsWanted: z.array(z.object({ id: z.string(), name: z.string(), referenceUrl: z.string().optional() })).min(1, 'Please add at least one skill you want to learn.'),
});

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type SignUpValues = z.infer<typeof signUpSchema>;
type SignInValues = z.infer<typeof signInSchema>;

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 6.343-4.114 11.41-9.473 11.41-5.358 0-9.473-5.067-9.473-11.41 0-6.344 4.115-11.41 9.473-11.41 3.109 0 5.192 1.304 6.464 2.523l-2.438 2.399c-.987-.94-2.238-1.52-3.996-1.52-3.333 0-6.135 2.766-6.135 6.164s2.802 6.164 6.135 6.164c3.832 0 5.422-2.733 5.586-4.199h-5.586v-3.003h9.322c.159.81.246 1.693.246 2.656z" transform="translate(2.5 2.5) scale(0.9)"/>
    </svg>
  );
}

export function AuthForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    control: controlSignUp,
    formState: { errors: errorsSignUp },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
        skillsOffered: [],
        skillsWanted: []
    }
  });

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    formState: { errors: errorsSignIn },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSignUp: SubmitHandler<SignUpValues> = async (data) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    if (users.find(u => u.email === data.email)) {
      toast({ title: 'Sign Up Error', description: 'Email already exists.', variant: 'destructive' });
      setLoading(false);
      return;
    }

    const newUser: User = {
        id: uuidv4(),
        name: data.name,
        email: data.email,
        profilePhotoUrl: undefined, // No placeholder, will use initials
        isPublic: true,
        skillsOffered: data.skillsOffered,
        skillsWanted: data.skillsWanted,
        availability: [],
        rating: 0,
        feedbackCount: 0,
        feedback: [],
        role: 'user',
        isBanned: false,
    };
    addUser(newUser);
    setAuthenticatedUser(newUser);

    setLoading(false);
    toast({ title: 'Account Created!', description: 'You have been successfully signed up.' });
    router.push('/profile');
    router.refresh();
  };

  const onSignIn: SubmitHandler<SignInValues> = async ({ email, password }) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    
    // Special check for admin credentials
    if (email === 'admin@example.com') {
      if (password !== 'admin123') {
        toast({ title: 'Sign In Error', description: 'Invalid password for admin.', variant: 'destructive' });
        setLoading(false);
        return;
      }
      const adminUser = users.find(u => u.email === email);
      if (adminUser) {
        setAuthenticatedUser(adminUser);
        setLoading(false);
        toast({ title: 'Admin Signed In!', description: 'Welcome back, Admin.' });
        router.push('/admin');
        router.refresh();
        return;
      }
    }
    
    const user = users.find(u => u.email === email);

    if (!user) {
      toast({ title: 'Sign In Error', description: 'User with this email not found.', variant: 'destructive' });
      setLoading(false);
      return;
    }

    if (user.isBanned) {
        toast({ title: 'Account Banned', description: 'Your account has been banned. Please contact support.', variant: 'destructive' });
        setLoading(false);
        return;
    }
    
    setAuthenticatedUser(user);

    setLoading(false);
    toast({ title: 'Signed In!', description: 'Welcome back.' });
    router.push('/browse');
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate signing in with the first mock user
    const users = getUsers();
    const user = users.find(u => u.role !== 'admin') || users[1]; // Sign in a non-admin user
    if (user.isBanned) {
        toast({ title: 'Account Banned', description: 'Your account has been banned. Please contact support.', variant: 'destructive' });
        setLoading(false);
        return;
    }
    setAuthenticatedUser(user);
    setLoading(false);
    toast({ title: 'Signed In!', description: 'Welcome to SkillSync.' });
    router.push('/browse');
    router.refresh();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Welcome to SkillSync</CardTitle>
        <CardDescription>
          Sign in or create an account to start swapping skills.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sign-in">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in" disabled={loading}>Sign In</TabsTrigger>
            <TabsTrigger value="sign-up" disabled={loading}>Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <form onSubmit={handleSubmitSignIn(onSignIn)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <Input id="email-signin" type="email" placeholder="m@example.com" {...registerSignIn('email')} />
                {errorsSignIn.email && <p className="text-destructive text-xs">{errorsSignIn.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signin">Password</Label>
                <Input id="password-signin" type="password" {...registerSignIn('password')} placeholder="Password" />
                {errorsSignIn.password && <p className="text-destructive text-xs">{errorsSignIn.password.message}</p>}
              </div>
              <Button className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="sign-up">
            <form onSubmit={handleSubmitSignUp(onSignUp)} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name-signup">Name</Label>
                <Input id="name-signup" placeholder="Jane Doe" {...registerSignUp('name')} />
                 {errorsSignUp.name && <p className="text-destructive text-xs">{errorsSignUp.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input id="email-signup" type="email" placeholder="m@example.com" {...registerSignUp('email')} />
                {errorsSignUp.email && <p className="text-destructive text-xs">{errorsSignUp.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" type="password" {...registerSignUp('password')} />
                {errorsSignUp.password && <p className="text-destructive text-xs">{errorsSignUp.password.message}</p>}
              </div>
              
              <Separator />

                <div className="space-y-2">
                    <Label>Skills You Offer</Label>
                     <Controller 
                        name="skillsOffered"
                        control={controlSignUp}
                        render={({ field }) => <SkillSelector value={field.value} onChange={field.onChange} />}
                     />
                    {errorsSignUp.skillsOffered && <p className="text-destructive text-xs">{errorsSignUp.skillsOffered.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label>Skills You Want</Label>
                     <Controller 
                        name="skillsWanted"
                        control={controlSignUp}
                        render={({ field }) => <SkillSelector value={field.value} onChange={field.onChange} />}
                     />
                    {errorsSignUp.skillsWanted && <p className="text-destructive text-xs">{errorsSignUp.skillsWanted.message}</p>}
                </div>

              <Button className="w-full" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
          Google (Demo Sign In)
        </Button>
      </CardContent>
    </Card>
  );
}
