import { Auth0Client } from '@auth0/nextjs-auth0/server';

const auth0 = new Auth0Client({
  routes: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    callback: '/api/auth/callback',
  }
});

export const GET = (req: any) => auth0.middleware(req);
export const POST = (req: any) => auth0.middleware(req);
