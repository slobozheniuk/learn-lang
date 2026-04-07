'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function LoginButtons() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <Button disabled>Loading...</Button>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>Welcome, {user.name}!</p>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
          <a href="/api/auth/logout">
            <Button variant="outline">Logout</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <a href="/api/auth/login">
      <Button size="lg">Login / Get Started</Button>
    </a>
  );
}
