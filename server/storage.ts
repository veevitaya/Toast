import { db } from "./db";
import {
  restaurants,
  userPreferences,
  userProfiles,
  campaigns,
  analyticsEvents,
  adBanners,
  adminUsers,
  restaurantOwners,
  restaurantClaims,
  groupSessions,
  groupSessionMembers,
  groupSwipes,
  tasteDna,
  decisionSessions,
  type Restaurant,
  type InsertRestaurant,
  type UserPreference,
  type InsertUserPreference,
  type UserProfile,
  type InsertUserProfile,
  type Campaign,
  type InsertCampaign,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type AdBanner,
  type InsertAdBanner,
  type AdminUser,
  type InsertAdminUser,
  type RestaurantOwner,
  type InsertRestaurantOwner,
  type RestaurantClaim,
  type InsertRestaurantClaim,
  type GroupSession,
  type InsertGroupSession,
  type GroupSessionMember,
  type InsertGroupSessionMember,
  type GroupSwipe,
  type InsertGroupSwipe,
  type TasteDna,
  type InsertTasteDna,
  type DecisionSession,
  type InsertDecisionSession,
  userSwipeStats,
  groupComboStats,
  type UserSwipeStats,
  type InsertUserSwipeStats,
  type GroupComboStats,
  type InsertGroupComboStats,
  tasteContextPatterns,
  recentMealMemory,
  userBehaviorEvents,
  moodChoiceLinks,
  type TasteContextPattern,
  type InsertTasteContextPattern,
  type RecentMealMemory,
  type InsertRecentMealMemory,
  type UserBehaviorEvent,
  type InsertUserBehaviorEvent,
  type MoodChoiceLink,
  type InsertMoodChoiceLink,
  sessionEvents,
  auditLogs,
  savedLists,
  savedListItems,
  partnerConnections,
  partnerInvites,
  type SessionEvent,
  type InsertSessionEvent,
  type AuditLog,
  type InsertAuditLog,
  type SavedList,
  type InsertSavedList,
  type SavedListItem,
  type InsertSavedListItem,
  type PartnerConnection,
  type InsertPartnerConnection,
  type PartnerInvite,
  type InsertPartnerInvite,
  restaurantPromotions,
  ownerTeamMembers,
  ownerTeamInvites,
  type RestaurantPromotion,
  type InsertRestaurantPromotion,
  type OwnerTeamMember,
  type InsertOwnerTeamMember,
  type OwnerTeamInvite,
  type InsertOwnerTeamInvite,
  vibeOverrides,
  type VibeOverride,
  type InsertVibeOverride,
  vibeDefinitions,
  vibeMatchingRules,
  type VibeDefinition,
  type InsertVibeDefinition,
  type VibeMatchingRule,
  type InsertVibeMatchingRule,
  menuItems,
  type MenuItem,
  type InsertMenuItem,
} from "@shared/schema";
import { eq, desc, and, or, gte, lte, gt, inArray, count, sql } from "drizzle-orm";

export interface IStorage {
  getRestaurants(mode?: string, lat?: number, lng?: number, query?: string): Promise<Restaurant[]>;
  getRestaurantById(id: number): Promise<Restaurant | undefined>;
  getSuggestions(): Promise<Restaurant[]>;
  getUserEvents(userId: string, limit?: number): Promise<AnalyticsEvent[]>;
  createPreference(pref: InsertUserPreference): Promise<UserPreference>;
  seedRestaurants(data: InsertRestaurant[]): Promise<void>;
  addRestaurant(data: InsertRestaurant): Promise<Restaurant>;
  getProfile(lineUserId: string): Promise<UserProfile | undefined>;
  upsertProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateProfile(lineUserId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  getAllProfiles(): Promise<UserProfile[]>;
  getPreferences(): Promise<UserPreference[]>;
  getRestaurantCount(): Promise<number>;
  getUserCount(): Promise<number>;
  updateRestaurant(id: number, updates: Partial<InsertRestaurant>): Promise<Restaurant | undefined>;
  deleteRestaurant(id: number): Promise<void>;

  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaigns(): Promise<Campaign[]>;
  getCampaignById(id: number): Promise<Campaign | undefined>;
  getCampaignsByOwner(ownerKey: string): Promise<Campaign[]>;
  updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<void>;

  logEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getEvents(filters?: { eventType?: string; userId?: string; restaurantId?: number; since?: string; until?: string }): Promise<AnalyticsEvent[]>;
  getEventCounts(eventType?: string, since?: string): Promise<number>;
  getTopRestaurantsByEvent(eventType: string, limit: number): Promise<{ restaurantId: number; count: number }[]>;

  createBanner(banner: InsertAdBanner): Promise<AdBanner>;
  getBanners(activeOnly?: boolean): Promise<AdBanner[]>;
  updateBanner(id: number, updates: Partial<InsertAdBanner>): Promise<AdBanner | undefined>;
  deleteBanner(id: number): Promise<void>;
  incrementBannerImpressions(id: number): Promise<void>;
  incrementBannerClicks(id: number): Promise<void>;

  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  getAdminUser(username: string): Promise<AdminUser | undefined>;
  getAdminUserById(id: number): Promise<AdminUser | undefined>;
  getAllAdminUsers(): Promise<AdminUser[]>;
  updateAdminUser(id: number, updates: Partial<InsertAdminUser>): Promise<AdminUser | undefined>;

  createRestaurantOwner(owner: InsertRestaurantOwner): Promise<RestaurantOwner>;
  getRestaurantOwnerByEmail(email: string): Promise<RestaurantOwner | undefined>;
  getRestaurantOwnerById(id: number): Promise<RestaurantOwner | undefined>;
  getRestaurantOwnerByRestaurantId(restaurantId: number): Promise<RestaurantOwner | undefined>;
  getAllRestaurantOwners(): Promise<RestaurantOwner[]>;
  updateRestaurantOwner(id: number, updates: Partial<InsertRestaurantOwner>): Promise<RestaurantOwner | undefined>;

  createRestaurantClaim(claim: InsertRestaurantClaim): Promise<RestaurantClaim>;
  getRestaurantClaims(status?: string): Promise<RestaurantClaim[]>;
  getRestaurantClaimById(id: number): Promise<RestaurantClaim | undefined>;
  updateRestaurantClaim(id: number, updates: Partial<InsertRestaurantClaim>): Promise<RestaurantClaim | undefined>;

  createGroupSession(session: InsertGroupSession): Promise<GroupSession>;
  getGroupSession(sessionCode: string): Promise<GroupSession | undefined>;
  updateGroupSessionStatus(sessionCode: string, status: string): Promise<void>;
  addGroupMember(member: InsertGroupSessionMember): Promise<GroupSessionMember>;
  getGroupMembers(sessionCode: string): Promise<GroupSessionMember[]>;
  isGroupMember(sessionCode: string, lineUserId: string): Promise<boolean>;
  updateMemberLocation(sessionCode: string, lineUserId: string, latitude: string, longitude: string): Promise<void>;
  recordGroupSwipe(swipe: InsertGroupSwipe): Promise<GroupSwipe>;
  getGroupSwipes(sessionCode: string): Promise<GroupSwipe[]>;
  getGroupMatches(sessionCode: string, swipeType?: string): Promise<{ menuItemId: number; voters: string[] }[]>;
  getPopularRestaurants(days: number, limit: number): Promise<{ restaurantId: number; score: number }[]>;
  getRestaurantsByVibe(vibe: string): Promise<Restaurant[]>;
  getRestaurantByGooglePlaceId(placeId: string): Promise<Restaurant | undefined>;
  getRestaurantsForSwipe(filters?: { vibes?: string[]; priceLevel?: number[]; category?: string; district?: string; limit?: number }): Promise<Restaurant[]>;

  getTasteDna(userId: string): Promise<TasteDna | undefined>;
  upsertTasteDna(data: InsertTasteDna): Promise<TasteDna>;

  createDecisionSession(data: InsertDecisionSession): Promise<DecisionSession>;
  getRecentDecisionSessions(userId: string, limit?: number): Promise<DecisionSession[]>;
  updateDecisionSession(id: number, updates: Partial<InsertDecisionSession>): Promise<void>;

  updateGroupSessionFingerprint(sessionCode: string, fingerprint: string): Promise<void>;
  getSessionsByFingerprint(fingerprint: string): Promise<GroupSession[]>;
  upsertUserSwipeStats(stats: InsertUserSwipeStats): Promise<UserSwipeStats>;
  getUserSwipeStats(lineUserId: string): Promise<UserSwipeStats | undefined>;
  upsertGroupComboStats(stats: InsertGroupComboStats): Promise<GroupComboStats>;
  getGroupComboStats(fingerprint: string): Promise<GroupComboStats | undefined>;
  getGroupCombosByUser(lineUserId: string): Promise<GroupComboStats[]>;
  getAllSwipesForUser(lineUserId: string): Promise<GroupSwipe[]>;

  getContextPatterns(userId: string): Promise<TasteContextPattern | undefined>;
  upsertContextPatterns(userId: string, data: Partial<InsertTasteContextPattern>): Promise<TasteContextPattern>;
  getRecentMealMemory(userId: string): Promise<RecentMealMemory | undefined>;
  upsertRecentMealMemory(userId: string, data: Partial<InsertRecentMealMemory>): Promise<RecentMealMemory>;
  logBehaviorEvent(event: InsertUserBehaviorEvent): Promise<UserBehaviorEvent>;
  getUserBehaviorEvents(userId: string, limit?: number): Promise<UserBehaviorEvent[]>;
  createMoodChoiceLink(link: InsertMoodChoiceLink): Promise<MoodChoiceLink>;
  getMoodChoiceLinks(userId: string, limit?: number): Promise<MoodChoiceLink[]>;
  createSessionEvent(event: InsertSessionEvent): Promise<SessionEvent>;
  getSessionEvents(sessionCode: string): Promise<SessionEvent[]>;
  checkIdempotencyKey(key: string): Promise<boolean>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(filters?: { actorType?: string; action?: string; limit?: number }): Promise<AuditLog[]>;

  getMenuItems(category?: string): Promise<import("@shared/schema").MenuItem[]>;
  getMenuItemById(id: number): Promise<import("@shared/schema").MenuItem | undefined>;
  seedMenuItems(data: import("@shared/schema").InsertMenuItem[]): Promise<void>;
  incrementMenuItemSwipeRight(id: number): Promise<void>;
  getTrendingMenuItems(limit?: number): Promise<import("@shared/schema").MenuItem[]>;
  getHotRestaurants(days: number, limit: number): Promise<{ restaurantId: number; score: number }[]>;

  getSavedLists(userId: string): Promise<SavedList[]>;
  createSavedList(data: InsertSavedList): Promise<SavedList>;
  updateSavedList(id: number, updates: Partial<InsertSavedList>): Promise<SavedList | undefined>;
  deleteSavedList(id: number): Promise<void>;
  getSavedListItems(listId: number, offset?: number, limit?: number): Promise<SavedListItem[]>;
  addSavedListItem(data: InsertSavedListItem): Promise<SavedListItem>;
  removeSavedListItem(listId: number, restaurantId: number): Promise<void>;
  getOrCreateDefaultLists(userId: string): Promise<{ mine: SavedList; partner: SavedList }>;
  getSavedListsWithItems(userId: string): Promise<(SavedList & { items: SavedListItem[] })[]>;

  createPartnerInvite(invite: InsertPartnerInvite): Promise<PartnerInvite>;
  getPartnerInviteByToken(token: string): Promise<PartnerInvite | undefined>;
  getPartnerInviteByNonce(nonce: string): Promise<PartnerInvite | undefined>;
  updatePartnerInvite(id: number, updates: Partial<InsertPartnerInvite>): Promise<PartnerInvite | undefined>;
  claimPartnerInvite(id: number, redeemedBy: string): Promise<PartnerInvite | undefined>;
  getPendingPartnerInvites(fromUserId: string): Promise<PartnerInvite[]>;

  createPartnerConnection(conn: InsertPartnerConnection): Promise<PartnerConnection>;
  getActivePartnerConnection(lineUserId: string): Promise<PartnerConnection | undefined>;
  disconnectPartner(connectionId: number): Promise<void>;
  updatePartnerConnection(id: number, updates: Partial<InsertPartnerConnection>): Promise<PartnerConnection | undefined>;

  getActiveSessionForUser(lineUserId: string): Promise<(GroupSession & { members: GroupSessionMember[] }) | null>;
  updateGroupSessionLocation(sessionCode: string, locationName: string | null, locationLat: string | null, locationLng: string | null): Promise<void>;

  createRestaurantPromotion(promo: InsertRestaurantPromotion): Promise<RestaurantPromotion>;
  getRestaurantPromotionsByOwner(ownerId: number): Promise<RestaurantPromotion[]>;
  getRestaurantPromotionById(id: number): Promise<RestaurantPromotion | undefined>;
  getAllActivePromotions(): Promise<RestaurantPromotion[]>;
  updateRestaurantPromotion(id: number, updates: Partial<InsertRestaurantPromotion>): Promise<RestaurantPromotion | undefined>;
  deleteRestaurantPromotion(id: number): Promise<void>;
  getActivePromotionsByRestaurant(restaurantId: number): Promise<RestaurantPromotion[]>;

  createOwnerTeamMember(member: InsertOwnerTeamMember): Promise<OwnerTeamMember>;
  getOwnerTeamMembers(ownerId: number): Promise<OwnerTeamMember[]>;
  getOwnerTeamMemberByToken(token: string): Promise<OwnerTeamMember | undefined>;
  getOwnerTeamMemberByEmail(ownerId: number, email: string): Promise<OwnerTeamMember | undefined>;
  updateOwnerTeamMember(id: number, updates: Partial<InsertOwnerTeamMember>): Promise<OwnerTeamMember | undefined>;
  deleteOwnerTeamMember(id: number): Promise<void>;

  createOwnerTeamInvite(invite: InsertOwnerTeamInvite): Promise<OwnerTeamInvite>;
  getOwnerTeamInviteByToken(token: string): Promise<OwnerTeamInvite | undefined>;
  getOwnerTeamInvitesByOwner(ownerId: number): Promise<OwnerTeamInvite[]>;
  updateOwnerTeamInvite(id: number, updates: Partial<InsertOwnerTeamInvite>): Promise<OwnerTeamInvite | undefined>;

  getVibeOverrides(restaurantId: number): Promise<VibeOverride[]>;
  getAllVibeOverrides(): Promise<VibeOverride[]>;
  upsertVibeOverride(override: InsertVibeOverride): Promise<VibeOverride>;
  deleteVibeOverride(id: number): Promise<void>;
  updateAllRestaurantVibes(): Promise<{ updated: number; details: { id: number; name: string; oldVibes: string[]; newVibes: string[] }[] }>;

  getVibeDefinitions(): Promise<VibeDefinition[]>;
  getVibeMatchingRules(vibe?: string): Promise<VibeMatchingRule[]>;
  seedVibeDefinitionsAndRules(): Promise<{ definitionsSeeded: number; rulesSeeded: number }>;
  getRestaurantsByVibeStructured(vibe: string, limit: number): Promise<(Restaurant & { vibeMatch: number; matchReasons?: string[] })[]>;
  evaluateVibesFromDB(r: { category: string; priceLevel: number; address: string; operatingHours?: string | null; description?: string }): Promise<{ vibe: string; matched: boolean; reasons: string[] }[]>;
  assignVibesFromDB(r: { category: string; priceLevel: number; address: string; operatingHours?: string | null; description?: string }): Promise<string[]>;
}

const MAX_CACHE_ENTRIES = 200;
const memCache = new Map<string, { data: any; expiry: number }>();
function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const entry = memCache.get(key);
  if (entry && entry.expiry > now) return Promise.resolve(entry.data as T);
  return fn().then(data => {
    if (memCache.size >= MAX_CACHE_ENTRIES) {
      let oldestKey: string | null = null;
      let oldestExpiry = Infinity;
      for (const [k, v] of memCache) {
        if (v.expiry < oldestExpiry) { oldestExpiry = v.expiry; oldestKey = k; }
      }
      if (oldestKey) memCache.delete(oldestKey);
    }
    memCache.set(key, { data, expiry: now + ttlMs });
    return data;
  });
}
function invalidateCache(prefix: string) {
  for (const key of memCache.keys()) {
    if (key.startsWith(prefix)) memCache.delete(key);
  }
}

export class DatabaseStorage implements IStorage {
  async getRestaurants(mode?: string, lat?: number, lng?: number, query?: string): Promise<Restaurant[]> {
    const cacheKey = `restaurants:list:${mode || ''}:${query || ''}`;
    return cached(cacheKey, 30000, async () => {
      let queryBuilder = db.select().from(restaurants);
      return await queryBuilder.orderBy(desc(restaurants.id));
    });
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
    return restaurant;
  }

  async getSuggestions(): Promise<Restaurant[]> {
    return await db.select().from(restaurants).limit(10);
  }

  async getUserEvents(userId: string, limit: number = 200): Promise<AnalyticsEvent[]> {
    return await db.select().from(analyticsEvents)
      .where(eq(analyticsEvents.userId, userId))
      .orderBy(desc(analyticsEvents.id))
      .limit(limit);
  }

  async createPreference(pref: InsertUserPreference): Promise<UserPreference> {
    const [preference] = await db.insert(userPreferences).values(pref).returning();
    return preference;
  }

  async seedRestaurants(data: InsertRestaurant[]): Promise<void> {
    await db.delete(restaurants);
    if (data.length > 0) {
      const batchSize = 50;
      for (let i = 0; i < data.length; i += batchSize) {
        await db.insert(restaurants).values(data.slice(i, i + batchSize));
      }
    }
    invalidateCache("restaurants:");
  }

  async addRestaurant(data: InsertRestaurant): Promise<Restaurant> {
    const [restaurant] = await db.insert(restaurants).values(data).returning();
    invalidateCache("restaurants:");
    return restaurant;
  }

  async getProfile(lineUserId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.lineUserId, lineUserId)).limit(1);
    return profile;
  }

  async upsertProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const existing = await this.getProfile(profile.lineUserId);
    if (existing) {
      const [updated] = await db.update(userProfiles)
        .set(profile)
        .where(eq(userProfiles.lineUserId, profile.lineUserId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userProfiles).values(profile).returning();
    invalidateCache("users:");
    return created;
  }

  async updateProfile(lineUserId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [updated] = await db.update(userProfiles)
      .set(updates)
      .where(eq(userProfiles.lineUserId, lineUserId))
      .returning();
    return updated;
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    return await db.select().from(userProfiles).orderBy(desc(userProfiles.id));
  }

  async getPreferences(): Promise<UserPreference[]> {
    return await db.select().from(userPreferences).orderBy(desc(userPreferences.id));
  }

  async getRestaurantCount(): Promise<number> {
    return cached("restaurants:count", 60000, async () => {
      const [result] = await db.select({ count: count() }).from(restaurants);
      return result.count;
    });
  }

  async getUserCount(): Promise<number> {
    return cached("users:count", 60000, async () => {
      const [result] = await db.select({ count: count() }).from(userProfiles);
      return result.count;
    });
  }

  async updateRestaurant(id: number, updates: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const [updated] = await db.update(restaurants).set(updates).where(eq(restaurants.id, id)).returning();
    invalidateCache("restaurants:");
    return updated;
  }

  async deleteRestaurant(id: number): Promise<void> {
    await db.delete(restaurants).where(eq(restaurants.id, id));
    invalidateCache("restaurants:");
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [created] = await db.insert(campaigns).values(campaign).returning();
    return created;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).orderBy(desc(campaigns.id));
  }

  async getCampaignById(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async getCampaignsByOwner(ownerKey: string): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.restaurantOwnerKey, ownerKey)).orderBy(desc(campaigns.id));
  }

  async updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const [updated] = await db.update(campaigns).set(updates).where(eq(campaigns.id, id)).returning();
    return updated;
  }

  async deleteCampaign(id: number): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  async logEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [created] = await db.insert(analyticsEvents).values(event).returning();
    return created;
  }

  async getEvents(filters?: { eventType?: string; userId?: string; restaurantId?: number; since?: string; until?: string }): Promise<AnalyticsEvent[]> {
    const conditions = [];
    if (filters?.eventType) conditions.push(eq(analyticsEvents.eventType, filters.eventType));
    if (filters?.userId) conditions.push(eq(analyticsEvents.userId, filters.userId));
    if (filters?.restaurantId) conditions.push(eq(analyticsEvents.restaurantId, filters.restaurantId));
    if (filters?.since) conditions.push(gte(analyticsEvents.timestamp, filters.since));
    if (filters?.until) conditions.push(lte(analyticsEvents.timestamp, filters.until));

    if (conditions.length > 0) {
      return await db.select().from(analyticsEvents).where(and(...conditions)).orderBy(desc(analyticsEvents.id)).limit(500);
    }
    return await db.select().from(analyticsEvents).orderBy(desc(analyticsEvents.id)).limit(500);
  }

  async getEventCounts(eventType?: string, since?: string): Promise<number> {
    const conditions = [];
    if (eventType) conditions.push(eq(analyticsEvents.eventType, eventType));
    if (since) conditions.push(gte(analyticsEvents.timestamp, since));

    if (conditions.length > 0) {
      const [result] = await db.select({ count: count() }).from(analyticsEvents).where(and(...conditions));
      return result.count;
    }
    const [result] = await db.select({ count: count() }).from(analyticsEvents);
    return result.count;
  }

  async getTopRestaurantsByEvent(eventType: string, limit: number): Promise<{ restaurantId: number; count: number }[]> {
    const results = await db
      .select({
        restaurantId: analyticsEvents.restaurantId,
        count: count(),
      })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.eventType, eventType))
      .groupBy(analyticsEvents.restaurantId)
      .orderBy(desc(count()))
      .limit(limit);
    return results.map(r => ({ restaurantId: r.restaurantId!, count: r.count }));
  }

  async createBanner(banner: InsertAdBanner): Promise<AdBanner> {
    const [created] = await db.insert(adBanners).values(banner).returning();
    return created;
  }

  async getBanners(activeOnly?: boolean): Promise<AdBanner[]> {
    if (activeOnly) {
      return await db.select().from(adBanners).where(eq(adBanners.isActive, true)).orderBy(desc(adBanners.id));
    }
    return await db.select().from(adBanners).orderBy(desc(adBanners.id));
  }

  async updateBanner(id: number, updates: Partial<InsertAdBanner>): Promise<AdBanner | undefined> {
    const [updated] = await db.update(adBanners).set(updates).where(eq(adBanners.id, id)).returning();
    return updated;
  }

  async deleteBanner(id: number): Promise<void> {
    await db.delete(adBanners).where(eq(adBanners.id, id));
  }

  async incrementBannerImpressions(id: number): Promise<void> {
    await db.update(adBanners).set({ impressions: sql`${adBanners.impressions} + 1` }).where(eq(adBanners.id, id));
  }

  async incrementBannerClicks(id: number): Promise<void> {
    await db.update(adBanners).set({ clicks: sql`${adBanners.clicks} + 1` }).where(eq(adBanners.id, id));
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [created] = await db.insert(adminUsers).values(user).returning();
    return created;
  }

  async getAdminUser(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
    return user;
  }

  async getAdminUserById(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
    return user;
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers).orderBy(desc(adminUsers.id));
  }

  async updateAdminUser(id: number, updates: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    const [updated] = await db.update(adminUsers).set(updates).where(eq(adminUsers.id, id)).returning();
    return updated;
  }

  async createRestaurantOwner(owner: InsertRestaurantOwner): Promise<RestaurantOwner> {
    const [created] = await db.insert(restaurantOwners).values(owner).returning();
    return created;
  }

  async getRestaurantOwnerByEmail(email: string): Promise<RestaurantOwner | undefined> {
    const [owner] = await db.select().from(restaurantOwners).where(eq(restaurantOwners.email, email)).limit(1);
    return owner;
  }

  async getRestaurantOwnerById(id: number): Promise<RestaurantOwner | undefined> {
    const [owner] = await db.select().from(restaurantOwners).where(eq(restaurantOwners.id, id)).limit(1);
    return owner;
  }

  async getRestaurantOwnerByRestaurantId(restaurantId: number): Promise<RestaurantOwner | undefined> {
    const [owner] = await db.select().from(restaurantOwners).where(eq(restaurantOwners.restaurantId, restaurantId)).limit(1);
    return owner;
  }

  async getAllRestaurantOwners(): Promise<RestaurantOwner[]> {
    return await db.select().from(restaurantOwners).orderBy(desc(restaurantOwners.id));
  }

  async updateRestaurantOwner(id: number, updates: Partial<InsertRestaurantOwner>): Promise<RestaurantOwner | undefined> {
    const [updated] = await db.update(restaurantOwners).set(updates).where(eq(restaurantOwners.id, id)).returning();
    return updated;
  }

  async createRestaurantClaim(claim: InsertRestaurantClaim): Promise<RestaurantClaim> {
    const [created] = await db.insert(restaurantClaims).values(claim).returning();
    return created;
  }

  async getRestaurantClaims(status?: string): Promise<RestaurantClaim[]> {
    if (status) {
      return await db.select().from(restaurantClaims).where(eq(restaurantClaims.status, status)).orderBy(desc(restaurantClaims.id));
    }
    return await db.select().from(restaurantClaims).orderBy(desc(restaurantClaims.id));
  }

  async getRestaurantClaimById(id: number): Promise<RestaurantClaim | undefined> {
    const [claim] = await db.select().from(restaurantClaims).where(eq(restaurantClaims.id, id)).limit(1);
    return claim;
  }

  async updateRestaurantClaim(id: number, updates: Partial<InsertRestaurantClaim>): Promise<RestaurantClaim | undefined> {
    const [updated] = await db.update(restaurantClaims).set(updates).where(eq(restaurantClaims.id, id)).returning();
    return updated;
  }

  async createGroupSession(session: InsertGroupSession): Promise<GroupSession> {
    const [created] = await db.insert(groupSessions).values(session).returning();
    return created;
  }

  async getGroupSession(sessionCode: string): Promise<GroupSession | undefined> {
    const [session] = await db.select().from(groupSessions).where(eq(groupSessions.sessionCode, sessionCode)).limit(1);
    return session;
  }

  async updateGroupSessionStatus(sessionCode: string, status: string): Promise<void> {
    await db.update(groupSessions).set({ status }).where(eq(groupSessions.sessionCode, sessionCode));
  }

  async addGroupMember(member: InsertGroupSessionMember): Promise<GroupSessionMember> {
    const [created] = await db.insert(groupSessionMembers).values(member).returning();
    return created;
  }

  async getGroupMembers(sessionCode: string): Promise<GroupSessionMember[]> {
    return await db.select().from(groupSessionMembers).where(eq(groupSessionMembers.sessionCode, sessionCode)).orderBy(groupSessionMembers.id);
  }

  async isGroupMember(sessionCode: string, lineUserId: string): Promise<boolean> {
    const [member] = await db.select().from(groupSessionMembers)
      .where(and(eq(groupSessionMembers.sessionCode, sessionCode), eq(groupSessionMembers.lineUserId, lineUserId)))
      .limit(1);
    return !!member;
  }

  async updateMemberLocation(sessionCode: string, lineUserId: string, latitude: string, longitude: string): Promise<void> {
    await db.update(groupSessionMembers)
      .set({ latitude, longitude })
      .where(and(eq(groupSessionMembers.sessionCode, sessionCode), eq(groupSessionMembers.lineUserId, lineUserId)));
  }

  async recordGroupSwipe(swipe: InsertGroupSwipe): Promise<GroupSwipe> {
    const swipeType = swipe.swipeType || 'restaurant';
    const [existing] = await db.select().from(groupSwipes)
      .where(and(
        eq(groupSwipes.sessionCode, swipe.sessionCode),
        eq(groupSwipes.lineUserId, swipe.lineUserId),
        eq(groupSwipes.menuItemId, swipe.menuItemId),
        eq(groupSwipes.swipeType, swipeType)
      ))
      .limit(1);

    if (existing) {
      const [updated] = await db.update(groupSwipes)
        .set({ direction: swipe.direction, swipedAt: swipe.swipedAt, swipeType })
        .where(eq(groupSwipes.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db.insert(groupSwipes).values({ ...swipe, swipeType }).returning();
    return created;
  }

  async getGroupSwipes(sessionCode: string): Promise<GroupSwipe[]> {
    return await db.select().from(groupSwipes).where(eq(groupSwipes.sessionCode, sessionCode)).orderBy(groupSwipes.id);
  }

  async getGroupMatches(sessionCode: string, swipeType?: string): Promise<{ menuItemId: number; voters: string[] }[]> {
    const members = await this.getGroupMembers(sessionCode);
    const memberCount = members.length;
    if (memberCount === 0) return [];

    const conditions = [
      eq(groupSwipes.sessionCode, sessionCode),
      sql`${groupSwipes.direction} IN ('right', 'super')`,
    ];
    if (swipeType) {
      conditions.push(eq(groupSwipes.swipeType, swipeType));
    }

    const results = await db.select({
      menuItemId: groupSwipes.menuItemId,
      voters: sql<string>`array_agg(DISTINCT ${groupSwipes.lineUserId})`,
      voterCount: sql<number>`count(DISTINCT ${groupSwipes.lineUserId})`,
    })
      .from(groupSwipes)
      .where(and(...conditions))
      .groupBy(groupSwipes.menuItemId)
      .having(sql`count(DISTINCT ${groupSwipes.lineUserId}) >= ${memberCount}`);

    return results.map(r => ({
      menuItemId: r.menuItemId,
      voters: Array.isArray(r.voters) ? r.voters : String(r.voters).replace(/[{}]/g, '').split(',').filter(Boolean),
    }));
  }

  async getPopularRestaurants(days: number, limit: number): Promise<{ restaurantId: number; score: number }[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const results = await db
      .select({
        restaurantId: analyticsEvents.restaurantId,
        score: sql<number>`SUM(CASE
          WHEN ${analyticsEvents.eventType} = 'save' THEN 3
          WHEN ${analyticsEvents.eventType} = 'swipe_right' THEN 2
          WHEN ${analyticsEvents.eventType} = 'view_detail' THEN 1
          ELSE 0
        END)`.as("score"),
      })
      .from(analyticsEvents)
      .where(and(
        gte(analyticsEvents.timestamp, since),
        sql`${analyticsEvents.restaurantId} IS NOT NULL`,
        sql`${analyticsEvents.eventType} IN ('save', 'swipe_right', 'view_detail')`
      ))
      .groupBy(analyticsEvents.restaurantId)
      .orderBy(sql`score DESC`)
      .limit(limit);

    return results
      .filter(r => r.restaurantId !== null)
      .map(r => ({ restaurantId: r.restaurantId!, score: Number(r.score) }));
  }

  async getRestaurantsByVibe(vibe: string): Promise<Restaurant[]> {
    return await db.select().from(restaurants)
      .where(sql`${restaurants.vibes} @> ARRAY[${vibe}]::text[]`)
      .orderBy(desc(restaurants.trendingScore));
  }

  async getRestaurantByGooglePlaceId(placeId: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants)
      .where(eq(restaurants.googlePlaceId, placeId))
      .limit(1);
    return restaurant;
  }

  async getRestaurantsForSwipe(filters?: {
    vibes?: string[];
    priceLevel?: number[];
    category?: string;
    district?: string;
    limit?: number;
  }): Promise<Restaurant[]> {
    const conditions: any[] = [];

    if (filters?.vibes && filters.vibes.length > 0) {
      const vibeConditions = filters.vibes.map(v =>
        sql`${restaurants.vibes} @> ARRAY[${v}]::text[]`
      );
      conditions.push(sql`(${sql.join(vibeConditions, sql` OR `)})`);
    }

    if (filters?.priceLevel && filters.priceLevel.length > 0) {
      const pricePlaceholders = filters.priceLevel.map(p => sql`${p}`);
      conditions.push(sql`${restaurants.priceLevel} IN (${sql.join(pricePlaceholders, sql`, `)})`);
    }

    if (filters?.category) {
      conditions.push(sql`LOWER(${restaurants.category}) LIKE ${'%' + filters.category.toLowerCase() + '%'}`);
    }

    if (filters?.district) {
      conditions.push(eq(restaurants.district, filters.district));
    }

    const limit = filters?.limit || 50;

    if (conditions.length === 0) {
      return await db.select().from(restaurants)
        .orderBy(desc(restaurants.trendingScore))
        .limit(limit);
    }

    return await db.select().from(restaurants)
      .where(sql`${sql.join(conditions, sql` AND `)}`)
      .orderBy(desc(restaurants.trendingScore))
      .limit(limit);
  }
  async getTasteDna(userId: string): Promise<TasteDna | undefined> {
    const [row] = await db.select().from(tasteDna).where(eq(tasteDna.userId, userId)).limit(1);
    return row;
  }

  async upsertTasteDna(data: InsertTasteDna): Promise<TasteDna> {
    const existing = await this.getTasteDna(data.userId);
    if (existing) {
      const [updated] = await db.update(tasteDna)
        .set({ ...data })
        .where(eq(tasteDna.userId, data.userId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(tasteDna).values(data).returning();
    return created;
  }

  async createDecisionSession(data: InsertDecisionSession): Promise<DecisionSession> {
    const [created] = await db.insert(decisionSessions).values(data).returning();
    return created;
  }

  async getRecentDecisionSessions(userId: string, limit = 20): Promise<DecisionSession[]> {
    return await db.select().from(decisionSessions)
      .where(eq(decisionSessions.userId, userId))
      .orderBy(desc(decisionSessions.id))
      .limit(limit);
  }

  async updateDecisionSession(id: number, updates: Partial<InsertDecisionSession>): Promise<void> {
    await db.update(decisionSessions).set(updates).where(eq(decisionSessions.id, id));
  }

  async updateGroupSessionFingerprint(sessionCode: string, fingerprint: string): Promise<void> {
    await db.update(groupSessions).set({ memberFingerprint: fingerprint }).where(eq(groupSessions.sessionCode, sessionCode));
  }

  async getSessionsByFingerprint(fingerprint: string): Promise<GroupSession[]> {
    return await db.select().from(groupSessions)
      .where(eq(groupSessions.memberFingerprint, fingerprint))
      .orderBy(desc(groupSessions.id));
  }

  async upsertUserSwipeStats(stats: InsertUserSwipeStats): Promise<UserSwipeStats> {
    const existing = await this.getUserSwipeStats(stats.lineUserId);
    if (existing) {
      const [updated] = await db.update(userSwipeStats)
        .set(stats)
        .where(eq(userSwipeStats.lineUserId, stats.lineUserId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userSwipeStats).values(stats).returning();
    return created;
  }

  async getUserSwipeStats(lineUserId: string): Promise<UserSwipeStats | undefined> {
    const [stats] = await db.select().from(userSwipeStats)
      .where(eq(userSwipeStats.lineUserId, lineUserId)).limit(1);
    return stats;
  }

  async upsertGroupComboStats(stats: InsertGroupComboStats): Promise<GroupComboStats> {
    const existing = await this.getGroupComboStats(stats.fingerprint);
    if (existing) {
      const [updated] = await db.update(groupComboStats)
        .set(stats)
        .where(eq(groupComboStats.fingerprint, stats.fingerprint))
        .returning();
      return updated;
    }
    const [created] = await db.insert(groupComboStats).values(stats).returning();
    return created;
  }

  async getGroupComboStats(fingerprint: string): Promise<GroupComboStats | undefined> {
    const [stats] = await db.select().from(groupComboStats)
      .where(eq(groupComboStats.fingerprint, fingerprint)).limit(1);
    return stats;
  }

  async getGroupCombosByUser(lineUserId: string): Promise<GroupComboStats[]> {
    return await db.select().from(groupComboStats)
      .where(sql`${groupComboStats.memberIdsJson}::jsonb @> ${JSON.stringify([lineUserId])}::jsonb`)
      .orderBy(desc(groupComboStats.id));
  }

  async getAllSwipesForUser(lineUserId: string): Promise<GroupSwipe[]> {
    return await db.select().from(groupSwipes)
      .where(eq(groupSwipes.lineUserId, lineUserId))
      .orderBy(desc(groupSwipes.id));
  }

  async getContextPatterns(userId: string): Promise<TasteContextPattern | undefined> {
    const [pattern] = await db.select().from(tasteContextPatterns)
      .where(eq(tasteContextPatterns.userId, userId)).limit(1);
    return pattern;
  }

  async upsertContextPatterns(userId: string, data: Partial<InsertTasteContextPattern>): Promise<TasteContextPattern> {
    const existing = await this.getContextPatterns(userId);
    if (existing) {
      const [updated] = await db.update(tasteContextPatterns)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(tasteContextPatterns.userId, userId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(tasteContextPatterns)
      .values({ userId, updatedAt: new Date().toISOString(), ...data } as any)
      .returning();
    return created;
  }

  async getRecentMealMemory(userId: string): Promise<RecentMealMemory | undefined> {
    const [memory] = await db.select().from(recentMealMemory)
      .where(eq(recentMealMemory.userId, userId)).limit(1);
    return memory;
  }

  async upsertRecentMealMemory(userId: string, data: Partial<InsertRecentMealMemory>): Promise<RecentMealMemory> {
    const existing = await this.getRecentMealMemory(userId);
    if (existing) {
      const [updated] = await db.update(recentMealMemory)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(recentMealMemory.userId, userId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(recentMealMemory)
      .values({ userId, updatedAt: new Date().toISOString(), ...data } as any)
      .returning();
    return created;
  }

  async logBehaviorEvent(event: InsertUserBehaviorEvent): Promise<UserBehaviorEvent> {
    const [created] = await db.insert(userBehaviorEvents).values(event).returning();
    return created;
  }

  async getUserBehaviorEvents(userId: string, limit: number = 200): Promise<UserBehaviorEvent[]> {
    return await db.select().from(userBehaviorEvents)
      .where(eq(userBehaviorEvents.userId, userId))
      .orderBy(desc(userBehaviorEvents.id))
      .limit(limit);
  }

  async createMoodChoiceLink(link: InsertMoodChoiceLink): Promise<MoodChoiceLink> {
    const [created] = await db.insert(moodChoiceLinks).values(link).returning();
    return created;
  }

  async getMoodChoiceLinks(userId: string, limit: number = 50): Promise<MoodChoiceLink[]> {
    return await db.select().from(moodChoiceLinks)
      .where(eq(moodChoiceLinks.userId, userId))
      .orderBy(desc(moodChoiceLinks.id))
      .limit(limit);
  }

  async createSessionEvent(event: InsertSessionEvent): Promise<SessionEvent> {
    const [created] = await db.insert(sessionEvents).values(event).returning();
    return created;
  }

  async getSessionEvents(sessionCode: string): Promise<SessionEvent[]> {
    return await db.select().from(sessionEvents)
      .where(eq(sessionEvents.sessionCode, sessionCode))
      .orderBy(desc(sessionEvents.id));
  }

  async checkIdempotencyKey(key: string): Promise<boolean> {
    const rows = await db.select({ id: sessionEvents.id }).from(sessionEvents)
      .where(eq(sessionEvents.idempotencyKey, key))
      .limit(1);
    return rows.length > 0;
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [created] = await db.insert(auditLogs).values(log).returning();
    return created;
  }

  async getAuditLogs(filters?: { actorType?: string; action?: string; limit?: number }): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs);
    const conditions = [];
    if (filters?.actorType) conditions.push(eq(auditLogs.actorType, filters.actorType));
    if (filters?.action) conditions.push(eq(auditLogs.action, filters.action));
    if (conditions.length > 0) query = query.where(and(...conditions)) as any;
    return await (query as any).orderBy(desc(auditLogs.id)).limit(filters?.limit || 100);
  }

  async getSavedLists(userId: string): Promise<SavedList[]> {
    return await db.select().from(savedLists)
      .where(eq(savedLists.userId, userId))
      .orderBy(savedLists.id);
  }

  async createSavedList(data: InsertSavedList): Promise<SavedList> {
    const [created] = await db.insert(savedLists).values(data).returning();
    return created;
  }

  async updateSavedList(id: number, updates: Partial<InsertSavedList>): Promise<SavedList | undefined> {
    const [updated] = await db.update(savedLists)
      .set(updates)
      .where(eq(savedLists.id, id))
      .returning();
    return updated;
  }

  async deleteSavedList(id: number): Promise<void> {
    await db.delete(savedListItems).where(eq(savedListItems.listId, id));
    await db.delete(savedLists).where(eq(savedLists.id, id));
  }

  async getSavedListItems(listId: number, offset?: number, limit?: number): Promise<SavedListItem[]> {
    let query = db.select().from(savedListItems)
      .where(eq(savedListItems.listId, listId))
      .orderBy(desc(savedListItems.id));
    if (typeof offset === "number" && offset > 0) query = query.offset(offset) as typeof query;
    if (typeof limit === "number" && limit > 0) query = query.limit(limit) as typeof query;
    return await query;
  }

  async addSavedListItem(data: InsertSavedListItem): Promise<SavedListItem> {
    const [existing] = await db.select().from(savedListItems)
      .where(and(
        eq(savedListItems.listId, data.listId),
        eq(savedListItems.restaurantId, data.restaurantId)
      ))
      .limit(1);
    if (existing) return existing;
    const [created] = await db.insert(savedListItems).values(data).returning();
    return created;
  }

  async removeSavedListItem(listId: number, restaurantId: number): Promise<void> {
    await db.delete(savedListItems)
      .where(and(
        eq(savedListItems.listId, listId),
        eq(savedListItems.restaurantId, restaurantId)
      ));
  }

  async getOrCreateDefaultLists(userId: string): Promise<{ mine: SavedList; partner: SavedList }> {
    const existing = await this.getSavedLists(userId);
    let mine = existing.find(l => l.isDefault && l.name === "My Saves");
    let partner = existing.find(l => l.isDefault && l.name === "With Partner");
    const now = new Date().toISOString();
    if (!mine) {
      mine = await this.createSavedList({
        userId, name: "My Saves", emoji: "❤️", isDefault: true, createdAt: now
      });
    }
    if (!partner) {
      partner = await this.createSavedList({
        userId, name: "With Partner", emoji: "💕", isDefault: true, createdAt: now
      });
    }
    return { mine, partner };
  }

  async getSavedListsWithItems(userId: string): Promise<(SavedList & { items: SavedListItem[] })[]> {
    const lists = await this.getSavedLists(userId);
    const result = await Promise.all(lists.map(async (list) => {
      const items = await this.getSavedListItems(list.id);
      return { ...list, items };
    }));
    return result;
  }

  async createPartnerInvite(invite: InsertPartnerInvite): Promise<PartnerInvite> {
    const [created] = await db.insert(partnerInvites).values(invite).returning();
    return created;
  }

  async getPartnerInviteByToken(token: string): Promise<PartnerInvite | undefined> {
    const [invite] = await db.select().from(partnerInvites)
      .where(eq(partnerInvites.token, token)).limit(1);
    return invite;
  }

  async getPartnerInviteByNonce(nonce: string): Promise<PartnerInvite | undefined> {
    const [invite] = await db.select().from(partnerInvites)
      .where(eq(partnerInvites.nonce, nonce)).limit(1);
    return invite;
  }

  async updatePartnerInvite(id: number, updates: Partial<InsertPartnerInvite>): Promise<PartnerInvite | undefined> {
    const [updated] = await db.update(partnerInvites)
      .set(updates).where(eq(partnerInvites.id, id)).returning();
    return updated;
  }

  async claimPartnerInvite(id: number, redeemedBy: string): Promise<PartnerInvite | undefined> {
    const [updated] = await db.update(partnerInvites)
      .set({ status: "accepted", redeemedBy })
      .where(and(
        eq(partnerInvites.id, id),
        eq(partnerInvites.status, "pending"),
      ))
      .returning();
    return updated;
  }

  async getPendingPartnerInvites(fromUserId: string): Promise<PartnerInvite[]> {
    return await db.select().from(partnerInvites)
      .where(and(
        eq(partnerInvites.fromUserId, fromUserId),
        eq(partnerInvites.status, "pending")
      ))
      .orderBy(desc(partnerInvites.id));
  }

  async createPartnerConnection(conn: InsertPartnerConnection): Promise<PartnerConnection> {
    return await db.transaction(async (tx) => {
      const [existingA] = await tx.select().from(partnerConnections)
        .where(and(
          or(
            eq(partnerConnections.userALineId, conn.userALineId),
            eq(partnerConnections.userBLineId, conn.userALineId),
          ),
          eq(partnerConnections.status, "active"),
        )).limit(1);
      if (existingA) throw new Error("User already has an active partner connection");

      const [existingB] = await tx.select().from(partnerConnections)
        .where(and(
          or(
            eq(partnerConnections.userALineId, conn.userBLineId),
            eq(partnerConnections.userBLineId, conn.userBLineId),
          ),
          eq(partnerConnections.status, "active"),
        )).limit(1);
      if (existingB) throw new Error("Partner already has an active partner connection");

      const [created] = await tx.insert(partnerConnections).values(conn).returning();
      return created;
    }, { isolationLevel: "serializable" });
  }

  async getActivePartnerConnection(lineUserId: string): Promise<PartnerConnection | undefined> {
    const [conn] = await db.select().from(partnerConnections)
      .where(and(
        sql`(${partnerConnections.userALineId} = ${lineUserId} OR ${partnerConnections.userBLineId} = ${lineUserId})`,
        eq(partnerConnections.status, "active")
      ))
      .limit(1);
    return conn;
  }

  async disconnectPartner(connectionId: number): Promise<void> {
    await db.update(partnerConnections)
      .set({ status: "disconnected", disconnectedAt: new Date().toISOString() })
      .where(eq(partnerConnections.id, connectionId));
  }

  async updatePartnerConnection(id: number, updates: Partial<InsertPartnerConnection>): Promise<PartnerConnection | undefined> {
    const [updated] = await db.update(partnerConnections)
      .set(updates).where(eq(partnerConnections.id, id)).returning();
    return updated;
  }

  async getActiveSessionForUser(lineUserId: string): Promise<(GroupSession & { members: GroupSessionMember[] }) | null> {
    const activeCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const completedCutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const memberRows = await db.select().from(groupSessionMembers)
      .where(eq(groupSessionMembers.lineUserId, lineUserId));
    if (memberRows.length === 0) return null;

    const sessionCodes = memberRows.map(m => m.sessionCode);
    const activeSessions = await db.select().from(groupSessions)
      .where(and(
        inArray(groupSessions.sessionCode, sessionCodes),
        or(
          and(
            inArray(groupSessions.status, ["waiting", "swiping"]),
            gt(groupSessions.createdAt, activeCutoff),
          ),
          and(
            eq(groupSessions.status, "completed"),
            gt(groupSessions.createdAt, completedCutoff),
          ),
        ),
      ))
      .orderBy(desc(groupSessions.id))
      .limit(1);

    if (activeSessions.length === 0) return null;
    const session = activeSessions[0];
    const members = await db.select().from(groupSessionMembers)
      .where(eq(groupSessionMembers.sessionCode, session.sessionCode));
    return { ...session, members };
  }

  async updateGroupSessionLocation(sessionCode: string, locationName: string | null, locationLat: string | null, locationLng: string | null): Promise<void> {
    await db.update(groupSessions)
      .set({ locationName, locationLat, locationLng })
      .where(eq(groupSessions.sessionCode, sessionCode));
  }

  async createRestaurantPromotion(promo: InsertRestaurantPromotion): Promise<RestaurantPromotion> {
    const [created] = await db.insert(restaurantPromotions).values(promo).returning();
    return created;
  }

  async getRestaurantPromotionsByOwner(ownerId: number): Promise<RestaurantPromotion[]> {
    return await db.select().from(restaurantPromotions)
      .where(eq(restaurantPromotions.ownerId, ownerId))
      .orderBy(desc(restaurantPromotions.id));
  }

  async getRestaurantPromotionById(id: number): Promise<RestaurantPromotion | undefined> {
    const [promo] = await db.select().from(restaurantPromotions).where(eq(restaurantPromotions.id, id));
    return promo;
  }

  async updateRestaurantPromotion(id: number, updates: Partial<InsertRestaurantPromotion>): Promise<RestaurantPromotion | undefined> {
    const [updated] = await db.update(restaurantPromotions).set(updates).where(eq(restaurantPromotions.id, id)).returning();
    return updated;
  }

  async deleteRestaurantPromotion(id: number): Promise<void> {
    await db.delete(restaurantPromotions).where(eq(restaurantPromotions.id, id));
  }

  async getActivePromotionsByRestaurant(restaurantId: number): Promise<RestaurantPromotion[]> {
    return await db.select().from(restaurantPromotions)
      .where(and(
        eq(restaurantPromotions.restaurantId, restaurantId),
        eq(restaurantPromotions.status, "active"),
      ))
      .orderBy(desc(restaurantPromotions.id));
  }

  async getAllActivePromotions(): Promise<RestaurantPromotion[]> {
    return await db.select().from(restaurantPromotions)
      .where(eq(restaurantPromotions.status, "active"))
      .orderBy(desc(restaurantPromotions.id));
  }

  async createOwnerTeamMember(member: InsertOwnerTeamMember): Promise<OwnerTeamMember> {
    const [created] = await db.insert(ownerTeamMembers).values(member).returning();
    return created;
  }

  async getOwnerTeamMembers(ownerId: number): Promise<OwnerTeamMember[]> {
    return await db.select().from(ownerTeamMembers)
      .where(eq(ownerTeamMembers.ownerId, ownerId))
      .orderBy(desc(ownerTeamMembers.id));
  }

  async getOwnerTeamMemberByToken(token: string): Promise<OwnerTeamMember | undefined> {
    const [member] = await db.select().from(ownerTeamMembers).where(eq(ownerTeamMembers.inviteToken, token));
    return member;
  }

  async getOwnerTeamMemberByEmail(ownerId: number, email: string): Promise<OwnerTeamMember | undefined> {
    const [member] = await db.select().from(ownerTeamMembers)
      .where(and(eq(ownerTeamMembers.ownerId, ownerId), eq(ownerTeamMembers.email, email)));
    return member;
  }

  async updateOwnerTeamMember(id: number, updates: Partial<InsertOwnerTeamMember>): Promise<OwnerTeamMember | undefined> {
    const [updated] = await db.update(ownerTeamMembers).set(updates).where(eq(ownerTeamMembers.id, id)).returning();
    return updated;
  }

  async deleteOwnerTeamMember(id: number): Promise<void> {
    await db.delete(ownerTeamMembers).where(eq(ownerTeamMembers.id, id));
  }

  async createOwnerTeamInvite(invite: InsertOwnerTeamInvite): Promise<OwnerTeamInvite> {
    const [created] = await db.insert(ownerTeamInvites).values(invite).returning();
    return created;
  }

  async getOwnerTeamInviteByToken(token: string): Promise<OwnerTeamInvite | undefined> {
    const [invite] = await db.select().from(ownerTeamInvites).where(eq(ownerTeamInvites.token, token));
    return invite;
  }

  async getOwnerTeamInvitesByOwner(ownerId: number): Promise<OwnerTeamInvite[]> {
    return await db.select().from(ownerTeamInvites)
      .where(eq(ownerTeamInvites.ownerId, ownerId))
      .orderBy(desc(ownerTeamInvites.id));
  }

  async updateOwnerTeamInvite(id: number, updates: Partial<InsertOwnerTeamInvite>): Promise<OwnerTeamInvite | undefined> {
    const [updated] = await db.update(ownerTeamInvites).set(updates).where(eq(ownerTeamInvites.id, id)).returning();
    return updated;
  }

  async getVibeOverrides(restaurantId: number): Promise<VibeOverride[]> {
    return await db.select().from(vibeOverrides)
      .where(eq(vibeOverrides.restaurantId, restaurantId));
  }

  async getAllVibeOverrides(): Promise<VibeOverride[]> {
    return await db.select().from(vibeOverrides);
  }

  private invalidateVibeCache(): void {
    for (const key of memCache.keys()) {
      if (key.startsWith("vibe_structured_") || key.startsWith("vibe_rules_")) {
        memCache.delete(key);
      }
    }
  }

  async upsertVibeOverride(override: InsertVibeOverride): Promise<VibeOverride> {
    this.invalidateVibeCache();
    const [result] = await db.insert(vibeOverrides)
      .values(override)
      .onConflictDoUpdate({
        target: [vibeOverrides.restaurantId, vibeOverrides.vibe],
        set: { action: override.action, reason: override.reason, createdBy: override.createdBy, createdAt: override.createdAt },
      })
      .returning();
    return result;
  }

  async deleteVibeOverride(id: number): Promise<void> {
    this.invalidateVibeCache();
    await db.delete(vibeOverrides).where(eq(vibeOverrides.id, id));
  }

  private evaluateRulesForRestaurant(
    r: { category: string; priceLevel: number; address: string; operatingHours?: string | null; description?: string },
    rules: VibeMatchingRule[]
  ): { vibe: string; matched: boolean; reasons: string[] }[] {
    const catLower = r.category.toLowerCase();
    const descLower = (r.description || "").toLowerCase();
    const catSegments = catLower.split(/[·•/,]+/).map(s => s.trim()).filter(Boolean);
    const catTokens = [...new Set([...catSegments, ...catSegments.flatMap(s => s.split(/\s+/))])];

    const matchesCatType = (reqType: string): boolean => {
      const tl = reqType.toLowerCase();
      const tw = tl.split(/\s+/);
      if (tw.length > 1) return catLower.includes(tl);
      return catTokens.some(tok => {
        if (tok === tl) return true;
        if (tok.length > tl.length && tok.endsWith(tl)) {
          const p = tok.slice(0, tok.length - tl.length);
          return p.endsWith(" ") || p.endsWith("-");
        }
        if (tok.length > tl.length && tok.startsWith(tl)) {
          const s = tok.slice(tl.length);
          return s.startsWith(" ") || s.startsWith("-") || s.startsWith("s");
        }
        return false;
      });
    };

    const results: { vibe: string; matched: boolean; reasons: string[] }[] = [];

    for (const rule of rules) {
      const entry = { vibe: rule.vibe, matched: false, reasons: [] as string[] };

      if (rule.hardFilter && rule.requiredCategoryTypes && rule.requiredCategoryTypes.length > 0) {
        const matchedType = rule.requiredCategoryTypes.find(t => matchesCatType(t));

        if (rule.excludeCategoryTypes && rule.excludeCategoryTypes.length > 0) {
          const excludedMatch = rule.excludeCategoryTypes.find(exc => matchesCatType(exc));
          if (excludedMatch) {
            entry.reasons.push(`excluded: category contains excluded type '${excludedMatch}'`);
            results.push(entry);
            continue;
          }
        }

        if (!matchedType) {
          const hasKw = (rule.categoryKeywords || []).some(kw => catLower.includes(kw)) ||
                        (rule.descriptionKeywords || []).some(kw => descLower.includes(kw));
          entry.reasons.push(hasKw ? "keyword match but missing required category type for hard-filter" : "no required category type found");
          results.push(entry);
          continue;
        }
        entry.matched = true;
        entry.reasons.push(`category contains required type: ${matchedType}`);
      } else {
        if (rule.categoryKeywords && rule.categoryKeywords.length > 0) {
          const m = rule.categoryKeywords.filter(kw => catLower.includes(kw));
          if (m.length > 0) { entry.matched = true; entry.reasons.push(`category keyword: ${m.join(", ")}`); }
        }
        if (rule.descriptionKeywords && rule.descriptionKeywords.length > 0) {
          const m = rule.descriptionKeywords.filter(kw => descLower.includes(kw));
          if (m.length > 0) { entry.matched = true; entry.reasons.push(`description keyword: ${m.join(", ")}`); }
        }
      }

      if (rule.priceLevelMin && r.priceLevel < rule.priceLevelMin) {
        entry.matched = false;
        entry.reasons.push(`price level ${r.priceLevel} below minimum ${rule.priceLevelMin}`);
      }
      if (rule.priceLevelMax && r.priceLevel > rule.priceLevelMax) {
        entry.matched = false;
        entry.reasons.push(`price level ${r.priceLevel} above maximum ${rule.priceLevelMax}`);
      }

      if (entry.matched && rule.excludedTags && rule.excludedTags.length > 0) {
        const excluded = rule.excludedTags.filter(t => catLower.includes(t.toLowerCase()));
        if (excluded.length > 0) {
          entry.matched = false;
          entry.reasons.push(`excluded by tag: ${excluded.join(", ")}`);
        }
      }
      results.push(entry);
    }

    const CUISINE_SPICY = ["thai", "indian", "mexican", "korean", "isaan", "northern", "southern"];
    const spicyEntry = results.find(e => e.vibe === "spicy");
    if (spicyEntry) {
      for (const tok of catTokens) {
        if (CUISINE_SPICY.some(c => tok.includes(c))) {
          spicyEntry.matched = true;
          spicyEntry.reasons.push(`cuisine typically spicy: ${tok}`);
          break;
        }
      }
    }

    const budgetEntry = results.find(e => e.vibe === "budget");
    if (budgetEntry) {
      const budgetRule = rules.find(r => r.vibe === "budget");
      const maxPrice = budgetRule?.priceLevelMax || 2;
      if (r.priceLevel <= maxPrice) {
        budgetEntry.matched = true;
        budgetEntry.reasons.push(`price level ${r.priceLevel} <= ${maxPrice}`);
      } else {
        budgetEntry.reasons.push(`price level ${r.priceLevel} > ${maxPrice}`);
      }
    } else if (!results.find(e => e.vibe === "budget")) {
      results.push({
        vibe: "budget",
        matched: r.priceLevel <= 2,
        reasons: [r.priceLevel <= 2 ? `price level ${r.priceLevel} <= 2` : `price level ${r.priceLevel} > 2`],
      });
    }

    const deliveryEntry = results.find(e => e.vibe === "delivery");
    if (deliveryEntry) {
      const deliveryRule = rules.find(r => r.vibe === "delivery");
      const maxPrice = deliveryRule?.priceLevelMax || 3;
      if (r.priceLevel <= maxPrice) {
        deliveryEntry.matched = true;
        deliveryEntry.reasons.push(`price level ${r.priceLevel} <= ${maxPrice}, delivery eligible`);
      } else {
        deliveryEntry.reasons.push(`price level ${r.priceLevel} > ${maxPrice}`);
      }
    } else if (!results.find(e => e.vibe === "delivery")) {
      results.push({
        vibe: "delivery",
        matched: r.priceLevel <= 3,
        reasons: [r.priceLevel <= 3 ? `price level ${r.priceLevel} <= 3, delivery eligible` : `price level ${r.priceLevel} > 3`],
      });
    }

    if (r.operatingHours) {
      const m = r.operatingHours.match(/(\d{2}):\d{2}\s*-\s*(\d{2}):\d{2}/);
      if (m) {
        const openHour = parseInt(m[1]), closeHour = parseInt(m[2]);
        if (closeHour >= 0 && closeHour <= 5) {
          const lateEntry = results.find(e => e.vibe === "late_night");
          if (lateEntry) { lateEntry.matched = true; lateEntry.reasons.push(`closes at ${closeHour}:xx (after midnight)`); }
          else results.push({ vibe: "late_night", matched: true, reasons: [`closes at ${closeHour}:xx (after midnight)`] });
        }
        if (openHour >= 6 && openHour <= 10) {
          const brunchEntry = results.find(e => e.vibe === "brunch");
          if (brunchEntry) { brunchEntry.matched = true; brunchEntry.reasons.push(`opens at ${openHour}:xx (morning)`); }
          else results.push({ vibe: "brunch", matched: true, reasons: [`opens at ${openHour}:xx (morning)`] });
        }
      }
    }

    const rooftopEntry = results.find(e => e.vibe === "rooftop");
    if (rooftopEntry?.matched) {
      const outdoorEntry = results.find(e => e.vibe === "outdoor");
      if (outdoorEntry) { outdoorEntry.matched = true; outdoorEntry.reasons.push("rooftop implies outdoor"); }
    }

    const seen = new Set<string>();
    const deduped: { vibe: string; matched: boolean; reasons: string[] }[] = [];
    for (const entry of results) {
      if (!seen.has(entry.vibe)) { seen.add(entry.vibe); deduped.push(entry); }
      else {
        const existing = deduped.find(e => e.vibe === entry.vibe);
        if (existing) { if (entry.matched) existing.matched = true; existing.reasons.push(...entry.reasons); }
      }
    }
    return deduped;
  }

  async evaluateVibesFromDB(r: { category: string; priceLevel: number; address: string; operatingHours?: string | null; description?: string }): Promise<{ vibe: string; matched: boolean; reasons: string[] }[]> {
    const dbRules = await this.getVibeMatchingRules();
    return this.evaluateRulesForRestaurant(r, dbRules);
  }

  async assignVibesFromDB(r: { category: string; priceLevel: number; address: string; operatingHours?: string | null; description?: string }): Promise<string[]> {
    const evaluations = await this.evaluateVibesFromDB(r);
    return evaluations.filter(e => e.matched).map(e => e.vibe);
  }

  async updateAllRestaurantVibes(): Promise<{ updated: number; details: { id: number; name: string; oldVibes: string[]; newVibes: string[] }[] }> {
    const dbRules = await this.getVibeMatchingRules();
    const allRestaurants = await this.getRestaurants();
    const allOverrides = await this.getAllVibeOverrides();
    const overrideMap = new Map<number, VibeOverride[]>();
    for (const ov of allOverrides) {
      if (!overrideMap.has(ov.restaurantId)) overrideMap.set(ov.restaurantId, []);
      overrideMap.get(ov.restaurantId)!.push(ov);
    }

    const useFallback = dbRules.length === 0;
    const details: { id: number; name: string; oldVibes: string[]; newVibes: string[] }[] = [];
    let updated = 0;

    for (const r of allRestaurants) {
      const oldVibes = r.vibes || [];
      let newVibes: string[];

      if (useFallback) {
        const { autoAssignVibes } = await import("@shared/vibeConfig");
        newVibes = autoAssignVibes(r);
      } else {
        const evaluations = this.evaluateRulesForRestaurant(r, dbRules);
        newVibes = evaluations.filter(e => e.matched).map(e => e.vibe);
      }

      const overrides = overrideMap.get(r.id) || [];
      for (const ov of overrides) {
        if (ov.action === "include" && !newVibes.includes(ov.vibe)) {
          newVibes.push(ov.vibe);
        } else if (ov.action === "exclude") {
          newVibes = newVibes.filter(v => v !== ov.vibe);
        }
      }
      newVibes.sort();

      const changed = JSON.stringify(oldVibes.sort()) !== JSON.stringify(newVibes);
      if (changed) {
        await db.update(restaurants).set({ vibes: newVibes }).where(eq(restaurants.id, r.id));
        details.push({ id: r.id, name: r.name, oldVibes, newVibes });
        updated++;
      }
    }

    return { updated, details };
  }

  async getVibeDefinitions(): Promise<VibeDefinition[]> {
    return cached("vibe_definitions", 300_000, async () => {
      return await db.select().from(vibeDefinitions).orderBy(vibeDefinitions.sortOrder);
    });
  }

  async getVibeMatchingRules(vibe?: string): Promise<VibeMatchingRule[]> {
    const cacheKey = vibe ? `vibe_rules_${vibe}` : "vibe_rules_all";
    return cached(cacheKey, 300_000, async () => {
      if (vibe) {
        return await db.select().from(vibeMatchingRules)
          .where(and(eq(vibeMatchingRules.vibe, vibe), eq(vibeMatchingRules.isActive, true)))
          .orderBy(desc(vibeMatchingRules.priority));
      }
      return await db.select().from(vibeMatchingRules)
        .where(eq(vibeMatchingRules.isActive, true))
        .orderBy(desc(vibeMatchingRules.priority));
    });
  }

  async seedVibeDefinitionsAndRules(): Promise<{ definitionsSeeded: number; rulesSeeded: number }> {
    const { VIBE_TAGS, VIBE_LABELS, VIBE_EMOJI } = await import("@shared/vibeConfig");

    const existingDefs = await db.select().from(vibeDefinitions);
    let definitionsSeeded = 0;
    if (existingDefs.length === 0) {
      const defs: InsertVibeDefinition[] = VIBE_TAGS.map((vibe, idx) => ({
        vibe,
        label: VIBE_LABELS[vibe],
        emoji: VIBE_EMOJI[vibe],
        description: `${VIBE_LABELS[vibe]} restaurants and venues`,
        isActive: true,
        sortOrder: idx,
      }));
      await db.insert(vibeDefinitions).values(defs);
      definitionsSeeded = defs.length;
    }

    const existingRules = await db.select().from(vibeMatchingRules);
    let rulesSeeded = 0;
    if (existingRules.length === 0) {
      const rules: InsertVibeMatchingRule[] = [
        {
          vibe: "drinks", ruleType: "hard_filter", hardFilter: true, priority: 100,
          requiredCategoryTypes: ["bar", "pub", "cocktail bar", "cocktail", "speakeasy", "wine bar", "brewery", "taproom", "izakaya", "beer bar", "craft beer", "whisky bar", "whiskey bar", "rum bar", "gin bar", "tiki bar", "lounge", "rooftop bar", "jazz bar", "sports bar"],
          excludeCategoryTypes: ["restaurant", "cafe", "bakery", "dessert", "brunch", "breakfast", "noodle", "rice", "curry", "sushi", "ramen", "pizza", "burger", "steak", "seafood"],
          categoryKeywords: [], descriptionKeywords: [],
          preferredTags: ["bar", "pub", "cocktail", "speakeasy", "izakaya"], excludedTags: ["cafe", "restaurant"],
          rankingWeight: 90, fallbackStrategy: "none", fallbackMinResults: 0, isActive: true,
        },
        {
          vibe: "cafe", ruleType: "hard_filter", hardFilter: true, priority: 90,
          requiredCategoryTypes: ["cafe", "coffee", "coffee shop", "tea house", "tea room", "bakery cafe", "specialty coffee"],
          categoryKeywords: ["cafe", "coffee", "tea"],
          descriptionKeywords: ["cafe", "coffee", "latte", "espresso", "pour over", "drip", "brew"],
          excludeCategoryTypes: [],
          preferredTags: ["cafe", "coffee", "tea"], excludedTags: [],
          rankingWeight: 80, fallbackStrategy: "none", fallbackMinResults: 0, isActive: true,
        },
        {
          vibe: "spicy", ruleType: "keyword", hardFilter: false, priority: 80,
          categoryKeywords: ["spicy", "isaan", "chili", "hot pot"],
          descriptionKeywords: ["spicy", "chili", "hot", "fiery", "capsicum"],
          requiredCategoryTypes: [], excludeCategoryTypes: [],
          preferredTags: ["thai", "indian", "mexican", "korean", "isaan"], excludedTags: [],
          rankingWeight: 70, fallbackStrategy: "relax_keywords", fallbackMinResults: 3, isActive: true,
        },
        {
          vibe: "healthy", ruleType: "keyword", hardFilter: false, priority: 70,
          categoryKeywords: ["salad", "vegan", "vegetarian", "organic", "poke", "healthy", "acai", "smoothie", "juice"],
          descriptionKeywords: ["healthy", "organic", "plant-based", "vegan", "vegetarian", "clean eating", "superfood"],
          requiredCategoryTypes: [], excludeCategoryTypes: [],
          preferredTags: ["salad", "vegan", "organic"], excludedTags: ["fast food", "fried"],
          rankingWeight: 60, fallbackStrategy: "relax_keywords", fallbackMinResults: 3, isActive: true,
        },
        {
          vibe: "outdoor", ruleType: "keyword", hardFilter: false, priority: 60,
          categoryKeywords: ["outdoor", "garden", "terrace", "riverside", "by the river"],
          descriptionKeywords: ["outdoor", "terrace", "garden", "open-air", "al fresco", "riverside"],
          requiredCategoryTypes: [], excludeCategoryTypes: [],
          preferredTags: ["garden", "terrace", "riverside"], excludedTags: [],
          rankingWeight: 50, fallbackStrategy: "relax_keywords", fallbackMinResults: 3, isActive: true,
        },
        {
          vibe: "date_night", ruleType: "keyword", hardFilter: false, priority: 70, priceLevelMin: 3,
          categoryKeywords: ["fine dining", "omakase", "kaiseki", "premium", "upscale"],
          descriptionKeywords: ["romantic", "intimate", "fine dining", "upscale", "elegant", "premium"],
          requiredCategoryTypes: [], excludeCategoryTypes: [],
          preferredTags: ["fine dining", "omakase", "premium"], excludedTags: ["fast food", "street food"],
          rankingWeight: 75, fallbackStrategy: "relax_price", fallbackMinResults: 5, isActive: true,
        },
        {
          vibe: "sweets", ruleType: "keyword", hardFilter: false, priority: 70,
          categoryKeywords: ["dessert", "bakery", "ice cream", "kakigori", "cake", "pastry", "sweet", "honey toast", "gelato", "chocolate"],
          descriptionKeywords: ["dessert", "sweet", "pastry", "cake", "ice cream", "gelato", "chocolate", "confection"],
          requiredCategoryTypes: [], excludeCategoryTypes: [],
          preferredTags: ["dessert", "bakery", "ice cream"], excludedTags: [],
          rankingWeight: 65, fallbackStrategy: "relax_keywords", fallbackMinResults: 3, isActive: true,
        },
        {
          vibe: "brunch", ruleType: "keyword", hardFilter: false, priority: 60,
          categoryKeywords: ["brunch", "breakfast", "morning", "pancake", "waffle"],
          descriptionKeywords: ["brunch", "breakfast", "morning", "eggs benedict", "pancake", "waffle"],
          requiredCategoryTypes: [], excludeCategoryTypes: [],
          preferredTags: ["brunch", "breakfast"], excludedTags: [],
          rankingWeight: 55, fallbackStrategy: "relax_keywords", fallbackMinResults: 3, isActive: true,
        },
        {
          vibe: "street_food", ruleType: "hard_filter", hardFilter: true, priority: 70,
          requiredCategoryTypes: ["street food", "night market", "hawker", "stall", "cart", "food truck", "roadside"],
          categoryKeywords: ["street food", "night market", "hawker", "stall", "cart", "food truck"],
          descriptionKeywords: ["street food", "night market", "roadside", "hawker", "food truck", "stall"],
          excludeCategoryTypes: ["fine dining", "omakase", "premium"],
          preferredTags: ["street food", "night market"], excludedTags: ["fine dining"],
          rankingWeight: 70, fallbackStrategy: "relax_to_keyword", fallbackMinResults: 3, isActive: true,
        },
        {
          vibe: "rooftop", ruleType: "hard_filter", hardFilter: true, priority: 60,
          requiredCategoryTypes: ["rooftop", "rooftop bar", "sky bar"],
          categoryKeywords: ["rooftop"],
          descriptionKeywords: ["rooftop", "sky bar", "skyline", "panoramic view"],
          excludeCategoryTypes: [],
          preferredTags: ["rooftop"], excludedTags: [],
          rankingWeight: 60, fallbackStrategy: "relax_to_keyword", fallbackMinResults: 2, isActive: true,
        },
        {
          vibe: "family", ruleType: "keyword", hardFilter: false, priority: 50,
          categoryKeywords: ["family", "buffet", "food court", "casual", "home-style", "traditional", "home cooking"],
          descriptionKeywords: ["family", "kid-friendly", "casual dining", "home-style", "home cooking", "comfort"],
          requiredCategoryTypes: [], excludeCategoryTypes: [],
          preferredTags: ["family", "buffet", "casual"], excludedTags: ["bar", "pub", "nightclub"],
          rankingWeight: 45, fallbackStrategy: "relax_keywords", fallbackMinResults: 5, isActive: true,
        },
        {
          vibe: "budget", ruleType: "price_filter", hardFilter: false, priority: 80,
          categoryKeywords: [], descriptionKeywords: [],
          requiredCategoryTypes: [], excludeCategoryTypes: [],
          preferredTags: ["street food", "local", "casual"], excludedTags: [],
          priceLevelMax: 2, rankingWeight: 60,
          fallbackStrategy: "relax_keywords", fallbackMinResults: 5, isActive: true,
        },
        {
          vibe: "delivery", ruleType: "price_filter", hardFilter: false, priority: 60,
          categoryKeywords: [], descriptionKeywords: [],
          requiredCategoryTypes: [], excludeCategoryTypes: ["fine dining", "omakase"],
          preferredTags: [], excludedTags: [],
          priceLevelMax: 3, rankingWeight: 50,
          fallbackStrategy: "relax_keywords", fallbackMinResults: 5, isActive: true,
        },
        {
          vibe: "late_night", ruleType: "hours_filter", hardFilter: false, priority: 60,
          categoryKeywords: ["late night", "night", "after hours"],
          descriptionKeywords: ["late night", "open late", "after midnight", "24 hours", "24hr"],
          requiredCategoryTypes: [], excludeCategoryTypes: [],
          preferredTags: ["bar", "izakaya", "ramen", "street food"], excludedTags: [],
          rankingWeight: 55, fallbackStrategy: "relax_keywords", fallbackMinResults: 3, isActive: true,
        },
      ];
      await db.insert(vibeMatchingRules).values(rules);
      rulesSeeded = rules.length;
    }

    return { definitionsSeeded, rulesSeeded };
  }

  private computeRelevanceScore(r: Restaurant, rule: VibeMatchingRule, reasons: string[]): number {
    const baseWeight = Math.min((rule.rankingWeight || 50) * 0.6, 55);
    const ratingBonus = (parseFloat(r.rating) - 3.5) * 12;
    const trendingBonus = (r.trendingScore || 0) * 0.2;
    const catLower = r.category.toLowerCase();
    let preferredBonus = 0;
    if (rule.preferredTags && rule.preferredTags.length > 0) {
      const matched = rule.preferredTags.filter(t => catLower.includes(t.toLowerCase()));
      preferredBonus = matched.length * 4;
    }
    const reasonBonus = Math.min(reasons.length * 2, 10);
    return Math.min(99, Math.max(20, Math.round(baseWeight + ratingBonus + trendingBonus + preferredBonus + reasonBonus)));
  }

  async getRestaurantsByVibeStructured(vibe: string, limit: number): Promise<(Restaurant & { vibeMatch: number; matchReasons?: string[] })[]> {
    return cached(`vibe_structured_${vibe}_${limit}`, 60_000, async () => {
      const dbRules = await this.getVibeMatchingRules();
      const vibeRule = dbRules.find(r => r.vibe === vibe);
      const allRestaurants = await this.getRestaurants();
      const allOverrides = await this.getAllVibeOverrides();

      const includeOverrides = new Set<number>();
      const excludeOverrides = new Set<number>();
      for (const ov of allOverrides) {
        if (ov.vibe !== vibe) continue;
        if (ov.action === "include") includeOverrides.add(ov.restaurantId);
        else if (ov.action === "exclude") excludeOverrides.add(ov.restaurantId);
      }

      if (dbRules.length === 0) {
        const preTagged = allRestaurants
          .filter(r => !excludeOverrides.has(r.id) && (r.vibes?.includes(vibe) || includeOverrides.has(r.id)));
        return preTagged.slice(0, limit).map(r => ({
          ...r,
          vibeMatch: Math.min(99, Math.round(50 + (parseFloat(r.rating) - 4.0) * 15 + (r.trendingScore || 0) * 0.2)),
        }));
      }

      const strictCandidates: (Restaurant & { vibeMatch: number; matchReasons: string[] })[] = [];
      for (const r of allRestaurants) {
        if (excludeOverrides.has(r.id)) continue;

        if (includeOverrides.has(r.id)) {
          strictCandidates.push({
            ...r,
            vibeMatch: 95,
            matchReasons: ["manual override: included by admin"],
          });
          continue;
        }

        const evaluations = this.evaluateRulesForRestaurant(r, dbRules);
        const vibeExpl = evaluations.find(e => e.vibe === vibe);
        if (vibeExpl?.matched) {
          strictCandidates.push({
            ...r,
            vibeMatch: this.computeRelevanceScore(r, vibeRule || dbRules[0], vibeExpl.reasons),
            matchReasons: vibeExpl.reasons,
          });
        }
      }

      strictCandidates.sort((a, b) => b.vibeMatch - a.vibeMatch);

      const fallbackMin = vibeRule?.fallbackMinResults || 3;
      const fallbackStrategy = vibeRule?.fallbackStrategy || "relax_keywords";

      if (strictCandidates.length >= fallbackMin || fallbackStrategy === "none") {
        return strictCandidates.slice(0, limit);
      }

      const strictIds = new Set(strictCandidates.map(c => c.id));
      const fallbackCandidates: (Restaurant & { vibeMatch: number; matchReasons: string[] })[] = [];

      if (fallbackStrategy === "relax_keywords" || fallbackStrategy === "relax_to_keyword") {
        for (const r of allRestaurants) {
          if (strictIds.has(r.id) || excludeOverrides.has(r.id)) continue;
          const catLower = r.category.toLowerCase();
          const descLower = (r.description || "").toLowerCase();
          const allKeywords = [
            ...(vibeRule?.categoryKeywords || []),
            ...(vibeRule?.descriptionKeywords || []),
          ];
          const matched = allKeywords.filter(kw => catLower.includes(kw) || descLower.includes(kw));
          if (matched.length > 0) {
            fallbackCandidates.push({
              ...r,
              vibeMatch: Math.min(70, Math.round(30 + matched.length * 5 + (parseFloat(r.rating) - 4.0) * 8)),
              matchReasons: [`fallback: keyword match (${matched.join(", ")})`],
            });
          }
        }
      } else if (fallbackStrategy === "relax_price" && vibeRule?.priceLevelMin) {
        const relaxedMin = Math.max(1, vibeRule.priceLevelMin - 1);
        for (const r of allRestaurants) {
          if (strictIds.has(r.id) || excludeOverrides.has(r.id)) continue;
          if (r.priceLevel >= relaxedMin) {
            const catLower = r.category.toLowerCase();
            const descLower = (r.description || "").toLowerCase();
            const allKw = [...(vibeRule.categoryKeywords || []), ...(vibeRule.descriptionKeywords || [])];
            const matched = allKw.filter(kw => catLower.includes(kw) || descLower.includes(kw));
            if (matched.length > 0) {
              fallbackCandidates.push({
                ...r,
                vibeMatch: Math.min(65, Math.round(25 + matched.length * 5 + (parseFloat(r.rating) - 4.0) * 8)),
                matchReasons: [`fallback: relaxed price (min ${relaxedMin}), keyword match (${matched.join(", ")})`],
              });
            }
          }
        }
      }

      fallbackCandidates.sort((a, b) => b.vibeMatch - a.vibeMatch);
      const combined = [...strictCandidates, ...fallbackCandidates];
      return combined.slice(0, limit);
    });
  }
  async getMenuItems(category?: string): Promise<MenuItem[]> {
    if (category) {
      return await db.select().from(menuItems)
        .where(eq(menuItems.category, category))
        .orderBy(desc(menuItems.swipeRightCount));
    }
    return await db.select().from(menuItems).orderBy(desc(menuItems.swipeRightCount));
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
    return item;
  }

  async seedMenuItems(data: InsertMenuItem[]): Promise<void> {
    const existing = await db.select({ id: menuItems.id }).from(menuItems).limit(1);
    if (existing.length > 0) return;
    if (data.length > 0) {
      const batchSize = 50;
      for (let i = 0; i < data.length; i += batchSize) {
        await db.insert(menuItems).values(data.slice(i, i + batchSize));
      }
    }
  }

  async incrementMenuItemSwipeRight(id: number): Promise<void> {
    await db.update(menuItems)
      .set({ swipeRightCount: sql`${menuItems.swipeRightCount} + 1` })
      .where(eq(menuItems.id, id));
  }

  async getTrendingMenuItems(limit: number = 30): Promise<MenuItem[]> {
    return await db.select().from(menuItems)
      .orderBy(desc(menuItems.swipeRightCount))
      .limit(limit);
  }

  async getHotRestaurants(days: number, limit: number): Promise<{ restaurantId: number; score: number }[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const results = await db
      .select({
        menuItemId: groupSwipes.menuItemId,
        score: sql<number>`count(*)`.as("score"),
      })
      .from(groupSwipes)
      .where(and(
        sql`${groupSwipes.direction} IN ('right', 'super')`,
        sql`${groupSwipes.swipeType} = 'restaurant'`,
        gte(groupSwipes.swipedAt, since)
      ))
      .groupBy(groupSwipes.menuItemId)
      .orderBy(sql`count(*) DESC`)
      .limit(limit);
    return results.map(r => ({ restaurantId: r.menuItemId, score: r.score }));
  }
}

export const storage = new DatabaseStorage();
