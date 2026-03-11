# Toast - Food Decision Making App

## Overview
Toast is a Tinder-style mobile application designed to simplify food discovery for individuals and groups. It offers personalized restaurant recommendations, synchronized group swiping, and a "Taste Profile" to enhance user experience. The project aims to be a leading platform for social food discovery, utilizing gamification and LINE integration to boost user engagement and streamline dining decisions.

## User Preferences
I prefer iterative development with clear, concise communication. Please ask before making major architectural changes or introducing new external dependencies. I value a clean, functional coding style, and detailed explanations when complex logic is involved. Please ensure all changes are well-documented and follow the established design system meticulously.

## System Architecture
Toast features a modern full-stack architecture. The frontend is built with React, Vite, TailwindCSS, and Framer Motion, using TanStack React Query for state management and wouter for routing. The backend is powered by Express.js with PostgreSQL and Drizzle ORM.

**UI/UX and Design System:**
The design adopts an Airbnb-inspired aesthetic, featuring a #FFCC02 golden yellow brand color, a warm cream background, and pure white cards with soft shadows. Typography includes Plus Jakarta Sans for headings and Inter for body text. Animations are spring-based (Framer Motion) for structural elements and CSS transitions for interactive components. Key UI elements include a draggable bottom sheet, animated emoji filters, horizontally scrollable restaurant rows, and a floating multi-session status bar. The interactive map uses Leaflet with custom styled divIcons.

**Key Features:**
- **Home Screen:** Displays an interactive map (OpenStreetMap, Bangkok-centric), a draggable bottom sheet, and personalized restaurant recommendations.
- **Solo Journey:** A 3-step quiz guides users to personalized restaurant results based on mood, location, budget, and interests.
- **Group Journey:** Enables users to create sessions, invite friends via LINE, and collectively decide on a restaurant through synchronized swiping. Includes a waiting room and session summary.
- **Trending Feed:** A TikTok-style vertical feed replacing the old Swipe tab, featuring snap-scrolling restaurant cards, media carousels, and action buttons (Like/Save/Share).
- **Taste Profile:** Tracks user swipe behavior to personalize recommendations ("Because you like..." sections).
- **Restaurant Detail:** Provides comprehensive restaurant information, including photos, reviews, hours, map location, and deep links for delivery services (Grab, LINE MAN, Robinhood).
- **User Profile:** Allows users to manage dietary restrictions, preferences, and LINE integration settings.
- **Vibe Tagging System:** Restaurants are categorized using 14 distinct vibe tags (e.g., `spicy`, `drinks`, `date_night`). An auto-assign logic maps keywords, price levels, and operating hours to these vibes.
- **Admin Panel:** A comprehensive data analytics platform with 17 super admin pages (Dashboard, Analytics, Restaurants, Menus, Campaigns, Banners, Swipe Sessions, Users, Food Trends, Geography, Partner Clickouts, Predictive Intel, Owners, Data Ops, Integrations, Reports, Audit Logs) and 9 owner pages (Dashboard, Menu & Hours, Reviews, Promotions, Performance, Insights, Notifications, Support, Settings). Shared utility: `adminUtils.ts` exports `getTintVar()` for consistent tint backgrounds.
- **Campaign System:** Enables restaurant owners to create and manage promotional campaigns, displayed as banners on the home screen and detail pages.
- **Analytics Tracking:** Client-side event tracking for user behavior analysis.
- **Toast Picks:** A personalized predictive recommendation system leveraging user preferences and context.
- **Toast Decides (Personalized):** A home page section offering personalized restaurant recommendations based on server-side analytics, client-side taste profile, time-of-day/day-of-week context, and restaurant ratings/trending scores.
- **Save Bucket System:** Users can save restaurants into "mine" or "partner" buckets.
- **Icon Style:** Uses clean, plain `lucide-react` icons, colored with Tailwind text classes. Bottom navigation icons are brand-colored when active.

**Technical Implementations:**
- **LINE LIFF Integration:** Deep integration for user authentication, profile retrieval, and social sharing. LINE OA integration (Channel: `2009335625`, LIFF: `2009335625-Pyd3rjhr`) handles group session invites with mandatory LINE permission flow — users must authenticate via LINE before joining a group session (with guest fallback option). Server-side token verification via LINE OAuth2 API. Endpoints: `POST /api/line/verify-token` (validates LINE access tokens and syncs profiles), `GET /api/line/oa-config` (returns OA channel config and all endpoint URLs).
- **Real-time Group Sessions:** Backend-powered sessions with PostgreSQL tables for `group_sessions`, `group_session_members`, and `group_swipes`. Supports trending swipe sessions with geolocation-based restaurant fetching. Group sessions support `expectedMembers` field for member count tracking — displays "X of Y joined" and placeholder avatars in waiting room. Group setup includes a group size picker (2-10 people).
- **Data Model:** Structured PostgreSQL tables for all core entities including `restaurants`, `user_preferences`, `campaigns`, `analytics_events`, `group_sessions`, etc.
- **Admin RBAC:** Role-based access control for admin users with granular permissions.
- **Restaurant Owner System:** Dedicated login and dashboard for restaurant owners to manage their restaurant details, menus, promotions, and view performance analytics. Includes a claim system for restaurants. Mock owner: `owner@toastbkk.com` / `owner2024` (Jay Fai, premium). Owner Settings has Profile/Notifications/Subscription/Payments tabs. Payments tab supports credit card and Thai bank account setup (mock). Owner Promotions page has working campaign creation form. Admin login defaults to super user mode with a "Logging in as Restaurant Owner?" link (no toggle tabs). Profile page hides owner toggle until user completes onboarding flow (Register New or Claim Existing restaurant). Enhanced multi-step onboarding: Choice → Profile Info → Restaurant Details/Claim Search → Anti-Mislaim Verification (type restaurant name to confirm) → Document Upload → Submitted for Review. Pending claims show amber badge on profile. Owner dashboard top section has hero banner, status pills (Verified/Pending/Setup Mode), quick stats (Views/Likes/Saves), and collapsible restaurant details editor. LocalStorage keys: `toast_owner_profile` (owner data), `toast_owner_onboarding_status` (approval status).
- **"Butters" Admin Assistant:** Floating yellow (#FFCC02) bot icon in bottom-right of admin layout (admin-only, not owner). Opens a slide-up chat panel showing pending tasks (claims, registrations). Can approve/reject claims directly with confirmation messages. Component: `client/src/components/ButtersAssistant.tsx`.
- **Admin Owner Claim Improvements:** Enhanced search results with full restaurant cards, "Already Claimed" badges preventing duplicate claims, name-typing confirmation step, multi-restaurant display grid for verified owners.
- **Admin Payments Page:** Revenue KPIs, Omise/Stripe gateway status, transaction table, subscription breakdown, payout settings. Route: `/admin/payments`.
- **Admin Color Scheme:** CSS custom properties in `index.css` `:root`. Semantic color system — no gradients, all flat solid colors with opacity tints. Purple `--admin-deep-purple` (#8B5CF6) = Users/People/Audience. Blue `--admin-blue` (#3B82F6) = Content/Restaurants. Rose `--admin-pink` (#F43F5E) = Engagement/Swipes/Actions. Emerald `--admin-cyan` (#10B981) = Discovery/Growth/Trends. Amber `--admin-teal` (#F59E0B) = Revenue/Delivery/Campaigns. Each color has a `*-10` CSS variable (10% opacity tint) for icon backgrounds. KPI cards use thin 3px colored top bar + tinted icon backgrounds. Section headers use 3px left border in their semantic color. Yellow `#FFCC02` for sidebar/nav/Butters ONLY. Owner portal accent: green `#00B14F`. Delivery platform charts use actual brand colors (Grab green, LINE MAN green, Robinhood purple).
- **Session Management:** Utilizes `sessionStorage` with `useSyncExternalStore` for persistent, global session tracking.
- **Search Functionality:** Matches restaurant names, categories, and menu keywords with priority.
- **Performance Optimizations:** Includes lazy loading for images and map iframes, and preloading of critical assets.
- **Internationalization (i18n):** Full Thai/English language system. Core files: `client/src/i18n/index.ts` (translation logic, `t()` function, locale detection, `getLocalizedValue()` for API content), `client/src/i18n/LanguageProvider.tsx` (React context + `useLanguage()` hook), `client/src/locales/en.json` and `client/src/locales/th.json` (translation dictionaries). Language preference stored in localStorage (`toast_app_language`), options: Auto (device detection), English, Thai. Fallback: English. LanguageProvider wraps App in `App.tsx`. To add a new language: add locale file in `locales/`, add to `SUPPORTED_LOCALES` in `i18n/index.ts`, add option in Profile.tsx `LANGUAGE_OPTIONS`. Consumer-facing pages use `t()` for UI text; admin pages remain English-only.

## External Dependencies
- **LINE LIFF:** For user authentication, profile retrieval, and social sharing within the LINE ecosystem.
- **Leaflet + Stadia Alidade Smooth:** For interactive map rendering.
- **OpenStreetMap:** Provides static map embeds for restaurant locations.
- **Grab:** Integrated for deep linking to food delivery services.