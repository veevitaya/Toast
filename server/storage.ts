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
} from "@shared/schema";
import { eq, desc, and, gte, lte, count, sql } from "drizzle-orm";

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
  getGroupMatches(sessionCode: string): Promise<{ menuItemId: number; voters: string[] }[]>;
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
    return await db.select().from(restaurants).limit(5);
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
    const [existing] = await db.select().from(groupSwipes)
      .where(and(
        eq(groupSwipes.sessionCode, swipe.sessionCode),
        eq(groupSwipes.lineUserId, swipe.lineUserId),
        eq(groupSwipes.menuItemId, swipe.menuItemId)
      ))
      .limit(1);

    if (existing) {
      const [updated] = await db.update(groupSwipes)
        .set({ direction: swipe.direction, swipedAt: swipe.swipedAt })
        .where(eq(groupSwipes.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db.insert(groupSwipes).values(swipe).returning();
    return created;
  }

  async getGroupSwipes(sessionCode: string): Promise<GroupSwipe[]> {
    return await db.select().from(groupSwipes).where(eq(groupSwipes.sessionCode, sessionCode)).orderBy(groupSwipes.id);
  }

  async getGroupMatches(sessionCode: string): Promise<{ menuItemId: number; voters: string[] }[]> {
    const members = await this.getGroupMembers(sessionCode);
    const memberCount = members.length;
    if (memberCount === 0) return [];

    const results = await db.select({
      menuItemId: groupSwipes.menuItemId,
      voters: sql<string>`array_agg(DISTINCT ${groupSwipes.lineUserId})`,
      voterCount: sql<number>`count(DISTINCT ${groupSwipes.lineUserId})`,
    })
      .from(groupSwipes)
      .where(and(
        eq(groupSwipes.sessionCode, sessionCode),
        sql`${groupSwipes.direction} IN ('right', 'super')`
      ))
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
    try {
      const [created] = await db.insert(partnerConnections).values(conn).returning();
      return created;
    } catch (err) {
      if (err instanceof Error && err.message.includes("unique")) {
        throw new Error("One or both users already have an active partner connection");
      }
      throw err;
    }
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
}

export const storage = new DatabaseStorage();
