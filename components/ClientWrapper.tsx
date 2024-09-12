'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Ensure this is correct
import Login from './Login';

interface ClientWrapperProps {
  children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  const router = useRouter(); // This should now work correctly

  const handleLogin = () => {
    console.log("User logged in");
    router.push('/bulk-editor'); // This should now work correctly
  };

  return (
    <div>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === Login) {
          return React.cloneElement(child, { onLogin: handleLogin });
        }
        return child;
      })}
    </div>
  );
};

export default ClientWrapper;