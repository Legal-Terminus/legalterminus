// Store frames: headline + the app screen in a phone, Legal Terminus colours.
// node render.mjs <raw-dir> <out-dir>   (raw screens are 1320×2868 iPhone 6.9" captures)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/Users/ankygoyal/Documents/git/legalterminus/Legal-Terminus/Frontend/package.json');
const { chromium } = require('playwright');

const [raw, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const logo = `data:image/png;base64,${fs.readFileSync('/Users/ankygoyal/Documents/git/legalterminus/Legal-Terminus/Portal/public/lt-logo.png').toString('base64')}`;

const FRAMES = [
  { shot: 'store-1-dashboard', head: 'Your business compliance, <em>handled by experts</em>', sub: 'Company, GST, trademark and more, in one app' },
  { shot: 'store-3-steps', head: 'See exactly where <em>every filing</em> stands', sub: 'Every step of every service, updated as it happens' },
  { shot: 'store-5-chat', head: 'Talk to <em>your expert</em>', sub: 'Questions answered right inside your service' },
  { shot: 'store-4-documents', head: 'Share documents <em>securely</em>', sub: 'Upload from your phone. Open what we send you.' },
  { shot: 'store-6-payments', head: 'Clear fees. <em>No surprises.</em>', sub: 'What is billed, paid and due, at a glance' },
  { shot: 'store-2-services', head: 'All your services, <em>one place</em>', sub: 'Registrations, filings and renewals, tracked for you' },
];

const SIZES = [
  { name: 'ios-6.9', w: 1320, h: 2868 },   // App Store iPhone 6.9"
  { name: 'play-phone', w: 1080, h: 1920, android: true }, // Google Play phone, 9:16
  { name: 'ios-6.3', w: 1206, h: 2622 },   // App Store "iPhone with Dynamic Island (medium display)" 6.3"
  { name: 'ios-6.1', w: 1179, h: 2556 },   // same slot, 6.1"
  { name: 'ios-6.7', w: 1290, h: 2796 },   // App Store iPhone 6.7"
  { name: 'ios-6.5', w: 1284, h: 2778 },   // App Store iPhone 6.5"
  { name: 'ios-6.5b', w: 1242, h: 2688 },  // App Store iPhone 6.5" (older size)
  { name: 'ios-5.5', w: 1242, h: 2208 },   // App Store iPhone 5.5"
];

const html = (f, s, img) => {
  const u = s.w / 1320;               // scale everything from the 1320-wide design
  const phoneW = Math.round(1000 * u);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;box-sizing:border-box}
  body{width:${s.w}px;height:${s.h}px;overflow:hidden;font-family:-apple-system,"SF Pro Display","Helvetica Neue",Arial,sans-serif;
    background:radial-gradient(ellipse at 85% 8%, #dff5da 0%, rgba(223,245,218,0) 55%), linear-gradient(180deg,#ffffff 0%,#f2faf0 100%);}
  .top{padding:${Math.round(150*u)}px ${Math.round(100*u)}px 0;}
  .logo{height:${Math.round(78*u)}px}
  h1{margin-top:${Math.round(70*u)}px;font-size:${Math.round(112*u)}px;line-height:1.08;font-weight:800;letter-spacing:-${(2*u).toFixed(1)}px;color:#111}
  h1 em{font-style:normal;color:#2BB61A}
  p{margin-top:${Math.round(34*u)}px;font-size:${Math.round(50*u)}px;line-height:1.3;color:#4b5563;font-weight:500}
  .phone{position:relative;margin:${Math.round(110*u)}px auto 0;
    width:${phoneW}px;border-radius:${Math.round(130*u)}px;background:#111;padding:${Math.round(22*u)}px;
    box-shadow:0 ${Math.round(40*u)}px ${Math.round(120*u)}px rgba(17,17,17,.22)}
  .phone img{display:block;width:100%;border-radius:${Math.round(110*u)}px}
  .android .scr{border-radius:${Math.round(110*u)}px;overflow:hidden;background:#fff}
  .android .scr img{border-radius:0;margin-top:-${Math.round((phoneW - 44*u) * 190 / 1320)}px}
  .android .sb{position:relative;z-index:2;height:${Math.round(70*u)}px;padding:0 ${Math.round(80*u)}px;display:flex;justify-content:space-between;align-items:center;background:#fff;font-size:${Math.round(34*u)}px;font-weight:600;color:#111}
  .hole{position:absolute;z-index:3;top:${Math.round(40*u)}px;left:50%;transform:translateX(-50%);width:${Math.round(34*u)}px;height:${Math.round(34*u)}px;border-radius:50%;background:#111}
  .island{position:absolute;top:${Math.round(58*u)}px;left:50%;transform:translateX(-50%);width:${Math.round(250*u)}px;height:${Math.round(72*u)}px;border-radius:${Math.round(40*u)}px;background:#111}
  </style></head><body>
  <div class="top"><img class="logo" src="${logo}"><h1>${f.head}</h1><p>${f.sub}</p></div>
  ${s.android ? `<div class="phone android"><div class="scr"><div class="sb"><span>9:41</span><span>▾ ▴ ▮</span></div><img src="${img}"></div><div class="hole"></div></div>` : `<div class="phone"><img src="${img}"><div class="island"></div></div>`}
  </body></html>`;
};

const browser = await chromium.launch();
for (const s of SIZES) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1 });
  let n = 0;
  for (const f of FRAMES) {
    const file = path.join(raw, `${f.shot}.png`);
    if (!fs.existsSync(file)) { console.log('missing', f.shot); continue; }
    n += 1;
    const img = `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
    await page.setContent(html(f, s, img), { waitUntil: 'load' });
    const dest = path.join(out, `${s.name}-${n}.png`);
    await page.screenshot({ path: dest, fullPage: false });
    console.log('wrote', dest);
  }
  await page.close();
}
await browser.close();
