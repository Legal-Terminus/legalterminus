/**
 * Gmail email smoke test — verifies the app's real email config works.
 *
 * It loads the same env files the backend uses (.env then .env.qa), then:
 *   1. checks GMAIL_USER / GMAIL_APP_PASSWORD are set,
 *   2. VERIFIES the SMTP connection + App-Password auth (no email sent), and
 *   3. optionally SENDS a real test email if you pass a recipient.
 *
 * Run from the backend/ directory (so the relative .env paths resolve):
 *   node scripts/test-email.js                 # verify config + auth only
 *   node scripts/test-email.js you@example.com # also send a real test email
 *
 * Exit code 0 = success, 1 = failure (usable in CI / quick checks).
 */
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Mirror server.js: load .env, then .env.qa (later file overrides).
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.qa' });

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;
const from = process.env.EMAIL_FROM || user;
const to = process.argv[2]; // optional recipient

function mask(v) {
  if (!v) return '(unset)';
  return v.length <= 4 ? '••••' : `${v.slice(0, 2)}…${v.slice(-2)} (${v.length} chars)`;
}

async function main() {
  console.log('— Gmail email smoke test —');
  console.log(`  GMAIL_USER:         ${user || '(unset)'}`);
  console.log(`  GMAIL_APP_PASSWORD: ${mask(pass)}`);
  console.log(`  EMAIL_FROM:         ${from || '(unset)'}`);

  if (!user || !pass) {
    console.error('\n❌ GMAIL_USER / GMAIL_APP_PASSWORD are not both set — email is disabled (no-op).');
    console.error('   Add them to backend/.env (and .env.qa) or the deploy secrets, then retry.');
    process.exit(1);
  }

  // Warn if the App Password still looks like the placeholder or has spaces.
  const cleaned = pass.replace(/\s+/g, '');
  if (/your-16-char/i.test(pass)) {
    console.error('\n❌ GMAIL_APP_PASSWORD is still the placeholder value. Paste the real 16-char App Password.');
    process.exit(1);
  }
  if (cleaned.length !== 16) {
    console.warn(`\n⚠️  App Password is ${cleaned.length} chars after removing spaces (Google App Passwords are 16). Continuing anyway…`);
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass: cleaned }, // spaces are fine either way; strip to be safe
  });

  // 1) Verify connection + authentication (does NOT send an email).
  try {
    await transporter.verify();
    console.log('\n✅ SMTP connection + App-Password auth OK (transporter.verify passed).');
  } catch (err) {
    console.error('\n❌ SMTP verify FAILED — Gmail rejected the connection/credentials.');
    console.error(`   ${err?.message || err}`);
    console.error('   Common causes: 2-Step Verification not enabled, wrong/expired App Password,');
    console.error('   or using the normal account password instead of an App Password.');
    process.exit(1);
  }

  // 2) Optionally send a real test email.
  if (!to) {
    console.log('\nℹ️  No recipient given — skipped sending. To send a real test email:');
    console.log('     node scripts/test-email.js you@example.com');
    process.exit(0);
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Legal Terminus — email test ✅',
      text: 'This is a test email from the Legal Terminus backend. If you received it, Gmail sending works.',
      html: '<p>This is a <b>test email</b> from the Legal Terminus backend.</p><p>If you received it, Gmail sending works. ✅</p>',
    });
    console.log(`\n✅ Test email SENT to ${to}. messageId: ${info.messageId}`);
    console.log('   Check the inbox (and spam) to confirm delivery.');
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Sending to ${to} FAILED.`);
    console.error(`   ${err?.message || err}`);
    process.exit(1);
  }
}

main();
