import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),
  category: text("category").notNull(),
  priceLevel: integer("price_level").notNull(),
  rating: text("rating").notNull(),
  address: text("address").notNull(),
  isNew: boolean("is_new").default(false),
  trendingScore: integer("trending_score").default(0),
  ownerId: integer("owner_id"),
  ownerClaimStatus: text("owner_claim_status").default("unclaimed"),
  paymentConnected: boolean("payment_connected").default(false),
  googlePlaceId: text("google_place_id"),
  vibes: text("vibes").array().default([]),
  district: text("district"),
  operatingHours: text("operating_hours"),
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({ id: true });
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  restaurantId: integer("restaurant_id").notNull(),
  preference: text("preference").notNull(),
});
export const insertUserPreferenceSchema = createInsertSchema(userPreferences).omit({ id: true });
export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = z.infer<typeof insertUserPreferenceSchema>;

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  lineUserId: text("line_user_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  pictureUrl: text("picture_url"),
  statusMessage: text("status_message"),
  dietaryRestrictions: text("dietary_restrictions").array().default([]),
  cuisinePreferences: text("cuisine_preferences").array().default([]),
  defaultBudget: integer("default_budget").default(2),
  defaultDistance: text("default_distance").default("5km"),
  partnerLineUserId: text("partner_line_user_id"),
  partnerDisplayName: text("partner_display_name"),
  partnerPictureUrl: text("partner_picture_url"),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true });
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  restaurantOwnerKey: text("restaurant_owner_key").notNull(),
  title: text("title").notNull(),
  dealType: text("deal_type").notNull(),
  dealValue: text("deal_value"),
  description: text("description"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  conditions: text("conditions").array().default([]),
  minSpend: text("min_spend"),
  maxRedemptions: text("max_redemptions"),
  targetGroups: text("target_groups").array().default([]),
  status: text("status").default("draft"),
  createdAt: text("created_at").notNull(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true });
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  userId: text("user_id"),
  restaurantId: integer("restaurant_id"),
  metadata: text("metadata"),
  timestamp: text("timestamp").notNull(),
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({ id: true });
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;

export const adBanners = pgTable("ad_banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  position: text("position").default("home_top"),
  isActive: boolean("is_active").default(true),
  startDate: text("start_date"),
  endDate: text("end_date"),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
});

export const insertAdBannerSchema = createInsertSchema(adBanners).omit({ id: true });
export type AdBanner = typeof adBanners.$inferSelect;
export type InsertAdBanner = z.infer<typeof insertAdBannerSchema>;

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("admin"),
  permissions: text("permissions").array().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: text("created_at").notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true });
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export const ADMIN_ROLES = ["superadmin", "admin", "moderator", "viewer"] as const;
export type AdminRole = typeof ADMIN_ROLES[number];

export const ADMIN_PERMISSIONS = [
  "manage_restaurants",
  "manage_users",
  "manage_campaigns",
  "manage_banners",
  "view_analytics",
  "manage_claims",
  "manage_config",
] as const;
export type AdminPermission = typeof ADMIN_PERMISSIONS[number];

export const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
  superadmin: [...ADMIN_PERMISSIONS],
  admin: ["manage_restaurants", "manage_campaigns", "manage_banners", "view_analytics", "manage_claims"],
  moderator: ["manage_restaurants", "view_analytics", "manage_claims"],
  viewer: ["view_analytics"],
};

export const restaurantOwners = pgTable("restaurant_owners", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  phone: text("phone"),
  lineUserId: text("line_user_id"),
  restaurantId: integer("restaurant_id"),
  isVerified: boolean("is_verified").default(false),
  verificationStatus: text("verification_status").default("pending"),
  paymentMethod: text("payment_method"),
  paymentDetails: jsonb("payment_details"),
  subscriptionTier: text("subscription_tier").default("free"),
  subscriptionExpiry: text("subscription_expiry"),
  createdAt: text("created_at").notNull(),
});

export const insertRestaurantOwnerSchema = createInsertSchema(restaurantOwners).omit({ id: true });
export type RestaurantOwner = typeof restaurantOwners.$inferSelect;
export type InsertRestaurantOwner = z.infer<typeof insertRestaurantOwnerSchema>;

export const restaurantClaims = pgTable("restaurant_claims", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  ownerId: integer("owner_id").notNull(),
  proofDocuments: text("proof_documents").array().default([]),
  status: text("status").default("pending"),
  reviewedBy: integer("reviewed_by"),
  reviewNotes: text("review_notes"),
  ownershipType: text("ownership_type").default("single_location"),
  verificationChecklist: jsonb("verification_checklist"),
  submittedAt: text("submitted_at").notNull(),
  reviewedAt: text("reviewed_at"),
});

export const insertRestaurantClaimSchema = createInsertSchema(restaurantClaims).omit({ id: true });
export type RestaurantClaim = typeof restaurantClaims.$inferSelect;
export type InsertRestaurantClaim = z.infer<typeof insertRestaurantClaimSchema>;

export const groupSessions = pgTable("group_sessions", {
  id: serial("id").primaryKey(),
  sessionCode: text("session_code").notNull().unique(),
  hostLineUserId: text("host_line_user_id").notNull(),
  status: text("status").default("waiting"),
  sessionType: text("session_type").default("regular"),
  sourceData: text("source_data"),
  createdAt: text("created_at").notNull(),
});

export const insertGroupSessionSchema = createInsertSchema(groupSessions).omit({ id: true });
export type GroupSession = typeof groupSessions.$inferSelect;
export type InsertGroupSession = z.infer<typeof insertGroupSessionSchema>;

export const groupSessionMembers = pgTable("group_session_members", {
  id: serial("id").primaryKey(),
  sessionCode: text("session_code").notNull(),
  lineUserId: text("line_user_id").notNull(),
  displayName: text("display_name").notNull(),
  pictureUrl: text("picture_url"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  joinedAt: text("joined_at").notNull(),
});

export const insertGroupSessionMemberSchema = createInsertSchema(groupSessionMembers).omit({ id: true });
export type GroupSessionMember = typeof groupSessionMembers.$inferSelect;
export type InsertGroupSessionMember = z.infer<typeof insertGroupSessionMemberSchema>;

export const groupSwipes = pgTable("group_swipes", {
  id: serial("id").primaryKey(),
  sessionCode: text("session_code").notNull(),
  lineUserId: text("line_user_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  direction: text("direction").notNull(),
  swipedAt: text("swiped_at").notNull(),
});

export const insertGroupSwipeSchema = createInsertSchema(groupSwipes).omit({ id: true });
export type GroupSwipe = typeof groupSwipes.$inferSelect;
export type InsertGroupSwipe = z.infer<typeof insertGroupSwipeSchema>;
