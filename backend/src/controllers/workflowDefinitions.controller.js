import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';

const COLLECTION = 'workflowDefinitions';

// GET /api/workflow-definitions — summaries for listing (no full steps payload).
export async function listDefinitions(req, res) {
  try {
    const snap = await getDb().collection(COLLECTION).get();
    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: data.id ?? d.id,
        name: data.name ?? d.id,
        version: data.version ?? 1,
        serviceKeys: data.serviceKeys ?? [],
        stepCount: Array.isArray(data.steps) ? data.steps.length : 0,
        updatedAt: data.updatedAt ?? null,
      };
    });
    res.json(items);
  } catch (err) {
    logger.error({ err }, 'listDefinitions error:');
    res.status(500).json({ message: 'Failed to list workflow definitions' });
  }
}

// GET /api/workflow-definitions/:id — full definition (incl. steps) for viz/editor.
export async function getDefinition(req, res) {
  try {
    const snap = await getDb().collection(COLLECTION).doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ message: 'Workflow definition not found' });
    res.json(snap.data());
  } catch (err) {
    logger.error({ err }, 'getDefinition error:');
    res.status(500).json({ message: 'Failed to get workflow definition' });
  }
}
