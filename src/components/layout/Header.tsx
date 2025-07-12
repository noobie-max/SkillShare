
"use client";

import Link from "next/link";
import { RefreshCw, Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { getAuthenticatedUser, setAuthenticatedUser } from "@/lib/local-storage";


const navLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/swaps", label: "My Swaps" },
  { href: "/chat", label: "Chat" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setCurrentUser(getAuthenticatedUser());
    
    // Listen for storage changes (for localStorage updates across tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'skillSyncAuthUser') {
        setCurrentUser(getAuthenticatedUser());
      }
    };
    
    // Listen for custom events (for same-tab updates)
    const handleAuthChange = () => {
      setCurrentUser(getAuthenticatedUser());
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    setAuthenticatedUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setCurrentUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-xl">SkillSync</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {currentUser && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary text-muted-foreground"
              >
                {link.label}
              </Link>
            ))}
            {currentUser?.role === 'admin' && (
                <Link
                    href="/admin"
                    className="transition-colors hover:text-primary text-muted-foreground font-medium"
                >
                    <Shield className="inline-block h-4 w-4 mr-1" />
                    Admin
                </Link>
            )}
             {!currentUser && (
                <Link
                    href="/about"
                    className="transition-colors hover:text-primary text-muted-foreground"
                >
                    About
                </Link>
             )}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={currentUser.profilePhotoUrl || undefined} alt={currentUser.name || "User avatar"} data-ai-hint="user avatar" />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {currentUser.name ? currentUser.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() : currentUser.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none font-headline">{currentUser?.name || 'My Account'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/swaps">My Swaps</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/chat">Chat</Link>
                </DropdownMenuItem>
                 {currentUser?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                 )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Sign Up</Link>
              </Button>
            </>
          )}


          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-6 text-lg font-medium mt-8">
                 {currentUser && navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-primary text-muted-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                 <Link
                    href="/profile"
                    className="transition-colors hover:text-primary text-muted-foreground"
                  >
                    Profile
                  </Link>
                  {currentUser?.role === 'admin' && (
                    <Link
                        href="/admin"
                        className="transition-colors hover:text-primary text-muted-foreground font-medium"
                    >
                        <Shield className="inline-block h-5 w-5 mr-2" />
                        Admin
                    </Link>
                  )}
                  {!currentUser && (
                    <Link
                        href="/about"
                        className="transition-colors hover:text-primary text-muted-foreground"
                    >
                        About
                    </Link>
                  )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
