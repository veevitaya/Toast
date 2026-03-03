import { db } from "./db";
import {
  restaurants,
  userPreferences,
  userProfiles,
  campaigns,
  analyticsEvents,
  adBanners,
  adminUsers,
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
} from "@shared/schema";
import { eq, desc, and, gte, lte, count, sql } from "drizzle-orm";

export interface IStorage {
  getRestaurants(mode?: string, lat?: number, lng?: number, query?: string): Promise<Restaurant[]>;
  getRestaurantById(id: number): Promise<Restaurant | undefined>;
  getSuggestions(): Promise<Restaurant[]>;
  createPreference(pref: InsertUserPreference): Promise<UserPreference>;
  seedRestaurants(data: InsertRestaurant[]): Promise<void>;
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
  getAllAdminUsers(): Promise<AdminUser[]>;
}

export class DatabaseStorage implements IStorage {
  async getRestaurants(mode?: string, lat?: number, lng?: number, query?: string): Promise<Restaurant[]> {
    let queryBuilder = db.select().from(restaurants);
    return await queryBuilder.orderBy(desc(restaurants.id));
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
    return restaurant;
  }

  async getSuggestions(): Promise<Restaurant[]> {
    return await db.select().from(restaurants).limit(5);
  }

  async createPreference(pref: InsertUserPreference): Promise<UserPreference> {
    const [preference] = await db.insert(userPreferences).values(pref).returning();
    return preference;
  }

  async seedRestaurants(data: InsertRestaurant[]): Promise<void> {
    await db.delete(restaurants);
    for (const restaurant of data) {
      await db.insert(restaurants).values(restaurant);
    }
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
    const [result] = await db.select({ count: count() }).from(restaurants);
    return result.count;
  }

  async getUserCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(userProfiles);
    return result.count;
  }

  async updateRestaurant(id: number, updates: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const [updated] = await db.update(restaurants).set(updates).where(eq(restaurants.id, id)).returning();
    return updated;
  }

  async deleteRestaurant(id: number): Promise<void> {
    await db.delete(restaurants).where(eq(restaurants.id, id));
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [created] = await db.insert(campaigns).values(campaign).returning();
    return created;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).orderBy(desc(campaigns.id));
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

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers);
  }
}

export const storage = new DatabaseStorage();
