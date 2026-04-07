'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api, { setAuthToken } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      // In a real nextjs-auth0 app, you'd get the token via an API route proxy
      // or using `getAccessToken` in a server component.
      // For this spec, we'll assume we can get it or just call the API.
      // Since it's client-side, we'd need to fetch it from /api/auth/token or similar.
      // nextjs-auth0 doesn't expose the JWT to the client by default for security.
      // But we can call /api/auth/me to get the user session info on frontend.
      const res = await api.get('/api/me');
      setProfile(res.data);
    } catch (err: any) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!user) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2">Logged in as: {user.email}</p>

      <div className="mt-8 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Backend Profile Info</h2>
        <Button onClick={fetchProfile} disabled={loadingProfile}>
          {loadingProfile ? 'Loading...' : 'Fetch from Backend API'}
        </Button>
        {profile && (
          <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        )}
      </div>

      <div className="mt-8">
        <a href="/api/auth/logout">
          <Button variant="outline">Logout</Button>
        </a>
      </div>
    </div>
  );
}
