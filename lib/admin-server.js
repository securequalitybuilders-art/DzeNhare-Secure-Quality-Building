import { readFile } from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { isAdminEmail } from './admin-access';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const table = process.env.SUPABASE_TABLE || 'intake_submissions';
const activityTable = `${table}_activity`;
const DATA_FILE = path.join(process.cwd(), 'data', 'intake-submissions.json');

function getAdminClient() {
  if (!url || !serviceRoleKey || serviceRoleKey === 'replace-with-service-role-key') {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function mapSubmission(item) {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    role: item.role,
    details: item.details,
    status: item.status || 'new',
    notes: item.notes || '',
    submittedAt: item.submitted_at || item.submittedAt,
    updatedAt: item.updated_at || item.updatedAt || '',
    updatedBy: item.updated_by || item.updatedBy || '',
    source: item.source || item.storage || 'supabase',
  };
}

function mapActivity(item) {
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
    source: item.source || 'supabase',
  };
}

export async function getAdminRows(authenticatedEmail) {
  if (!(await isAdminEmail(authenticatedEmail))) {
    return { ok: false, rows: [], message: 'Unauthorized admin email.' };
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return { ok: false, rows: [], message: 'SUPABASE_SERVICE_ROLE_KEY is not configured.' };
  }

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    return { ok: false, rows: [], message: error.message };
  }

  return {
    ok: true,
    rows: (data || []).map(mapSubmission),
    message: '',
  };
}

export async function getAdminRowById(authenticatedEmail, id) {
  if (!(await isAdminEmail(authenticatedEmail))) {
    return { ok: false, row: null, message: 'Unauthorized admin email.' };
  }

  if (!id) {
    return { ok: false, row: null, message: 'Missing lead id.' };
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return { ok: false, row: null, message: 'SUPABASE_SERVICE_ROLE_KEY is not configured.' };
  }

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { ok: false, row: null, message: error.message };
  }

  if (!data) {
    return { ok: false, row: null, message: 'Lead not found in Supabase.' };
  }

  return {
    ok: true,
    row: mapSubmission(data),
    message: '',
  };
}

export async function getSubmissionActivity(authenticatedEmail, submissionIds = []) {
  if (!(await isAdminEmail(authenticatedEmail))) {
    return { ok: false, activitiesBySubmission: {}, message: 'Unauthorized admin email.' };
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return { ok: false, activitiesBySubmission: {}, message: 'SUPABASE_SERVICE_ROLE_KEY is not configured.' };
  }

  let query = supabase
    .from(activityTable)
    .select('*')
    .order('created_at', { ascending: false });

  if (submissionIds.length > 0) {
    query = query.in('submission_id', submissionIds);
  }

  const { data, error } = await query;

  if (error) {
    return { ok: false, activitiesBySubmission: {}, message: error.message };
  }

  const grouped = {};
  for (const row of data || []) {
    const mapped = mapActivity(row);
    if (!grouped[mapped.submissionId]) grouped[mapped.submissionId] = [];
    grouped[mapped.submissionId].push(mapped);
  }

  return {
    ok: true,
    activitiesBySubmission: grouped,
    message: '',
  };
}

export async function getSubmissionActivityForId(authenticatedEmail, id) {
  const result = await getSubmissionActivity(authenticatedEmail, id ? [id] : []);

  if (!result.ok) {
    return { ok: false, activities: [], message: result.message };
  }

  return {
    ok: true,
    activities: result.activitiesBySubmission[id] || [],
    message: '',
  };
}

export async function getLocalRows() {
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.map((item) => mapSubmission({ ...item, source: item.source || item.storage || 'local' }));
  } catch {
    return [];
  }
}

export async function getLocalRowById(id) {
  const rows = await getLocalRows();
  return rows.find((item) => item.id === id) || null;
}
