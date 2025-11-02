'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { LogIn, LogOut } from 'lucide-react';

const AuthButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsLoggedIn(!isLoggedIn)}
    >
      {isLoggedIn ? (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </>
      )}
    </Button>
  );
};

export default AuthButton;
