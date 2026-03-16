import { pgTable, text, serial, integer, boolean, jsonb, real, index } from "drizzle-orm/pg-core";
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
}, (table) => ({
  ownerIdIdx: index("restaurants_owner_id_idx").on(table.ownerId),
  trendingScoreIdx: index("restaurants_trending_score_idx").on(table.trendingScore),
  googlePlaceIdIdx: index("restaurants_google_place_id_idx").on(table.googlePlaceId),
}));

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({ id: true });
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  restaurantId: integer("restaurant_id").notNull(),
  preference: text("preference").notNull(),
}, (table) => ({
  userIdIdx: index("user_preferences_user_id_idx").on(table.userId),
}));
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
}, (table) => ({
  ownerKeyIdx: index("campaigns_owner_key_idx").on(table.restaurantOwnerKey),
}));

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
}, (table) => ({
  userIdIdx: index("analytics_events_user_id_idx").on(table.userId),
  eventTypeIdx: index("analytics_events_event_type_idx").on(table.eventType),
  timestampIdx: index("analytics_events_timestamp_idx").on(table.timestamp),
  restaurantIdIdx: index("analytics_events_restaurant_id_idx").on(table.restaurantId),
}));

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
  expectedMembers: integer("expected_members"),
  memberFingerprint: text("member_fingerprint"),
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
}, (table) => ({
  sessionCodeIdx: index("group_session_members_session_code_idx").on(table.sessionCode),
}));

export const insertGroupSessionMemberSchema = createInsertSchema(groupSessionMembers).omit({ id: true });
export type GroupSessionMember = typeof groupSessionMembers.$inferSelect;
export type InsertGroupSessionMember = z.infer<typeof insertGroupSessionMemberSchema>;

export const tasteDna = pgTable("taste_dna", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  comfortScore: integer("comfort_score").default(50),
  explorationScore: integer("exploration_score").default(50),
  healthyScore: integer("healthy_score").default(50),
  indulgentScore: integer("indulgent_score").default(50),
  spiceScore: integer("spice_score").default(50),
  distanceScore: integer("distance_score").default(50),
  budgetScore: integer("budget_score").default(50),
  noveltyScore: integer("novelty_score").default(50),
  speedPreferenceScore: integer("speed_preference_score").default(50),
  cuisineAffinityJson: jsonb("cuisine_affinity_json").default({}),
  cuisineDislikeJson: jsonb("cuisine_dislike_json").default({}),
  contextPatternsJson: text("context_patterns_json"),
  updatedAt: text("updated_at").notNull(),
});

export const insertTasteDnaSchema = createInsertSchema(tasteDna).omit({ id: true });
export type TasteDna = typeof tasteDna.$inferSelect;
export type InsertTasteDna = z.infer<typeof insertTasteDnaSchema>;

export const tasteContextPatterns = pgTable("taste_context_patterns", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  weekdayLunchJson: jsonb("weekday_lunch_json").default({}),
  weekdayDinnerJson: jsonb("weekday_dinner_json").default({}),
  weekendLunchJson: jsonb("weekend_lunch_json").default({}),
  weekendDinnerJson: jsonb("weekend_dinner_json").default({}),
  rainyDayJson: jsonb("rainy_day_json").default({}),
  officeAreaJson: jsonb("office_area_json").default({}),
  homeAreaJson: jsonb("home_area_json").default({}),
  updatedAt: text("updated_at").notNull(),
});

export const insertTasteContextPatternsSchema = createInsertSchema(tasteContextPatterns).omit({ id: true });
export type TasteContextPattern = typeof tasteContextPatterns.$inferSelect;
export type InsertTasteContextPattern = z.infer<typeof insertTasteContextPatternsSchema>;

export const recentMealMemory = pgTable("recent_meal_memory", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  recentCuisinesJson: jsonb("recent_cuisines_json").default([]),
  recentRestaurantsJson: jsonb("recent_restaurants_json").default([]),
  recentDishTagsJson: jsonb("recent_dish_tags_json").default([]),
  updatedAt: text("updated_at").notNull(),
});

export const insertRecentMealMemorySchema = createInsertSchema(recentMealMemory).omit({ id: true });
export type RecentMealMemory = typeof recentMealMemory.$inferSelect;
export type InsertRecentMealMemory = z.infer<typeof insertRecentMealMemorySchema>;

export const userBehaviorEvents = pgTable("user_behavior_events", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  sessionId: text("session_id"),
  eventType: text("event_type").notNull(),
  restaurantId: integer("restaurant_id"),
  cuisineTag: text("cuisine_tag"),
  cravingTag: text("craving_tag"),
  timeOfDay: text("time_of_day"),
  dayOfWeek: text("day_of_week"),
  areaLabel: text("area_label"),
  weatherLabel: text("weather_label"),
  groupSize: integer("group_size"),
  eventWeight: real("event_weight").default(1.0),
  metadataJson: jsonb("metadata_json").default({}),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  userIdIdx: index("user_behavior_events_user_id_idx").on(table.userId),
}));

export const insertUserBehaviorEventSchema = createInsertSchema(userBehaviorEvents).omit({ id: true });
export type UserBehaviorEvent = typeof userBehaviorEvents.$inferSelect;
export type InsertUserBehaviorEvent = z.infer<typeof insertUserBehaviorEventSchema>;

export const moodChoiceLinks = pgTable("mood_choice_links", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  moodTag: text("mood_tag").notNull(),
  chosenCuisine: text("chosen_cuisine"),
  chosenDishType: text("chosen_dish_type"),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  userIdIdx: index("mood_choice_links_user_id_idx").on(table.userId),
}));

export const insertMoodChoiceLinkSchema = createInsertSchema(moodChoiceLinks).omit({ id: true });
export type MoodChoiceLink = typeof moodChoiceLinks.$inferSelect;
export type InsertMoodChoiceLink = z.infer<typeof insertMoodChoiceLinkSchema>;

export const decisionSessions = pgTable("decision_sessions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  daypart: text("daypart").notNull(),
  selectedCraving: text("selected_craving"),
  selectedRefinementsJson: text("selected_refinements_json"),
  recommendationIdsJson: text("recommendation_ids_json"),
  chosenRestaurantId: integer("chosen_restaurant_id"),
  timeToDecisionMs: integer("time_to_decision_ms"),
  resultConfidence: real("result_confidence"),
  successFlag: boolean("success_flag"),
  createdAt: text("created_at").notNull(),
  endedAt: text("ended_at"),
}, (table) => ({
  userIdIdx: index("decision_sessions_user_id_idx").on(table.userId),
}));

export const insertDecisionSessionSchema = createInsertSchema(decisionSessions).omit({ id: true });
export type DecisionSession = typeof decisionSessions.$inferSelect;
export type InsertDecisionSession = z.infer<typeof insertDecisionSessionSchema>;

export const groupSwipes = pgTable("group_swipes", {
  id: serial("id").primaryKey(),
  sessionCode: text("session_code").notNull(),
  lineUserId: text("line_user_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  direction: text("direction").notNull(),
  swipedAt: text("swiped_at").notNull(),
}, (table) => ({
  sessionCodeIdx: index("group_swipes_session_code_idx").on(table.sessionCode),
  lineUserIdIdx: index("group_swipes_line_user_id_idx").on(table.lineUserId),
  sessionUserIdx: index("group_swipes_session_user_idx").on(table.sessionCode, table.lineUserId, table.menuItemId),
}));

export const insertGroupSwipeSchema = createInsertSchema(groupSwipes).omit({ id: true });
export type GroupSwipe = typeof groupSwipes.$inferSelect;
export type InsertGroupSwipe = z.infer<typeof insertGroupSwipeSchema>;

export const userSwipeStats = pgTable("user_swipe_stats", {
  id: serial("id").primaryKey(),
  lineUserId: text("line_user_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  pictureUrl: text("picture_url"),
  totalSessions: integer("total_sessions").default(0),
  totalSwipes: integer("total_swipes").default(0),
  totalLikes: integer("total_likes").default(0),
  totalDislikes: integer("total_dislikes").default(0),
  totalSuperLikes: integer("total_super_likes").default(0),
  topCategoriesJson: text("top_categories_json"),
  topRestaurantIdsJson: text("top_restaurant_ids_json"),
  updatedAt: text("updated_at").notNull(),
});

export const insertUserSwipeStatsSchema = createInsertSchema(userSwipeStats).omit({ id: true });
export type UserSwipeStats = typeof userSwipeStats.$inferSelect;
export type InsertUserSwipeStats = z.infer<typeof insertUserSwipeStatsSchema>;

export const groupComboStats = pgTable("group_combo_stats", {
  id: serial("id").primaryKey(),
  fingerprint: text("fingerprint").notNull().unique(),
  memberIdsJson: text("member_ids_json").notNull(),
  memberNamesJson: text("member_names_json").notNull(),
  totalSessions: integer("total_sessions").default(0),
  totalSwipes: integer("total_swipes").default(0),
  totalMatches: integer("total_matches").default(0),
  topCategoriesJson: text("top_categories_json"),
  topMatchedRestaurantIdsJson: text("top_matched_restaurant_ids_json"),
  lastSessionCode: text("last_session_code"),
  lastSessionAt: text("last_session_at"),
  createdAt: text("created_at").notNull(),
});

export const insertGroupComboStatsSchema = createInsertSchema(groupComboStats).omit({ id: true });
export type GroupComboStats = typeof groupComboStats.$inferSelect;
export type InsertGroupComboStats = z.infer<typeof insertGroupComboStatsSchema>;

export const sessionEvents = pgTable("session_events", {
  id: serial("id").primaryKey(),
  sessionCode: text("session_code").notNull(),
  eventType: text("event_type").notNull(),
  actorId: text("actor_id").notNull(),
  payload: jsonb("payload"),
  idempotencyKey: text("idempotency_key"),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  sessionCodeIdx: index("session_events_session_code_idx").on(table.sessionCode),
  eventTypeIdx: index("session_events_event_type_idx").on(table.eventType),
  idempotencyKeyIdx: index("session_events_idempotency_key_idx").on(table.idempotencyKey),
}));

export const insertSessionEventSchema = createInsertSchema(sessionEvents).omit({ id: true });
export type SessionEvent = typeof sessionEvents.$inferSelect;
export type InsertSessionEvent = z.infer<typeof insertSessionEventSchema>;

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  actorType: text("actor_type").notNull(),
  actorId: text("actor_id").notNull(),
  targetType: text("target_type"),
  targetId: text("target_id"),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  actorIdx: index("audit_logs_actor_idx").on(table.actorType, table.actorId),
  actionIdx: index("audit_logs_action_idx").on(table.action),
}));

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true });
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
