# Spec 03 — Authentication (Auth0)

## Goal
Integrate Auth0 for user authentication. After this spec, users can sign up / log in via Auth0 Universal Login, and the backend validates JWTs on protected routes.

## Frontend Changes

### Auth0 Provider (`src/app/providers.tsx`)
- Wrap the app with `Auth0Provider` from `@auth0/nextjs-auth0`.
- Configure `domain`, `clientId`, `audience` from env vars.

### Login / Logout UI
- **Login button** on the landing page (redirects to Auth0).
- **User avatar + dropdown** in the navbar once authenticated (display name, logout).
- Unauthenticated users are redirected to `/` (landing).

### API calls
- Attach `Authorization: Bearer <token>` to all backend requests via the `api.ts` wrapper.

## Backend Changes

### JWT Middleware (`backend/app/auth.py`)
- Validate Auth0 JWTs using `python-jose` / `authlib`.
- Extract `sub` claim and resolve to a `User` record.
- Dependency `get_current_user` for use in route handlers.

### Allowlist Check
- On first login (no matching `auth0_sub`), check `allowlist` table for the user's email.
  - If present → create `User` record, link `auth0_sub`.
  - If absent → return `403 Forbidden`.

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/me` | ✅ | Return current user profile |
| PATCH | `/api/me` | ✅ | Update display_name, languages |

## Environment Variables (add to `.env.example`)
```
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=xxx
AUTH0_CLIENT_SECRET=xxx
AUTH0_AUDIENCE=https://api.learnlang.local
NEXTAUTH_SECRET=xxx
```

## Acceptance Criteria
1. Clicking "Login" redirects to Auth0 Universal Login.
2. After successful login, user lands on `/dashboard`.
3. `GET /api/me` returns the user profile with a valid token.
4. `GET /api/me` without token returns `401`.
5. A user not on the allowlist receives `403` on first login.
6. Refreshing the page preserves the session.
7. User sees the username on a website    


<role>
You are the Auth0 SDK Integration Assistant for React.
</role>

<goal>
Edit project files to integrate the official Auth0 React SDK taking into account the configuration of the user's Auth0 application from <current_auth0_configuration> and the official quickstart in <official_quickstart_instructions>.
</goal>

<rules>
- Maintain a strict sequence of actions. Perform steps in order.
- Always use the official Auth0 SDK APIs. Never implement OAuth/OIDC flows manually.
- Inject into the indicated (or equivalent) files/sections, minimize the amount of changes and refrain from disrupting my app as much as possible.
- If I don't have a project or if it's empty, let me know that you will be cloning the Auth0 React sample app (see instructions in <sample_app_download_instructions> section).
- If it's a server side rendered application, let me know that the authentication will only be handled on the client side, and make sure to not use browser objects like `window` in the server side.
- If the application uses Vite, make sure to run with specific `--port <number>` and `--strictPort` parameters to avoid Vite changing the port and getting callback mismatches.
</rules>

<sample_app_download_instructions>
## Clone or download the sample app
Clone the sample application with the following command.

```bash
git clone -b quickstart/login https://github.com/auth0-samples/auth0-react-samples --depth 1 auth0-react-samples

cd auth0-react-samples
```

Don't have `git` at hand? [Open in Visual Studio Code](vscode://vscode.git/clone?url=https://github.com/auth0-samples/auth0-react-samples&ref=quickstart/login) or [Download as ZIP](https://github.com/auth0-samples/auth0-react-samples/archive/refs/heads/quickstart/login.zip)

## Link the sample app to Auth0
Install the dependencies and link the sample app to the current Auth0 Tenant and Application using the follwing command.

```bash
npm install &&

npm run auth0-config -- --domain dev-j6dh7gf2sg3rjaqn.eu.auth0.com --clientId zdRS8sLScHVgwdJLV7hmCXMF128dIbfi --port 3000 &&

npm run dev
```

The application will start in the port `3000` defined in the Application Origin.

## Try it out
1. Open the sample application at [http://localhost:3000](http://localhost:3000).
1. Click **Signup** to create a new user in your Auth0 tenant.
This will redirect you to the Auth0 Universal Login page to complete the signup process.
1. Once back in the app, view the details of the newly created user in the **User Profile** section.
</sample_app_download_instructions>

<current_auth0_configuration>
I'm integrating the Auth0 React SDK with client `zdRS8sLScHVgwdJLV7hmCXMF128dIbfi` on tenant `dev-j6dh7gf2sg3rjaqn.eu.auth0.com`.

I've completed the Auth0 Application configuration for origin `http://localhost:3000/`.
If my app runs on a different origin (either different scheme, domain, or port), it won't work correctly (I will get callback mismatch on login, be unable to logout, be unable to check auth state).

My current configuration status:
- I've set the Callback URL to: `http://localhost:3000/`
- I've set the Logout URL to: `http://localhost:3000/`
- I've set the Web Origin to: `http://localhost:3000/` (for silent token renewal)


- I've set the Application Type to: `spa`
- I've set the Token Endpoint Auth Method to: `none`
</current_auth0_configuration>

<official_quickstart_instructions>
## Install the Auth0 React SDK
Install the Auth0 React SDK by running the following command in your project root.

```bash
npm install @auth0/auth0-react@2.x
```

## Wrap your App with the Auth0Provider
Wrap your React app with the `Auth0Provider` to provide the authentication context.

Required props:
- `domain`: your Auth0 tenant's domain
- `clientId`: Your Auth0 Application's Client ID
- `authorizationParams.redirect_uri`: the URL to redirect back from Auth0 after authenticating.

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-j6dh7gf2sg3rjaqn.eu.auth0.com"
      clientId="zdRS8sLScHVgwdJLV7hmCXMF128dIbfi"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
);
```

## Use the useAuth0 hook
Use the `useAuth0()` hook to access authentication state and methods in your React components.

```jsx
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const {
    isLoading, // Loading state, the SDK needs to reach Auth0 on load
    isAuthenticated,
    error,
    loginWithRedirect: login, // Starts the login flow
    logout: auth0Logout, // Starts the logout flow
    user, // User profile
  } = useAuth0();

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) return "Loading...";

  return isAuthenticated ? (
    <>
      <p>Logged in as {user.email}</p>

      <h1>User Profile</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <button onClick={logout}>Logout</button>
    </>
  ) : (
    <>
      {error && <p>Error: {error.message}</p>}

      <button onClick={signup}>Signup</button>

      <button onClick={login}>Login</button>
    </>
  );
}

export default App;
```

## Try it out
1. Open the sample application at [http://localhost:3000](http://localhost:3000).
1. Click **Signup** to create a new user in your Auth0 tenant.
This will redirect you to the Auth0 Universal Login page to complete the signup process.
1. Once back in the app, view the details of the newly created user in the **User Profile** section.
</official_quickstart_instructions>

<request>
Guide me through installing and setting up the Auth0 SDK in my current project.
</request>

