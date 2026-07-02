'use server';

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { getAdminUser } from '../../lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const DATA_FILE = path.join(process.cwd(), 'data', 'intake-submissions.json');
const TABLE_NAME = process.env.SUPABASE_TABLE || 'intake_submissions';
const ACTIVITY_TABLE = `${TABLE_NAME}_activity`;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function readLocalSubmissions() {
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function updateLocalSubmission(id, patch) {
  try {
    const parsed = await readLocalSubmissions();
    const next = parsed.map((item) => (item.id === id ? { ...item, ...patch } : item));
    await writeFile(DATA_FILE, JSON.stringify(next, null, 2), 'utf8');
  } catch {
    // ignore local sync failure in prototype
  }
}

function mapActivity(item) {
  if (!item) return null;
  return {
    id: item.id,
    submissionId: item.submission_id,
    eventType: item.event_type,
    actorEmail: item.actor_email || '',
    createdAt: item.created_at,
    summary: item.summary || '',
    statusFrom: item.status_from || '',
    statusTo: item.status_to || '',
    notesBefore: item.notes_before || '',
    notesAfter: item.notes_after || '',
    metadata: item.metadata || null,
    source: 'supabase',
  };
}

export async function updateLeadAction(formData) {
  const { email, isAdmin } = await getAdminUser();
  if (!isAdmin) {
    return { ok: false, message: 'Unauthorized admin session.' };
  }

  const id = String(formData.get('id') || '').trim();
  const status = String(formData.get('status') || '').trim();
  const notes = String(formData.get('notes') || '').trim();
  const updatedAt = new Date().toISOString();

  if (!id) {
    return { ok: false, message: 'Missing lead id.' };
  }

  if (!url || !serviceRoleKey || serviceRoleKey === 'replace-with-service-role-key') {
    return { ok: false, message: 'SUPABASE_SERVICE_ROLE_KEY is not configured.' };
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ status: status || 'new', notes, updated_at: updatedAt, updated_by: email })
    .eq('id', id);

  if (error) {
    return { ok: false, message: error.message };
  }

  // Activity is now logged by the database trigger. Fetch the newest event for immediate UI update.
  const { data: latestActivity } = await supabase
    .from(ACTIVITY_TABLE)
    .select('*')
    .eq('submission_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  await updateLocalSubmission(id, {
    status: status || 'new',
    notes,
    updatedAt,
    updatedBy: email,
  });

  return {
    ok: true,
    message: 'Lead updated successfully.',
    updatedAt,
    updatedBy: email,
    activity: mapActivity(latestActivity),
  };
}
