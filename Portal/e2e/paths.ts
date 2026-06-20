import path from 'path';
import { fileURLToPath } from 'url';
import type { RoleKey } from './helpers';

/** Where each role's saved storageState lives (shared by setup + fixtures). */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const AUTH_DIR = path.join(__dirname, '.auth');
export const statePath = (role: RoleKey) => path.join(AUTH_DIR, `${role}.json`);
