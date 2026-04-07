import React from 'react';
import { LoginButtons } from '@/components/login-buttons';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Learn Lang</h1>
      <p className="mt-4 text-xl text-gray-600">Minimalist, AI-driven language learning.</p>
      <div className="mt-8 text-center">
        <LoginButtons />
      </div>
    </main>
  );
}
