/**
 * Integration test for the solo "What sounds good" decision filters.
 *
 * Guards that the fine-tune filters on POST /api/solo/decide genuinely shape the
 * returned pick (functional, not decorative). A future change that accidentally
 * makes a filter a no-op will fail this test.
 *
 * Prerequisites: the dev server must be running and the DB seeded.
 *   - In this environment the "Start application" workflow already serves it.
 * Run:  npx tsx tests/solo-decide.test.ts
 *   - Override the target with SOLO_TEST_BASE_URL (default http://localhost:5000).
 *
 * Not covered here (frontend React state, no component-test runner is configured):
 *   - the "Toast, decide for me" CTA staying disabled until a mood is chosen
 *   - the CTA staying disabled while "Near me" geolocation is still resolving
 */

const BASE = process.env.SOLO_TEST_BASE_URL || "http://localhost:5000";
const ENDPOINT = `${BASE}/api/solo/decide`;

type Pick = {
  id: number;
  name: string;
  category: string | null;
  priceLevel: number | null;
  district: string | null;
  vibes: string[];
  description: string | null;
} | null;

type DecideResponse = { pick: Pick; alternatives: Pick[]; learning: boolean };

const baseBody = { hour: 12, dayOfWeek: 3, excludeIds: [] as number[], mood: "surprise" };

async function decide(extra: Record<string, unknown>): Promise<DecideResponse> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...baseBody, ...extra }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${ENDPOINT}`);
  return res.json() as Promise<DecideResponse>;
}

// Collect the primary pick across N calls so a hard filter is checked against
// every variation the ranker might surface, not just one lucky draw.
async function picks(n: number, extra: Record<string, unknown>): Promise<Pick[]> {
  const out: Pick[] = [];
  for (let i = 0; i < n; i++) out.push((await decide(extra)).pick);
  return out;
}

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const hay = (p: NonNullable<Pick>) =>
  `${p.name} ${p.category || ""} ${p.description || ""}`.toLowerCase();
const isBuffet = (p: NonNullable<Pick>) =>
  /buffet|all[ -]you[ -]can[ -]eat/.test(hay(p));
const isFineDining = (p: NonNullable<Pick>) =>
  (p.priceLevel || 0) >= 4 ||
  /fine[ -]dining|omakase|kaiseki|steakhouse|tasting menu|degustation|\bfrench\b/.test(hay(p));
const hasVibe = (p: NonNullable<Pick>, v: string) =>
  (p.vibes || []).some((x) => x.toLowerCase() === v);

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) {
    passed++;
    console.log(`  \u2713 ${name}`);
  } else {
    failed++;
    console.error(`  \u2717 ${name}${detail ? ` \u2014 ${detail}` : ""}`);
  }
}
function nonNull(ps: Pick[]): ps is NonNullable<Pick>[] {
  return ps.every((p) => p !== null);
}

async function run() {
  console.log(`Solo decide filter tests \u2192 ${ENDPOINT}\n`);

  // Sanity: a plain decision always lands a pick (guaranteePick, no dead-ends).
  const plain = await picks(2, {});
  check("plain request always returns a pick", nonNull(plain));

  // Budget hard-filters into the requested price range.
  const cheap = await picks(3, { budget: "cheap" });
  check(
    "budget 'cheap' \u2192 priceLevel within 1\u20132",
    nonNull(cheap) && cheap.every((p) => (p!.priceLevel || 0) >= 1 && (p!.priceLevel || 0) <= 2),
    nonNull(cheap) ? cheap.map((p) => p!.priceLevel).join(",") : "null pick",
  );
  const splurge = await picks(3, { budget: "splurge" });
  check(
    "budget 'splurge' \u2192 priceLevel >= 4",
    nonNull(splurge) && splurge.every((p) => (p!.priceLevel || 0) >= 4),
    nonNull(splurge) ? splurge.map((p) => p!.priceLevel).join(",") : "null pick",
  );

  // Dining styles that map to a vibe hard-filter by that vibe.
  const cafe = await picks(3, { dining: "cafe" });
  check(
    "dining 'cafe' \u2192 pick has 'cafe' vibe",
    nonNull(cafe) && cafe.every((p) => hasVibe(p!, "cafe")),
    nonNull(cafe) ? cafe.map((p) => p!.name).join(",") : "null pick",
  );
  const street = await picks(3, { dining: "street" });
  check(
    "dining 'street' \u2192 pick has 'street_food' vibe",
    nonNull(street) && street.every((p) => hasVibe(p!, "street_food")),
    nonNull(street) ? street.map((p) => p!.name).join(",") : "null pick",
  );

  // Dining styles with no vibe (buffet / fine dining) hard-filter by attributes.
  const buffet = await picks(3, { dining: "buffet" });
  check(
    "dining 'buffet' \u2192 pick is a buffet spot",
    nonNull(buffet) && buffet.every((p) => isBuffet(p!)),
    nonNull(buffet) ? buffet.map((p) => `${p!.name}|${p!.category}`).join(",") : "null pick",
  );
  const fine = await picks(3, { dining: "finedining" });
  check(
    "dining 'finedining' \u2192 pick is fine dining (price>=4 or fine-dining category)",
    nonNull(fine) && fine.every((p) => isFineDining(p!)),
    nonNull(fine) ? fine.map((p) => `${p!.name}|${p!.priceLevel}`).join(",") : "null pick",
  );

  // Location hard-filters by district.
  const sukhumvit = await picks(3, { districts: ["Sukhumvit"] });
  check(
    "district 'Sukhumvit' \u2192 pick is in Sukhumvit",
    nonNull(sukhumvit) && sukhumvit.every((p) => p!.district === "Sukhumvit"),
    nonNull(sukhumvit) ? sukhumvit.map((p) => p!.district).join(",") : "null pick",
  );

  // Combined filters narrow on every axis at once.
  const silomCheap = await picks(3, { districts: ["Silom"], budget: "cheap" });
  check(
    "district 'Silom' + budget 'cheap' \u2192 in Silom and priceLevel <= 2",
    nonNull(silomCheap) &&
      silomCheap.every((p) => p!.district === "Silom" && (p!.priceLevel || 0) <= 2),
    nonNull(silomCheap)
      ? silomCheap.map((p) => `${p!.district}|${p!.priceLevel}`).join(",")
      : "null pick",
  );

  // Near me: distance-ranks around the user's coords. The route slices to the
  // 30 nearest restaurants, so the pick must come from that nearest set.
  const allRes = (await (await fetch(`${BASE}/api/restaurants`)).json()) as Array<{
    id: number;
    lat: string;
    lng: string;
  }>;
  const withCoords = allRes
    .map((r) => ({ id: r.id, lat: parseFloat(r.lat), lng: parseFloat(r.lng) }))
    .filter((r) => !Number.isNaN(r.lat) && !Number.isNaN(r.lng));
  if (withCoords.length > 5) {
    const origin = withCoords[0]; // use a real restaurant's location as "me"
    const nearestIds = new Set(
      withCoords
        .map((r) => ({ id: r.id, d: haversineKm(origin.lat, origin.lng, r.lat, r.lng) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 30)
        .map((r) => r.id),
    );
    const near = await picks(3, { nearMe: true, userLat: origin.lat, userLng: origin.lng });
    check(
      "nearMe \u2192 pick is among the 30 nearest restaurants to the user",
      nonNull(near) && near.every((p) => nearestIds.has(p!.id)),
      nonNull(near) ? near.map((p) => p!.id).join(",") : "null pick",
    );
  } else {
    console.log("  \u2013 nearMe test skipped (not enough geocoded restaurants)");
  }

  // Graceful relaxation: an over-constrained request never dead-ends.
  const overConstrained = await picks(1, { districts: ["Sukhumvit"], dining: "buffet" });
  check(
    "over-constrained (Sukhumvit + buffet) still returns a pick (graceful relaxation)",
    nonNull(overConstrained),
  );

  // --- Adversarial / type-confusion regression. Request-controlled JSON shapes
  // (arrays with non-string elements, etc.) previously reached the recommendation
  // engine and crashed it with a 500 via .toLowerCase()/.map(). They must now stay
  // 200 and still filter on the valid values. ---
  async function rawStatus(body: unknown): Promise<number> {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.status;
  }

  check(
    "avoidTags with mixed non-string elements \u2192 200 (no 500)",
    (await rawStatus({ ...baseBody, avoidTags: ["spicy", 123, null, {}, "thai"] })) === 200,
  );
  check(
    "districts with non-string first element \u2192 200 (no 500)",
    (await rawStatus({ ...baseBody, districts: [123, "Sukhumvit"] })) === 200,
  );
  check(
    "districts with null/object elements \u2192 200 (no 500)",
    (await rawStatus({ ...baseBody, districts: [null, {}, "Sukhumvit"] })) === 200,
  );

  // A mixed-type districts array still filters by the valid district value.
  const mixedDistrict = await picks(3, { districts: [123, "Sukhumvit"] });
  check(
    "mixed districts [123,'Sukhumvit'] \u2192 pick still in Sukhumvit",
    nonNull(mixedDistrict) && mixedDistrict.every((p) => p!.district === "Sukhumvit"),
    nonNull(mixedDistrict) ? mixedDistrict.map((p) => p!.district).join(",") : "null pick",
  );

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error("\nTest run failed to execute:", err instanceof Error ? err.message : err);
  process.exit(1);
});
