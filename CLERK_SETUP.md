# Clerk Authentication Setup

This project has been configured with Clerk authentication using the Next.js App Router approach.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dG9nZXRoZXItaGVkZ2Vob2ctMjkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_EpRYo1B8YoL3ETJGLcWWpfbAwgb5cuD6clFSuTa4A9
```

## Implementation Details

### 1. Middleware (`middleware.ts`)

- Uses `clerkMiddleware()` from `@clerk/nextjs/server`
- Configured to handle authentication for all routes except static files

### 2. Layout (`app/layout.tsx`)

- Wrapped with `<ClerkProvider>`
- Provides the base structure for the application

### 3. Authentication Wrapper (`app/components/AuthWrapper.tsx`)

- Secures the entire application
- Shows sign-in/sign-up buttons for unauthenticated users
- Only renders the main app content for authenticated users

### 4. Page (`app/page.tsx`)

- Wrapped with `AuthWrapper` for security
- Shows header with `<UserButton>` for authenticated users
- Displays reunion content only for signed-in users

## Getting Started

1. Install dependencies: `npm install`
2. Create `.env.local` with the provided keys
3. Run the development server: `npm run dev`
4. Visit `http://localhost:3000` to see the authentication flow

## Clerk Dashboard

Visit the [Clerk Dashboard](https://dashboard.clerk.com) to:

- Configure authentication methods
- Manage users
- Set up email templates
- Configure security settings
