# Bear Lake Reunion App Setup

This project has been configured with Clerk authentication and MongoDB database using the Next.js App Router approach.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dG9nZXRoZXItaGVkZ2Vob2ctMjkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_EpRYo1B8YoL3ETJGLcWWpfbAwgb5cuD6clFSuTa4A9

# MongoDB Database
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/bear-lake-reunion?retryWrites=true&w=majority

# Clerk Webhook (for automatic user creation)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Implementation Details

### 1. Middleware (`middleware.ts`)

- Uses `clerkMiddleware()` from `@clerk/nextjs/server`
- Configured to handle authentication for all routes except static files

### 2. Layout (`app/layout.tsx`)

- Wrapped with `<ClerkProvider>`
- Includes `<AuthWrapper>` for app-wide authentication protection
- Contains centralized `<Navigation>` component
- Provides consistent layout structure for all pages

### 3. Authentication Wrapper (`app/components/AuthWrapper.tsx`)

- Secures the entire application
- Shows sign-in/sign-up buttons for unauthenticated users
- Only renders the main app content for authenticated users

### 4. Navigation (`app/components/Navigation.tsx`)

- Centralized header component with title and UserButton
- Consistent navigation across all authenticated pages
- Clean, reusable component

### 5. Page (`app/page.tsx`)

- Handles routing logic based on RSVP status
- Redirects to appropriate pages (RSVP or Dashboard)
- No duplicate layout code

### 6. Database (`lib/mongodb.ts`)

- MongoDB connection utility with connection caching
- Prevents connection leaks in development
- Handles connection errors gracefully

### 7. Models (`models/Reunion.ts`)

- Mongoose schema for reunion data
- Includes title, date, location, description, attendees, and activities
- Timestamps for creation and updates

### 8. API Routes (`app/api/reunions/route.ts`)

- GET endpoint to fetch all reunions
- POST endpoint to create new reunions
- Proper error handling and response formatting

### 9. User Management (`models/User.ts`)

- User model with Clerk user ID, RSVP status, and role
- Automatic user creation via webhook when users sign up
- User data management API endpoints

### 10. Webhook Handler (`app/api/webhooks/clerk/route.ts`)

- Handles Clerk webhook events
- Automatically creates user records in MongoDB on signup
- Verifies webhook signatures for security

### 11. User API (`app/api/users/route.ts`)

- GET endpoint to fetch current user data
- PATCH endpoint to update user information
- Protected by Clerk authentication

## Getting Started

1. Install dependencies: `npm install`
2. Create `.env.local` with the provided keys
3. Set up MongoDB:
   - Create a MongoDB Atlas account or use local MongoDB
   - Update the `MONGODB_URI` in `.env.local` with your connection string
4. Configure Clerk Webhook:
   - Go to Clerk Dashboard > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Select `user.created` event
   - Copy the webhook secret to `CLERK_WEBHOOK_SECRET` in `.env.local`
5. Run the development server: `npm run dev`
6. Visit `http://localhost:3000` to see the authentication flow

## Clerk Dashboard

Visit the [Clerk Dashboard](https://dashboard.clerk.com) to:

- Configure authentication methods
- Manage users
- Set up email templates
- Configure security settings
