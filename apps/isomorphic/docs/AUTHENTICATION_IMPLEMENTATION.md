# Authentication Implementation - oep-web-admin

This document describes the authentication implementation using **credentials-only login** (email/password).

## Overview

The oep-web-admin uses NextAuth.js v4 with credentials provider only. Google OAuth has been disabled to keep authentication simple and focused on admin users with email/password credentials.

## Files Created/Modified

### 1. Created: `src/libs/apiRoutes.ts`
- Centralized API route configuration
- Points to backend API endpoints (`/auth/login`, `/auth/register`)
- Uses `NEXT_PUBLIC_API_URL` environment variable

### 2. Modified: `src/env.mjs`
- Added `NEXT_PUBLIC_API_URL` as a required client-side environment variable
- Must be configured in `.env` file

### 3. Created: `next-auth.d.ts`
- Extended NextAuth types to include custom user fields
- Added `token` field to User and JWT types
- Extended Session user type with all necessary fields (id, token, name, email, image)

### 4. Modified: `src/app/api/auth/[...nextauth]/auth-options.ts`
**Major Changes:**
- Replaced mock credentials login with real API integration
- Implemented proper Google OAuth flow with backend validation
- Added error handling classes (InvalidLoginError, AccountNotFoundError, AuthenticationFailedError)
- Proper JWT/Session callbacks to store user data and token

**Credentials Provider:**
- Calls `APIRoutes.login` with email/password
- Stores JWT token from backend response
- Returns user object with id, token, name, email, image

**Google Provider:**
- Maintains existing Google OAuth configuration
- Added `signIn` callback to validate with backend
- Calls `APIRoutes.providerLogin` with provider details
- Backend verifies Google account and returns user + token

**Callbacks:**
- `signIn`: Validates Google users with backend
- `jwt`: Stores user data in JWT token
- `session`: Exposes user data (including token) to client
- `redirect`: Simple redirect to base URL

### 5. Modified: `src/app/shared/auth-layout/auth-wrapper-one.tsx`
- Replaced mock `handleSignIn` function with real `handleGoogleSignIn`
- Imported `signIn` from `next-auth/react`
- Google button now calls `signIn('google')` directly
- Added proper error handling with toast notifications

## Environment Setup

Add to `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (already configured)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Authentication Flow

### Credentials Login:
1. User submits email/password via sign-in form
2. NextAuth calls credentials provider `authorize` function
3. Makes POST request to `APIRoutes.login` with credentials
4. Backend validates and returns user data + JWT token
5. Token stored in session via JWT callback
6. User redirected to dashboard

### Google Login:
1. User clicks "Sign in with Google" button
2. `signIn('google')` initiates Google OAuth flow
3. User authorizes with Google
4. NextAuth receives Google profile
5. `signIn` callback makes POST to `APIRoutes.providerLogin`
6. Backend validates Google account and returns user + token
7. Token stored in session via JWT callback
8. User redirected to dashboard

## Session Access

**Server Components:**
```typescript
import { auth } from '@/auth';

const session = await auth();
const userId = session?.user?.id;
const token = session?.user?.token;
```

**Client Components:**
```typescript
import { useSession } from 'next-auth/react';

const { data: session } = useSession();
const userId = session?.user?.id;
const token = session?.user?.token;
```

## API Integration

The implementation matches the storefront pattern:
- Uses same backend endpoints (`/auth/login`, `/auth/login/provider`)
- Expects same response format from backend
- Stores JWT token in session for API authentication
- Error handling for invalid credentials and Google account issues

## Next Steps

1. **Configure Environment Variables**: Add `NEXT_PUBLIC_API_URL` to `.env.local`
2. **Test Credentials Login**: Try logging in with email/password
3. **Test Google Login**: Try OAuth flow with Google account
4. **Verify Token Storage**: Check that JWT token is available in session
5. **Update API Calls**: Use `session.user.token` for authenticated API requests

## Notes

- All authentication logic follows storefront implementation
- Uses NextAuth.js v4 with JWT strategy
- Session expires after 30 days
- Google provider uses `allowDangerousEmailAccountLinking: true`
- Error pages redirect to sign-in page
- Type-safe with TypeScript throughout
