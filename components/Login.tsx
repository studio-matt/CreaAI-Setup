'use client'; // Add this at the top of the file

import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui";
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { signInWithPopup } from "firebase/auth"; // Import signInWithPopup
import React from 'react'; // Import React for useEffect

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      onLogin(); // Call the onLogin prop after successful login
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to log in</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleLogin} className="w-full flex items-center justify-center">
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          <span>Sign in with Google</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default Login;