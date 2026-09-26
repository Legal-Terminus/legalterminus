/**
 * E2E helper (#203): print the portal link a real account email would carry,
 * built by the real link service, so Playwright can open it without a mailbox.
 *
 *   node scripts/e2e-account-link.js password <email> [setup|reset]
 *   node scripts/e2e-account-link.js signin <email>
 *
 * Prints `LINK=<url>` (other output — dotenv, the logger — goes to stdout too,
 * so the caller looks for the prefix). Test-only: refuses anything that is not
 * an e2e address, so it cannot be used to mint a link for a real person.
 */
import initializeFirebase from '../src/config/firebase.js';
import { passwordLinkFor, signInLinkFor } from '../src/services/accountLinks.service.js';

const [kind, email, intent = 'setup'] = process.argv.slice(2);

if (!/^e2e-[^@]+@legalterminus\.test$/i.test(email || '')) {
  console.error('Refusing: only e2e-*@legalterminus.test addresses.');
  process.exit(2);
}

initializeFirebase();
const link = kind === 'signin'
  ? await signInLinkFor(email)
  : await passwordLinkFor(email, { intent });
console.log(`LINK=${link}`);
process.exit(0);
