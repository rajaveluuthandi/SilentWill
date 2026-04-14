// Supabase Edge Function: Vault Release
// Called when the dead man's switch triggers after all reminders fail.
// Fetches all assets, decrypts sensitive fields, generates HTML report,
// and emails it to all verified nominees.
//
// Deploy: supabase functions deploy trigger-vault-release
// Env vars needed: RESEND_API_KEY (set via supabase secrets set)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ── Crypto helpers (mirrors packages/api/src/crypto.ts for Deno) ──

function fromBase64(str: string): Uint8Array {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey(raw: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['decrypt']);
}

async function decryptValue(key: CryptoKey, encrypted: string): Promise<string> {
  const [ivB64, cipherB64] = encrypted.split(':');
  if (!ivB64 || !cipherB64) return encrypted;
  try {
    const iv = fromBase64(ivB64);
    const ciphertext = fromBase64(cipherB64);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return new TextDecoder().decode(decrypted);
  } catch {
    return encrypted;
  }
}

const SENSITIVE_FIELDS = ['account_number', 'routing_number', 'policy_number', 'folio_number', 'notes'];

async function decryptAsset(key: CryptoKey, asset: Record<string, any>) {
  const result = { ...asset };
  for (const field of SENSITIVE_FIELDS) {
    if (result[field] && typeof result[field] === 'string' && result[field].includes(':')) {
      result[field] = await decryptValue(key, result[field]);
    }
  }
  return result;
}

// ── Currency formatter ──

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10000000) return `₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(2)} L`;
  return `₹${abs.toLocaleString('en-IN')}`;
}

// ── HTML Report Generator ──

function generateReport(
  userEmail: string,
  assets: Record<string, any>[],
  nominees: Record<string, any>[],
): string {
  const totalAssets = assets.filter(a => a.value > 0).reduce((s, a) => s + a.value, 0);
  const totalLiabilities = Math.abs(assets.filter(a => a.value < 0).reduce((s, a) => s + a.value, 0));
  const netWorth = totalAssets - totalLiabilities;

  const categories = [...new Set(assets.map(a => a.category))];

  const assetRows = assets.map(a => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${a.name}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${a.category}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${a.institution || '—'}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${a.account_number || '—'}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;text-align:right;font-weight:600;">${formatCurrency(a.value)}</td>
    </tr>
  `).join('');

  const nomineeRows = nominees.map(n => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${n.name}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${n.relation}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${n.email}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${n.phone || '—'}</td>
    </tr>
  `).join('');

  const detailBlocks = assets.map(a => {
    const details = [
      a.institution && `<strong>Institution:</strong> ${a.institution}`,
      a.account_number && `<strong>Account:</strong> ${a.account_number}`,
      a.routing_number && `<strong>Routing:</strong> ${a.routing_number}`,
      a.policy_number && `<strong>Policy:</strong> ${a.policy_number}`,
      a.folio_number && `<strong>Folio:</strong> ${a.folio_number}`,
      a.location && `<strong>Location:</strong> ${a.location}`,
      a.weight && `<strong>Weight:</strong> ${a.weight}`,
      a.maturity_date && `<strong>Maturity:</strong> ${a.maturity_date}`,
      a.notes && `<strong>Notes:</strong> ${a.notes}`,
    ].filter(Boolean).join('<br/>');

    return `
      <div style="background:#f8f9fa;border-radius:12px;padding:20px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h3 style="margin:0;color:#2b3437;">${a.name}</h3>
          <span style="font-weight:700;color:#2b3437;">${formatCurrency(a.value)}</span>
        </div>
        <p style="color:#6b7b83;font-size:13px;margin:0 0 8px 0;">${a.category} · ${a.subcategory || a.status}</p>
        ${details ? `<div style="font-size:13px;color:#2b3437;line-height:1.8;">${details}</div>` : ''}
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:'Inter',system-ui,sans-serif;color:#2b3437;background:#ffffff;margin:0;padding:0;">
  <div style="max-width:700px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="display:inline-block;width:60px;height:60px;background:#1a2332;border-radius:16px;line-height:60px;text-align:center;margin-bottom:16px;">
        <span style="color:white;font-size:24px;">🔒</span>
      </div>
      <h1 style="margin:0 0 8px 0;font-size:28px;color:#2b3437;">SilentWill Vault Report</h1>
      <p style="margin:0;color:#6b7b83;font-size:14px;">
        Digital Inheritance Vault — Automatically Released
      </p>
      <p style="margin:8px 0 0 0;color:#6b7b83;font-size:13px;">
        Vault Owner: <strong>${userEmail}</strong><br/>
        Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>

    <!-- Summary -->
    <div style="background:#1a2332;border-radius:16px;padding:24px;margin-bottom:32px;color:white;">
      <p style="margin:0 0 4px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;opacity:0.7;">Net Worth</p>
      <h2 style="margin:0 0 16px 0;font-size:36px;">${formatCurrency(netWorth)}</h2>
      <div style="display:flex;gap:24px;">
        <div>
          <p style="margin:0;font-size:12px;opacity:0.7;">Total Assets</p>
          <p style="margin:0;font-size:18px;font-weight:600;">${formatCurrency(totalAssets)}</p>
        </div>
        <div>
          <p style="margin:0;font-size:12px;opacity:0.7;">Liabilities</p>
          <p style="margin:0;font-size:18px;font-weight:600;">${formatCurrency(totalLiabilities)}</p>
        </div>
        <div>
          <p style="margin:0;font-size:12px;opacity:0.7;">Categories</p>
          <p style="margin:0;font-size:18px;font-weight:600;">${categories.length}</p>
        </div>
        <div>
          <p style="margin:0;font-size:12px;opacity:0.7;">Total Items</p>
          <p style="margin:0;font-size:18px;font-weight:600;">${assets.length}</p>
        </div>
      </div>
    </div>

    <!-- Asset Table -->
    <h2 style="font-size:20px;margin:0 0 16px 0;">Asset Overview</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;font-size:14px;">
      <thead>
        <tr style="background:#f0f3f5;">
          <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6b7b83;">Asset</th>
          <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6b7b83;">Category</th>
          <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6b7b83;">Institution</th>
          <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6b7b83;">Account</th>
          <th style="padding:12px 16px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6b7b83;">Value</th>
        </tr>
      </thead>
      <tbody>${assetRows}</tbody>
    </table>

    <!-- Detailed Asset Info -->
    <h2 style="font-size:20px;margin:0 0 16px 0;">Detailed Asset Information</h2>
    ${detailBlocks}

    <!-- Nominees -->
    <h2 style="font-size:20px;margin:32px 0 16px 0;">Designated Nominees</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;font-size:14px;">
      <thead>
        <tr style="background:#f0f3f5;">
          <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6b7b83;">Name</th>
          <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6b7b83;">Relation</th>
          <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6b7b83;">Email</th>
          <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6b7b83;">Phone</th>
        </tr>
      </thead>
      <tbody>${nomineeRows}</tbody>
    </table>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;border-top:1px solid #e0e5e8;color:#6b7b83;font-size:12px;">
      <p style="margin:0 0 4px 0;">This report was auto-generated by SilentWill's Dead Man's Switch protocol.</p>
      <p style="margin:0;">All sensitive data was decrypted using the vault owner's encryption key.</p>
      <p style="margin:8px 0 0 0;font-weight:600;">Please handle this information with utmost care and confidentiality.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Main Handler ──

Deno.serve(async (req: Request) => {
  try {
    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'user_id required' }), { status: 400 });
    }

    // Get user info
    const { data: { user } } = await supabase.auth.admin.getUserById(user_id);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Get vault key from user metadata
    const vaultKeyB64 = user.user_metadata?.vault_key;
    let cryptoKey: CryptoKey | null = null;
    if (vaultKeyB64) {
      cryptoKey = await importKey(fromBase64(vaultKeyB64));
    }

    // Fetch all assets
    const { data: rawAssets } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    // Decrypt assets
    const assets = [];
    for (const asset of rawAssets ?? []) {
      assets.push(cryptoKey ? await decryptAsset(cryptoKey, asset) : asset);
    }

    // Fetch nominees
    const { data: nominees } = await supabase
      .from('nominees')
      .select('*')
      .eq('user_id', user_id);

    const verifiedNominees = (nominees ?? []).filter((n: any) => n.status === 'verified');

    // Generate HTML report
    const html = generateReport(user.email ?? 'Unknown', assets, nominees ?? []);

    // Send email to each verified nominee
    const emailResults = [];
    if (RESEND_API_KEY && verifiedNominees.length > 0) {
      for (const nominee of verifiedNominees) {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'SilentWill <noreply@silentwill.app>',
              to: nominee.email,
              subject: `SilentWill Vault Report — ${user.email}`,
              html,
            }),
          });
          const result = await res.json();
          emailResults.push({ nominee: nominee.email, status: res.ok ? 'sent' : 'failed', result });
        } catch (err) {
          emailResults.push({ nominee: nominee.email, status: 'error', error: (err as Error).message });
        }
      }
    }

    // Log activity
    await supabase.from('activity_log').insert({
      user_id,
      title: `Vault report generated and sent to ${verifiedNominees.length} nominee(s)`,
      type: 'secure',
      icon: 'mail',
    });

    return new Response(
      JSON.stringify({
        success: true,
        assets_count: assets.length,
        nominees_notified: verifiedNominees.length,
        email_results: emailResults,
        report_preview: html.substring(0, 500) + '...',
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500 },
    );
  }
});
