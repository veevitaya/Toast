import { chromium } from 'playwright-core';

const EXEC = process.env.CHROMIUM_PATH;
const BASE = 'http://localhost:5000';
const CODE = process.env.SESSION;
const HOST_ID = process.env.HOST_ID;
const HOST_NAME = process.env.HOST_NAME || 'Mali';

if (!EXEC || !CODE || !HOST_ID) {
  console.error('Missing CHROMIUM_PATH / SESSION / HOST_ID env vars');
  process.exit(1);
}

const browser = await chromium.launch({
  executablePath: EXEC,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});

try {
  const ctx = await browser.newContext({
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  page.on('console', (m) => console.log('[page:' + m.type() + ']', m.text()));

  // Establish origin, then authenticate as a real member via the session-scoped guest key.
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ code, id, name }) => {
    localStorage.setItem(
      'toast_guest_' + code,
      JSON.stringify({ userId: id, displayName: name, pictureUrl: '' }),
    );
  }, { code: CODE, id: HOST_ID, name: HOST_NAME });

  await page.goto(BASE + '/group/swipe?session=' + CODE, { waitUntil: 'domcontentloaded' });

  // 1) Match screen (auto-pops because matches already exist for this member)
  await page.waitForSelector('[data-testid="group-match-page"]', { timeout: 30000 });
  await page.waitForTimeout(1500); // let confetti / spring animation settle
  await page.screenshot({ path: 'screenshots/group-match.jpg', type: 'jpeg', quality: 92 });
  console.log('OK captured: group-match.jpg');

  // 2) Top Picks screen
  await page.click('[data-testid="button-view-summary"]');
  await page.waitForSelector('[data-testid="group-summary-page"]', { timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/group-toppicks.jpg', type: 'jpeg', quality: 92 });
  console.log('OK captured: group-toppicks.jpg');

  // 3) Bonus: tie-breaker game (RPS for 2 members)
  const cant = await page.$('[data-testid="button-cant-decide"]');
  if (cant) {
    await cant.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/group-tiebreaker.jpg', type: 'jpeg', quality: 92 });
    console.log('OK captured: group-tiebreaker.jpg');
  } else {
    console.log('SKIP tiebreaker: button-cant-decide not found');
  }

  console.log('DONE');
} finally {
  await browser.close();
}
