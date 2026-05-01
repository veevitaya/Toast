# Toast - Food Decision Making App

## Overview
Toast is a mobile application designed to simplify food discovery for individuals and groups. It provides personalized restaurant recommendations and facilitates group decision-making through a Tinder-style interface. The project aims to be a leading platform for social food discovery, enhancing user engagement and streamlining dining choices with features like a "Taste Profile" and LINE integration.

## User Preferences
I prefer iterative development with clear, concise communication. Please ask before making major architectural changes or introducing new external dependencies. I value a clean, functional coding style, and detailed explanations when complex logic is involved. Please ensure all changes are well-documented and follow the established design system meticulously.

## System Architecture
Toast utilizes a full-stack architecture. The frontend is built with React, Vite, TailwindCSS, and Framer Motion, using TanStack React Query for state management and wouter for routing. The backend is powered by Express.js with PostgreSQL and Drizzle ORM.

**UI/UX and Design System:**
The design adopts an Airbnb-inspired aesthetic, featuring a #FFCC02 golden yellow brand color, warm cream background, and white cards with soft shadows. Plus Jakarta Sans is used for headings and Inter for body text. Animations are spring-based for structural elements and CSS transitions for interactive components. Key UI elements include a draggable bottom sheet, animated emoji filters, horizontally scrollable restaurant rows, and a floating multi-session status bar. Interactive maps use Leaflet with custom styled divIcons. Admin and owner panels feature distinct color schemes and accent colors.

**Core Features:**
- **Onboarding Flow:** A two-step process for new users to set up their profiles.
- **Personalized Recommendations:** Offers an interactive map, personalized restaurant suggestions, and a "Daily Craving Engine" with advanced filtering.
- **Group Decision Making:** Enables users to create group sessions, invite friends via LINE, and collectively decide on a restaurant through synchronized swiping and a waiting room. Features a **menu-first swipe flow** where groups first swipe on dish types (from a `menu_items` table with 35 seeded dishes), then transition to restaurant cards serving matched dishes. Vibe-dependent routing: menu-first vibes (Spicy, Budget, Healthy, Trending Dishes, Street Food, Sweets, Brunch, Delivery) show dish cards first; restaurant-first vibes (Date Night, Outdoor, Drinks, Hot Restaurants, Rooftop, Late Night, Family, Cafe, Fine Dining) go directly to restaurant cards. The `group_swipes` table includes a `swipeType` column (`'menu' | 'restaurant'`) for phase-safe match computation.
- **Trending Feed:** A vertical, snap-scrolling feed of restaurant cards.
- **Taste Profile:** Tracks user swipe behavior to personalize recommendations and offers a "TasteDNA" panel.
- **Restaurant Details & Saving:** Provides comprehensive restaurant information, deep links to delivery services, and a server-persisted "Save Bucket System" with `saved_lists` and `saved_list_items` DB tables. Supports custom lists, localStorage-to-server migration for authenticated users, and a dedicated `/saved` page. Default lists: "My Saves" and "With Partner".
- **User Profile & Preferences:** Manages dietary restrictions, preferences, and LINE integration.
- **Partner Connection System:** DB-backed partner linking via HMAC-signed invite tokens (7-day TTL, anti-replay nonce via session_events). Tables: `partner_connections` (mutual link with anniversary date, status) + `partner_invites` (from user, token, nonce, expiry). Full flow: create invite → share via LINE → accept → mutual profile update. Enhanced Partners tab in Profile shows shared stats (days together, matches, total swipes), anniversary date, and disconnect with confirmation. Partner accept page at `/partner/accept?token=...`.
- **Vibe Tagging System:** DB-driven vibe matching with `vibe_definitions` (14 vibes with labels/emoji/sort) and `vibe_matching_rules` tables. Rules are seeded on startup from vibeConfig defaults and evaluated server-side via `evaluateRulesForRestaurant()` in storage. Features hard-filter mode for "drinks" and "cafe" vibes, keyword matching, price-level constraints, and cross-vibe implication (rooftop→outdoor). Includes `vibe_overrides` table for admin manual include/exclude. Admin endpoints: retag all (`POST /api/admin/vibes/retag`), explain matching (`POST /api/admin/vibes/explain`), manage overrides (`GET/POST/DELETE /api/admin/vibes/overrides`), debug by-vibe (`POST /api/admin/vibes/debug-by-vibe`, admin-only). `/api/restaurants/by-vibe` uses structured pipeline: pre-tagged lookup → DB rule evaluation fallback → relevance ranking. Auto-retag runs on server startup. Changing DB rules changes matching results without code changes.
- **Admin Panel:** A data analytics platform for managing restaurants, users, campaigns, and viewing detailed analytics with an RBAC system.
- **Restaurant Owner System:** A dedicated portal for owners to manage restaurant details, menus, promotions, and view performance analytics, including a subscription payment system.
- **"Butters" Assistant:** A dual-mode AI assistant providing context-aware suggestions for both admin and owner users.
- **Campaign System:** Allows restaurant owners to create and manage promotional campaigns.
- **Analytics Tracking:** Client-side event tracking for user behavior analysis.
- **Legal Center:** Provides access to various legal documents.
- **Internationalization (i18n):** Full Thai/English language support.
- **Search Functionality:** Matches restaurant names, categories, and menu keywords.

**Technical Implementations:**
- **Personalization & Recommendation Engine:** A multi-layered system that uses "Taste DNA" (long-term preferences), a "Moment Engine" (context-aware scoring), candidate generation, and a ranking engine. It also includes a confidence model and an explanation engine. **Toast Decides only surfaces restaurants that are an honest 90%+ match against the user's Taste DNA**: the engine maps its raw 0–1 fit score linearly to a 0–99% match (`60 + raw·50`), and `generateRecommendation` returns `null` (not a fake fallback) when no candidate clears the 90% threshold. The bootstrap response carries a `learningMode: true` flag in that case, and the UI shows a "we're still learning your taste, swipe a few spots" card instead of an inflated pick.
- **LINE LIFF Integration:** Deep integration for user authentication, profile retrieval, and social sharing.
- **Real-time Group Sessions:** Backend-powered sessions using PostgreSQL, supporting trending sessions, tracking member fingerprints for historical trend analysis, and server-side session recovery via `GET /api/sessions/active/:userId`. Sessions have optional group location fields (`locationName`, `locationLat`, `locationLng`) with a host-only location setting endpoint. Expired (24h) and completed sessions show graceful end-state UI.
- **Data Model:** Structured PostgreSQL tables for all core entities.
- **Session Management:** Hybrid client+server session tracking. SessionBar checks server for active sessions on mount (via `getActiveSessionForUser`), supplementing `sessionStorage`-based tracking. InteractiveMap includes a "My Location" recenter button using geolocation.
- **Google Places API Integration:** Backend support for fetching and importing restaurant data, including auto-deduplication and vibe assignment.
- **Performance Optimizations:** Includes lazy loading, preloading, database indexing, optimized queries, server-side caching, and frontend route lazy-loading.
- **Reliability & Hardening:** Features React ErrorBoundary, API request timeouts, auto-retry for network errors, double-submit prevention, image error fallbacks, server-side rate limiting, and comprehensive error logging.
- **Scalability & Database Optimization:** Implements database indexes on frequently-queried columns, GIN index for array containment, connection pooling, and server-side in-memory caching with auto-invalidation. N+1 queries have been eliminated.
- **Security Hardening:** Employs Helmet middleware for security headers, payload size limits, request ID generation, rate limiting on critical endpoints, login audit logging, and granular RBAC permission enforcement. Session event logging, server-generated session codes, and health endpoints are also implemented. All `/api/analytics/*` read endpoints require `adminAuth` (the event POST remains public for client-side tracking). Silent empty catch blocks in `processDecisionEvent` now log errors for debuggability.

## External Dependencies
- **LINE LIFF:** For user authentication, profile retrieval, and social sharing.
- **Leaflet + Stadia Alidade Smooth:** For interactive map rendering.
- **OpenStreetMap:** Provides static map embeds.
- **Grab:** Integrated for deep linking to food delivery services.
- **LINE MAN:** Integrated for deep linking to food delivery services.
- **Robinhood:** Integrated for deep linking to food delivery services.
- **Omise/Stripe:** Payment gateways for owner subscription management.