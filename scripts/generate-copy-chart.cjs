/* Generates exports/toast-copy-chart-en-th.xlsx
 * Sheet per screen area. Two blocks per sheet:
 *  1) translated copy from client/src/locales/en.json + th.json
 *  2) hardcoded English strings extracted from main-screen components (AST scan)
 * Run: node scripts/generate-copy-chart.cjs
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'client/src/locales/en.json'), 'utf8'));
const th = JSON.parse(fs.readFileSync(path.join(ROOT, 'client/src/locales/th.json'), 'utf8'));

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') Object.assign(out, flatten(v, key));
    else out[key] = String(v);
  }
  return out;
}

const tiebreakerDir = path.join(ROOT, 'client/src/components/group-tiebreaker');
const tiebreakerFiles = fs.existsSync(tiebreakerDir)
  ? fs.readdirSync(tiebreakerDir).filter(f => f.endsWith('.tsx')).map(f => `client/src/components/group-tiebreaker/${f}`)
  : [];

const groups = {
  'Home': [
    'client/src/pages/Home.tsx', 'client/src/components/ToastDecides.tsx',
    'client/src/components/BottomNav.tsx', 'client/src/components/SessionBar.tsx',
    'client/src/components/InteractiveMap.tsx', 'client/src/components/EmojiFilter.tsx',
    'client/src/components/BottomSheet.tsx', 'client/src/components/LoadingMascot.tsx',
  ],
  'Solo Flow': [
    'client/src/pages/SoloJourney.tsx', 'client/src/pages/SoloQuiz.tsx',
    'client/src/pages/SoloResults.tsx', 'client/src/pages/SwipePage.tsx',
    'client/src/pages/ToastPicks.tsx', 'client/src/pages/RestaurantList.tsx',
    'client/src/pages/MenuItemRestaurants.tsx',
    'client/src/components/SwipeCard.tsx', 'client/src/components/SwipeDeck.tsx',
  ],
  'Group Flow': [
    'client/src/pages/GroupSetup.tsx', 'client/src/pages/GroupSwipe.tsx',
    'client/src/pages/GroupTaste.tsx', 'client/src/pages/WaitingRoom.tsx',
    ...tiebreakerFiles,
  ],
  'Trending': ['client/src/pages/TrendingFeed.tsx'],
  'Restaurant & Saved': [
    'client/src/pages/RestaurantDetail.tsx', 'client/src/pages/SavedLists.tsx',
    'client/src/components/SaveBucketPicker.tsx', 'client/src/components/RestaurantRow.tsx',
  ],
  'Shared UI': ['client/src/pages/Onboarding.tsx', 'client/src/components/ErrorBoundary.tsx'],
};

const ATTR_ALLOW = new Set(['placeholder','title','label','alt','aria-label','description','subtitle','headline','buttonLabel','confirmText','cancelText','message','text','caption','hint','tooltip','emptyText']);
const PROP_ALLOW = new Set(['title','description','label','message','subtitle','headline','buttonLabel','text','caption','hint','emptyText','confirmText','cancelText','greeting','sub']);

function isCopy(s) {
  const v = s.replace(/\s+/g, ' ').trim();
  if (!/[A-Za-z\u0E00-\u0E7F]{2,}/.test(v)) return null;
  if (/^[a-z0-9_.\-\/:#@]+$/.test(v)) return null;
  if (/^(https?:|\/|#|@|\.|linear-gradient|rgba?\(|hsla?\()/.test(v)) return null;
  if (!v.includes(' ') && /[-_]/.test(v)) return null;
  if (v.length < 2 || v.length > 300) return null;
  return v;
}

function extract(file) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found = [];
  const add = (node, text, ctx) => {
    const v = isCopy(text);
    if (!v) return;
    const line = sf.getLineAndCharacterOfPosition(node.getStart()).line + 1;
    found.push({ text: v, line, ctx });
  };
  function nearestJsxAttr(node) {
    for (let p = node.parent; p; p = p.parent) {
      if (ts.isJsxAttribute(p)) return p.name.getText();
      if (ts.isJsxElement(p) || ts.isJsxFragment(p) || ts.isJsxSelfClosingElement(p)) return null;
    }
    return undefined;
  }
  function visit(node) {
    if (ts.isJsxText(node)) add(node, node.text, 'jsx');
    else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const attr = nearestJsxAttr(node);
      if (attr === null) add(node, node.text, 'jsx');
      else if (typeof attr === 'string' && ATTR_ALLOW.has(attr)) add(node, node.text, attr);
      else if (attr === undefined && node.parent && ts.isPropertyAssignment(node.parent)
               && PROP_ALLOW.has(node.parent.name.getText())) add(node, node.text, node.parent.name.getText());
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return found.filter(f => !/^[a-z_]+\.[a-z0-9_.]+$/i.test(f.text));
}

const hardcoded = {};
for (const [sheet, files] of Object.entries(groups)) {
  const rows = [];
  const seen = new Set();
  for (const f of files) {
    if (!fs.existsSync(path.join(ROOT, f))) continue;
    for (const item of extract(f)) {
      const key = item.text.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({ file: f.split('/').pop(), ...item });
    }
  }
  hardcoded[sheet] = rows;
}

const sheetDefs = [
  { name: 'Home', sections: [['home', 'Home screen'], ['navigation', 'Bottom navigation']] },
  { name: 'Solo Flow', sections: [['soloJourney', 'Solo journey'], ['quiz', 'Quiz'], ['swipe', 'Swipe cards'], ['results', 'Results'], ['toast_picks', "Toast's picks"]] },
  { name: 'Group Flow', sections: [['group', 'Group setup'], ['waiting', 'Waiting room'], ['group_swipe', 'Group swipe']] },
  { name: 'Trending', sections: [['trending', 'Trending feed']] },
  { name: 'Restaurant & Saved', sections: [['restaurant', 'Restaurant details'], ['saved', 'Saved lists']] },
  { name: 'Shared UI', sections: [['common', 'Common labels & buttons'], ['errors', 'Errors'], ['empty', 'Empty states'], ['cuisine', 'Cuisine labels']] },
];

const GOLD = 'FFFFCC02', CREAM = 'FFFFF6E0', ORANGE = 'FFFFE8B3', DARK = 'FF1F1F1F', GRAY = 'FF6B7280';

async function main() {
  const wb = new ExcelJS.Workbook();
  let locTotal = 0, hardTotal = 0;

  for (const def of sheetDefs) {
    const ws = wb.addWorksheet(def.name, { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = [{ width: 34 }, { width: 52 }, { width: 52 }, { width: 36 }];
    const hr = ws.addRow(['Key / Location', 'English', 'Thai', 'Notes']);
    hr.height = 22;
    hr.eachCell(c => {
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GOLD } };
      c.font = { name: 'Arial', bold: true, size: 11, color: { argb: DARK } };
      c.alignment = { vertical: 'middle' };
      c.border = { bottom: { style: 'medium', color: { argb: DARK } } };
    });

    const divider = (label, color) => {
      const r = ws.addRow([label]);
      r.height = 20;
      ws.mergeCells(`A${r.number}:D${r.number}`);
      r.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
      r.getCell(1).font = { name: 'Arial', bold: true, size: 10.5, color: { argb: DARK } };
      r.getCell(1).alignment = { vertical: 'middle' };
    };

    for (const [sectionKey, label] of def.sections) {
      divider(`— ${label} (${sectionKey}.*) —`, CREAM);
      const fEn = flatten(en[sectionKey]), fTh = flatten(th[sectionKey]);
      for (const [k, v] of Object.entries(fEn)) {
        const row = ws.addRow([`${sectionKey}.${k}`, v, fTh[k] !== undefined ? fTh[k] : '⚠ MISSING', '']);
        row.getCell(1).font = { name: 'Consolas', size: 9.5, color: { argb: GRAY } };
        row.getCell(2).font = { name: 'Arial', size: 10.5 };
        row.getCell(3).font = { name: 'Tahoma', size: 10.5 };
        row.eachCell(c => { c.alignment = { vertical: 'top', wrapText: true }; });
        locTotal++;
      }
    }

    const rows = hardcoded[def.name] || [];
    if (rows.length) {
      divider('— HARDCODED IN APP CODE (English only — Thai to be written) —', ORANGE);
      let currentFile = null;
      for (const r of rows) {
        if (r.file !== currentFile) {
          currentFile = r.file;
          const fr = ws.addRow([`▸ ${r.file}`]);
          ws.mergeCells(`A${fr.number}:D${fr.number}`);
          fr.getCell(1).font = { name: 'Arial', bold: true, italic: true, size: 9.5, color: { argb: GRAY } };
        }
        const row = ws.addRow([`${r.file}:${r.line}`, r.text, '', r.ctx === 'jsx' ? '' : `(${r.ctx})`]);
        row.getCell(1).font = { name: 'Consolas', size: 9, color: { argb: GRAY } };
        row.getCell(2).font = { name: 'Arial', size: 10.5 };
        row.getCell(3).font = { name: 'Tahoma', size: 10.5 };
        row.getCell(4).font = { name: 'Arial', italic: true, size: 9, color: { argb: GRAY } };
        row.eachCell(c => { c.alignment = { vertical: 'top', wrapText: true }; });
        hardTotal++;
      }
    }
  }

  const outDir = path.join(ROOT, 'exports');
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, 'toast-copy-chart-en-th.xlsx');
  await wb.xlsx.writeFile(out);
  console.log(`OK: ${locTotal} locale strings + ${hardTotal} hardcoded strings -> ${out}`);
}

main().catch(e => { console.error(e); process.exit(1); });
