import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/Users/ankygoyal/Documents/git/legalterminus/Legal-Terminus/Frontend/package.json');
const { chromium } = require('playwright');
const b64 = (p) => fs.readFileSync(p).toString('base64');
const logo = `data:image/png;base64,${b64('/Users/ankygoyal/Documents/git/legalterminus/Legal-Terminus/Portal/public/lt-logo.png')}`;
const shot = `data:image/png;base64,${b64(process.env.HOME + '/lt-android-release/store-assets/raw-screens/store-1-dashboard.png')}`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
body{width:1024px;height:500px;overflow:hidden;font-family:-apple-system,"SF Pro Display","Helvetica Neue",Arial,sans-serif;
 background:radial-gradient(ellipse at 90% 10%,#dff5da 0%,rgba(223,245,218,0) 60%),linear-gradient(180deg,#fff 0%,#f2faf0 100%);position:relative}
.text{position:absolute;left:56px;top:70px;width:560px}
.logo{height:46px}
h1{margin-top:34px;font-size:50px;line-height:1.08;font-weight:800;letter-spacing:-1px;color:#111}
h1 em{font-style:normal;color:#2BB61A}
p{margin-top:18px;font-size:21px;line-height:1.35;color:#4b5563;font-weight:500}
.phone{position:absolute;right:70px;top:52px;width:250px;border-radius:38px;background:#111;padding:8px;box-shadow:0 18px 50px rgba(17,17,17,.22)}
.phone img{display:block;width:100%;border-radius:31px}
.scr{border-radius:31px;overflow:hidden;background:#fff}.scr img{border-radius:0!important;margin-top:-34px}.sb{position:relative;z-index:2;height:20px;padding:0 22px;display:flex;justify-content:space-between;align-items:center;background:#fff;font-size:10px;font-weight:600;color:#111}.hole{position:absolute;z-index:3;top:13px;left:50%;transform:translateX(-50%);width:10px;height:10px;border-radius:50%;background:#111}.island{position:absolute;top:20px;left:50%;transform:translateX(-50%);width:66px;height:19px;border-radius:12px;background:#111}
</style></head><body>
<div class="text"><img class="logo" src="${logo}"><h1>Your business compliance, <em>handled by experts</em></h1>
<p>Company registration, GST, trademark and more. Track every step in one app.</p></div>
<div class="phone"><div class="scr"><div class="sb"><span>9:41</span><span>▾ ▴ ▮</span></div><img src="${shot}"></div><div class="hole"></div></div></body></html>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 500 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.screenshot({ path: process.env.HOME + '/lt-android-release/store-assets/play-feature-graphic-1024x500.png' });
await browser.close();
