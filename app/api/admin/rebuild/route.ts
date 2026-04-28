import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/user';
import { supabaseAdmin } from '@/lib/db/supabase';

function trimMessage(message: string, max = 220): string {
  return message.length > max ? `${message.slice(0, max)}...` : message;
}

function getCooldownSeconds(): number {
  const raw = Number.parseInt(process.env.ADMIN_REBUILD_COOLDOWN_SECONDS || '45', 10);
  if (!Number.isFinite(raw)) return 45;
  return Math.max(30, Math.min(60, raw));
}

async function logRebuildRequest(input: {
  adminUserId: string;
  adminEmail: string;
  status: 'accepted' | 'rejected' | 'failed';
  message?: string;
  responseStatus?: number;
  ipAddress?: string | null;
}) {
  try {
    const db = supabaseAdmin as unknown as {
      from: (table: string) => { insert: (row: Record<string, unknown>) => Promise<unknown> };
    };

    await db.from('admin_rebuild_requests').insert({
      admin_user_id: input.adminUserId,
      admin_email: input.adminEmail,
      status: input.status,
      message: input.message || null,
      response_status: input.responseStatus ?? null,
      ip_address: input.ipAddress ?? null,
    });
  } catch (error) {
    console.error('Failed to write rebuild audit log:', error);
  }
}

function getIpAddress(request: Request): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    return first || null;
  }
  const realIp = request.headers.get('x-real-ip');
  return realIp?.trim() || null;
}

export async function POST(request: Request) {
  const profile = await requireAdmin();
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ipAddress = getIpAddress(request);
  const cooldownSeconds = getCooldownSeconds();

  try {
    const db = supabaseAdmin as unknown as {
      from: (table: string) => {
        select: (columns: string) => {
          eq: (column: string, value: string) => {
            order: (column: string, opts: { ascending: boolean }) => {
              limit: (count: number) => Promise<{ data: Array<{ requested_at: string }> | null }>;
            };
          };
        };
      };
    };

    const { data: recentRows } = await db
      .from('admin_rebuild_requests')
      .select('requested_at')
      .eq('admin_email', profile.email)
      .order('requested_at', { ascending: false })
      .limit(1);

    const lastRequest = recentRows?.[0]?.requested_at;
    if (lastRequest) {
      const elapsedMs = Date.now() - new Date(lastRequest).getTime();
      if (elapsedMs < cooldownSeconds * 1000) {
        const retryAfter = Math.max(1, Math.ceil((cooldownSeconds * 1000 - elapsedMs) / 1000));
        const message = `Please wait ${retryAfter}s before requesting another rebuild.`;
        await logRebuildRequest({
          adminUserId: profile.id,
          adminEmail: profile.email,
          status: 'rejected',
          message,
          responseStatus: 429,
          ipAddress,
        });
        return NextResponse.json({ error: message, retryAfter }, { status: 429 });
      }
    }
  } catch (error) {
    console.error('Failed to validate rebuild cooldown:', error);
  }

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    await logRebuildRequest({
      adminUserId: profile.id,
      adminEmail: profile.email,
      status: 'failed',
      message: 'Missing VERCEL_DEPLOY_HOOK_URL',
      responseStatus: 500,
      ipAddress,
    });
    return NextResponse.json(
      {
        error:
          'Missing VERCEL_DEPLOY_HOOK_URL. Add it in your environment variables to enable rebuild requests.',
      },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(hookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trigger: 'admin-portal',
        actor: profile.email,
        timestamp: new Date().toISOString(),
      }),
      cache: 'no-store',
    });

    const rawText = await res.text();
    if (!res.ok) {
      await logRebuildRequest({
        adminUserId: profile.id,
        adminEmail: profile.email,
        status: 'failed',
        message: trimMessage(rawText || res.statusText),
        responseStatus: res.status,
        ipAddress,
      });
      return NextResponse.json(
        {
          error: `Vercel rebuild request failed (${res.status}): ${trimMessage(rawText || res.statusText)}`,
        },
        { status: 502 },
      );
    }

    await logRebuildRequest({
      adminUserId: profile.id,
      adminEmail: profile.email,
      status: 'accepted',
      message: 'Rebuild requested via deploy hook',
      responseStatus: res.status,
      ipAddress,
    });

    return NextResponse.json({
      ok: true,
      message: 'Rebuild request sent to Vercel successfully.',
      response: trimMessage(rawText || 'Accepted by deploy hook.'),
      cooldownSeconds,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await logRebuildRequest({
      adminUserId: profile.id,
      adminEmail: profile.email,
      status: 'failed',
      message: trimMessage(message),
      responseStatus: 502,
      ipAddress,
    });
    return NextResponse.json(
      { error: `Failed to contact Vercel deploy hook: ${trimMessage(message)}` },
      { status: 502 },
    );
  }
}
