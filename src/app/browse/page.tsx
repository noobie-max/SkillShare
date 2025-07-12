
"use client";

import { useEffect, useState } from "react";
import { UserCard } from "@/components/browse/UserCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { availabilities } from "@/lib/mock-data";
import type { User } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { getAuthenticatedUser, getUsers } from "@/lib/local-storage";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUser = getAuthenticatedUser();
    setCurrentUser(authUser);

    const allDbUsers = getUsers();
    // Filter out the current user and non-public users
    const publicUsers = allDbUsers.filter(u => u.isPublic && u.id !== authUser?.id);
    setAllUsers(publicUsers);
    setLoading(false);
  }, []);

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearchTerm =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some((skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesAvailability =
      availabilityFilter === "all" ||
      user.availability.includes(availabilityFilter);

    return matchesSearchTerm && matchesAvailability;
  });

  return (
    <TooltipProvider>
        <div className="space-y-8">
        <div>
            <h1 className="text-4xl font-headline font-bold text-center mb-2">
            Find Your Skill-Swap Partner
            </h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Search for users by name or skill, and filter by their availability.
            Start your learning journey today!
            </p>
        </div>

        <div className="p-4 bg-card/80 border rounded-lg shadow-sm sticky top-20 z-10 flex flex-col md:flex-row gap-4">
            <Input
            placeholder="Search by name or skill (e.g., 'Jane Doe' or 'Photography')"
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
            value={availabilityFilter}
            onValueChange={setAvailabilityFilter}
            >
            <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Filter by availability" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Availabilities</SelectItem>
                {availabilities.map((avail) => (
                <SelectItem key={avail} value={avail}>
                    {avail}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        
        {loading ? (
            <div className="flex justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        ) : filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} currentUser={currentUser} />
            ))}
            </div>
        ) : (
            <div className="text-center py-16">
            <h2 className="text-2xl font-headline font-semibold">No users found</h2>
            <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters.
            </p>
            </div>
        )}
        </div>
    </TooltipProvider>
  );
}
