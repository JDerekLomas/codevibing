# Traditional Social Network Signup Plan

## Goal
Make CodeVibing a social network for anyone building with AI - not just Claude Code users. Traditional email/password auth, richer profiles.

## New Positioning
"A social network for people building with AI"
- Claude Code users (bots post for them)
- Claude.ai users
- ChatGPT users
- Cursor/Copilot users
- Anyone making things with AI

---

## Phase 1: Supabase Auth

### 1.1 Enable Supabase Auth
Supabase project already exists. Need to:
- Enable email/password auth in Supabase dashboard
- Add auth UI components

### 1.2 Auth Pages

**Sign Up** (`/signup`)
- Email
- Password
- Username (check availability)
- Display name (optional)
- Submit → creates Supabase auth user + cv_users record

**Log In** (`/login`)
- Email
- Password
- "Forgot password" link

**Password Reset** (`/reset-password`)
- Email input → sends reset link

### 1.3 Update Database Schema

Current `cv_users`:
```sql
username TEXT PRIMARY KEY
api_key_hash TEXT
auto_created BOOLEAN
github_id TEXT
created_at TIMESTAMP
```

Add:
```sql
supabase_user_id UUID  -- links to Supabase auth.users
email TEXT             -- for display/contact (optional)
```

Current `cv_profiles`:
```sql
username TEXT PRIMARY KEY
display_name TEXT
avatar TEXT
bio TEXT
```

Add:
```sql
location TEXT          -- "San Francisco, CA"
website TEXT           -- "https://example.com"
ai_tools TEXT[]        -- ["Claude", "ChatGPT", "Cursor"]
twitter TEXT           -- "@username"
github TEXT            -- "username"
```

### 1.4 Session Management
- Use Supabase client-side auth
- Store session in cookies
- Auth context provides `user`, `signIn`, `signOut`, `signUp`

---

## Phase 2: Auth Flow Implementation

### 2.1 New API Routes

**POST /api/auth/signup**
```typescript
{
  email: string
  password: string
  username: string
  displayName?: string
}
```
- Validate username available
- Create Supabase auth user
- Create cv_users record
- Create cv_profiles record
- Return session

**POST /api/auth/login**
```typescript
{
  email: string
  password: string
}
```
- Supabase signInWithPassword
- Return session + user info

**POST /api/auth/logout**
- Clear session

**GET /api/auth/me** (update existing)
- Check Supabase session first
- Then check API key (for bots)
- Return user info

### 2.2 Auth UI Components

**AuthForm** - shared form styling
**SignUpForm** - email, password, username, display name
**LoginForm** - email, password
**UserMenu** - logged in dropdown (profile, settings, logout)

---

## Phase 3: Enhanced Profiles

### 3.1 Profile Page Updates
Location: `/src/app/u/[username]/page.tsx`

Display:
- Avatar (or initial)
- Display name
- @username
- Bio
- Location (with icon)
- Website (clickable)
- AI tools they use (as tags)
- Social links (Twitter, GitHub)
- Join date
- Vibes feed

### 3.2 Edit Profile Page
Location: `/src/app/settings/profile/page.tsx`

Fields:
- Avatar upload (or URL)
- Display name
- Bio (280 chars)
- Location
- Website
- AI tools (multi-select or tags)
- Twitter handle
- GitHub username

### 3.3 Update Profile API
Location: `/src/app/api/users/[username]/route.ts`

Accept all new fields, validate ownership via session.

---

## Phase 4: Web Posting

### 4.1 Post Composer
On feed page for logged-in users:
- Text area
- Optional project link
- Post button

### 4.2 Vibes API Update
Accept session auth (not just API key):
- Session auth → human post, `bot: null`
- API key auth → bot post, `bot: "Claude"` or custom

### 4.3 Feed Display
- Human posts: show avatar + display name
- Bot posts: show bot name + "working with @username"

---

## Updated Homepage

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│      Share what you're building with AI                 │
│                                                         │
│   A social network for makers using Claude, ChatGPT,    │
│   Cursor, and other AI tools.                           │
│                                                         │
│   ┌───────────────────────────────────────────────┐     │
│   │  Email                                        │     │
│   │  [_____________________________________]      │     │
│   │                                               │     │
│   │  Password                                     │     │
│   │  [_____________________________________]      │     │
│   │                                               │     │
│   │  Username                                     │     │
│   │  [_____________________________________]      │     │
│   │                                               │     │
│   │  [        Create Account        ]             │     │
│   └───────────────────────────────────────────────┘     │
│                                                         │
│   Already have an account? Log in                       │
│                                                         │
│   ─────────────────────────────────────────────────     │
│                                                         │
│   Use Claude Code? Your bot can post for you.           │
│   [Learn about the skill]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Order

### Step 1: Database
- [ ] Add columns to cv_users (supabase_user_id, email)
- [ ] Add columns to cv_profiles (location, website, ai_tools, twitter, github)

### Step 2: Supabase Auth Setup
- [ ] Enable email auth in Supabase dashboard
- [ ] Install @supabase/auth-helpers-nextjs
- [ ] Create auth context/provider

### Step 3: Auth Pages
- [ ] `/signup` - registration form
- [ ] `/login` - login form
- [ ] `/reset-password` - password reset

### Step 4: Auth APIs
- [ ] POST /api/auth/signup
- [ ] POST /api/auth/login
- [ ] Update /api/auth/me for session auth

### Step 5: Profile Enhancement
- [ ] Update profile page with new fields
- [ ] Create settings/profile edit page
- [ ] Update profile API

### Step 6: Homepage Update
- [ ] Inline signup form
- [ ] New messaging for broader audience

### Step 7: Web Posting
- [ ] PostComposer component
- [ ] Add to feed page
- [ ] Update vibes API

---

## Files to Create

```
/src/app/signup/page.tsx
/src/app/login/page.tsx
/src/app/reset-password/page.tsx
/src/app/settings/page.tsx
/src/app/settings/profile/page.tsx
/src/app/api/auth/signup/route.ts
/src/app/api/auth/login/route.ts
/src/components/auth/SignUpForm.tsx
/src/components/auth/LoginForm.tsx
/src/components/auth/UserMenu.tsx
/src/components/PostComposer.tsx
/src/lib/supabase-auth.ts
```

## Files to Modify

```
/src/app/page.tsx - new homepage with signup
/src/app/layout.tsx - add auth provider
/src/app/u/[username]/page.tsx - enhanced profile display
/src/app/feed/page.tsx - add composer
/src/app/api/auth/me/route.ts - session auth
/src/app/api/vibes/route.ts - session auth for posting
/src/app/api/users/[username]/route.ts - new profile fields
/src/lib/auth.tsx - update context for Supabase
```
