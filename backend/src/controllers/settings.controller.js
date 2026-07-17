import { logger } from '../config/logger.js';
import { TEMPLATE_DEFS, getEmailTemplates, saveEmailTemplates } from '../services/emailTemplates.service.js';

/**
 * Admin-editable app settings (#107/#108/#109). Currently: email templates.
 * GET returns the effective templates (defaults merged with overrides) PLUS the
 * template definitions (labels, placeholders, audience) so the editor can render
 * itself without hardcoding them on the frontend.
 */
export async function getEmailTemplatesSettings(req, res) {
  try {
    const templates = await getEmailTemplates();
    const defs = Object.fromEntries(
      Object.entries(TEMPLATE_DEFS).map(([k, d]) => [k, {
        label: d.label, audience: d.audience, description: d.description, placeholders: d.placeholders,
        default: { subject: d.subject, body: d.body },
      }]),
    );
    res.json({ templates, defs });
  } catch (err) {
    logger.error({ err }, 'getEmailTemplatesSettings error:');
    res.status(500).json({ message: 'Failed to load email templates' });
  }
}

export async function putEmailTemplatesSettings(req, res) {
  try {
    const templates = await saveEmailTemplates(req.body?.templates ?? {});
    res.json({ templates });
  } catch (err) {
    logger.error({ err }, 'putEmailTemplatesSettings error:');
    res.status(500).json({ message: 'Failed to save email templates' });
  }
}
