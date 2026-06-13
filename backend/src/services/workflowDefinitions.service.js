import { getDb } from '../config/firebase.js';
import { compileDefinition } from '../../../shared/workflows/compileDefinition.js';

/**
 * Loads workflow DEFINITIONS (data) from Firestore and compiles them to XState
 * machines on demand. Single place the backend turns stored workflow data into a
 * runnable engine — used by task creation and (Phase 2) transitions.
 *
 * Definitions are versioned and effectively immutable per published version, so a
 * short in-memory cache keyed by `${id}@${version}` is safe. A separate
 * service-key → definitionId lookup is cached briefly (definitions are rarely
 * added).
 */

const COLLECTION = 'workflowDefinitions';
const CACHE_TTL_MS = 5 * 60 * 1000;

const _compiledByVersion = new Map(); // `${id}@${version}` → { definition, machine }
let _byServiceKey = null;             // { serviceKey: definitionId }
let _byServiceKeyAt = 0;

/** Fetch a definition document by id. */
async function fetchDefinition(definitionId) {
  const snap = await getDb().collection(COLLECTION).doc(definitionId).get();
  return snap.exists ? snap.data() : null;
}

/** Build (and cache) the serviceKey → definitionId index. */
async function getServiceKeyIndex() {
  const now = Date.now();
  if (_byServiceKey && now - _byServiceKeyAt < CACHE_TTL_MS) return _byServiceKey;

  const snap = await getDb().collection(COLLECTION).get();
  const index = {};
  snap.forEach((doc) => {
    const d = doc.data();
    for (const key of d.serviceKeys ?? []) index[key] = doc.id;
  });
  _byServiceKey = index;
  _byServiceKeyAt = now;
  return index;
}

/** Resolve, cache, and compile a definition by its id. Returns { definition, machine } or null. */
export async function getCompiledById(definitionId) {
  if (!definitionId) return null;
  const definition = await fetchDefinition(definitionId);
  if (!definition) return null;

  const cacheKey = `${definition.id}@${definition.version ?? 1}`;
  let entry = _compiledByVersion.get(cacheKey);
  if (!entry) {
    entry = { definition, machine: compileDefinition(definition) };
    _compiledByVersion.set(cacheKey, entry);
  }
  return entry;
}

/** Resolve a service key → its compiled workflow. Returns { definition, machine } or null. */
export async function getCompiledForServiceKey(serviceKey) {
  const index = await getServiceKeyIndex();
  const definitionId = index[serviceKey];
  if (!definitionId) return null;
  return getCompiledById(definitionId);
}

/** Invalidate caches (call after publishing a definition edit). */
export function invalidateWorkflowCache() {
  _compiledByVersion.clear();
  _byServiceKey = null;
  _byServiceKeyAt = 0;
}
