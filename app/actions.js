'use server';

import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'intake-submissions.json');
const RATE_LIMIT_FILE = path.join(DATA_DIR, 'intake-rate-limit.json');
const TABLE_NAME = process.env.SUPABASE_TABLE || 'intake_submissions';
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_FIELD_LENGTH = 5000;

async function readJsonFile(filePath, fallback) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function readSubmissions() {
  return readJsonFile(DATA_FILE, []);
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function getClientFingerprint(formData) {
  const headerStore = headers();
  const forwardedFor = headerStore.get('x-forwarded-for') || '';
  const realIp = headerStore.get('x-real-ip') || '';
  const userAgent = headerStore.get('user-agent') || '';
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const basis = `${forwardedFor.split(',')[0] || realIp || 'unknown'}|${userAgent}|${email}`;
  return createHash('sha256').update(basis).digest('hex');
}

async function checkLocalRateLimit(fingerprint) {
  await mkdir(DATA_DIR, { recursive: true });
  const now = Date.now();
  const rateMap = await readJsonFile(RATE_LIMIT_FILE, {});
  const recent = (rateMap[fingerprint] || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    rateMap[fingerprint] = recent;
    await writeFile(RATE_LIMIT_FILE, JSON.stringify(rateMap, null, 2), 'utf8');
    return false;
  }

  rateMap[fingerprint] = [...recent, now];
  await writeFile(RATE_LIMIT_FILE, JSON.stringify(rateMap, null, 2), 'utf8');
  return true;
}

function hasLikelyBotContent(payload) {
  const combined = `${payload.name} ${payload.email} ${payload.role} ${payload.details}`.toLowerCase();
  const urlMatches = combined.match(/https?:\/\//g) || [];
  const spamTerms = ['casino', 'viagra', 'crypto giveaway', 'telegram pump', 'forex signals'];
  return urlMatches.length > 2 || spamTerms.some((term) => combined.includes(term));
}

export async function submitIntake(formData) {
  const honeypot = String(formData.get('company_website') || '').trim();
  if (honeypot) {
    return { ok: true, message: 'Thanks. Your intake has been captured.' };
  }

  const fingerprint = getClientFingerprint(formData);
  const rateLimitAllowed = await checkLocalRateLimit(fingerprint);
  if (!rateLimitAllowed) {
    return { ok: false, message: 'Too many submissions from this browser recently. Please try again later.' };
  }

  const payload = {
    id: `lead_${Date.now()}`,
    name: String(formData.get('name') || '').trim().slice(0, MAX_FIELD_LENGTH),
    email: String(formData.get('email') || '').trim().slice(0, MAX_FIELD_LENGTH),
    role: String(formData.get('role') || '').trim().slice(0, MAX_FIELD_LENGTH),
    details: String(formData.get('details') || '').trim().slice(0, MAX_FIELD_LENGTH),
    submittedAt: new Date().toISOString(),
  };

  if (!payload.name || !payload.email || !payload.role || !payload.details) {
    return { ok: false, message: 'Please complete all fields before submitting.' };
  }

  if (hasLikelyBotContent(payload)) {
    return { ok: false, message: 'This submission looks automated. Please remove excessive links or promotional content.' };
  }

  let supabasePersisted = false;
  const supabase = getSupabaseClient();

  if (supabase) {
    const { error } = await supabase.from(TABLE_NAME).insert({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      details: payload.details,
      status: 'new',
      notes: '',
      submitted_at: payload.submittedAt,
    });

    if (!error) {
      supabasePersisted = true;
    }
  }

  await mkdir(DATA_DIR, { recursive: true });
  const existing = await readSubmissions();
  existing.unshift({ ...payload, storage: supabasePersisted ? 'supabase+local' : 'local' });
  await writeFile(DATA_FILE, JSON.stringify(existing, null, 2), 'utf8');

  return {
    ok: true,
    message: supabasePersisted
      ? `Thanks ${payload.name}. Your intake has been captured and synced to Supabase.`
      : `Thanks ${payload.name}. Your intake has been captured locally. Supabase sync did not complete yet.`,
    payload,
  };
}
