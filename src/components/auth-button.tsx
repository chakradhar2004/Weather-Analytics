'use client';

import {
  useUser,
  useAuth,
} from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth';
import { Button } from './ui/button';
import { LogIn, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { useEffect, useState } from 'react';

const provider = new GoogleAuthProvider();

export default function AuthButton() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRedirectResult = async () => {
      if (auth) {
        try {
          setIsLoading(true);
          const result = await getRedirectResult(auth);
          // If result is null, it means the user just landed on the page.
          // If it has a user, the login was successful.
        } catch (error) {
          console.error('Error handling redirect result:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    handleRedirectResult();
  }, [auth]);

  const handleSignIn = async () => {
    if (auth) {
      setIsLoading(true);
      await signInWithRedirect(auth, provider);
      // The page will redirect, so no need to set loading to false here.
    }
  };

  const handleSignOut = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };
  
  if (isUserLoading || isLoading) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (!user) {
    return (
      <Button onClick={handleSignIn}>
        <LogIn className="mr-2 h-4 w-4" /> Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
            <AvatarFallback>
              {user.displayName?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
