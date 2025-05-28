import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client for privileged actions
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

/**
 * Get user by email using Supabase Admin REST API
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
export async function getUserByEmail(email: string) {
  const res = await fetch(`${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
    headers: {
      apiKey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (json.users && json.users.length > 0) return json.users[0];
  return null;
} 