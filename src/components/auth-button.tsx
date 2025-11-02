'use client';

import {
  useUser,
  useAuth,
} from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
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

const provider = new GoogleAuthProvider();

export default function AuthButton() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignIn = async () => {
    if (!auth) {
      console.error('Auth service is not available');
      alert('Authentication service is not available. Please try again later.');
      return;
    }

    try {
      console.log('Attempting to sign in with Google...');
      await signInWithPopup(auth, provider);
      console.log('Sign in successful');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);

      // More specific error handling
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Sign in popup was closed by the user');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('Sign in popup was cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Please allow popups for this website and try again.');
      } else {
        alert(`Failed to sign in: ${error.message || 'Unknown error'}`);
      }
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
  
  if (isUserLoading) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (!user) {
    return (
      <Button onClick={handleSignIn} variant="default">
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
      <DropdownMenuContent className="w-64 p-4" align="end" forceMount>
        <DropdownMenuLabel className="p-0">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {user.displayName?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-base font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
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
