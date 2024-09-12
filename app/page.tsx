'use client'; // Ensure this is a client component

import ClientWrapper from '../components/ClientWrapper';
import Login from '../components/Login';
import Image from 'next/image'; // Import Image component

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen"> {/* Centering the content */}
      <Image 
        src="/images/headshop-logo-tiki-head.png" // Updated logo path to headshop-logo.jpg
        alt="Headshop Logo"
        width={300} // Adjust width as needed
        height={100} // Adjust height as needed
        className="mb-4" // Margin below the logo
      />
      <h1 className="text-3xl font-bold mb-4">Headdy Updater</h1> {/* Heading */}
      <ClientWrapper className="w-2/5"> {/* Set width to 40% */}
        <Login />
      </ClientWrapper>
    </main>
  );
}