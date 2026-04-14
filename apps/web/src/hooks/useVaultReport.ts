'use client';

import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  getAssets,
  getNominees,
  getOrCreateVaultKey,
  decryptSensitiveFieldsArray,
} from '@silentwill/api';

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10000000) return `₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(2)} L`;
  return `₹${abs.toLocaleString('en-IN')}`;
}

export function useVaultReport() {
  const { user, isDemo } = useAuth();
  const [generating, setGenerating] = useState(false);

  const generateAndPreview = useCallback(async () => {
    if (isDemo || !user) return;
    setGenerating(true);

    const key = await getOrCreateVaultKey(supabase);
    const { data: rawAssets } = await getAssets(supabase);
    const assets = key && rawAssets ? await decryptSensitiveFieldsArray(key, rawAssets) : rawAssets ?? [];
    const { data: nominees } = await getNominees(supabase);

    const totalAssets = assets.filter((a: any) => a.value > 0).reduce((s: number, a: any) => s + a.value, 0);
    const totalLiabilities = Math.abs(assets.filter((a: any) => a.value < 0).reduce((s: number, a: any) => s + a.value, 0));
    const netWorth = totalAssets - totalLiabilities;

    const assetRows = assets.map((a: any) =>
      `<tr>
        <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${a.name}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${a.category}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${a.institution || '—'}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;">${a.account_number || '—'}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #e0e5e8;text-align:right;font-weight:600;">${formatCurrency(a.value)}</td>
      </tr>`
    ).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;color:#2b3437;margin:0;padding:40px 24px;max-width:700px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="margin:0 0 8px 0;">SilentWill Vault Report</h1>
    <p style="color:#6b7b83;">Preview — This is what your nominees would receive</p>
    <p style="color:#6b7b83;font-size:13px;">Owner: ${user.email} · Generated: ${new Date().toLocaleDateString()}</p>
  </div>
  <div style="background:#1a2332;border-radius:16px;padding:24px;margin-bottom:32px;color:white;">
    <p style="margin:0;font-size:12px;opacity:0.7;">NET WORTH</p>
    <h2 style="margin:4px 0 12px 0;font-size:32px;">${formatCurrency(netWorth)}</h2>
    <span style="font-size:14px;opacity:0.7;">Assets: ${formatCurrency(totalAssets)} · Liabilities: ${formatCurrency(totalLiabilities)} · ${assets.length} items</span>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <thead><tr style="background:#f0f3f5;">
      <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;color:#6b7b83;">Asset</th>
      <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;color:#6b7b83;">Category</th>
      <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;color:#6b7b83;">Institution</th>
      <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;color:#6b7b83;">Account</th>
      <th style="padding:12px 16px;text-align:right;font-size:11px;text-transform:uppercase;color:#6b7b83;">Value</th>
    </tr></thead>
    <tbody>${assetRows}</tbody>
  </table>
  <p style="text-align:center;color:#6b7b83;font-size:12px;margin-top:32px;">
    ${(nominees ?? []).length} nominee(s) would receive this report.
  </p>
</body></html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }

    setGenerating(false);
  }, [user, isDemo]);

  return { generateAndPreview, generating };
}
