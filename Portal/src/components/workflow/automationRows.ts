import { CalendarClock, ClipboardList, Clock, FileUp, GitBranch, IndianRupee, Mail, UserCheck, Zap } from 'lucide-react';
import { KNOWN_EFFECTS } from './stepEditorVocab';
import { describeCondition } from '../../../../shared/workflows/conditions.js';
import { describeForm } from '../../../../shared/workflows/forms.js';
import { describeDueRule } from '../../../../shared/workflows/dueRules.js';
import { describeAction } from '../../../../shared/workflows/actions.js';
import { roleLabel } from '../../lib/roles';
import type { WorkflowStepDef } from '../../api/workflowDefinitions';

/**
 * The pure half of `StepAutomationSummary`: which automations a step has, as
 * data. It lives in its own file because a module that exports both a component
 * and plain functions cannot be hot-reloaded on its own — every save of the
 * component file would reload the whole page.
 */

export interface AutomationRow {
  key: string;
  icon: typeof Mail;
  /** Present tense, for the editor: what WILL happen. */
  text: string;
  /** Which sub-editor this row belongs to, so a click can open it (AC2). */
  field: 'client-email' | 'documents' | 'payment' | 'assignment' | 'effects'
    // Epics 34/35: the newer automations, each with its own sub-editor.
    | 'condition' | 'form' | 'due-rule' | 'actions';
}

/** The step's automations, in the order an author thinks about them. */
export function automationRows(step: WorkflowStepDef, stepTitleFor?: (n: number) => string): AutomationRow[] {
  const rows: AutomationRow[] = [];

  // A client-facing prompt is the loudest thing a step can do — it emails a
  // real person — so it leads.
  if (step.clientPromptTitle || step.clientPromptMessage) {
    const subject = step.clientPromptTitle?.trim();
    rows.push({
      key: 'client-email',
      icon: Mail,
      field: 'client-email',
      text: subject ? `Emails the client: “${subject}”` : 'Emails the client when this step starts',
    });
  }

  for (const eff of KNOWN_EFFECTS) {
    if ((step.effects ?? []).includes(eff.id)) {
      rows.push({ key: `effect-${eff.id}`, icon: Mail, field: 'effects', text: eff.label });
    }
  }

  if (step.allowDocUpload) {
    rows.push({
      key: 'docs',
      icon: FileUp,
      field: 'documents',
      text: 'Asks the client to upload documents',
    });
  }

  if (step.type === 'payment_gate' && step.gate) {
    const level = step.gate.requires === 'part_paid' ? 'a part payment' : 'full payment';
    const onward = stepTitleFor?.(step.gate.onPass);
    rows.push({
      key: 'gate',
      icon: IndianRupee,
      field: 'payment',
      text: onward
        ? `Waits for ${level}, then goes to “${onward}”`
        : `Waits for ${level} before the matter can continue`,
    });
  }

  if (step.assignedRole) {
    rows.push({
      key: 'role',
      icon: UserCheck,
      field: 'assignment',
      // roleLabel gives the human name ("Team Member"); the raw slug read
      // "Goes to the team member team".
      text: `Assigned to ${roleLabel(step.assignedRole)}`,
    });
  }

  // E01-S34-2: the step may not apply to every client. Placed high — whether a
  // step runs at all matters more than what it does when it does.
  if (step.condition) {
    rows.push({
      key: 'condition',
      icon: GitBranch,
      field: 'condition',
      // Reuses the SHARED describer, so the editor and the runtime cannot
      // describe the same condition differently.
      text: `Only applies when ${describeCondition(step.condition) ?? 'a condition matches'}`,
    });
  }

  // E01-S34-3: structured questions the client answers in the portal.
  if (step.form?.fields?.length) {
    rows.push({
      key: 'form',
      icon: ClipboardList,
      field: 'form',
      text: describeForm(step.form) ?? 'Asks the client questions',
    });
  }

  // E01-S32-1/32-2: declarative actions.
  for (const [i, action] of (step.actions ?? []).entries()) {
    rows.push({
      key: `action-${action.id ?? i}`,
      icon: Zap,
      field: 'actions',
      text: `${describeAction(action)} ${action.on === 'entry' ? 'when this step starts' : 'when this step completes'}`,
    });
  }

  // E01-S35-1: a date-anchored deadline REPLACES the duration ETA, so it is
  // rendered instead of it rather than beside it — showing both would state two
  // different deadlines for one step.
  if (step.dueRule) {
    rows.push({
      key: 'due-rule',
      icon: CalendarClock,
      field: 'due-rule',
      text: describeDueRule(step.dueRule) ?? 'Has a date-anchored deadline',
    });
  } else if (typeof step.typicalDurationDays === 'number' && step.typicalDurationDays >= 0) {
    const d = step.typicalDurationDays;
    rows.push({
      key: 'eta',
      icon: Clock,
      field: 'assignment',
      text: d === 0 ? 'Expected same day' : `Expected to take ${d} day${d === 1 ? '' : 's'}`,
    });
  }

  return rows;
}

/** How many of a workflow's steps will contact the client (AC4). */
export function clientTouchpointCount(steps: WorkflowStepDef[]): number {
  return steps.filter((s) =>
    s.clientPromptTitle || s.clientPromptMessage || s.allowDocUpload
    || (s.effects ?? []).includes('SEND_EMAIL')).length;
}
