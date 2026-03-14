# Toast - Food Decision Making App

## Overview
Toast is a mobile application designed to simplify food discovery for individuals and groups through a Tinder-style interface. It offers personalized restaurant recommendations, synchronized group swiping, and a "Taste Profile" to enhance user experience. The project aims to be a leading platform for social food discovery, leveraging gamification and LINE integration to boost user engagement and streamline dining decisions.

## User Preferences
I prefer iterative development with clear, concise communication. Please ask before making major architectural changes or introducing new external dependencies. I value a clean, functional coding style, and detailed explanations when complex logic is involved. Please ensure all changes are well-documented and follow the established design system meticulously.

## System Architecture
Toast features a modern full-stack architecture with a React, Vite, TailwindCSS, and Framer Motion frontend, using TanStack React Query for state management and wouter for routing. The backend is powered by Express.js with PostgreSQL and Drizzle ORM.

**UI/UX and Design System:**
The design adopts an Airbnb-inspired aesthetic with a #FFCC02 golden yellow brand color, warm cream background, and white cards with soft shadows. Typography uses Plus Jakarta Sans for headings and Inter for body text. Animations are spring-based for structural elements and CSS transitions for interactive components. Key UI elements include a draggable bottom sheet, animated emoji filters, horizontally scrollable restaurant rows, and a floating multi-session status bar. Interactive maps use Leaflet with custom styled divIcons. The admin panel features a semantic color system with distinct colors for different functional areas and a yellow accent for global elements. The owner portal uses a green accent.

**Key Features:**
- **Onboarding Flow:** Quick 2-step onboarding (name + cuisine preferences) gates first-time solo/group entry. Stored in `toast_user_profile` localStorage; syncs name to guest profiles. Onboarding page at `/onboarding?returnTo=...`.
- **Personalized Recommendations:** Home screen displays an interactive map and personalized recommendations. Solo Journey uses a 3-step quiz, and "Toast Decides" offers personalized picks based on user preferences, context, and a "Daily Craving Engine" with a "Refine my picks" bottom sheet for advanced filtering.
- **Group Decision Making:** Users can create group sessions, invite friends via LINE, and collectively decide on a restaurant through synchronized swiping with a waiting room and session summary. Waiting room identifies host (gold border + star + "Host" label) vs members (green + checkmark + "Ready") using server-side `hostLineUserId`.
- **Trending Feed:** A TikTok-style vertical feed featuring snap-scrolling restaurant cards, media carousels, and action buttons.
- **Taste Profile:** Tracks user swipe behavior to personalize recommendations and offers a "TasteDNA" panel with aggregate scoring signals.
- **Restaurant Details & Saving:** Comprehensive restaurant information, deep links to delivery services, and a "Save Bucket System" for organizing saved restaurants.
- **User Profile & Preferences:** Manages dietary restrictions, preferences, and LINE integration settings.
- **Vibe Tagging System:** Restaurants are categorized using 14 distinct vibe tags, with an auto-assignment logic.
- **Admin Panel:** A comprehensive data analytics platform with an extensive set of pages for managing restaurants, users, campaigns, and viewing detailed analytics (Decision Intelligence, Performance, AI Recommendations, Delivery Conversions, Customer Insights). Features an Admin RBAC system.
- **Restaurant Owner System:** Dedicated login and dashboard for owners to manage restaurant details, menus, promotions, and performance analytics. Includes a multi-step restaurant claiming process and a subscription-based payment system.
- **"Butters" Assistant:** A dual-mode floating AI assistant available for both admin (yellow accent, "Admin Assistant") and owner (green accent, "Growth Assistant") users, providing page-aware context suggestions and insights.
- **Campaign System:** Enables restaurant owners to create and manage promotional campaigns.
- **Analytics Tracking:** Client-side event tracking for user behavior analysis, batched for efficiency.
- **Internationalization (i18n):** Full Thai/English language support with locale detection and `t()` function for UI text, stored in `localStorage`.
- **Search Functionality:** Matches restaurant names, categories, and menu keywords.
- **Performance Optimizations:** Lazy loading, critical asset preloading, database indexing, optimized backend queries, server-side in-memory caching, and frontend route lazy-loading. Toast Decides uses bootstrap-first rendering (sessionStorage cached), idle-callback API enrichment, optimized Unsplash image sizing (hero=400, secondary=200), sendBeacon analytics with batch fallback, and shared server-side event processing for single/batch endpoints.

**Technical Implementations:**
- **LINE LIFF Integration:** Deep integration for user authentication, profile retrieval, and social sharing, including server-side token verification and group session invites with mandatory LINE permission flow.
- **Real-time Group Sessions:** Backend-powered sessions using PostgreSQL tables for `group_sessions`, `group_session_members`, and `group_swipes`, supporting trending sessions with geolocation-based restaurant fetching.
- **Data Model:** Structured PostgreSQL tables for all core entities.
- **Session Management:** Utilizes `sessionStorage` with `useSyncExternalStore` for persistent, global session tracking.
- **Google Places API Integration:** Backend supports fetching and importing restaurant data from Google Places API, with auto-deduplication, auto-vibe assignment, and auto-district detection.

## External Dependencies
- **LINE LIFF:** For user authentication, profile retrieval, and social sharing within the LINE ecosystem.
- **Leaflet + Stadia Alidade Smooth:** For interactive map rendering.
- **OpenStreetMap:** Provides static map embeds for restaurant locations.
- **Grab:** Integrated for deep linking to food delivery services.
- **LINE MAN:** Integrated for deep linking to food delivery services.
- **Robinhood:** Integrated for deep linking to food delivery services.
- **Omise/Stripe:** Payment gateways for owner subscription management.