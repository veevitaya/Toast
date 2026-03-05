import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { createHash } from "crypto";
import { classifyRestaurant, VERIFICATION_CHECKLIST_TEMPLATE } from "./classifier";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function seedAdminUser() {
  const admins = await storage.getAllAdminUsers();
  if (admins.length === 0) {
    await storage.createAdminUser({
      username: "admin",
      passwordHash: hashPassword("toast2024"),
      role: "superadmin",
      permissions: ["manage_restaurants", "manage_users", "manage_campaigns", "manage_banners", "view_analytics", "manage_claims", "manage_config"],
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  } else {
    const seedAdmin = admins.find((a) => a.username === "admin");
    if (seedAdmin && (seedAdmin.role !== "superadmin" || !seedAdmin.permissions?.length)) {
      await storage.updateAdminUser(seedAdmin.id, {
        role: "superadmin",
        permissions: ["manage_restaurants", "manage_users", "manage_campaigns", "manage_banners", "view_analytics", "manage_claims", "manage_config"],
        isActive: true,
      });
    }
  }
}

async function seedDatabase() {
  const existing = await storage.getRestaurants();
  if (existing.length < 10) {
    await storage.seedRestaurants([
      {
        name: "Pad Thai Plus",
        description: "Authentic street food style pad thai with fresh shrimp and tofu.",
        imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=60",
        lat: "13.7466",
        lng: "100.5393",
        category: "Thai  •  Street food",
        priceLevel: 1,
        rating: "4.8",
        address: "Central World",
        isNew: true,
        trendingScore: 95,
      },
      {
        name: "Sushi Master",
        description: "Fresh cuts imported daily from Tsukiji market.",
        imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
        lat: "13.7454",
        lng: "100.5341",
        category: "Japanese  •  Sushi",
        priceLevel: 3,
        rating: "4.5",
        address: "Siam Paragon",
        isNew: false,
        trendingScore: 80,
      },
      {
        name: "Burger Joint BKK",
        description: "Smash burgers with secret sauce and hand-cut fries.",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60",
        lat: "13.7382",
        lng: "100.5609",
        category: "American  •  Burgers",
        priceLevel: 2,
        rating: "4.2",
        address: "Sukhumvit 11",
        isNew: false,
        trendingScore: 70,
      },
      {
        name: "Pizza Paradise",
        description: "Gourmet wood-fired pizzas with imported Italian ingredients.",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60",
        lat: "13.7285",
        lng: "100.5310",
        category: "Italian  •  Pizza",
        priceLevel: 2,
        rating: "4.6",
        address: "Silom",
        isNew: true,
        trendingScore: 88,
      },
      {
        name: "Sol and Luna",
        description: "Modern Italian bistro with handmade pasta and craft cocktails.",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
        lat: "13.7466",
        lng: "100.5393",
        category: "Italian  •  Modern",
        priceLevel: 3,
        rating: "4.7",
        address: "Central World",
        isNew: true,
        trendingScore: 92,
      },
      {
        name: "Ojo Bangkok",
        description: "Elevated Mexican cuisine with stunning city views.",
        imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&auto=format&fit=crop&q=60",
        lat: "13.7466",
        lng: "100.5393",
        category: "Mexican  •  Fine dining",
        priceLevel: 4,
        rating: "4.4",
        address: "Central World",
        isNew: true,
        trendingScore: 85,
      },
      {
        name: "Baan Kanom Thai",
        description: "Traditional Thai desserts and sweets in a charming setting.",
        imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop&q=60",
        lat: "13.7466",
        lng: "100.5393",
        category: "Thai  •  Dessert",
        priceLevel: 1,
        rating: "4.3",
        address: "Central World",
        isNew: true,
        trendingScore: 78,
      },
      {
        name: "Ramen Champ",
        description: "Rich tonkotsu broth simmered for 18 hours.",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=60",
        lat: "13.7382",
        lng: "100.5609",
        category: "Japanese  •  Ramen",
        priceLevel: 2,
        rating: "4.6",
        address: "Thonglor",
        isNew: false,
        trendingScore: 90,
      },
      {
        name: "Green Curry House",
        description: "Aromatic green curry with organic chicken and Thai basil.",
        imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=60",
        lat: "13.7285",
        lng: "100.5310",
        category: "Thai  •  Curry",
        priceLevel: 1,
        rating: "4.5",
        address: "Ari",
        isNew: false,
        trendingScore: 82,
      },
      {
        name: "Korean BBQ King",
        description: "Premium wagyu beef and pork belly grilled at your table.",
        imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=60",
        lat: "13.7466",
        lng: "100.5393",
        category: "Korean  •  BBQ",
        priceLevel: 3,
        rating: "4.4",
        address: "Sukhumvit 24",
        isNew: false,
        trendingScore: 87,
      },
      {
        name: "Pho Street Saigon",
        description: "Slow-simmered beef bone broth with rice noodles and fresh herbs.",
        imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=60",
        lat: "13.7310",
        lng: "100.5670",
        category: "Vietnamese  •  Noodles",
        priceLevel: 1,
        rating: "4.6",
        address: "Ekkamai",
        isNew: true,
        trendingScore: 88,
      },
      {
        name: "Charoen Krung Seafood",
        description: "Fresh catch daily — grilled river prawns and steamed sea bass.",
        imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=60",
        lat: "13.7230",
        lng: "100.5130",
        category: "Thai  •  Seafood",
        priceLevel: 2,
        rating: "4.7",
        address: "Charoen Krung",
        isNew: false,
        trendingScore: 91,
      },
      {
        name: "Masala Art",
        description: "Northern Indian curries and tandoori in a vibrant setting.",
        imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=60",
        lat: "13.7370",
        lng: "100.5540",
        category: "Indian  •  Curry",
        priceLevel: 2,
        rating: "4.5",
        address: "Sukhumvit 31",
        isNew: true,
        trendingScore: 79,
      },
      {
        name: "After You Dessert",
        description: "Famous kakigori shaved ice and honey toast paradise.",
        imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop&q=60",
        lat: "13.7320",
        lng: "100.5690",
        category: "Cafe  •  Dessert",
        priceLevel: 2,
        rating: "4.3",
        address: "Thonglor",
        isNew: false,
        trendingScore: 83,
      },
      {
        name: "Dim Sum Dynasty",
        description: "Hong Kong-style dim sum with har gow, siu mai, and char siu bao.",
        imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=60",
        lat: "13.7410",
        lng: "100.5100",
        category: "Chinese  •  Dim sum",
        priceLevel: 2,
        rating: "4.6",
        address: "Chinatown",
        isNew: true,
        trendingScore: 86,
      },
      {
        name: "Roots Coffee & Brunch",
        description: "Specialty pour-over coffee with all-day brunch and avocado toast.",
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=60",
        lat: "13.7450",
        lng: "100.5530",
        category: "Cafe  •  Brunch",
        priceLevel: 2,
        rating: "4.8",
        address: "Ari",
        isNew: true,
        trendingScore: 93,
      },
    ]);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  seedDatabase().catch(console.error);
  seedAdminUser().catch(console.error);

  app.get("/api/restaurants/suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getSuggestions();
      res.json(suggestions);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/restaurants/personalized", async (req, res) => {
    try {
      const { userId, tasteProfile, hour, dayOfWeek } = req.body;
      const allRestaurants = await storage.getRestaurants();

      let userEvents: any[] = [];
      if (userId) {
        userEvents = await storage.getUserEvents(userId, 300);
      }

      const swipeRightIds = new Set<number>();
      const swipeLeftIds = new Set<number>();
      const savedIds = new Set<number>();
      const viewedIds = new Set<number>();
      const categoryAffinities: Record<string, number> = {};

      for (const evt of userEvents) {
        if (evt.eventType === "swipe_right" && evt.restaurantId) swipeRightIds.add(evt.restaurantId);
        if (evt.eventType === "swipe_left" && evt.restaurantId) swipeLeftIds.add(evt.restaurantId);
        if (evt.eventType === "save" && evt.restaurantId) savedIds.add(evt.restaurantId);
        if (evt.eventType === "view_detail" && evt.restaurantId) viewedIds.add(evt.restaurantId);

        if (evt.metadata) {
          try {
            const meta = JSON.parse(evt.metadata);
            if (meta.category) {
              const cats = meta.category.split(/[,·•]/).map((c: string) => c.trim().toLowerCase());
              for (const cat of cats) {
                if (!cat) continue;
                const weight = evt.eventType === "swipe_right" ? 2 : evt.eventType === "save" ? 3 : evt.eventType === "swipe_left" ? -1 : 0.5;
                categoryAffinities[cat] = (categoryAffinities[cat] || 0) + weight;
              }
            }
          } catch {}
        }
      }

      if (tasteProfile) {
        const { likes = {}, superLikes = {}, dislikes = {} } = tasteProfile;
        for (const [cat, entry] of Object.entries(likes) as [string, any][]) {
          const key = cat.toLowerCase();
          categoryAffinities[key] = (categoryAffinities[key] || 0) + (entry.count || 1) * 1.5;
        }
        for (const [cat, entry] of Object.entries(superLikes) as [string, any][]) {
          const key = cat.toLowerCase();
          categoryAffinities[key] = (categoryAffinities[key] || 0) + (entry.count || 1) * 3;
        }
        for (const [cat, entry] of Object.entries(dislikes) as [string, any][]) {
          const key = cat.toLowerCase();
          categoryAffinities[key] = (categoryAffinities[key] || 0) - (entry.count || 1) * 1;
        }
      }

      const timeSlot = hour !== undefined ? (
        hour >= 6 && hour < 11 ? "morning" :
        hour >= 11 && hour < 14 ? "lunch" :
        hour >= 14 && hour < 17 ? "afternoon" :
        hour >= 17 && hour < 21 ? "dinner" : "latenight"
      ) : "dinner";

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const TIME_BOOSTS: Record<string, string[]> = {
        morning: ["cafe", "brunch", "coffee", "bakery", "breakfast"],
        lunch: ["thai", "japanese", "noodles", "street food", "quick"],
        afternoon: ["cafe", "dessert", "tea", "boba", "snack"],
        dinner: ["bbq", "fine dining", "sushi", "italian", "korean", "seafood"],
        latenight: ["street food", "ramen", "noodles", "thai", "bar"],
      };

      const scored = allRestaurants.map((r) => {
        let score = 50;
        const rCats = r.category.toLowerCase().split(/[,·•]/).map(c => c.trim());

        for (const cat of rCats) {
          if (categoryAffinities[cat]) {
            score += categoryAffinities[cat] * 3;
          }
          for (const [affCat, affScore] of Object.entries(categoryAffinities)) {
            if (cat.includes(affCat) || affCat.includes(cat)) {
              score += affScore * 1.5;
            }
          }
        }

        if (swipeRightIds.has(r.id)) score += 15;
        if (savedIds.has(r.id)) score += 20;
        if (swipeLeftIds.has(r.id)) score -= 25;
        if (viewedIds.has(r.id)) score += 5;

        const timeBoostCats = TIME_BOOSTS[timeSlot] || [];
        for (const cat of rCats) {
          for (const tb of timeBoostCats) {
            if (cat.includes(tb) || tb.includes(cat)) {
              score += 8;
            }
          }
        }

        if (isWeekend) {
          for (const cat of rCats) {
            if (["brunch", "cafe", "fine dining", "premium", "bbq"].some(w => cat.includes(w))) {
              score += 5;
            }
          }
        }

        const rating = parseFloat(r.rating) || 4.0;
        score += (rating - 4.0) * 10;

        if (r.trendingScore) score += r.trendingScore * 0.1;
        if (r.isNew) score += 3;

        score = Math.max(0, Math.min(99, Math.round(score)));

        return {
          id: r.id,
          name: r.name,
          category: r.category,
          rating: r.rating,
          imageUrl: r.imageUrl,
          address: r.address,
          priceLevel: r.priceLevel,
          match: score,
        };
      });

      scored.sort((a, b) => b.match - a.match);

      res.json(scored.slice(0, 5));
    } catch (err) {
      console.error("Personalized suggestions error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const restaurant = await storage.getRestaurantById(id);
      if (!restaurant) return res.status(404).json({ message: "Not found" });
      res.json(restaurant);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.restaurants.list.path, async (req, res) => {
    try {
      const input = api.restaurants.list.input ? api.restaurants.list.input.parse(req.query) : {};
      const restaurants = await storage.getRestaurants(
        input.mode,
        input.lat,
        input.lng,
        input.query
      );
      res.json(restaurants);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid query parameters" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.preferences.create.path, async (req, res) => {
    try {
      const input = api.preferences.create.input.parse(req.body);
      const pref = await storage.createPreference(input);
      res.status(201).json(pref);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/profile/:lineUserId", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.lineUserId);
      if (!profile) return res.status(404).json({ message: "Profile not found" });
      res.json(profile);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const schema = z.object({
        lineUserId: z.string().min(1),
        displayName: z.string().min(1),
        pictureUrl: z.string().nullable().optional(),
        statusMessage: z.string().nullable().optional(),
        dietaryRestrictions: z.array(z.string()).optional().default([]),
        cuisinePreferences: z.array(z.string()).optional().default([]),
        defaultBudget: z.number().min(1).max(4).optional().default(2),
        defaultDistance: z.string().optional().default("5km"),
        partnerLineUserId: z.string().nullable().optional(),
        partnerDisplayName: z.string().nullable().optional(),
        partnerPictureUrl: z.string().nullable().optional(),
      });
      const input = schema.parse(req.body);
      const profile = await storage.upsertProfile(input);
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/profile/:lineUserId", async (req, res) => {
    try {
      const schema = z.object({
        displayName: z.string().min(1).optional(),
        pictureUrl: z.string().nullable().optional(),
        dietaryRestrictions: z.array(z.string()).optional(),
        cuisinePreferences: z.array(z.string()).optional(),
        defaultBudget: z.number().min(1).max(4).optional(),
        defaultDistance: z.string().optional(),
        partnerLineUserId: z.string().nullable().optional(),
        partnerDisplayName: z.string().nullable().optional(),
        partnerPictureUrl: z.string().nullable().optional(),
      });
      const updates = schema.parse(req.body);
      const profile = await storage.updateProfile(req.params.lineUserId, updates);
      if (!profile) return res.status(404).json({ message: "Profile not found" });
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Campaign routes
  app.post("/api/campaigns", async (req, res) => {
    try {
      const schema = z.object({
        restaurantOwnerKey: z.string().min(1),
        title: z.string().min(1),
        dealType: z.string().min(1),
        dealValue: z.string().optional().default(""),
        description: z.string().optional().default(""),
        startDate: z.string().optional().default(""),
        endDate: z.string().optional().default(""),
        conditions: z.array(z.string()).optional().default([]),
        minSpend: z.string().optional().default(""),
        maxRedemptions: z.string().optional().default(""),
        targetGroups: z.array(z.string()).optional().default([]),
        status: z.string().optional().default("draft"),
      });
      const input = schema.parse(req.body);
      const campaign = await storage.createCampaign({
        ...input,
        createdAt: new Date().toISOString(),
      });
      res.status(201).json(campaign);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/campaigns", async (_req, res) => {
    try {
      const all = await storage.getCampaigns();
      res.json(all);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/campaigns/owner/:ownerKey", async (req, res) => {
    try {
      const list = await storage.getCampaignsByOwner(req.params.ownerKey);
      res.json(list);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const updated = await storage.updateCampaign(id, req.body);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deleteCampaign(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics routes
  app.post("/api/analytics/event", async (req, res) => {
    try {
      const schema = z.object({
        eventType: z.string().min(1),
        userId: z.string().optional().nullable(),
        restaurantId: z.number().optional().nullable(),
        metadata: z.string().optional().nullable(),
        timestamp: z.string().optional().default(() => new Date().toISOString()),
      });
      const input = schema.parse(req.body);
      const event = await storage.logEvent({
        eventType: input.eventType,
        userId: input.userId || null,
        restaurantId: input.restaurantId || null,
        metadata: input.metadata || null,
        timestamp: input.timestamp,
      });
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/analytics/events", async (req, res) => {
    try {
      const filters: any = {};
      if (req.query.eventType) filters.eventType = req.query.eventType as string;
      if (req.query.userId) filters.userId = req.query.userId as string;
      if (req.query.restaurantId) filters.restaurantId = parseInt(req.query.restaurantId as string);
      if (req.query.since) filters.since = req.query.since as string;
      if (req.query.until) filters.until = req.query.until as string;
      const events = await storage.getEvents(filters);
      res.json(events);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/analytics/summary", async (_req, res) => {
    try {
      const [totalUsers, totalRestaurants, totalEvents, totalCampaigns] = await Promise.all([
        storage.getUserCount(),
        storage.getRestaurantCount(),
        storage.getEventCounts(),
        storage.getCampaigns().then(c => c.length),
      ]);
      const swipeRights = await storage.getEventCounts("swipe_right");
      const swipeLefts = await storage.getEventCounts("swipe_left");
      const views = await storage.getEventCounts("view_detail");
      const saves = await storage.getEventCounts("save");
      const quizStarts = await storage.getEventCounts("quiz_start");

      const eventBreakdown: Record<string, number> = {
        swipe_right: swipeRights,
        swipe_left: swipeLefts,
        view_detail: views,
        save: saves,
        quiz_start: quizStarts,
      };

      res.json({
        totalUsers,
        totalRestaurants,
        totalEvents,
        totalSwipes: swipeRights + swipeLefts,
        totalCampaigns,
        swipeRights,
        swipeLefts,
        views,
        saves,
        quizStarts,
        eventBreakdown,
        activeCampaigns: (await storage.getCampaigns()).filter(c => c.status === "active").length,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/analytics/top-restaurants", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const top = await storage.getTopRestaurantsByEvent("swipe_right", limit);
      const restaurants = await Promise.all(
        top.map(async (t) => {
          const r = await storage.getRestaurantById(t.restaurantId);
          return { ...t, name: r?.name || "Unknown", restaurant: r };
        })
      );
      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/analytics/user-segments", async (_req, res) => {
    try {
      const totalUsers = await storage.getUserCount();
      const segments = [
        { id: "power_users", name: "Power Users", description: "Users with 20+ swipes — highly engaged and decisive", estimatedCount: Math.floor(totalUsers * 0.15) || 12 },
        { id: "new_users", name: "New Users", description: "Users with fewer than 5 interactions — just getting started", estimatedCount: Math.floor(totalUsers * 0.3) || 25 },
        { id: "thai_food_lovers", name: "Thai Food Lovers", description: "Users who frequently swipe right on Thai restaurants", estimatedCount: Math.floor(totalUsers * 0.35) || 30 },
        { id: "budget_diners", name: "Budget Diners", description: "Users with budget preference set to ฿ — value-conscious", estimatedCount: Math.floor(totalUsers * 0.25) || 20 },
        { id: "high_spenders", name: "High Spenders", description: "Users with budget ฿฿฿-฿฿฿฿ — willing to pay for quality", estimatedCount: Math.floor(totalUsers * 0.1) || 8 },
        { id: "weekend_browsers", name: "Weekend Browsers", description: "Users most active on Saturday and Sunday", estimatedCount: Math.floor(totalUsers * 0.4) || 35 },
        { id: "lunch_crowd", name: "Lunch Crowd", description: "Users most active between 11am–2pm — great for lunch promos", estimatedCount: Math.floor(totalUsers * 0.3) || 22 },
        { id: "group_planners", name: "Group Planners", description: "Users who have created or joined group sessions", estimatedCount: Math.floor(totalUsers * 0.08) || 6 },
        { id: "savers", name: "Active Savers", description: "Users who save restaurants frequently to their buckets", estimatedCount: Math.floor(totalUsers * 0.2) || 15 },
        { id: "explorers", name: "Explorers", description: "Users who browse many categories and cuisines", estimatedCount: Math.floor(totalUsers * 0.18) || 14 },
      ];
      res.json(segments);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const adminAuth = async (req: any, res: any, next: any) => {
    const authHeader = req.headers["x-admin-token"];
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const decoded = Buffer.from(authHeader, "base64").toString();
      const [username] = decoded.split(":");
      const admin = await storage.getAdminUser(username);
      if (!admin || admin.isActive === false) return res.status(401).json({ message: "Unauthorized" });
      req.adminUser = admin;
      next();
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };

  const ownerAuth = async (req: any, res: any, next: any) => {
    const authHeader = req.headers["x-owner-token"];
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const decoded = Buffer.from(authHeader, "base64").toString();
      const [email] = decoded.split(":");
      const owner = await storage.getRestaurantOwnerByEmail(email);
      if (!owner) return res.status(401).json({ message: "Unauthorized" });
      req.ownerUser = owner;
      next();
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Ad Banner routes
  app.get("/api/banners", async (_req, res) => {
    try {
      const banners = await storage.getBanners();
      res.json(banners);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/banners", adminAuth, async (req, res) => {
    try {
      const schema = z.object({
        title: z.string().min(1),
        imageUrl: z.string().min(1),
        linkUrl: z.string().optional().default(""),
        position: z.string().optional().default("home_top"),
        isActive: z.boolean().optional().default(true),
        startDate: z.string().optional().default(""),
        endDate: z.string().optional().default(""),
      });
      const input = schema.parse(req.body);
      const banner = await storage.createBanner(input);
      res.status(201).json(banner);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/admin/banners/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const updated = await storage.updateBanner(id, req.body);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/banners/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deleteBanner(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const schema = z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      });
      const input = schema.parse(req.body);
      const admin = await storage.getAdminUser(input.username);
      if (!admin || admin.passwordHash !== hashPassword(input.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (admin.isActive === false) {
        return res.status(403).json({ message: "Account disabled" });
      }
      res.json({
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions || [],
        sessionType: "admin",
        loggedIn: true,
      });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/owner-login", async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(1),
      });
      const input = schema.parse(req.body);
      const owner = await storage.getRestaurantOwnerByEmail(input.email);
      if (!owner || owner.passwordHash !== hashPassword(input.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      let restaurant = null;
      if (owner.restaurantId) {
        restaurant = await storage.getRestaurantById(owner.restaurantId);
      }
      res.json({
        id: owner.id,
        email: owner.email,
        displayName: owner.displayName,
        restaurantId: owner.restaurantId,
        restaurantName: restaurant?.name || null,
        isVerified: owner.isVerified,
        subscriptionTier: owner.subscriptionTier,
        sessionType: "owner",
        loggedIn: true,
      });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/admin-users", adminAuth, async (_req, res) => {
    try {
      const users = await storage.getAllAdminUsers();
      res.json(users.map(u => ({ ...u, passwordHash: undefined })));
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/admin-users", adminAuth, async (req: any, res) => {
    try {
      if (req.adminUser?.role !== "superadmin") {
        return res.status(403).json({ message: "Only superadmins can create admin users" });
      }
      const schema = z.object({
        username: z.string().min(1),
        password: z.string().min(4),
        role: z.enum(["superadmin", "admin", "moderator", "viewer"]),
        permissions: z.array(z.string()).optional().default([]),
      });
      const input = schema.parse(req.body);
      const existing = await storage.getAdminUser(input.username);
      if (existing) return res.status(409).json({ message: "Username already exists" });
      const user = await storage.createAdminUser({
        username: input.username,
        passwordHash: hashPassword(input.password),
        role: input.role,
        permissions: input.permissions,
        isActive: true,
        createdAt: new Date().toISOString(),
      });
      res.status(201).json({ ...user, passwordHash: undefined });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/admin/admin-users/:id", adminAuth, async (req: any, res) => {
    try {
      if (req.adminUser?.role !== "superadmin") {
        return res.status(403).json({ message: "Only superadmins can modify admin users" });
      }
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const updates: any = {};
      if (req.body.role) updates.role = req.body.role;
      if (req.body.permissions) updates.permissions = req.body.permissions;
      if (typeof req.body.isActive === "boolean") updates.isActive = req.body.isActive;
      if (req.body.password) updates.passwordHash = hashPassword(req.body.password);
      const updated = await storage.updateAdminUser(id, updates);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json({ ...updated, passwordHash: undefined });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/owners", adminAuth, async (_req, res) => {
    try {
      const owners = await storage.getAllRestaurantOwners();
      res.json(owners.map(o => ({ ...o, passwordHash: undefined })));
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/owners", adminAuth, async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(4),
        displayName: z.string().min(1),
        phone: z.string().optional(),
        restaurantId: z.number().optional(),
      });
      const input = schema.parse(req.body);
      const existing = await storage.getRestaurantOwnerByEmail(input.email);
      if (existing) return res.status(409).json({ message: "Email already registered" });
      const owner = await storage.createRestaurantOwner({
        email: input.email,
        passwordHash: hashPassword(input.password),
        displayName: input.displayName,
        phone: input.phone || null,
        restaurantId: input.restaurantId || null,
        isVerified: false,
        verificationStatus: "pending",
        subscriptionTier: "free",
        createdAt: new Date().toISOString(),
      });
      res.status(201).json({ ...owner, passwordHash: undefined });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/admin/owners/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const updates: any = {};
      if (typeof req.body.isVerified === "boolean") updates.isVerified = req.body.isVerified;
      if (req.body.verificationStatus) updates.verificationStatus = req.body.verificationStatus;
      if (req.body.subscriptionTier) updates.subscriptionTier = req.body.subscriptionTier;
      if (req.body.subscriptionExpiry) updates.subscriptionExpiry = req.body.subscriptionExpiry;
      if (req.body.restaurantId !== undefined) updates.restaurantId = req.body.restaurantId;
      const updated = await storage.updateRestaurantOwner(id, updates);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json({ ...updated, passwordHash: undefined });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/claims", adminAuth, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const claims = await storage.getRestaurantClaims(status);
      const enriched = await Promise.all(claims.map(async (c) => {
        const owner = await storage.getRestaurantOwnerById(c.ownerId);
        const restaurant = await storage.getRestaurantById(c.restaurantId);
        return {
          ...c,
          ownerName: owner?.displayName || "Unknown",
          ownerEmail: owner?.email || "",
          ownerPhone: owner?.phone || "",
          restaurantName: restaurant?.name || "Unknown",
          restaurantAddress: restaurant?.address || "",
          restaurantCategory: restaurant?.category || "",
          restaurantImageUrl: restaurant?.imageUrl || "",
        };
      }));
      res.json(enriched);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/claims", async (req, res) => {
    try {
      const schema = z.object({
        restaurantId: z.number(),
        ownerId: z.number(),
        proofDocuments: z.array(z.string()).optional().default([]),
        ownershipType: z.enum(["single_location", "franchise_owner", "franchisee"]).optional().default("single_location"),
        notes: z.string().optional(),
      });
      const input = schema.parse(req.body);
      const claim = await storage.createRestaurantClaim({
        ...input,
        status: "pending",
        verificationChecklist: VERIFICATION_CHECKLIST_TEMPLATE,
        reviewNotes: input.notes || null,
        submittedAt: new Date().toISOString(),
      });
      res.status(201).json(claim);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/admin/claims/:id", adminAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const claim = await storage.getRestaurantClaimById(id);
      if (!claim) return res.status(404).json({ message: "Claim not found" });
      const updates: any = {};
      if (req.body.status) updates.status = req.body.status;
      if (req.body.reviewNotes !== undefined) updates.reviewNotes = req.body.reviewNotes;
      if (req.body.verificationChecklist) updates.verificationChecklist = req.body.verificationChecklist;
      updates.reviewedBy = req.adminUser?.id;
      updates.reviewedAt = new Date().toISOString();
      const updated = await storage.updateRestaurantClaim(id, updates);
      if (req.body.status === "approved") {
        await storage.updateRestaurant(claim.restaurantId, {
          ownerId: claim.ownerId,
          ownerClaimStatus: "approved",
        });
        await storage.updateRestaurantOwner(claim.ownerId, {
          restaurantId: claim.restaurantId,
          isVerified: true,
          verificationStatus: "approved",
        });
      }
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/owner/search-restaurants", ownerAuth, async (req: any, res) => {
    try {
      const query = (req.query.q as string || "").trim().toLowerCase();
      const all = await storage.getRestaurants();
      const filtered = query
        ? all.filter(r =>
            r.name.toLowerCase().includes(query) ||
            r.address.toLowerCase().includes(query) ||
            r.category.toLowerCase().includes(query)
          )
        : all;
      res.json(filtered.slice(0, 20));
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/owner/dashboard", ownerAuth, async (req: any, res) => {
    try {
      const owner = req.ownerUser;
      let restaurant = null;
      if (owner.restaurantId) {
        restaurant = await storage.getRestaurantById(owner.restaurantId);
      }
      const campaigns = owner.restaurantId
        ? await storage.getCampaignsByOwner(String(owner.id))
        : [];
      const claims = await storage.getRestaurantClaims();
      const myClaims = claims.filter(c => c.ownerId === owner.id);
      let stats = { views: 0, likes: 0, saves: 0, deliveryTaps: 0 };
      if (owner.restaurantId) {
        const events = await storage.getEvents({ restaurantId: owner.restaurantId });
        stats.views = events.filter(e => e.eventType === "view_detail").length;
        stats.likes = events.filter(e => e.eventType === "swipe_right").length;
        stats.saves = events.filter(e => e.eventType === "save").length;
        stats.deliveryTaps = events.filter(e => e.eventType === "delivery_tap").length;
      }
      res.json({
        owner: { ...owner, passwordHash: undefined },
        restaurant,
        campaigns,
        claims: myClaims,
        stats,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/dashboard", adminAuth, async (_req, res) => {
    try {
      const [totalUsers, totalRestaurants, totalEvents] = await Promise.all([
        storage.getUserCount(),
        storage.getRestaurantCount(),
        storage.getEventCounts(),
      ]);
      const allCampaigns = await storage.getCampaigns();
      const activeCampaigns = allCampaigns.filter(c => c.status === "active").length;
      const swipeRights = await storage.getEventCounts("swipe_right");
      const banners = await storage.getBanners();
      const activeBanners = banners.filter(b => b.isActive).length;
      const recentEvents = await storage.getEvents();

      const swipeLefts = await storage.getEventCounts("swipe_left");
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const eventsToday = await storage.getEventCounts(undefined, todayStart.toISOString());

      res.json({
        totalUsers,
        totalRestaurants,
        totalEvents,
        totalSwipes: swipeRights + swipeLefts,
        totalCampaigns: allCampaigns.length,
        activeCampaigns,
        swipeRights,
        activeBanners,
        draftCampaigns: allCampaigns.filter(c => c.status === "draft").length,
        eventsToday,
        recentEvents: recentEvents.slice(0, 20),
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/users", adminAuth, async (_req, res) => {
    try {
      const users = await storage.getAllProfiles();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/restaurants", adminAuth, async (_req, res) => {
    try {
      const all = await storage.getRestaurants();
      res.json(all);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/admin/restaurants/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const updated = await storage.updateRestaurant(id, req.body);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/restaurants/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deleteRestaurant(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/google-places/fetch", adminAuth, async (req, res) => {
    try {
      const schema = z.object({
        query: z.string().default("restaurants in Bangkok"),
        radius: z.number().default(5000),
        lat: z.number().default(13.7563),
        lng: z.number().default(100.5018),
        maxResults: z.number().default(20),
      });
      const input = schema.parse(req.body);

      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          message: "Google Places API key not configured. Add GOOGLE_PLACES_API_KEY in environment secrets.",
          code: "MISSING_API_KEY",
        });
      }

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${input.lat},${input.lng}&radius=${input.radius}&type=restaurant&keyword=${encodeURIComponent(input.query)}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        return res.status(400).json({
          message: `Google Places API error: ${data.status} — ${data.error_message || "Unknown error"}`,
          code: "API_ERROR",
        });
      }

      const places = (data.results || []).slice(0, input.maxResults);
      const mapped = places.map((place: any) => {
        const photoRef = place.photos?.[0]?.photo_reference;
        const imageUrl = photoRef
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${apiKey}`
          : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60";

        const classified = classifyRestaurant(place);

        return {
          name: place.name,
          description: classified.description,
          imageUrl,
          lat: String(place.geometry?.location?.lat || input.lat),
          lng: String(place.geometry?.location?.lng || input.lng),
          category: classified.category,
          priceLevel: classified.priceLevel,
          rating: String(place.rating || "4.0"),
          address: place.vicinity || place.formatted_address || "Bangkok",
          isNew: classified.isNew,
          trendingScore: classified.trendingScore,
          googlePlaceId: place.place_id || null,
          classification: {
            cuisine: classified.cuisineDetected,
            style: classified.styleDetected,
            ownershipType: classified.ownershipType,
            confidence: classified.confidence,
            reviewCount: classified.reviewCount,
          },
        };
      });

      res.json({
        fetched: mapped.length,
        restaurants: mapped,
        nextPageToken: data.next_page_token || null,
      });
    } catch (err) {
      console.error("Google Places fetch error:", err);
      res.status(500).json({ message: "Failed to fetch from Google Places API" });
    }
  });

  app.post("/api/admin/google-places/import", adminAuth, async (req, res) => {
    try {
      const schema = z.object({
        restaurants: z.array(z.object({
          name: z.string(),
          description: z.string(),
          imageUrl: z.string(),
          lat: z.string(),
          lng: z.string(),
          category: z.string(),
          priceLevel: z.number(),
          rating: z.string(),
          address: z.string(),
          isNew: z.boolean().optional(),
          trendingScore: z.number().optional(),
          googlePlaceId: z.string().optional(),
        })),
        replaceExisting: z.boolean().default(false),
      });
      const input = schema.parse(req.body);

      if (input.replaceExisting) {
        await storage.seedRestaurants(input.restaurants);
      } else {
        for (const r of input.restaurants) {
          await storage.addRestaurant(r);
        }
      }

      res.json({ imported: input.restaurants.length, success: true });
    } catch (err) {
      console.error("Import error:", err);
      res.status(500).json({ message: "Failed to import restaurants" });
    }
  });

  app.post("/api/group/sessions", async (req, res) => {
    try {
      const schema = z.object({
        sessionCode: z.string().min(1),
        hostLineUserId: z.string().min(1),
        hostDisplayName: z.string().min(1),
        hostPictureUrl: z.string().optional(),
      });
      const input = schema.parse(req.body);

      const existing = await storage.getGroupSession(input.sessionCode);
      if (existing) {
        return res.status(409).json({ message: "Session already exists" });
      }

      const session = await storage.createGroupSession({
        sessionCode: input.sessionCode,
        hostLineUserId: input.hostLineUserId,
        status: "waiting",
        createdAt: new Date().toISOString(),
      });

      await storage.addGroupMember({
        sessionCode: input.sessionCode,
        lineUserId: input.hostLineUserId,
        displayName: input.hostDisplayName,
        pictureUrl: input.hostPictureUrl || null,
        joinedAt: new Date().toISOString(),
      });

      res.status(201).json(session);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/group/sessions/:code/join", async (req, res) => {
    try {
      const { code } = req.params;
      const schema = z.object({
        lineUserId: z.string().min(1),
        displayName: z.string().min(1),
        pictureUrl: z.string().optional(),
      });
      const input = schema.parse(req.body);

      const session = await storage.getGroupSession(code);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      const alreadyMember = await storage.isGroupMember(code, input.lineUserId);
      if (alreadyMember) {
        const members = await storage.getGroupMembers(code);
        return res.json({ session, members });
      }

      const member = await storage.addGroupMember({
        sessionCode: code,
        lineUserId: input.lineUserId,
        displayName: input.displayName,
        pictureUrl: input.pictureUrl || null,
        joinedAt: new Date().toISOString(),
      });

      const members = await storage.getGroupMembers(code);
      res.status(201).json({ session, members, newMember: member });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/group/sessions/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const session = await storage.getGroupSession(code);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      const members = await storage.getGroupMembers(code);
      res.json({ session, members });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/group/sessions/:code/status", async (req, res) => {
    try {
      const { code } = req.params;
      const schema = z.object({
        status: z.enum(["waiting", "swiping", "completed"]),
        lineUserId: z.string().min(1),
      });
      const input = schema.parse(req.body);

      const session = await storage.getGroupSession(code);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.hostLineUserId !== input.lineUserId) {
        return res.status(403).json({ message: "Only the host can change session status" });
      }

      await storage.updateGroupSessionStatus(code, input.status);
      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/group/sessions/:code/swipe", async (req, res) => {
    try {
      const { code } = req.params;
      const schema = z.object({
        lineUserId: z.string().min(1),
        menuItemId: z.number(),
        direction: z.enum(["left", "right", "super"]),
      });
      const input = schema.parse(req.body);

      const isMember = await storage.isGroupMember(code, input.lineUserId);
      if (!isMember) {
        return res.status(403).json({ message: "Not a member of this session" });
      }

      const swipe = await storage.recordGroupSwipe({
        sessionCode: code,
        lineUserId: input.lineUserId,
        menuItemId: input.menuItemId,
        direction: input.direction,
        swipedAt: new Date().toISOString(),
      });

      const matches = await storage.getGroupMatches(code);
      const members = await storage.getGroupMembers(code);

      res.json({ swipe, matches, memberCount: members.length });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/group/sessions/:code/matches", async (req, res) => {
    try {
      const { code } = req.params;
      const matches = await storage.getGroupMatches(code);
      const members = await storage.getGroupMembers(code);
      res.json({ matches, members });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/group/sessions/:code/swipes", async (req, res) => {
    try {
      const { code } = req.params;
      const swipes = await storage.getGroupSwipes(code);
      const members = await storage.getGroupMembers(code);
      res.json({ swipes, members });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
