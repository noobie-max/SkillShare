
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldBan, ShieldCheck, Users, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import type { User, Swap } from '@/lib/types';
import { getAuthenticatedUser, getUsers, updateUser, getSwaps } from '@/lib/local-storage';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeSwaps: 0, completedSwaps: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const authUser = getAuthenticatedUser();
    setUser(authUser);
    
    if (!authUser) {
      router.push('/login');
      return;
    }
    
    if (authUser.role !== 'admin') {
      router.push('/');
      return;
    }

    const users = getUsers();
    const swaps = getSwaps();
    setAllUsers(users);
    setStats({
        totalUsers: users.length,
        activeSwaps: swaps.filter(s => s.status === 'accepted').length,
        completedSwaps: swaps.filter(s => s.status === 'completed').length
    });
    setLoading(false);
  }, [router]);

  const toggleBanStatus = async (targetUser: User) => {
    const newBanStatus = !targetUser.isBanned;
    const updatedUser = { ...targetUser, isBanned: newBanStatus };
    updateUser(updatedUser);

    setAllUsers(allUsers.map(u => u.id === targetUser.id ? updatedUser : u));
    toast({
      title: `User ${newBanStatus ? 'Banned' : 'Unbanned'}`,
      description: `${targetUser.name} has been successfully ${newBanStatus ? 'banned' : 'unbanned'}.`,
    });
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    // This is a fallback while redirecting
    return null;
  }
  
  const StatCard = ({ title, value, icon: Icon }: { title: string, value: number, icon: React.ElementType }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-2 text-primary">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users and platform settings.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
        <StatCard title="Active Swaps" value={stats.activeSwaps} icon={RefreshCw} />
        <StatCard title="Completed Swaps" value={stats.completedSwaps} icon={CheckCircle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map(u => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={u.profilePhotoUrl} alt={u.name} data-ai-hint="person avatar" />
                        <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                   <TableCell>
                      <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="capitalize">{u.role || 'user'}</Badge>
                   </TableCell>
                  <TableCell>
                    {u.isBanned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {user?.id !== u.id && (
                       <Button
                        variant={u.isBanned ? "secondary" : "destructive"}
                        size="sm"
                        onClick={() => toggleBanStatus(u)}
                      >
                        {u.isBanned ? <ShieldCheck className="mr-2 h-4 w-4" /> : <ShieldBan className="mr-2 h-4 w-4" />}
                        {u.isBanned ? 'Unban' : 'Ban'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
