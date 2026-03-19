import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { createHash, randomBytes } from "crypto";
import { classifyRestaurant, VERIFICATION_CHECKLIST_TEMPLATE } from "./classifier";
import { autoAssignVibes, autoDetectDistrict } from "@shared/vibeConfig";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function generateSessionCode(): string {
  return randomBytes(4).toString("hex");
}

function logSessionEvent(sessionCode: string, eventType: string, actorId: string, payload?: any, idempotencyKey?: string) {
  storage.createSessionEvent({
    sessionCode,
    eventType,
    actorId,
    payload: payload || null,
    idempotencyKey: idempotencyKey || null,
    createdAt: new Date().toISOString(),
  }).catch(err => console.error("Failed to log session event:", err));
}

function logAudit(action: string, actorType: string, actorId: string, targetType?: string, targetId?: string, metadata?: any, ipAddress?: string) {
  storage.createAuditLog({
    action,
    actorType,
    actorId,
    targetType: targetType || null,
    targetId: targetId || null,
    metadata: metadata || null,
    ipAddress: ipAddress || null,
    createdAt: new Date().toISOString(),
  }).catch(err => console.error("Failed to log audit event:", err));
}

const RATE_LIMIT_MAX_BUCKETS = 10000;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
function rateLimit(key: string, maxPerWindow: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    if (rateLimitBuckets.size >= RATE_LIMIT_MAX_BUCKETS) {
      const cutoff = now;
      for (const [k, v] of rateLimitBuckets) {
        if (cutoff > v.resetAt) rateLimitBuckets.delete(k);
        if (rateLimitBuckets.size < RATE_LIMIT_MAX_BUCKETS * 0.8) break;
      }
      if (rateLimitBuckets.size >= RATE_LIMIT_MAX_BUCKETS) {
        return true;
      }
    }
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count++;
  if (bucket.count > maxPerWindow) return true;
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateLimitBuckets) {
    if (now > v.resetAt) rateLimitBuckets.delete(k);
  }
}, 60000);

const CACHE_MAX_ENTRIES = 200;
const cache = new Map<string, { data: any; expiry: number }>();
function getCached<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expiry > now) return Promise.resolve(cached.data as T);
  if (cache.size >= CACHE_MAX_ENTRIES) {
    let oldest = "";
    let oldestTime = Infinity;
    for (const [k, v] of cache) { if (v.expiry < oldestTime) { oldest = k; oldestTime = v.expiry; } }
    if (oldest) cache.delete(oldest);
  }
  return fetcher().then(data => { cache.set(key, { data, expiry: now + ttlMs }); return data; });
}
function invalidateCache(prefix: string) {
  for (const key of cache.keys()) { if (key.startsWith(prefix)) cache.delete(key); }
}

interface VerifiedLineProfile {
  userId: string;
  displayName: string;
  pictureUrl: string | null;
}

async function verifyLineAccessToken(accessToken: string): Promise<VerifiedLineProfile | null> {
  try {
    const verifyRes = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `access_token=${encodeURIComponent(accessToken)}`,
    });
    if (!verifyRes.ok) return null;

    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!profileRes.ok) return null;

    const lineProfile = await profileRes.json();
    return {
      userId: lineProfile.userId,
      displayName: lineProfile.displayName,
      pictureUrl: lineProfile.pictureUrl || null,
    };
  } catch {
    return null;
  }
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

async function seedOwnerUser() {
  const restaurants = await storage.getRestaurants();
  const jayFai = restaurants.find(r => r.name === "Jay Fai");
  if (!jayFai) return;

  let owner = await storage.getRestaurantOwnerByEmail("owner@toastbkk.com");
  if (!owner) {
    owner = await storage.createRestaurantOwner({
      email: "owner@toastbkk.com",
      passwordHash: hashPassword("owner2024"),
      displayName: "Somchai Rattanakorn",
      phone: "+66 89-123-4567",
      restaurantId: jayFai.id,
      isVerified: true,
      verificationStatus: "approved",
      subscriptionTier: "premium",
      createdAt: "2026-01-15T10:00:00Z",
    });
  }

  if (owner && owner.restaurantId !== jayFai.id) {
    await storage.updateRestaurantOwner(owner.id, { restaurantId: jayFai.id });
  }

  if (owner && (!jayFai.ownerId || jayFai.ownerId !== owner.id)) {
    await storage.updateRestaurant(jayFai.id, { ownerId: owner.id, ownerClaimStatus: "verified" });
  }
}

async function seedDatabase() {
  const existing = await storage.getRestaurants();
  if (existing.length < 40) {
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
      {
        name: "Som Tam Nua",
        description: "Famous Siam Square papaya salad and Isaan fried chicken.",
        imageUrl: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop&q=60",
        lat: "13.7455",
        lng: "100.5345",
        category: "Thai  •  Isaan",
        priceLevel: 1,
        rating: "4.7",
        address: "Siam Square",
        isNew: false,
        trendingScore: 94,
      },
      {
        name: "Thipsamai Pad Thai",
        description: "Legendary pad thai wrapped in egg since 1966.",
        imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=60",
        lat: "13.7520",
        lng: "100.5050",
        category: "Thai  •  Noodles",
        priceLevel: 1,
        rating: "4.9",
        address: "Phra Nakhon",
        isNew: false,
        trendingScore: 97,
      },
      {
        name: "Gaggan Anand",
        description: "Progressive Indian cuisine by Asia's most celebrated chef.",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
        lat: "13.7350",
        lng: "100.5620",
        category: "Indian  •  Fine dining",
        priceLevel: 4,
        rating: "4.9",
        address: "Langsuan",
        isNew: false,
        trendingScore: 99,
      },
      {
        name: "Jay Fai",
        description: "Michelin-starred street food — crab omelette and drunken noodles.",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60",
        lat: "13.7530",
        lng: "100.5060",
        category: "Thai  •  Street food",
        priceLevel: 3,
        rating: "4.8",
        address: "Maha Chai Rd",
        isNew: false,
        trendingScore: 98,
      },
      {
        name: "Sorn",
        description: "Two Michelin-star Southern Thai cuisine with foraged ingredients.",
        imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=60",
        lat: "13.7315",
        lng: "100.5705",
        category: "Thai  •  Fine dining",
        priceLevel: 4,
        rating: "4.9",
        address: "Sukhumvit 26",
        isNew: false,
        trendingScore: 96,
      },
      {
        name: "Namsaah Bottling Trust",
        description: "Creative Thai-Western fusion in a converted bottling factory.",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
        lat: "13.7295",
        lng: "100.5330",
        category: "Fusion  •  Modern",
        priceLevel: 3,
        rating: "4.5",
        address: "Silom Soi 7",
        isNew: true,
        trendingScore: 84,
      },
      {
        name: "Baan Ice",
        description: "Home-style royal Thai recipes served in a heritage house.",
        imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=60",
        lat: "13.7400",
        lng: "100.5150",
        category: "Thai  •  Traditional",
        priceLevel: 2,
        rating: "4.6",
        address: "Soi Phiphat",
        isNew: false,
        trendingScore: 89,
      },
      {
        name: "Caturday Cat Cafe",
        description: "Cozy cafe with rescue cats, great coffee, and fluffy pancakes.",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60",
        lat: "13.7440",
        lng: "100.5370",
        category: "Cafe  •  Themed",
        priceLevel: 2,
        rating: "4.3",
        address: "Ratchathewi",
        isNew: false,
        trendingScore: 75,
      },
      {
        name: "Sukhumvit Soi 38 Night Market",
        description: "Legendary night market with grilled seafood and mango sticky rice.",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60",
        lat: "13.7260",
        lng: "100.5690",
        category: "Thai  •  Street food",
        priceLevel: 1,
        rating: "4.4",
        address: "Sukhumvit 38",
        isNew: false,
        trendingScore: 86,
      },
      {
        name: "Bo.Lan",
        description: "Sustainable fine-dining Thai with forgotten ancestral recipes.",
        imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=60",
        lat: "13.7280",
        lng: "100.5710",
        category: "Thai  •  Fine dining",
        priceLevel: 4,
        rating: "4.7",
        address: "Sukhumvit 24",
        isNew: false,
        trendingScore: 91,
      },
      {
        name: "Sala Rattanakosin",
        description: "Rooftop Thai dining with stunning Wat Arun sunset views.",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
        lat: "13.7440",
        lng: "100.4890",
        category: "Thai  •  Rooftop",
        priceLevel: 3,
        rating: "4.5",
        address: "Maharat Rd",
        isNew: true,
        trendingScore: 87,
      },
      {
        name: "Sushi Masato",
        description: "Omakase counter with fish flown in daily from Tokyo's Toyosu.",
        imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
        lat: "13.7340",
        lng: "100.5660",
        category: "Japanese  •  Omakase",
        priceLevel: 4,
        rating: "4.8",
        address: "Phrom Phong",
        isNew: true,
        trendingScore: 93,
      },
      {
        name: "Tealicious",
        description: "Matcha lattes, hojicha desserts, and Japanese-style cheesecakes.",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=60",
        lat: "13.7310",
        lng: "100.5680",
        category: "Cafe  •  Japanese",
        priceLevel: 2,
        rating: "4.4",
        address: "Ekkamai",
        isNew: true,
        trendingScore: 81,
      },
      {
        name: "El Mercado",
        description: "Bustling Mexican cantina with fresh tacos and frozen margaritas.",
        imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=60",
        lat: "13.7340",
        lng: "100.5600",
        category: "Mexican  •  Casual",
        priceLevel: 2,
        rating: "4.3",
        address: "Sukhumvit 31",
        isNew: false,
        trendingScore: 77,
      },
      {
        name: "Supanniga Eating Room",
        description: "Elegant Eastern Thai cuisine from family recipes in Thonglor.",
        imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=60",
        lat: "13.7330",
        lng: "100.5700",
        category: "Thai  •  Eastern",
        priceLevel: 2,
        rating: "4.6",
        address: "Thonglor 10",
        isNew: false,
        trendingScore: 90,
      },
      {
        name: "Quince BKK",
        description: "Mediterranean brunch hotspot with shakshuka and craft cocktails.",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60",
        lat: "13.7360",
        lng: "100.5540",
        category: "Mediterranean  •  Brunch",
        priceLevel: 3,
        rating: "4.5",
        address: "Sukhumvit 45",
        isNew: true,
        trendingScore: 85,
      },
      {
        name: "Khao San Road Pad Krapow",
        description: "No-frills basil stir-fry with crispy fried egg — backpacker classic.",
        imageUrl: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop&q=60",
        lat: "13.7590",
        lng: "100.4970",
        category: "Thai  •  Street food",
        priceLevel: 1,
        rating: "4.2",
        address: "Khao San Rd",
        isNew: false,
        trendingScore: 80,
      },
      {
        name: "Yamazato",
        description: "Authentic kaiseki multi-course Japanese at The Okura Prestige.",
        imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
        lat: "13.7380",
        lng: "100.5560",
        category: "Japanese  •  Kaiseki",
        priceLevel: 4,
        rating: "4.7",
        address: "Wireless Rd",
        isNew: false,
        trendingScore: 88,
      },
      {
        name: "Ciao Bella Trattoria",
        description: "Handmade truffle pasta and wood-fired Neapolitan pizza.",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60",
        lat: "13.7420",
        lng: "100.5510",
        category: "Italian  •  Trattoria",
        priceLevel: 3,
        rating: "4.5",
        address: "Langsuan",
        isNew: true,
        trendingScore: 82,
      },
      {
        name: "Pla Dib",
        description: "Izakaya-style Japanese bar food with sake flights and sashimi.",
        imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
        lat: "13.7340",
        lng: "100.5700",
        category: "Japanese  •  Izakaya",
        priceLevel: 2,
        rating: "4.4",
        address: "Thonglor 17",
        isNew: false,
        trendingScore: 83,
      },
      {
        name: "Err Urban Rustic Thai",
        description: "Playful Thai street food elevated with craft cocktails and rustic decor.",
        imageUrl: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop&q=60",
        lat: "13.7430",
        lng: "100.4950",
        category: "Thai  •  Modern street",
        priceLevel: 2,
        rating: "4.6",
        address: "Maha Rat Rd",
        isNew: false,
        trendingScore: 89,
      },
      {
        name: "Ongtong Khao Soi",
        description: "Northern Thai curry noodle soup — rich coconut broth with crispy noodles.",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=60",
        lat: "13.7310",
        lng: "100.5690",
        category: "Thai  •  Northern",
        priceLevel: 1,
        rating: "4.7",
        address: "Ekkamai 4",
        isNew: false,
        trendingScore: 92,
      },
      {
        name: "72 Courtyard",
        description: "Chic food court and wine bar with curated street food vendors.",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
        lat: "13.7320",
        lng: "100.5710",
        category: "Multi  •  Food court",
        priceLevel: 2,
        rating: "4.3",
        address: "Sukhumvit 55",
        isNew: false,
        trendingScore: 78,
      },
      {
        name: "Le Du",
        description: "Modern Thai tasting menus showcasing seasonal Thai ingredients.",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
        lat: "13.7290",
        lng: "100.5310",
        category: "Thai  •  Fine dining",
        priceLevel: 4,
        rating: "4.9",
        address: "Silom Soi 7",
        isNew: false,
        trendingScore: 97,
      },
      {
        name: "Nara Thai Cuisine",
        description: "Upscale Thai dining with signature crab curry and mango salad.",
        imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=60",
        lat: "13.7460",
        lng: "100.5390",
        category: "Thai  •  Upscale",
        priceLevel: 3,
        rating: "4.5",
        address: "Central World",
        isNew: false,
        trendingScore: 85,
      },
      {
        name: "Tenjo Sushi & Yakiniku",
        description: "All-you-can-eat premium sushi and Japanese BBQ buffet.",
        imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
        lat: "13.7455",
        lng: "100.5350",
        category: "Japanese  •  Buffet",
        priceLevel: 2,
        rating: "4.2",
        address: "Siam Paragon",
        isNew: true,
        trendingScore: 79,
      },
      {
        name: "The Local",
        description: "Nostalgic Thai home cooking in a vintage Sukhumvit townhouse.",
        imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=60",
        lat: "13.7350",
        lng: "100.5630",
        category: "Thai  •  Home-style",
        priceLevel: 2,
        rating: "4.6",
        address: "Sukhumvit 23",
        isNew: false,
        trendingScore: 87,
      },
      {
        name: "Mikkeller Bangkok",
        description: "Danish craft beer bar with gourmet bar bites and weekend brunch.",
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=60",
        lat: "13.7310",
        lng: "100.5690",
        category: "Western  •  Bar & grill",
        priceLevel: 3,
        rating: "4.4",
        address: "Ekkamai 10",
        isNew: false,
        trendingScore: 76,
      },
      {
        name: "Wattana Panich",
        description: "Century-old beef noodle soup — perpetual broth since 1955.",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=60",
        lat: "13.7310",
        lng: "100.5690",
        category: "Thai  •  Noodles",
        priceLevel: 1,
        rating: "4.8",
        address: "Ekkamai Soi 18",
        isNew: false,
        trendingScore: 95,
      },
      {
        name: "Jeh O Chula",
        description: "Late-night mama noodle hot pot — Bangkok's most viral street stall.",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60",
        lat: "13.7350",
        lng: "100.5160",
        category: "Thai  •  Late night",
        priceLevel: 1,
        rating: "4.6",
        address: "Charoen Krung 73",
        isNew: false,
        trendingScore: 93,
      },
    ]);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  seedAdminUser().catch(console.error);
  seedDatabase().then(() => seedOwnerUser()).catch(console.error);

  app.get("/api/restaurants/suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getSuggestions();
      res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
      res.json(suggestions);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/restaurants/personalized", async (req, res) => {
    try {
      const ip = req.ip || "unknown";
      if (rateLimit(`personalized:${ip}`, 30, 10000)) {
        return res.status(429).json({ message: "Too many requests" });
      }
      const { userId, tasteProfile, hour, dayOfWeek, craving, preferences, avoidTags, pricePref, distancePref } = req.body;
      const allRestaurants = await getCached("restaurants:all", 30000, () => storage.getRestaurants());

      const timeSlot = hour !== undefined ? (
        hour >= 6 && hour < 11 ? "morning" :
        hour >= 11 && hour < 14 ? "lunch" :
        hour >= 14 && hour < 17 ? "afternoon" :
        hour >= 17 && hour < 21 ? "dinner" : "latenight"
      ) : "dinner";
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

      const CRAVING_MAP: Record<string, string[]> = {
        "warm": ["thai", "ramen", "noodles", "curry", "soup"],
        "spicy": ["thai", "isaan", "korean", "mexican", "indian"],
        "fresh": ["salad", "healthy", "poke", "smoothie", "vegan"],
        "balanced": ["thai", "japanese", "brunch", "western"],
        "indulgent": ["bbq", "burger", "pizza", "dessert", "fine dining"],
        "quick": ["street food", "noodles", "fast", "quick"],
        "comforting": ["ramen", "noodles", "curry", "soup", "thai"],
        "healthy": ["salad", "poke", "smoothie", "vegan", "healthy"],
        "adventurous": ["fusion", "ethiopian", "peruvian", "middle eastern"],
        "familiar": [],
        "surprise": [],
      };

      const cuisineBoosts = craving ? (CRAVING_MAP[craving.toLowerCase()] || []) : [];

      let priceNum: number | undefined;
      if (pricePref && pricePref !== "any") {
        priceNum = pricePref === "$" ? 1 : pricePref === "$$" ? 2 : 3;
      }

      let tasteDnaData = null;
      let contextPatterns = null;
      let mealMemory = null;
      let userEvents: any[] = [];
      let behaviorEvents: any[] = [];

      if (userId) {
        [tasteDnaData, contextPatterns, mealMemory, userEvents, behaviorEvents] = await Promise.all([
          storage.getTasteDna(userId),
          storage.getContextPatterns(userId),
          storage.getRecentMealMemory(userId),
          storage.getUserEvents(userId, 80),
          storage.getUserBehaviorEvents(userId, 80),
        ]);
      }

      if (tasteProfile && tasteDnaData) {
        const { likes = {}, superLikes = {} } = tasteProfile;
        const affinityUpdates = { ...(tasteDnaData.cuisineAffinityJson as Record<string, number> || {}) };
        for (const [cat, entry] of Object.entries(likes) as [string, any][]) {
          affinityUpdates[cat.toLowerCase()] = (affinityUpdates[cat.toLowerCase()] || 0) + (entry.count || 1) * 1.5;
        }
        for (const [cat, entry] of Object.entries(superLikes) as [string, any][]) {
          affinityUpdates[cat.toLowerCase()] = (affinityUpdates[cat.toLowerCase()] || 0) + (entry.count || 1) * 3;
        }
        tasteDnaData = { ...tasteDnaData, cuisineAffinityJson: affinityUpdates };
      }

      const { buildUserHistory, generateRecommendation } = await import("./recommendation/index");
      const userHistory = buildUserHistory(userEvents, behaviorEvents);

      const result = generateRecommendation(
        allRestaurants,
        {
          userId: userId || "anonymous",
          daypart: timeSlot,
          isWeekend,
          mood: craving?.toLowerCase(),
          avoidTags: avoidTags || [],
          cuisineBoosts,
          pricePref: priceNum,
        },
        tasteDnaData,
        contextPatterns,
        mealMemory,
        userHistory,
        userEvents.length
      );

      if (!result) {
        return res.json([]);
      }

      const formatResult = (item: any, index: number) => {
        const r = allRestaurants.find(rest => rest.id === item.restaurantId) || null;
        const rCats = r ? r.category.toLowerCase().split(/[,·•]/).map((c: string) => c.trim()) : [];

        const nameHash = (item.name || "").split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0) % 25;
        const daypartScore = rCats.some(c =>
          (timeSlot === "lunch" && ["thai", "japanese", "noodles"].some(t => c.includes(t))) ||
          (timeSlot === "dinner" && ["bbq", "fine dining", "sushi"].some(t => c.includes(t)))
        ) ? Math.min(100, 70 + nameHash) : Math.round(30 + nameHash);

        return {
          id: item.restaurantId,
          name: item.name,
          category: item.category || r?.category,
          rating: item.rating || r?.rating,
          imageUrl: item.imageUrl || r?.imageUrl,
          address: item.address || r?.address,
          priceLevel: item.priceLevel ?? r?.priceLevel,
          district: item.district || r?.district || null,
          match: item.match,
          reasonChips: item.reasonChips || [],
          confidenceText: index === 0 ? (result.primary.confidenceLabel || "Good match") : undefined,
          insight: item.reasonChips?.join(" \u00B7 ") || null,
          scores: {
            taste: Math.min(99, Math.round(item.match * 1.1)),
            daypart: daypartScore,
            popularity: Math.min(99, Math.round((r?.trendingScore || 50) * 0.99)),
            value: Math.min(99, Math.round(100 - ((r?.priceLevel || 2) - 1) * 20 + (parseFloat(r?.rating || "4") || 4) * 3)),
          },
          description: r?.description || null,
          vibes: r?.vibes || [],
        };
      };

      const results = [
        formatResult(result.primary, 0),
        ...result.alternatives.map((alt, i) => formatResult(alt, i + 1)),
      ];

      res.json(results.slice(0, 5));
    } catch (err) {
      console.error("Personalized suggestions error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/session/bootstrap", async (req, res) => {
    try {
      const { accessToken, lat, lng, timezone, locale } = req.body;
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = now.getDay();
      const daypart = hour >= 6 && hour < 11 ? "morning" :
        hour >= 11 && hour < 14 ? "lunch" :
        hour >= 14 && hour < 17 ? "afternoon" :
        hour >= 17 && hour < 21 ? "dinner" : "latenight";
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      let lineProfile: VerifiedLineProfile | null = null;
      let userProfile: any = null;
      let isFirstVisit = true;

      if (accessToken) {
        lineProfile = await verifyLineAccessToken(accessToken);
        if (lineProfile) {
          userProfile = await storage.getProfile(lineProfile.userId);
          if (userProfile) {
            isFirstVisit = false;
          } else {
            userProfile = await storage.upsertProfile({
              lineUserId: lineProfile.userId,
              displayName: lineProfile.displayName,
              pictureUrl: lineProfile.pictureUrl,
            });
          }
        }
      }

      const userId = lineProfile?.userId || "anonymous";

      const allRestaurants = await getCached("restaurants:all", 30000, () => storage.getRestaurants());

      let tasteDnaData = null;
      let contextPatterns = null;
      let mealMemory = null;
      let userEvents: any[] = [];
      let behaviorEvents: any[] = [];

      if (userId !== "anonymous") {
        [tasteDnaData, contextPatterns, mealMemory, userEvents, behaviorEvents] = await Promise.all([
          storage.getTasteDna(userId),
          storage.getContextPatterns(userId),
          storage.getRecentMealMemory(userId),
          storage.getUserEvents(userId, 50),
          storage.getUserBehaviorEvents(userId, 50),
        ]);
      }

      const tasteDnaSummary = tasteDnaData ? {
        comfort: tasteDnaData.comfortScore || 50,
        exploration: tasteDnaData.explorationScore || 50,
        healthy: tasteDnaData.healthyScore || 50,
        indulgent: tasteDnaData.indulgentScore || 50,
        spicy: tasteDnaData.spiceScore || 50,
        distance: tasteDnaData.distanceScore || 50,
        budget: tasteDnaData.budgetScore || 50,
        novelty: tasteDnaData.noveltyScore || 50,
      } : {
        comfort: 50, exploration: 50, healthy: 50, indulgent: 50,
        spicy: 50, distance: 50, budget: 50, novelty: 50,
      };

      const { buildUserHistory, generateRecommendation } = await import("./recommendation/index");

      const userHistory = buildUserHistory(userEvents, behaviorEvents);

      const result = generateRecommendation(
        allRestaurants,
        {
          userId,
          daypart,
          isWeekend,
          areaLabel: undefined,
          mood: undefined,
          weatherLabel: undefined,
        },
        tasteDnaData,
        contextPatterns,
        mealMemory,
        userHistory,
        userEvents.length
      );

      let dailyPick: any = null;
      let alternatives: any[] = [];

      if (result) {
        dailyPick = result.primary;
        alternatives = result.alternatives;
      } else {
        const fallback = allRestaurants.slice(0, 3);
        if (fallback.length > 0) {
          dailyPick = {
            restaurantId: fallback[0].id,
            name: fallback[0].name,
            imageUrl: fallback[0].imageUrl,
            category: fallback[0].category,
            address: fallback[0].address,
            district: fallback[0].district,
            rating: fallback[0].rating,
            priceLevel: fallback[0].priceLevel,
            confidenceLabel: "Worth trying",
            reasonChips: ["Popular nearby"],
            match: 60,
            distanceText: null,
          };
          alternatives = fallback.slice(1).map(r => ({
            restaurantId: r.id,
            name: r.name,
            imageUrl: r.imageUrl,
            category: r.category,
            address: r.address,
            district: r.district,
            rating: r.rating,
            priceLevel: r.priceLevel,
            match: 55,
            reasonChips: [],
          }));
        }
      }

      let sessionId: number | null = null;
      if (userId !== "anonymous" && dailyPick) {
        try {
          const recIds = [dailyPick.restaurantId, ...alternatives.map((a: any) => a.restaurantId)];
          const session = await storage.createDecisionSession({
            userId,
            daypart,
            createdAt: now.toISOString(),
            recommendationIdsJson: JSON.stringify(recIds),
            resultConfidence: result?.confidence?.score || null,
          });
          sessionId = session.id;
        } catch {}
      }

      res.json({
        user: lineProfile ? {
          id: userProfile?.id || null,
          lineUserId: lineProfile.userId,
          displayName: lineProfile.displayName,
          avatarUrl: lineProfile.pictureUrl,
        } : null,
        session: {
          isFirstVisit,
          daypart,
          serverTime: now.toISOString(),
          locationUsed: !!(lat && lng),
          sessionId,
        },
        tasteDnaSummary,
        dailyPick,
        alternatives,
      });
    } catch (err) {
      console.error("Bootstrap error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const VALID_DECISION_EVENTS = [
    "hero_impression", "primary_cta_clicked", "alternative_requested",
    "refine_opened", "refine_applied", "recommendation_accepted",
    "recommendation_rejected", "detail_viewed", "saved", "session_abandoned",
    "swipe_right", "swipe_left", "restaurant_detail_opened",
  ];

  async function processDecisionEvent(evt: { userId?: string; eventType: string; restaurantId?: number | null; metadata?: any; sessionId?: string | number }) {
    const userId = evt.userId || "anonymous";
    const { eventType, restaurantId, metadata, sessionId } = evt;
    const now = new Date();
    const meta = typeof metadata === "object" ? metadata : (metadata ? (() => { try { return JSON.parse(metadata); } catch { return {}; } })() : {});

    await storage.logEvent({
      eventType,
      userId,
      restaurantId: restaurantId || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      timestamp: now.toISOString(),
    });

    const hour = now.getHours();
    const daypart = hour >= 6 && hour < 11 ? "morning" :
      hour >= 11 && hour < 14 ? "lunch" :
      hour >= 14 && hour < 17 ? "afternoon" :
      hour >= 17 && hour < 21 ? "dinner" : "latenight";
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    try {
      await storage.logBehaviorEvent({
        userId,
        sessionId: sessionId?.toString() || null,
        eventType,
        restaurantId: restaurantId || null,
        cuisineTag: meta.category?.toLowerCase() || null,
        cravingTag: meta.craving || null,
        timeOfDay: daypart,
        dayOfWeek: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][now.getDay()],
        areaLabel: meta.area || null,
        weatherLabel: meta.weather || null,
        groupSize: meta.groupSize || null,
        eventWeight: (await import("./recommendation/eventWeighting")).getEventWeight(eventType),
        createdAt: now.toISOString(),
      });
    } catch {}

    if (eventType === "recommendation_accepted" && sessionId && restaurantId) {
      try {
        await storage.updateDecisionSession(Number(sessionId), {
          chosenRestaurantId: restaurantId,
          timeToDecisionMs: meta?.timeToDecisionMs || null,
          successFlag: true,
          endedAt: now.toISOString(),
        });
      } catch {}
    }

    if (userId && userId !== "anonymous") {
      const triggerEvents = [
        "recommendation_accepted", "primary_cta_clicked", "saved", "detail_viewed",
        "recommendation_rejected", "alternative_requested", "session_abandoned",
        "swipe_right", "swipe_left", "restaurant_detail_opened",
      ];

      if (triggerEvents.includes(eventType)) {
        try {
          const { computeTasteDnaUpdates, computeContextPatternUpdate, computeRecentMealUpdate } = await import("./recommendation/tasteDnaWorker");

          let dna = await storage.getTasteDna(userId);
          if (!dna) {
            dna = await storage.upsertTasteDna({ userId, updatedAt: now.toISOString() });
          }

          let restaurant = null;
          if (restaurantId) {
            restaurant = await storage.getRestaurantById(restaurantId);
          }

          const dnaUpdates = computeTasteDnaUpdates(dna, eventType, restaurant, meta);
          if (Object.keys(dnaUpdates).length > 0) {
            await storage.upsertTasteDna({
              userId,
              ...dnaUpdates,
              updatedAt: now.toISOString(),
            } as any);
          }

          if (restaurant && ["recommendation_accepted", "saved", "swipe_right"].includes(eventType)) {
            const contextPatterns = await storage.getContextPatterns(userId);
            const ctxUpdate = computeContextPatternUpdate(contextPatterns, daypart, isWeekend, restaurant);
            await storage.upsertContextPatterns(userId, ctxUpdate);

            const mealMemory = await storage.getRecentMealMemory(userId);
            const mealUpdate = computeRecentMealUpdate(mealMemory, restaurant);
            await storage.upsertRecentMealMemory(userId, mealUpdate);
          }

          if (meta.mood && restaurant && eventType === "recommendation_accepted") {
            try {
              const rCats = restaurant.category.toLowerCase().split(/[,·•]/).map((c: string) => c.trim());
              await storage.createMoodChoiceLink({
                userId,
                moodTag: meta.mood,
                chosenCuisine: rCats[0] || null,
                chosenDishType: meta.dishType || null,
                createdAt: now.toISOString(),
              });
            } catch {}
          }
        } catch (err) {
          console.error("Taste DNA update error:", err);
        }
      }
    }
  }

  app.post("/api/toast-decides/event", async (req, res) => {
    try {
      const { eventType } = req.body;
      if (!eventType) return res.status(400).json({ message: "eventType required" });
      if (!VALID_DECISION_EVENTS.includes(eventType)) {
        return res.status(400).json({ message: "Invalid event type" });
      }

      setImmediate(async () => {
        try {
          await processDecisionEvent(req.body);
        } catch (e) {
          console.error("Async event processing error:", e);
        }
      });

      res.status(202).json({ ok: true });
    } catch (err) {
      console.error("Event tracking error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/toast-decides/events", async (req, res) => {
    try {
      const { events } = req.body;
      if (!Array.isArray(events) || events.length === 0) {
        return res.status(400).json({ message: "events array required" });
      }

      setImmediate(async () => {
        for (const evt of events.slice(0, 50)) {
          try {
            if (!evt.eventType || !VALID_DECISION_EVENTS.includes(evt.eventType)) continue;
            await processDecisionEvent(evt);
          } catch (e) {
            console.error("Batch event processing error:", e);
          }
        }
      });

      res.status(202).json({ ok: true, count: events.length });
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/saved-lists", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ message: "userId required" });
      const ip = req.ip || "unknown";
      if (rateLimit(`saved-lists:${ip}`, 30, 10000)) {
        return res.status(429).json({ message: "Too many requests" });
      }
      const defaults = await storage.getOrCreateDefaultLists(userId);
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = parseInt(req.query.limit as string) || 50;
      const lists = await storage.getSavedListsWithItems(userId);
      const paginated = lists.map(list => ({
        ...list,
        items: list.items.slice(offset, offset + limit),
        totalItems: list.items.length,
      }));
      res.json(paginated);
    } catch (err) {
      console.error("Get saved lists error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/saved-lists", async (req, res) => {
    try {
      const { userId, name, emoji } = req.body;
      if (!userId || !name) return res.status(400).json({ message: "userId and name required" });
      const ip = req.ip || "unknown";
      if (rateLimit(`saved-lists-create:${ip}`, 10, 10000)) {
        return res.status(429).json({ message: "Too many requests" });
      }
      const existing = await storage.getSavedLists(userId);
      if (existing.length >= 20) {
        return res.status(400).json({ message: "Maximum 20 lists allowed" });
      }
      const list = await storage.createSavedList({
        userId, name, emoji: emoji || "📋", isDefault: false, createdAt: new Date().toISOString()
      });
      res.json(list);
    } catch (err) {
      console.error("Create saved list error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/saved-lists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userId, name, emoji } = req.body;
      if (!userId) return res.status(400).json({ message: "userId required" });
      const lists = await storage.getSavedLists(userId);
      const target = lists.find(l => l.id === id);
      if (!target) return res.status(404).json({ message: "List not found" });
      if (target.isDefault) return res.status(400).json({ message: "Cannot rename default lists" });
      const updated = await storage.updateSavedList(id, { name, emoji });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/saved-lists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ message: "userId required" });
      const lists = await storage.getSavedLists(userId);
      const target = lists.find(l => l.id === id);
      if (!target) return res.status(404).json({ message: "List not found" });
      if (target.isDefault) return res.status(400).json({ message: "Cannot delete default lists" });
      await storage.deleteSavedList(id);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/saved-lists/:id/items", async (req, res) => {
    try {
      const listId = parseInt(req.params.id);
      const { userId, restaurantId } = req.body;
      if (!userId || !restaurantId) return res.status(400).json({ message: "userId and restaurantId required" });
      if (typeof restaurantId !== "number" || restaurantId < 1) return res.status(400).json({ message: "Invalid restaurantId" });
      const ip = req.ip || "unknown";
      if (rateLimit(`saved-item-add:${ip}`, 30, 10000)) {
        return res.status(429).json({ message: "Too many requests" });
      }
      const lists = await storage.getSavedLists(userId);
      const target = lists.find(l => l.id === listId);
      if (!target) return res.status(404).json({ message: "List not found" });
      const item = await storage.addSavedListItem({
        listId, restaurantId, addedAt: new Date().toISOString()
      });
      res.json(item);
    } catch (err) {
      console.error("Add saved list item error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/saved-lists/:id/items/:restaurantId", async (req, res) => {
    try {
      const listId = parseInt(req.params.id);
      const restaurantId = parseInt(req.params.restaurantId);
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ message: "userId required" });
      const lists = await storage.getSavedLists(userId);
      const target = lists.find(l => l.id === listId);
      if (!target) return res.status(404).json({ message: "List not found" });
      await storage.removeSavedListItem(listId, restaurantId);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/saved-lists/:id/start-session", async (req, res) => {
    try {
      const listId = parseInt(req.params.id);
      const { userId, displayName } = req.body;
      if (!userId) return res.status(400).json({ message: "userId required" });
      const ip = req.ip || "unknown";
      if (rateLimit(`saved-session:${ip}`, 5, 30000)) {
        return res.status(429).json({ message: "Too many requests" });
      }
      const lists = await storage.getSavedLists(userId);
      const target = lists.find(l => l.id === listId);
      if (!target) return res.status(404).json({ message: "List not found" });
      const items = await storage.getSavedListItems(listId);
      if (items.length === 0) return res.status(400).json({ message: "List is empty" });

      const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const session = await storage.createGroupSession({
        sessionCode,
        hostLineUserId: userId,
        status: "waiting",
        sessionType: "saved_list",
        sourceData: JSON.stringify({ listId, listName: target.name, restaurantIds: items.map(i => i.restaurantId) }),
        expectedMembers: null,
        createdAt: new Date().toISOString(),
      });
      await storage.addGroupMember({
        sessionCode,
        lineUserId: userId,
        displayName: displayName || "Host",
        pictureUrl: null,
        latitude: null,
        longitude: null,
        joinedAt: new Date().toISOString(),
      });
      res.status(201).json({ sessionCode, listName: target.name, restaurantCount: items.length });
    } catch (err) {
      console.error("Start session from list error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/saved-lists/:id/invite", async (req, res) => {
    try {
      const listId = parseInt(req.params.id);
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ message: "userId required" });
      const ip = req.ip || "unknown";
      if (rateLimit(`saved-invite:${ip}`, 10, 30000)) {
        return res.status(429).json({ message: "Too many requests" });
      }
      const lists = await storage.getSavedLists(userId);
      const target = lists.find(l => l.id === listId);
      if (!target) return res.status(404).json({ message: "List not found" });
      const items = await storage.getSavedListItems(listId);

      const crypto = await import("crypto");
      const secret = process.env.SESSION_SECRET;
      if (!secret) return res.status(500).json({ message: "Server configuration error" });
      const nonce = crypto.randomBytes(12).toString("hex");
      const payload = JSON.stringify({
        listId,
        userId,
        restaurantIds: items.map(i => i.restaurantId),
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
        nonce,
      });
      const hmac = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
      const token = Buffer.from(payload).toString("base64url") + "." + hmac;

      res.json({
        inviteToken: token,
        inviteUrl: `/group/setup?listInvite=${token}`,
        listName: target.name,
        restaurantCount: items.length,
      });
    } catch (err) {
      console.error("Create invite from list error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/saved-lists/invite/:token", async (req, res) => {
    try {
      const token = req.params.token;
      const parts = token.split(".");
      if (parts.length !== 2) return res.status(400).json({ message: "Invalid invite token" });
      const [payloadB64, sig] = parts;
      const crypto = await import("crypto");
      const secret = process.env.SESSION_SECRET;
      if (!secret) return res.status(500).json({ message: "Server configuration error" });
      const payload = Buffer.from(payloadB64, "base64url").toString();
      const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
      if (sig !== expectedSig) return res.status(403).json({ message: "Invalid token signature" });
      const decoded = JSON.parse(payload);
      if (!decoded.listId || !decoded.exp) return res.status(400).json({ message: "Invalid invite token" });
      if (Date.now() > decoded.exp) return res.status(410).json({ message: "Invite expired" });
      const nonceKey = `list-invite:${decoded.nonce}`;
      const used = await storage.checkIdempotencyKey(nonceKey);
      if (used) return res.status(409).json({ message: "Invite already used" });
      await storage.createSessionEvent({
        sessionCode: `list-invite-${decoded.listId}`,
        eventType: "INVITE_REDEEMED",
        actorId: "system",
        payload: { nonce: decoded.nonce, listId: decoded.listId },
        idempotencyKey: nonceKey,
        createdAt: new Date().toISOString(),
      });
      res.json({
        listId: decoded.listId,
        userId: decoded.userId,
        restaurantIds: decoded.restaurantIds || [],
      });
    } catch (err) {
      res.status(400).json({ message: "Invalid invite token" });
    }
  });

  app.post("/api/saved-lists/migrate", async (req, res) => {
    try {
      const { userId, mine, partner } = req.body;
      if (!userId) return res.status(400).json({ message: "userId required" });
      const ip = req.ip || "unknown";
      if (rateLimit(`saved-migrate:${ip}`, 5, 60000)) {
        return res.status(429).json({ message: "Too many requests" });
      }
      const defaults = await storage.getOrCreateDefaultLists(userId);
      const existingMineItems = await storage.getSavedListItems(defaults.mine.id);
      const existingPartnerItems = await storage.getSavedListItems(defaults.partner.id);
      const now = new Date().toISOString();
      if (Array.isArray(mine)) {
        for (const rid of mine) {
          if (!existingMineItems.some(i => i.restaurantId === rid)) {
            await storage.addSavedListItem({ listId: defaults.mine.id, restaurantId: rid, addedAt: now });
          }
        }
      }
      if (Array.isArray(partner)) {
        for (const rid of partner) {
          if (!existingPartnerItems.some(i => i.restaurantId === rid)) {
            await storage.addSavedListItem({ listId: defaults.partner.id, restaurantId: rid, addedAt: now });
          }
        }
      }
      res.json({ ok: true, migrated: true });
    } catch (err) {
      console.error("Migrate saved lists error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/toast-decides/taste-dna-summary", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ message: "userId required" });
      const ip = req.ip || "unknown";
      if (rateLimit(`taste-dna:${ip}`, 20, 10000)) {
        return res.status(429).json({ message: "Too many requests" });
      }

      const dna = await storage.getTasteDna(userId);
      const defaults = {
        comfort: 50, exploration: 50, healthy: 50, indulgent: 50,
        spicy: 50, distance: 50, budget: 50, novelty: 50, speed: 50,
        cuisineAffinities: {},
        cuisineDislikes: {},
      };

      if (!dna) return res.json(defaults);

      res.json({
        comfort: dna.comfortScore || 50,
        exploration: dna.explorationScore || 50,
        healthy: dna.healthyScore || 50,
        indulgent: dna.indulgentScore || 50,
        spicy: dna.spiceScore || 50,
        distance: dna.distanceScore || 50,
        budget: dna.budgetScore || 50,
        novelty: dna.noveltyScore || 50,
        speed: dna.speedPreferenceScore || 50,
        cuisineAffinities: dna.cuisineAffinityJson || {},
        cuisineDislikes: dna.cuisineDislikeJson || {},
      });
    } catch (err) {
      console.error("Taste DNA error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/restaurants/by-vibe", async (req, res) => {
    try {
      const { vibe, limit = 20 } = req.body;
      if (!vibe) return res.status(400).json({ message: "vibe is required" });

      if (vibe === "popular") {
        const popular = await storage.getPopularRestaurants(7, limit);
        if (popular.length === 0) {
          const all = await storage.getRestaurants();
          const sorted = all.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0)).slice(0, limit);
          return res.json(sorted.map(r => ({ ...r, vibeMatch: r.trendingScore || 50 })));
        }
        const allRestaurants = await storage.getRestaurants();
        const restaurantMap = new Map(allRestaurants.map(r => [r.id, r]));
        const maxScore = popular[0]?.score || 1;
        const results = popular
          .map(p => {
            const r = restaurantMap.get(p.restaurantId);
            if (!r) return null;
            return { ...r, vibeMatch: Math.round((p.score / maxScore) * 99) };
          })
          .filter(Boolean);
        return res.json(results);
      }

      if (vibe === "budget") {
        const all = await storage.getRestaurants();
        const budget = all
          .filter(r => r.priceLevel <= 2)
          .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
          .slice(0, limit)
          .map(r => ({ ...r, vibeMatch: Math.round(90 - (r.priceLevel - 1) * 20 + parseFloat(r.rating) * 2) }));
        return res.json(budget);
      }

      const vibeRestaurants = await storage.getRestaurantsByVibe(vibe);
      const results = vibeRestaurants.slice(0, limit).map(r => ({
        ...r,
        vibeMatch: Math.min(99, Math.round(50 + (parseFloat(r.rating) - 4.0) * 15 + (r.trendingScore || 0) * 0.2)),
      }));
      res.json(results);
    } catch (err) {
      console.error("By-vibe error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/restaurants/for-swipe", async (req, res) => {
    try {
      const vibes = req.query.vibes ? String(req.query.vibes).split(",").filter(Boolean) : undefined;
      const priceLevel = req.query.priceLevel
        ? String(req.query.priceLevel).split(",").map(Number).filter(n => !isNaN(n))
        : undefined;
      const category = req.query.category ? String(req.query.category) : undefined;
      const district = req.query.district ? String(req.query.district) : undefined;
      const parsedLimit = req.query.limit ? Number(req.query.limit) : 50;
      const limit = Number.isFinite(parsedLimit) ? Math.min(100, Math.max(1, parsedLimit)) : 50;

      const results = await storage.getRestaurantsForSwipe({
        vibes,
        priceLevel,
        category,
        district,
        limit,
      });

      const mapped = results.map(r => ({
        id: r.id,
        name: r.name,
        category: r.category,
        description: r.description,
        priceLevel: r.priceLevel,
        rating: r.rating,
        address: r.address,
        imageUrl: r.imageUrl,
        isNew: r.isNew,
        vibes: r.vibes || [],
        district: r.district,
        trendingScore: r.trendingScore,
        lat: r.lat,
        lng: r.lng,
      }));

      res.json(mapped);
    } catch (err) {
      console.error("Swipe restaurants error:", err);
      res.status(500).json({ message: "Failed to fetch restaurants for swipe" });
    }
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const restaurant = await storage.getRestaurantById(id);
      if (!restaurant) return res.status(404).json({ message: "Not found" });
      res.set("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
      res.json(restaurant);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.restaurants.list.path, async (req, res) => {
    try {
      const input = api.restaurants.list.input ? api.restaurants.list.input.parse(req.query) : {};
      const locationFilter = (input as any)?.location as string | undefined;
      const cacheKey = `restaurants:${input.mode || ''}:${input.query || ''}:${locationFilter || ''}`;
      let restaurants = await getCached(cacheKey, 30000, () =>
        storage.getRestaurants(input.mode, input.lat, input.lng, input.query)
      );
      if (locationFilter) {
        const loc = locationFilter.toLowerCase();
        restaurants = restaurants.filter((r: any) => {
          const addr = (r.address || "").toLowerCase();
          const district = (r.district || "").toLowerCase();
          return addr.includes(loc) || district.includes(loc);
        });
      }
      res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
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

  app.post("/api/line/verify-token", async (req, res) => {
    try {
      const schema = z.object({
        accessToken: z.string().min(1),
      });
      const { accessToken } = schema.parse(req.body);

      const verifyRes = await fetch("https://api.line.me/oauth2/v2.1/verify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `access_token=${encodeURIComponent(accessToken)}`,
      });

      if (!verifyRes.ok) {
        return res.status(401).json({ valid: false, message: "Invalid access token" });
      }

      const tokenInfo = await verifyRes.json();

      const profileRes = await fetch("https://api.line.me/v2/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!profileRes.ok) {
        return res.status(401).json({ valid: false, message: "Failed to fetch profile" });
      }

      const lineProfile = await profileRes.json();

      const existing = await storage.getProfile(lineProfile.userId);
      if (!existing) {
        await storage.upsertProfile({
          lineUserId: lineProfile.userId,
          displayName: lineProfile.displayName,
          pictureUrl: lineProfile.pictureUrl || null,
          statusMessage: lineProfile.statusMessage || null,
          dietaryRestrictions: [],
          cuisinePreferences: [],
          defaultBudget: 2,
          defaultDistance: "5km",
          partnerLineUserId: null,
          partnerDisplayName: null,
          partnerPictureUrl: null,
        });
      } else {
        await storage.updateProfile(lineProfile.userId, {
          displayName: lineProfile.displayName,
          pictureUrl: lineProfile.pictureUrl || null,
          statusMessage: lineProfile.statusMessage || null,
        });
      }

      res.json({
        valid: true,
        profile: {
          userId: lineProfile.userId,
          displayName: lineProfile.displayName,
          pictureUrl: lineProfile.pictureUrl || null,
          statusMessage: lineProfile.statusMessage || null,
        },
        tokenInfo: {
          scope: tokenInfo.scope,
          expiresIn: tokenInfo.expires_in,
          clientId: tokenInfo.client_id,
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("LINE token verification error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/line/oa-config", (_req, res) => {
    res.json({
      channelId: process.env.VITE_LINE_OA_CHANNEL_ID || "",
      liffId: process.env.VITE_LINE_OA_LIFF_ID || "",
      liffUrl: process.env.VITE_LINE_OA_LIFF_ID
        ? `https://liff.line.me/${process.env.VITE_LINE_OA_LIFF_ID}`
        : null,
      endpoints: {
        verifyToken: "/api/line/verify-token",
        syncProfile: "/api/line/profile",
        getProfile: "/api/profile/:lineUserId",
        updateProfile: "/api/profile/:lineUserId",
        groupSessionCreate: "/api/group/sessions",
        groupSessionJoin: "/api/group/sessions/:code/join",
        groupSessionGet: "/api/group/sessions/:code",
        groupSessionStatus: "/api/group/sessions/:code/status",
      },
      scopes: ["profile", "openid"],
      permissions: [
        "profile (display name, profile picture, status message)",
        "openid (user identification)",
      ],
    });
  });

  app.post("/api/line/profile", async (req, res) => {
    try {
      const schema = z.object({
        userId: z.string().min(1),
        displayName: z.string().min(1),
        pictureUrl: z.string().optional(),
        statusMessage: z.string().optional(),
      });
      const input = schema.parse(req.body);

      const existing = await storage.getProfile(input.userId);
      let profile;
      if (existing) {
        profile = await storage.updateProfile(input.userId, {
          displayName: input.displayName,
          pictureUrl: input.pictureUrl || null,
          statusMessage: input.statusMessage || null,
        });
      } else {
        profile = await storage.upsertProfile({
          lineUserId: input.userId,
          displayName: input.displayName,
          pictureUrl: input.pictureUrl || null,
          statusMessage: input.statusMessage || null,
          dietaryRestrictions: [],
          cuisinePreferences: [],
          defaultBudget: 2,
          defaultDistance: "5km",
          partnerLineUserId: null,
          partnerDisplayName: null,
          partnerPictureUrl: null,
        });
      }

      res.json({ success: true, profile });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/profile/:lineUserId", async (req, res) => {
    try {
      const ip = req.ip || "unknown";
      if (rateLimit(`profile-read:${ip}`, 30, 10000)) {
        return res.status(429).json({ message: "Too many requests" });
      }
      const profile = await storage.getProfile(req.params.lineUserId);
      if (!profile) return res.status(404).json({ message: "Profile not found" });
      const { partnerLineUserId, ...safeProfile } = profile as any;
      res.json(safeProfile);
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

  const adminAuth = async (req: any, res: any, next: any) => {
    const authHeader = req.headers["x-admin-token"];
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const decoded = Buffer.from(authHeader, "base64").toString();
      const [username, password] = decoded.split(":");
      if (!username || !password) return res.status(401).json({ message: "Unauthorized" });
      const admin = await storage.getAdminUser(username);
      if (!admin || admin.isActive === false) return res.status(401).json({ message: "Unauthorized" });
      if (admin.passwordHash !== hashPassword(password)) return res.status(401).json({ message: "Unauthorized" });
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
      const [email, password] = decoded.split(":");
      if (!email || !password) return res.status(401).json({ message: "Unauthorized" });
      const owner = await storage.getRestaurantOwnerByEmail(email);
      if (!owner) return res.status(401).json({ message: "Unauthorized" });
      if (owner.passwordHash !== hashPassword(password)) return res.status(401).json({ message: "Unauthorized" });
      req.ownerUser = owner;
      next();
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };

  function requirePermission(req: any, res: any, permission: string): boolean {
    const admin = req.adminUser;
    if (!admin) { res.status(401).json({ message: "Unauthorized" }); return false; }
    if (admin.role === "superadmin") return true;
    const perms: string[] = admin.permissions || [];
    if (!perms.includes(permission)) {
      res.status(403).json({ message: `Missing permission: ${permission}` });
      return false;
    }
    return true;
  }

  const TIER_HIERARCHY: Record<string, number> = { free: 0, growth: 1, premium: 2, pro: 2, enterprise: 3 };
  function requireTier(owner: any, requiredTier: string): boolean {
    const ownerLevel = TIER_HIERARCHY[owner?.subscriptionTier || "free"] ?? 0;
    const requiredLevel = TIER_HIERARCHY[requiredTier] ?? 0;
    return ownerLevel >= requiredLevel;
  }

  // Campaign routes (requires growth tier)
  app.post("/api/campaigns", ownerAuth, async (req: any, res) => {
    try {
      if (!requireTier(req.ownerUser, "growth")) {
        return res.status(403).json({ message: "Campaign management requires Growth tier or above" });
      }
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
        restaurantOwnerKey: String(req.ownerUser.id),
        createdAt: new Date().toISOString(),
      });
      res.status(201).json(campaign);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/campaigns", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_campaigns")) return;
      const all = await storage.getCampaigns();
      res.json(all);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/campaigns/owner/:ownerKey", ownerAuth, async (req: any, res) => {
    try {
      if (String(req.ownerUser?.id) !== req.params.ownerKey) {
        return res.status(403).json({ message: "Not authorized to view these campaigns" });
      }
      const list = await storage.getCampaignsByOwner(req.params.ownerKey);
      res.json(list);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/campaigns/:id", ownerAuth, async (req: any, res) => {
    try {
      const ip = req.ip || "unknown";
      if (rateLimit(`campaign-update:${ip}`, 10, 60000)) {
        return res.status(429).json({ message: "Too many requests" });
      }
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const campaign = await storage.getCampaignById(id);
      if (!campaign) return res.status(404).json({ message: "Not found" });
      if (campaign.restaurantOwnerKey !== String(req.ownerUser?.id)) {
        return res.status(403).json({ message: "Not authorized to edit this campaign" });
      }
      const allowedFields: Record<string, any> = {};
      const campaignSafeKeys = ["title", "dealType", "dealValue", "description", "status", "startDate", "endDate", "conditions", "minSpend", "maxRedemptions", "targetGroups"];
      for (const key of campaignSafeKeys) {
        if (req.body[key] !== undefined) allowedFields[key] = req.body[key];
      }
      const updated = await storage.updateCampaign(id, allowedFields);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/campaigns/:id", ownerAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const campaign = await storage.getCampaignById(id);
      if (!campaign) return res.status(404).json({ message: "Not found" });
      if (campaign.restaurantOwnerKey !== String(req.ownerUser?.id)) {
        return res.status(403).json({ message: "Not authorized to delete this campaign" });
      }
      await storage.deleteCampaign(id);
      logAudit("campaign_deleted", "owner", String(req.ownerUser?.id), "campaign", String(id), undefined, req.ip);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics routes
  app.post("/api/analytics/event", async (req, res) => {
    try {
      const schema = z.object({
        eventType: z.string().min(1).max(100),
        userId: z.string().max(100).optional().nullable(),
        restaurantId: z.number().optional().nullable(),
        metadata: z.string().max(2000).optional().nullable(),
        timestamp: z.string().optional().default(() => new Date().toISOString()),
      });
      const input = schema.parse(req.body);
      const ip = req.ip || "unknown";
      if (rateLimit(`analytics:${ip}`, 60, 10000)) {
        return res.status(429).json({ message: "Rate limited" });
      }
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

  // Ad Banner routes
  app.get("/api/banners", async (_req, res) => {
    try {
      const banners = await getCached("banners", 60000, () => storage.getBanners());
      res.json(banners);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/banners", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_banners")) return;
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
      invalidateCache("banners");
      res.status(201).json(banner);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/admin/banners/:id", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_banners")) return;
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const allowedFields: Record<string, any> = {};
      const safeKeys = ["title", "imageUrl", "linkUrl", "position", "isActive", "startDate", "endDate"];
      for (const key of safeKeys) {
        if (req.body[key] !== undefined) allowedFields[key] = req.body[key];
      }
      const updated = await storage.updateBanner(id, allowedFields);
      if (!updated) return res.status(404).json({ message: "Not found" });
      invalidateCache("banners");
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/banners/:id", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_banners")) return;
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deleteBanner(id);
      invalidateCache("banners");
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
      const ip = req.ip || "unknown";
      if (rateLimit(`admin-login:${ip}`, 5, 60000)) {
        return res.status(429).json({ message: "Too many login attempts" });
      }
      const admin = await storage.getAdminUser(input.username);
      if (!admin || admin.passwordHash !== hashPassword(input.password)) {
        logAudit("admin_login_failed", "admin", input.username, undefined, undefined, undefined, ip);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (admin.isActive === false) {
        return res.status(403).json({ message: "Account disabled" });
      }
      logAudit("admin_login_success", "admin", input.username, undefined, undefined, { role: admin.role }, ip);
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
      const ip = req.ip || "unknown";
      if (rateLimit(`owner-login:${ip}`, 5, 60000)) {
        return res.status(429).json({ message: "Too many login attempts" });
      }
      const owner = await storage.getRestaurantOwnerByEmail(input.email);
      if (!owner || owner.passwordHash !== hashPassword(input.password)) {
        logAudit("owner_login_failed", "owner", input.email, undefined, undefined, undefined, ip);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      logAudit("owner_login_success", "owner", input.email, "restaurant", String(owner.restaurantId), undefined, ip);
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

  app.get("/api/admin/admin-users", adminAuth, async (req: any, res) => {
    try {
      if (req.adminUser?.role !== "superadmin") {
        return res.status(403).json({ message: "Only superadmins can list admin users" });
      }
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

  app.get("/api/admin/audit-logs", adminAuth, async (req: any, res) => {
    try {
      if (req.adminUser?.role !== "superadmin") {
        return res.status(403).json({ message: "Only superadmins can view audit logs" });
      }
      const action = req.query.action as string | undefined;
      const actorType = req.query.actorType as string | undefined;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
      const logs = await storage.getAuditLogs({ action, actorType, limit });
      res.json(logs);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/session-events/:code", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "view_analytics")) return;
      const { code } = req.params;
      const events = await storage.getSessionEvents(code);
      res.json(events);
    } catch (err) {
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
      if (id === req.adminUser?.id) {
        return res.status(403).json({ message: "Cannot modify your own admin account" });
      }
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

  app.get("/api/admin/owners", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_users")) return;
      const owners = await storage.getAllRestaurantOwners();
      res.json(owners.map(o => ({ ...o, passwordHash: undefined })));
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/owners", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_users")) return;
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

  app.patch("/api/admin/owners/:id", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_users")) return;
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

  app.get("/api/admin/claims", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_claims")) return;
      const status = req.query.status as string | undefined;
      const claims = await storage.getRestaurantClaims(status);
      const [allOwners, allRestaurants] = await Promise.all([
        storage.getAllRestaurantOwners(),
        storage.getRestaurants(),
      ]);
      const ownerMap = new Map(allOwners.map(o => [o.id, o]));
      const restaurantMap = new Map(allRestaurants.map(r => [r.id, r]));
      const enriched = claims.map(c => {
        const owner = ownerMap.get(c.ownerId);
        const restaurant = restaurantMap.get(c.restaurantId);
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
      });
      res.json(enriched);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/claims", ownerAuth, async (req: any, res) => {
    try {
      const ip = req.ip || "unknown";
      if (rateLimit(`claim-submit:${ip}`, 5, 60000)) {
        return res.status(429).json({ message: "Too many claim submissions, try again later" });
      }
      const schema = z.object({
        restaurantId: z.number(),
        proofDocuments: z.array(z.string()).optional().default([]),
        ownershipType: z.enum(["single_location", "franchise_owner", "franchisee"]).optional().default("single_location"),
        notes: z.string().optional(),
      });
      const input = schema.parse(req.body);
      const ownerId = req.ownerUser.id;

      const restaurant = await storage.getRestaurant(input.restaurantId);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

      if (restaurant.ownerClaimStatus === "verified" || restaurant.ownerClaimStatus === "approved") {
        return res.status(409).json({ message: "This restaurant has already been claimed and verified by another owner." });
      }

      const existingClaims = await storage.getRestaurantClaims("pending");
      const duplicateClaim = existingClaims.find(
        (c) => c.restaurantId === input.restaurantId && (c.ownerId === ownerId || c.status === "pending")
      );
      if (duplicateClaim) {
        if (duplicateClaim.ownerId === ownerId) {
          return res.status(409).json({ message: "You already have a pending claim for this restaurant." });
        }
        return res.status(409).json({ message: "Another claim for this restaurant is already under review." });
      }

      const claim = await storage.createRestaurantClaim({
        ...input,
        ownerId,
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
      if (!requirePermission(req, res, "manage_claims")) return;
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
      logAudit(`claim_${req.body.status || "updated"}`, "admin", String(req.adminUser?.id || "unknown"), "claim", String(id), { restaurantId: claim.restaurantId, ownerId: claim.ownerId }, req.ip);
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
      const results = filtered.slice(0, 20).map(r => ({
        id: r.id,
        name: r.name,
        category: r.category,
        address: r.address,
        imageUrl: r.imageUrl,
        rating: r.rating,
        priceLevel: r.priceLevel,
        description: r.description,
        district: r.district,
        vibes: r.vibes || [],
        trendingScore: r.trendingScore || 0,
        ownerClaimStatus: r.ownerClaimStatus || "unclaimed",
        ownerId: r.ownerId || null,
      }));
      res.json(results);
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

      const allRestaurants = await storage.getRestaurants();
      const ownedRestaurants = allRestaurants
        .filter(r => r.ownerId === owner.id)
        .map(r => ({
          id: r.id,
          name: r.name,
          category: r.category,
          address: r.address,
          imageUrl: r.imageUrl,
          rating: r.rating,
          ownerClaimStatus: r.ownerClaimStatus || "unclaimed",
        }));

      const claimedRestaurants = await Promise.all(
        myClaims.map(async (c: any) => {
          const r = await storage.getRestaurantById(c.restaurantId);
          return {
            claimId: c.id,
            restaurantId: c.restaurantId,
            restaurantName: r?.name || `Restaurant #${c.restaurantId}`,
            restaurantImage: r?.imageUrl || "",
            restaurantAddress: r?.address || "",
            restaurantCategory: r?.category || "",
            restaurantRating: r?.rating || "0",
            status: c.status,
            submittedAt: c.submittedAt,
            reviewedAt: c.reviewedAt,
          };
        })
      );

      let stats = { views: 0, likes: 0, saves: 0, deliveryTaps: 0 };
      if (owner.restaurantId) {
        const events = await storage.getEvents({ restaurantId: owner.restaurantId });
        stats.views = events.filter(e => e.eventType === "view_detail").length;
        stats.likes = events.filter(e => e.eventType === "swipe_right").length;
        stats.saves = events.filter(e => e.eventType === "save").length;
        stats.deliveryTaps = events.filter(e => e.eventType === "delivery_click" || e.eventType === "delivery_tap").length;
      }
      res.json({
        owner: { ...owner, passwordHash: undefined },
        restaurant,
        campaigns,
        claims: myClaims,
        claimedRestaurants,
        ownedRestaurants,
        stats,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/dashboard", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "view_analytics")) return;
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

  app.get("/api/admin/users", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_users")) return;
      const users = await storage.getAllProfiles();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/restaurants", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_restaurants")) return;
      const all = await storage.getRestaurants();
      res.json(all);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/admin/restaurants/:id", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_restaurants")) return;
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const allowedFields: Record<string, any> = {};
      const safeKeys = ["name", "description", "imageUrl", "lat", "lng", "category", "priceLevel", "rating", "address", "isNew", "trendingScore", "vibes", "district", "operatingHours", "googlePlaceId"];
      for (const key of safeKeys) {
        if (req.body[key] !== undefined) allowedFields[key] = req.body[key];
      }
      const updated = await storage.updateRestaurant(id, allowedFields);
      if (!updated) return res.status(404).json({ message: "Not found" });
      invalidateCache("restaurants");
      logAudit("restaurant_updated", "admin", String(req.adminUser?.id || "unknown"), "restaurant", String(id), { fields: Object.keys(allowedFields) }, req.ip);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/restaurants/:id", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_restaurants")) return;
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deleteRestaurant(id);
      invalidateCache("restaurants");
      logAudit("restaurant_deleted", "admin", String(req.adminUser?.id || "unknown"), "restaurant", String(id), undefined, req.ip);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/restaurants/auto-assign-vibes", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_restaurants")) return;
      const all = await storage.getRestaurants();
      let updated = 0;
      for (const r of all) {
        const vibes = autoAssignVibes(r);
        const district = r.district || autoDetectDistrict(r.address);
        const changes: Record<string, any> = {};
        if (JSON.stringify(vibes) !== JSON.stringify(r.vibes || [])) {
          changes.vibes = vibes;
        }
        if (district && district !== r.district) {
          changes.district = district;
        }
        if (Object.keys(changes).length > 0) {
          await storage.updateRestaurant(r.id, changes);
          updated++;
        }
      }
      invalidateCache("restaurants");
      res.json({ success: true, totalRestaurants: all.length, updated });
    } catch (err) {
      console.error("Auto-assign vibes error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/restaurants/:id/auto-assign-vibes", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_restaurants")) return;
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const restaurant = await storage.getRestaurantById(id);
      if (!restaurant) return res.status(404).json({ message: "Not found" });
      const vibes = autoAssignVibes(restaurant);
      const district = restaurant.district || autoDetectDistrict(restaurant.address);
      const updates: Record<string, any> = { vibes };
      if (district) updates.district = district;
      const updated = await storage.updateRestaurant(id, updates);
      invalidateCache("restaurants");
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/google-places/fetch", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_restaurants")) return;
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

  app.post("/api/admin/google-places/import", adminAuth, async (req: any, res) => {
    try {
      if (!requirePermission(req, res, "manage_restaurants")) return;
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
          operatingHours: z.string().optional(),
        })),
        autoAssign: z.boolean().default(true),
        skipDuplicates: z.boolean().default(true),
      });
      const input = schema.parse(req.body);

      let imported = 0;
      let skipped = 0;
      let updated = 0;

      for (const r of input.restaurants) {
        if (input.skipDuplicates && r.googlePlaceId) {
          const existing = await storage.getRestaurantByGooglePlaceId(r.googlePlaceId);
          if (existing) {
            await storage.updateRestaurant(existing.id, {
              rating: r.rating,
              trendingScore: r.trendingScore,
              imageUrl: r.imageUrl || existing.imageUrl,
            });
            updated++;
            continue;
          }
        }

        let vibes: string[] = [];
        let district: string | null = null;

        if (input.autoAssign) {
          vibes = autoAssignVibes({
            category: r.category,
            priceLevel: r.priceLevel,
            address: r.address,
            operatingHours: r.operatingHours || null,
            description: r.description,
          });
          district = autoDetectDistrict(r.address);
        }

        await storage.addRestaurant({
          ...r,
          vibes: vibes.length > 0 ? vibes : [],
          district: district || undefined,
          operatingHours: r.operatingHours || undefined,
        });
        imported++;
      }

      invalidateCache("restaurants");
      res.json({ imported, skipped, updated, total: input.restaurants.length, success: true });
    } catch (err) {
      console.error("Import error:", err);
      res.status(500).json({ message: "Failed to import restaurants" });
    }
  });


  app.post("/api/group/sessions", async (req, res) => {
    try {
      const ip = req.ip || "unknown";
      if (rateLimit(`session-create:${ip}`, 10, 60000)) {
        return res.status(429).json({ message: "Too many session creation requests" });
      }

      const schema = z.object({
        sessionCode: z.string().min(1).optional(),
        hostLineUserId: z.string().min(1),
        hostDisplayName: z.string().min(1),
        hostPictureUrl: z.string().optional(),
        sessionType: z.string().optional(),
        sourceData: z.string().optional(),
        expectedMembers: z.number().int().min(2).max(20).optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
      });
      const input = schema.parse(req.body);

      let hostUserId = input.hostLineUserId;
      let hostDisplayName = input.hostDisplayName;
      let hostPictureUrl = input.hostPictureUrl || null;

      const lineToken = req.headers["x-line-access-token"] as string | undefined;
      if (lineToken) {
        const verified = await verifyLineAccessToken(lineToken);
        if (verified) {
          hostUserId = verified.userId;
          hostDisplayName = verified.displayName;
          hostPictureUrl = verified.pictureUrl;
        }
      }

      let sessionCode = generateSessionCode();
      let retries = 0;
      while (retries < 5) {
        const existing = await storage.getGroupSession(sessionCode);
        if (!existing) break;
        sessionCode = generateSessionCode();
        retries++;
      }

      const session = await storage.createGroupSession({
        sessionCode,
        hostLineUserId: hostUserId,
        status: "waiting",
        sessionType: input.sessionType || "regular",
        sourceData: input.sourceData || null,
        expectedMembers: input.expectedMembers || null,
        createdAt: new Date().toISOString(),
      });

      await storage.addGroupMember({
        sessionCode,
        lineUserId: hostUserId,
        displayName: hostDisplayName,
        pictureUrl: hostPictureUrl,
        latitude: input.latitude || null,
        longitude: input.longitude || null,
        joinedAt: new Date().toISOString(),
      });

      logSessionEvent(sessionCode, "SESSION_CREATED", hostUserId, { sessionType: input.sessionType || "regular", expectedMembers: input.expectedMembers });

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
      const ip = req.ip || "unknown";
      if (rateLimit(`session-join:${ip}`, 15, 60000)) {
        return res.status(429).json({ message: "Too many join attempts" });
      }
      const { code } = req.params;
      const schema = z.object({
        lineUserId: z.string().min(1),
        displayName: z.string().min(1),
        pictureUrl: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
      });
      const input = schema.parse(req.body);

      let userId = input.lineUserId;
      let displayName = input.displayName;
      let pictureUrl = input.pictureUrl || null;

      const lineToken = req.headers["x-line-access-token"] as string | undefined;
      if (lineToken) {
        const verified = await verifyLineAccessToken(lineToken);
        if (verified) {
          userId = verified.userId;
          displayName = verified.displayName;
          pictureUrl = verified.pictureUrl;
        }
      }

      const session = await storage.getGroupSession(code);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      if (session.status !== "waiting") {
        const alreadyMember = await storage.isGroupMember(code, userId);
        if (alreadyMember) {
          const members = await storage.getGroupMembers(code);
          return res.json({ session, members: sanitizeMembers(members) });
        }
        return res.status(400).json({ message: "Session is no longer accepting new members" });
      }
      const sessionAge = Date.now() - new Date(session.createdAt).getTime();
      if (sessionAge > 24 * 60 * 60 * 1000) {
        return res.status(410).json({ message: "Session has expired" });
      }

      const alreadyMember = await storage.isGroupMember(code, userId);
      if (alreadyMember) {
        const members = await storage.getGroupMembers(code);
        return res.json({ session, members: sanitizeMembers(members) });
      }

      const member = await storage.addGroupMember({
        sessionCode: code,
        lineUserId: userId,
        displayName: displayName,
        pictureUrl: pictureUrl,
        latitude: input.latitude || null,
        longitude: input.longitude || null,
        joinedAt: new Date().toISOString(),
      });

      logSessionEvent(code, "USER_JOINED", userId, { displayName });

      const members = await storage.getGroupMembers(code);
      const { latitude, longitude, ...safeMember } = member as any;
      res.status(201).json({ session, members: sanitizeMembers(members), newMember: safeMember });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  function sanitizeMembers(members: any[]) {
    return members.map(({ latitude, longitude, ...safe }) => safe);
  }

  app.get("/api/group/sessions/:code", async (req, res) => {
    try {
      const ip = req.ip || "unknown";
      if (rateLimit(`session-lookup:${ip}`, 20, 60000)) {
        return res.status(429).json({ message: "Too many lookup attempts" });
      }
      const { code } = req.params;
      const session = await storage.getGroupSession(code);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      const sessionAge = Date.now() - new Date(session.createdAt).getTime();
      if (sessionAge > 24 * 60 * 60 * 1000) {
        return res.status(410).json({ message: "Session has expired" });
      }
      const members = await storage.getGroupMembers(code);
      const hostMember = members.find(m => m.lineUserId === session.hostLineUserId);
      const enrichedSession = {
        ...session,
        hostDisplayName: hostMember?.displayName || "Host",
        hostPictureUrl: hostMember?.pictureUrl || null,
      };
      res.json({ session: enrichedSession, members: sanitizeMembers(members) });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/group/sessions/:code/status", async (req, res) => {
    try {
      const { code } = req.params;
      const schema = z.object({
        status: z.enum(["waiting", "swiping", "completed", "expired", "deleted"]),
        lineUserId: z.string().min(1),
      });
      const input = schema.parse(req.body);

      const session = await storage.getGroupSession(code);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.hostLineUserId !== input.lineUserId) {
        return res.status(403).json({ message: "Only the host can change session status" });
      }
      const sessionAge = Date.now() - new Date(session.createdAt).getTime();
      if (sessionAge > 24 * 60 * 60 * 1000) {
        return res.status(410).json({ message: "Session has expired" });
      }

      const validTransitions: Record<string, string[]> = {
        waiting: ["swiping", "deleted"],
        swiping: ["completed", "deleted"],
        completed: ["expired"],
        expired: [],
        deleted: [],
      };
      const currentStatus = session.status || "waiting";
      if (!validTransitions[currentStatus]?.includes(input.status)) {
        return res.status(400).json({ message: `Cannot transition from ${currentStatus} to ${input.status}` });
      }

      await storage.updateGroupSessionStatus(code, input.status);
      logSessionEvent(code, input.status === "swiping" ? "ROUND_STARTED" : input.status === "completed" ? "SESSION_COMPLETED" : "STATUS_CHANGED", input.lineUserId, { status: input.status });

      if (input.status === "swiping") {
        const members = await storage.getGroupMembers(code);
        const sortedIds = members.map(m => m.lineUserId).sort();
        const fingerprint = sortedIds.join("|");
        await storage.updateGroupSessionFingerprint(code, fingerprint);
      }

      if (input.status === "completed") {
        try {
          await finalizeSessionStats(code);
        } catch (e) {
          console.error("Failed to finalize session stats:", e);
        }
      }

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
      const ip = req.ip || "unknown";
      if (rateLimit(`swipe-ip:${ip}`, 100, 10000)) {
        return res.status(429).json({ message: "Too many requests" });
      }

      const { code } = req.params;
      const schema = z.object({
        lineUserId: z.string().min(1).max(100),
        menuItemId: z.number().int().positive(),
        direction: z.enum(["left", "right", "super"]),
      });
      const input = schema.parse(req.body);

      const isMember = await storage.isGroupMember(code, input.lineUserId);
      if (!isMember) {
        return res.status(403).json({ message: "Not a member of this session" });
      }

      const session = await storage.getGroupSession(code);
      if (!session || session.status !== "swiping") {
        return res.status(400).json({ message: "Session is not in swiping state" });
      }

      const sessionAge = Date.now() - new Date(session.createdAt).getTime();
      if (sessionAge > 24 * 60 * 60 * 1000) {
        return res.status(410).json({ message: "Session has expired" });
      }

      const rlKey = `swipe:${code}:${input.lineUserId}`;
      if (rateLimit(rlKey, 30, 10000)) {
        return res.status(429).json({ message: "Too many swipes, slow down" });
      }

      const idempotencyKey = `swipe:${code}:${input.lineUserId}:${input.menuItemId}`;
      const alreadyProcessed = await storage.checkIdempotencyKey(idempotencyKey);
      if (alreadyProcessed) {
        const matches = await storage.getGroupMatches(code);
        const members = await storage.getGroupMembers(code);
        return res.json({ swipe: null, matches, memberCount: members.length, replayed: true });
      }

      const swipe = await storage.recordGroupSwipe({
        sessionCode: code,
        lineUserId: input.lineUserId,
        menuItemId: input.menuItemId,
        direction: input.direction,
        swipedAt: new Date().toISOString(),
      });

      logSessionEvent(code, "SWIPE_SUBMITTED", input.lineUserId, { menuItemId: input.menuItemId, direction: input.direction }, idempotencyKey);

      const matches = await storage.getGroupMatches(code);
      const members = await storage.getGroupMembers(code);

      if (matches.length > 0) {
        logSessionEvent(code, "MATCH_GENERATED", "system", { matchCount: matches.length });
      }

      const currentSession = await storage.getGroupSession(code);
      if (currentSession && !currentSession.memberFingerprint && members.length >= 2) {
        const sortedIds = members.map(m => m.lineUserId).sort();
        await storage.updateGroupSessionFingerprint(code, sortedIds.join("|"));
      }

      res.json({ swipe, matches, memberCount: members.length });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  async function buildRestaurantMap(code: string): Promise<Map<number, any>> {
    const allRestaurants = await storage.getRestaurants();
    const restaurantMap = new Map(allRestaurants.map(r => [r.id, r]));

    const session = await storage.getGroupSession(code);
    if (session?.sourceData) {
      try {
        const parsed = JSON.parse(session.sourceData);
        if (parsed.restaurants && Array.isArray(parsed.restaurants)) {
          for (const r of parsed.restaurants) {
            if (r.id && !restaurantMap.has(r.id)) {
              restaurantMap.set(r.id, r);
            }
          }
        }
      } catch {}
    }
    return restaurantMap;
  }

  app.get("/api/group/sessions/:code/matches", async (req, res) => {
    try {
      const { code } = req.params;
      const session = await storage.getGroupSession(code);
      if (!session) return res.status(404).json({ message: "Session not found" });
      const matches = await storage.getGroupMatches(code);
      const members = await storage.getGroupMembers(code);
      const restaurantMap = matches.length > 0 ? await buildRestaurantMap(code) : new Map();
      const enrichedMatches = matches.map(m => ({
        ...m,
        restaurant: restaurantMap.get(m.menuItemId) || null,
      }));
      res.json({ matches: enrichedMatches, members: sanitizeMembers(members) });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/group/sessions/:code/swipes", async (req, res) => {
    try {
      const { code } = req.params;
      const session = await storage.getGroupSession(code);
      if (!session) return res.status(404).json({ message: "Session not found" });
      const swipes = await storage.getGroupSwipes(code);
      const members = await storage.getGroupMembers(code);
      const menuItemIds = [...new Set(swipes.map(s => s.menuItemId))];
      const restaurantMap = menuItemIds.length > 0 ? await buildRestaurantMap(code) : new Map();
      const restaurants = menuItemIds
        .map(id => restaurantMap.get(id))
        .filter(Boolean);
      res.json({ swipes, members: sanitizeMembers(members), restaurants });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/group/sessions/:code/location", async (req, res) => {
    try {
      const { code } = req.params;
      const schema = z.object({
        lineUserId: z.string().min(1),
        latitude: z.string().min(1),
        longitude: z.string().min(1),
      });
      const input = schema.parse(req.body);
      const isMember = await storage.isGroupMember(code, input.lineUserId);
      if (!isMember) {
        return res.status(403).json({ message: "Not a member of this session" });
      }
      await storage.updateMemberLocation(code, input.lineUserId, input.latitude, input.longitude);
      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/sessions/active/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ message: "userId required" });
      const result = await storage.getActiveSessionForUser(userId);
      if (!result) return res.json({ session: null });
      const { members, ...session } = result;
      const sanitized = members.map(m => ({
        displayName: m.displayName,
        pictureUrl: m.pictureUrl,
      }));
      res.json({
        session: {
          sessionCode: session.sessionCode,
          status: session.status,
          hostLineUserId: session.hostLineUserId,
          memberCount: members.length,
          locationName: session.locationName,
          createdAt: session.createdAt,
        },
        members: sanitized,
      });
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/group/sessions/:code/session-location", async (req, res) => {
    try {
      const { code } = req.params;
      const schema = z.object({
        lineUserId: z.string().min(1),
        locationName: z.string().optional(),
        locationLat: z.string().optional(),
        locationLng: z.string().optional(),
      });
      const input = schema.parse(req.body);
      const session = await storage.getGroupSession(code);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.hostLineUserId !== input.lineUserId) {
        return res.status(403).json({ message: "Only host can set session location" });
      }
      await storage.updateGroupSessionLocation(
        code,
        input.locationName || null,
        input.locationLat || null,
        input.locationLng || null,
      );
      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/group/sessions/:code/trending-restaurants", async (req, res) => {
    try {
      const { code } = req.params;
      const session = await storage.getGroupSession(code);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      if (session.sourceData) {
        try {
          const parsed = JSON.parse(session.sourceData);
          if (parsed.restaurants && Array.isArray(parsed.restaurants) && parsed.restaurants.length > 0) {
            return res.json({ restaurants: parsed.restaurants, source: "trending_feed" });
          }
        } catch {}
      }

      const members = await storage.getGroupMembers(code);
      const locatedMembers = members.filter(m => m.latitude && m.longitude);

      let centerLat = 13.7563;
      let centerLng = 100.5018;

      if (locatedMembers.length > 0) {
        centerLat = locatedMembers.reduce((sum, m) => sum + parseFloat(m.latitude!), 0) / locatedMembers.length;
        centerLng = locatedMembers.reduce((sum, m) => sum + parseFloat(m.longitude!), 0) / locatedMembers.length;
      }

      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      if (apiKey) {
        try {
          const radius = locatedMembers.length > 1
            ? Math.max(1500, calculateMaxDistance(locatedMembers) * 1000)
            : 3000;

          const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${centerLat},${centerLng}&radius=${Math.min(radius, 10000)}&type=restaurant&key=${apiKey}&language=th`;
          const placesRes = await fetch(url);
          if (placesRes.ok) {
            const placesData = await placesRes.json();
            if (placesData.results && placesData.results.length > 0) {
              const restaurantsOut = [];
              for (const place of placesData.results.slice(0, 30)) {
                let imageUrl = "";
                if (place.photos && place.photos.length > 0) {
                  imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${place.photos[0].photo_reference}&key=${apiKey}`;
                }

                const classified = classifyRestaurant(place);
                const vibes = autoAssignVibes({
                  category: classified.category,
                  priceLevel: classified.priceLevel,
                  address: place.vicinity || "",
                  description: classified.description,
                });
                const district = autoDetectDistrict(place.vicinity || "");

                let existingId: number | undefined;
                if (place.place_id) {
                  const existing = await storage.getRestaurantByGooglePlaceId(place.place_id);
                  if (existing) {
                    existingId = existing.id;
                  } else {
                    const created = await storage.addRestaurant({
                      name: place.name,
                      description: classified.description,
                      imageUrl: imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
                      lat: place.geometry?.location?.lat?.toString() || centerLat.toString(),
                      lng: place.geometry?.location?.lng?.toString() || centerLng.toString(),
                      category: classified.category,
                      priceLevel: classified.priceLevel,
                      rating: (place.rating || 4.0).toString(),
                      address: place.vicinity || "",
                      isNew: classified.isNew,
                      trendingScore: classified.trendingScore,
                      googlePlaceId: place.place_id,
                      vibes,
                      district: district || undefined,
                    });
                    existingId = created.id;
                  }
                }

                restaurantsOut.push({
                  id: existingId || 10000 + restaurantsOut.length,
                  name: place.name,
                  category: classified.category,
                  description: classified.description,
                  priceLevel: classified.priceLevel,
                  rating: (place.rating || 4.0).toString(),
                  address: place.vicinity || "",
                  imageUrl,
                  isNew: classified.isNew,
                  lat: place.geometry?.location?.lat?.toString() || centerLat.toString(),
                  lng: place.geometry?.location?.lng?.toString() || centerLng.toString(),
                  googlePlaceId: place.place_id || null,
                  vibes,
                  district,
                  trendingScore: classified.trendingScore,
                });
              }
              return res.json({ restaurants: restaurantsOut, center: { lat: centerLat, lng: centerLng }, source: "google_places" });
            }
          }
        } catch (err) {
          console.error("Google Places API error:", err);
        }
      }

      const allRestaurants = await storage.getRestaurants();
      const withDistance = allRestaurants.map(r => {
        const rLat = parseFloat(r.lat) || 13.7563;
        const rLng = parseFloat(r.lng) || 100.5018;
        const dist = haversineDistance(centerLat, centerLng, rLat, rLng);
        return { ...r, distance: dist };
      });
      withDistance.sort((a, b) => {
        const scoreA = (a.trendingScore || 0) * 2 - a.distance;
        const scoreB = (b.trendingScore || 0) * 2 - b.distance;
        return scoreB - scoreA;
      });

      res.json({ restaurants: withDistance.slice(0, 30), center: { lat: centerLat, lng: centerLng }, source: "database" });
    } catch (err) {
      console.error("Trending restaurants error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  async function finalizeSessionStats(sessionCode: string) {
    const session = await storage.getGroupSession(sessionCode);
    if (!session) return;

    const members = await storage.getGroupMembers(sessionCode);
    const swipes = await storage.getGroupSwipes(sessionCode);
    const matches = await storage.getGroupMatches(sessionCode);

    const allRestaurants = await storage.getRestaurants();
    const restaurantMap = new Map(allRestaurants.map(r => [r.id, r]));

    let fingerprint = session.memberFingerprint;
    if (!fingerprint) {
      const sortedIds = members.map(m => m.lineUserId).sort();
      fingerprint = sortedIds.join("|");
      await storage.updateGroupSessionFingerprint(sessionCode, fingerprint);
    }

    for (const member of members) {
      const allUserSwipes = await storage.getAllSwipesForUser(member.lineUserId);

      const categoryCounts: Record<string, number> = {};
      const restaurantLikeCounts: Record<number, number> = {};
      for (const s of allUserSwipes) {
        if (s.direction === "right" || s.direction === "super") {
          restaurantLikeCounts[s.menuItemId] = (restaurantLikeCounts[s.menuItemId] || 0) + 1;
        }
      }
      for (const [rid, cnt] of Object.entries(restaurantLikeCounts)) {
        const r = restaurantMap.get(parseInt(rid));
        if (r) {
          categoryCounts[r.category] = (categoryCounts[r.category] || 0) + cnt;
        }
      }

      const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const topRestaurantIds = Object.entries(restaurantLikeCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => parseInt(e[0]));

      const allUserSessions = await storage.getGroupCombosByUser(member.lineUserId);
      const sessionCodes = new Set<string>();
      for (const combo of allUserSessions) {
        const sessions = await storage.getSessionsByFingerprint(combo.fingerprint);
        for (const s of sessions) sessionCodes.add(s.sessionCode);
      }
      const currentSessionSessions = await storage.getSessionsByFingerprint(fingerprint);
      for (const s of currentSessionSessions) sessionCodes.add(s.sessionCode);

      await storage.upsertUserSwipeStats({
        lineUserId: member.lineUserId,
        displayName: member.displayName,
        pictureUrl: member.pictureUrl,
        totalSessions: sessionCodes.size,
        totalSwipes: allUserSwipes.length,
        totalLikes: allUserSwipes.filter(s => s.direction === "right" || s.direction === "super").length,
        totalDislikes: allUserSwipes.filter(s => s.direction === "left").length,
        totalSuperLikes: allUserSwipes.filter(s => s.direction === "super").length,
        topCategoriesJson: JSON.stringify(topCategories),
        topRestaurantIdsJson: JSON.stringify(topRestaurantIds),
        updatedAt: new Date().toISOString(),
      });
    }

    const allFingerprintSessions = await storage.getSessionsByFingerprint(fingerprint);
    let comboTotalSwipes = 0;
    let comboTotalMatches = 0;
    const comboCategoryCounts: Record<string, number> = {};
    const comboMatchedRestaurants: Record<number, number> = {};

    for (const s of allFingerprintSessions) {
      const sSwipes = await storage.getGroupSwipes(s.sessionCode);
      const sMatches = await storage.getGroupMatches(s.sessionCode);
      comboTotalSwipes += sSwipes.length;
      comboTotalMatches += sMatches.length;
      for (const m of sMatches) {
        comboMatchedRestaurants[m.menuItemId] = (comboMatchedRestaurants[m.menuItemId] || 0) + 1;
        const r = restaurantMap.get(m.menuItemId);
        if (r) comboCategoryCounts[r.category] = (comboCategoryCounts[r.category] || 0) + 1;
      }
    }

    const comboTopCategories = Object.entries(comboCategoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const comboTopMatchedIds = Object.entries(comboMatchedRestaurants).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => parseInt(e[0]));

    const memberIds = members.map(m => m.lineUserId).sort();
    await storage.upsertGroupComboStats({
      fingerprint,
      memberIdsJson: JSON.stringify(memberIds),
      memberNamesJson: JSON.stringify(members.map(m => m.displayName)),
      totalSessions: allFingerprintSessions.length,
      totalSwipes: comboTotalSwipes,
      totalMatches: comboTotalMatches,
      topCategoriesJson: JSON.stringify(comboTopCategories),
      topMatchedRestaurantIdsJson: JSON.stringify(comboTopMatchedIds),
      lastSessionCode: sessionCode,
      lastSessionAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  }

  app.post("/api/group/sessions/:code/finalize-stats", async (req, res) => {
    try {
      const { code } = req.params;
      const session = await storage.getGroupSession(code);
      if (!session) return res.status(404).json({ message: "Session not found" });

      const { lineUserId } = req.body || {};
      if (!lineUserId) {
        return res.status(400).json({ message: "lineUserId is required" });
      }
      const isMember = await storage.isGroupMember(code, lineUserId);
      if (!isMember) return res.status(403).json({ message: "Not a member" });

      await finalizeSessionStats(code);
      res.json({ success: true });
    } catch (err) {
      console.error("Finalize stats error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/group/combo-stats/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const session = await storage.getGroupSession(code);
      if (!session) return res.status(404).json({ message: "Session not found" });

      const members = await storage.getGroupMembers(code);

      const fingerprint = session.memberFingerprint || members.map(m => m.lineUserId).sort().join("|");

      const comboStatsData = await storage.getGroupComboStats(fingerprint);

      const memberStats = [];
      for (const member of members) {
        const stats = await storage.getUserSwipeStats(member.lineUserId);
        memberStats.push({
          lineUserId: member.lineUserId,
          displayName: member.displayName,
          pictureUrl: member.pictureUrl,
          stats: stats ? {
            totalSessions: stats.totalSessions,
            totalLikes: stats.totalLikes,
            totalDislikes: stats.totalDislikes,
            totalSuperLikes: stats.totalSuperLikes,
            topCategoriesJson: stats.topCategoriesJson,
          } : null,
        });
      }

      const previousSessions = await storage.getSessionsByFingerprint(fingerprint);

      res.json({
        fingerprint,
        comboStats: comboStatsData || null,
        memberStats,
        previousSessionCount: previousSessions.length,
        previousSessions: previousSessions.slice(0, 10).map(s => ({
          sessionCode: s.sessionCode,
          createdAt: s.createdAt,
          status: s.status,
        })),
      });
    } catch (err) {
      console.error("Combo stats error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/group/user-stats/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const requesterId = req.query.requesterId as string;
      if (!requesterId) {
        return res.status(400).json({ message: "requesterId is required" });
      }
      if (requesterId !== userId) {
        return res.status(403).json({ message: "Can only view your own stats" });
      }
      const ip = req.ip || "unknown";
      if (rateLimit(`user-stats:${ip}`, 20, 10000)) {
        return res.status(429).json({ message: "Too many requests" });
      }
      const stats = await storage.getUserSwipeStats(userId);
      const combos = await storage.getGroupCombosByUser(userId);
      res.json({ stats: stats || null, groups: combos });
    } catch (err) {
      console.error("User stats error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/partner/invite", async (req, res) => {
    try {
      const { userId, displayName, pictureUrl } = req.body;
      if (!userId || !displayName) return res.status(400).json({ message: "userId and displayName required" });
      const ip = req.ip || "unknown";
      if (rateLimit(`partner-invite:${ip}`, 5, 60000)) {
        return res.status(429).json({ message: "Too many requests" });
      }

      const existing = await storage.getActivePartnerConnection(userId);
      if (existing) return res.status(409).json({ message: "Already connected to a partner" });

      const pending = await storage.getPendingPartnerInvites(userId);
      for (const p of pending) {
        if (new Date(p.expiresAt).getTime() > Date.now()) {
          return res.json({
            inviteToken: p.token,
            inviteUrl: `/partner/accept?token=${p.token}`,
            expiresAt: p.expiresAt,
          });
        }
      }

      const crypto = await import("crypto");
      const secret = process.env.SESSION_SECRET;
      if (!secret) return res.status(500).json({ message: "Server configuration error" });
      const nonce = crypto.randomBytes(16).toString("hex");
      const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const payload = JSON.stringify({ fromUserId: userId, exp, nonce, type: "partner_invite" });
      const hmac = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
      const token = Buffer.from(payload).toString("base64url") + "." + hmac;

      await storage.createPartnerInvite({
        fromUserId: userId,
        fromDisplayName: displayName,
        fromPictureUrl: pictureUrl || null,
        token,
        nonce,
        expiresAt: new Date(exp).toISOString(),
        status: "pending",
        redeemedBy: null,
        createdAt: new Date().toISOString(),
      });

      logSessionEvent("partner", "PARTNER_INVITE_CREATED", userId, { nonce });

      res.json({
        inviteToken: token,
        inviteUrl: `/partner/accept?token=${token}`,
        expiresAt: new Date(exp).toISOString(),
      });
    } catch (err) {
      console.error("Partner invite error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/partner/invite/:token", async (req, res) => {
    try {
      const token = req.params.token;
      const parts = token.split(".");
      if (parts.length !== 2) return res.status(400).json({ message: "Invalid invite token" });

      const [payloadB64, sig] = parts;
      const crypto = await import("crypto");
      const secret = process.env.SESSION_SECRET;
      if (!secret) return res.status(500).json({ message: "Server configuration error" });
      const payload = Buffer.from(payloadB64, "base64url").toString();
      const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
      if (sig !== expectedSig) return res.status(403).json({ message: "Invalid token signature" });

      const decoded = JSON.parse(payload);
      if (decoded.type !== "partner_invite") return res.status(400).json({ message: "Invalid token type" });
      if (Date.now() > decoded.exp) return res.status(410).json({ message: "Invite expired" });

      const invite = await storage.getPartnerInviteByToken(token);
      if (!invite) return res.status(404).json({ message: "Invite not found" });
      if (invite.status !== "pending") return res.status(409).json({ message: "Invite already used" });

      res.json({
        fromDisplayName: invite.fromDisplayName,
        fromPictureUrl: invite.fromPictureUrl,
        fromUserId: invite.fromUserId,
        expiresAt: invite.expiresAt,
      });
    } catch (err) {
      console.error("Partner invite verify error:", err);
      res.status(400).json({ message: "Invalid invite token" });
    }
  });

  app.post("/api/partner/accept", async (req, res) => {
    try {
      const { token, userId, displayName, pictureUrl } = req.body;
      if (!token || !userId || !displayName) {
        return res.status(400).json({ message: "token, userId, and displayName required" });
      }
      const ip = req.ip || "unknown";
      if (rateLimit(`partner-accept:${ip}`, 5, 60000)) {
        return res.status(429).json({ message: "Too many requests" });
      }

      const parts = token.split(".");
      if (parts.length !== 2) return res.status(400).json({ message: "Invalid invite token" });
      const [payloadB64, sig] = parts;
      const crypto = await import("crypto");
      const secret = process.env.SESSION_SECRET;
      if (!secret) return res.status(500).json({ message: "Server configuration error" });
      const payload = Buffer.from(payloadB64, "base64url").toString();
      const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
      if (sig !== expectedSig) return res.status(403).json({ message: "Invalid token signature" });

      const decoded = JSON.parse(payload);
      if (decoded.type !== "partner_invite") return res.status(400).json({ message: "Invalid token type" });
      if (Date.now() > decoded.exp) return res.status(410).json({ message: "Invite expired" });

      const invite = await storage.getPartnerInviteByToken(token);
      if (!invite) return res.status(404).json({ message: "Invite not found" });
      if (invite.status !== "pending") return res.status(409).json({ message: "Invite already used" });

      if (invite.fromUserId === userId) {
        return res.status(400).json({ message: "Cannot accept your own invite" });
      }

      const existingA = await storage.getActivePartnerConnection(userId);
      if (existingA) return res.status(409).json({ message: "You are already connected to a partner" });
      const existingB = await storage.getActivePartnerConnection(invite.fromUserId);
      if (existingB) return res.status(409).json({ message: "Inviter is already connected to someone" });

      const claimed = await storage.claimPartnerInvite(invite.id, userId);
      if (!claimed) {
        return res.status(409).json({ message: "Invite already redeemed by another user" });
      }

      const nonceKey = `partner-invite:${invite.nonce}`;
      await storage.createSessionEvent({
        sessionCode: "partner",
        eventType: "PARTNER_INVITE_REDEEMED",
        actorId: userId,
        payload: { nonce: invite.nonce, fromUserId: invite.fromUserId },
        idempotencyKey: nonceKey,
        createdAt: new Date().toISOString(),
      });

      const [userA, userB] = [invite.fromUserId, userId].sort();
      let connection;
      try {
        connection = await storage.createPartnerConnection({
          userALineId: userA,
          userBLineId: userB,
          anniversaryDate: new Date().toISOString().split("T")[0],
          connectedAt: new Date().toISOString(),
          disconnectedAt: null,
          status: "active",
        });
      } catch (connErr) {
        const recheckInvite = await storage.getPartnerInviteByToken(token);
        if (recheckInvite && recheckInvite.redeemedBy === userId) {
          await storage.updatePartnerInvite(invite.id, { status: "pending", redeemedBy: null });
        }
        const errMsg = connErr instanceof Error ? connErr.message : "Could not create connection";
        return res.status(409).json({ message: errMsg });
      }

      await storage.updateProfile(invite.fromUserId, {
        partnerLineUserId: userId,
        partnerDisplayName: displayName,
        partnerPictureUrl: pictureUrl || null,
      });
      await storage.updateProfile(userId, {
        partnerLineUserId: invite.fromUserId,
        partnerDisplayName: invite.fromDisplayName,
        partnerPictureUrl: invite.fromPictureUrl || null,
      });

      const fromPending = await storage.getPendingPartnerInvites(invite.fromUserId);
      for (const p of fromPending) {
        if (p.id !== invite.id) await storage.updatePartnerInvite(p.id, { status: "expired" });
      }
      const toPending = await storage.getPendingPartnerInvites(userId);
      for (const p of toPending) {
        await storage.updatePartnerInvite(p.id, { status: "expired" });
      }

      logAudit("partner_connected", "user", userId, "partner", invite.fromUserId);

      res.json({
        connectionId: connection.id,
        partnerId: invite.fromUserId,
        partnerDisplayName: invite.fromDisplayName,
        partnerPictureUrl: invite.fromPictureUrl,
        anniversaryDate: connection.anniversaryDate,
      });
    } catch (err) {
      console.error("Partner accept error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/partner/status/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId) return res.status(400).json({ message: "userId required" });

      const connection = await storage.getActivePartnerConnection(userId);
      if (!connection) {
        const pendingInvites = await storage.getPendingPartnerInvites(userId);
        const activePending = pendingInvites.find(p => new Date(p.expiresAt).getTime() > Date.now());
        return res.json({
          connected: false,
          pendingInvite: activePending ? {
            token: activePending.token,
            expiresAt: activePending.expiresAt,
            createdAt: activePending.createdAt,
          } : null,
        });
      }

      const partnerId = connection.userALineId === userId ? connection.userBLineId : connection.userALineId;
      const partnerProfile = await storage.getProfile(partnerId);

      const swipeStats = await storage.getUserSwipeStats(userId);
      const partnerSwipeStats = await storage.getUserSwipeStats(partnerId);

      const connectedDate = new Date(connection.connectedAt);
      const now = new Date();
      const daysTogether = Math.floor((now.getTime() - connectedDate.getTime()) / (1000 * 60 * 60 * 24));

      let sharedSwipes = 0;
      let sharedMatches = 0;
      let sessionsTogether = 0;
      let mostUsedVibe = "";
      try {
        const userEvents = await storage.getUserBehaviorEvents(userId, 500);
        const partnerEvents = await storage.getUserBehaviorEvents(partnerId, 500);
        const userRestaurants = new Set(userEvents.filter(e => e.eventType === "swipe_right").map(e => e.restaurantId));
        const partnerRestaurants = new Set(partnerEvents.filter(e => e.eventType === "swipe_right").map(e => e.restaurantId));
        for (const rid of userRestaurants) {
          if (rid && partnerRestaurants.has(rid)) sharedMatches++;
        }
        sharedSwipes = (swipeStats?.totalSwipes || 0) + (partnerSwipeStats?.totalSwipes || 0);

        const userGroupSessions = await storage.getAllSwipesForUser(userId);
        const partnerGroupSessions = await storage.getAllSwipesForUser(partnerId);
        const userSessionCodes = new Set(userGroupSessions.map(s => s.sessionCode));
        const sharedSessionCodes = new Set<string>();
        for (const ps of partnerGroupSessions) {
          if (userSessionCodes.has(ps.sessionCode)) sharedSessionCodes.add(ps.sessionCode);
        }
        sessionsTogether = sharedSessionCodes.size;

        const vibeCounts: Record<string, number> = {};
        for (const e of [...userEvents, ...partnerEvents]) {
          if (e.eventType === "swipe_right" && e.metadata) {
            try {
              const meta = typeof e.metadata === "string" ? JSON.parse(e.metadata) : e.metadata;
              if (meta.vibes) {
                for (const v of meta.vibes) {
                  vibeCounts[v] = (vibeCounts[v] || 0) + 1;
                }
              }
            } catch {}
          }
        }
        const sortedVibes = Object.entries(vibeCounts).sort((a, b) => b[1] - a[1]);
        if (sortedVibes.length > 0) mostUsedVibe = sortedVibes[0][0];
      } catch {}

      res.json({
        connected: true,
        connectionId: connection.id,
        partnerId,
        partnerDisplayName: partnerProfile?.displayName || "Partner",
        partnerPictureUrl: partnerProfile?.pictureUrl || null,
        anniversaryDate: connection.anniversaryDate,
        connectedAt: connection.connectedAt,
        daysTogether,
        sharedStats: {
          totalSwipes: sharedSwipes,
          sharedMatches,
          daysTogether,
          sessionsTogether,
          mostUsedVibe,
        },
      });
    } catch (err) {
      console.error("Partner status error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/partner/disconnect", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ message: "userId required" });
      const ip = req.ip || "unknown";
      if (rateLimit(`partner-disconnect:${ip}`, 3, 60000)) {
        return res.status(429).json({ message: "Too many requests" });
      }

      const connection = await storage.getActivePartnerConnection(userId);
      if (!connection) return res.status(404).json({ message: "No active partner connection" });

      const partnerId = connection.userALineId === userId ? connection.userBLineId : connection.userALineId;

      await storage.disconnectPartner(connection.id);

      await storage.updateProfile(userId, {
        partnerLineUserId: null,
        partnerDisplayName: null,
        partnerPictureUrl: null,
      });
      await storage.updateProfile(partnerId, {
        partnerLineUserId: null,
        partnerDisplayName: null,
        partnerPictureUrl: null,
      });

      logAudit("partner_disconnected", "user", userId, "partner", partnerId);
      logSessionEvent("partner", "PARTNER_DISCONNECTED", userId, { partnerId });

      res.json({ disconnected: true });
    } catch (err) {
      console.error("Partner disconnect error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/partner/anniversary", async (req, res) => {
    try {
      const { userId, anniversaryDate } = req.body;
      if (!userId || !anniversaryDate) return res.status(400).json({ message: "userId and anniversaryDate required" });

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(anniversaryDate)) return res.status(400).json({ message: "anniversaryDate must be YYYY-MM-DD" });

      const connection = await storage.getActivePartnerConnection(userId);
      if (!connection) return res.status(404).json({ message: "No active partner connection" });

      await storage.updatePartnerConnection(connection.id, { anniversaryDate });
      res.json({ updated: true, anniversaryDate });
    } catch (err) {
      console.error("Partner anniversary error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/partner/migrate-legacy", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ message: "userId required" });
      const ip = req.ip || "unknown";
      if (rateLimit(`partner-migrate:${ip}`, 3, 60000)) {
        return res.status(429).json({ message: "Too many requests" });
      }

      const profile = await storage.getProfile(userId);
      if (!profile || !profile.partnerLineUserId) {
        return res.json({ migrated: false, reason: "No legacy partner data" });
      }

      const existing = await storage.getActivePartnerConnection(userId);
      if (existing) {
        return res.json({ migrated: false, reason: "Already has active connection" });
      }

      const partnerProfile = await storage.getProfile(profile.partnerLineUserId);
      if (!partnerProfile) {
        return res.json({ migrated: false, reason: "Partner profile not found" });
      }

      const existingPartner = await storage.getActivePartnerConnection(profile.partnerLineUserId);
      if (existingPartner) {
        return res.json({ migrated: false, reason: "Partner already connected to someone else" });
      }

      const [userA, userB] = [userId, profile.partnerLineUserId].sort();
      try {
        await storage.createPartnerConnection({
          userALineId: userA,
          userBLineId: userB,
          anniversaryDate: new Date().toISOString().split("T")[0],
          connectedAt: new Date().toISOString(),
          disconnectedAt: null,
          status: "active",
        });
      } catch {
        return res.json({ migrated: false, reason: "Connection already exists" });
      }

      await storage.updateProfile(userId, {
        partnerLineUserId: profile.partnerLineUserId,
        partnerDisplayName: profile.partnerDisplayName || partnerProfile.displayName || null,
        partnerPictureUrl: profile.partnerPictureUrl || partnerProfile.pictureUrl || null,
      });
      await storage.updateProfile(profile.partnerLineUserId, {
        partnerLineUserId: userId,
        partnerDisplayName: profile.displayName || null,
        partnerPictureUrl: profile.pictureUrl || null,
      });

      logAudit("partner_migrated", "user", userId, "partner", profile.partnerLineUserId);
      res.json({ migrated: true, partnerId: profile.partnerLineUserId });
    } catch (err) {
      console.error("Partner migrate error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateMaxDistance(members: { latitude: string | null; longitude: string | null }[]): number {
  let maxDist = 0;
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const d = haversineDistance(
        parseFloat(members[i].latitude!), parseFloat(members[i].longitude!),
        parseFloat(members[j].latitude!), parseFloat(members[j].longitude!)
      );
      if (d > maxDist) maxDist = d;
    }
  }
  return maxDist;
}
