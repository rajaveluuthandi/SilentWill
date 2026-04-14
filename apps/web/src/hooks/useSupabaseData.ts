'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  getAssets,
  getAssetsByCategory,
  createAsset,
  deleteAsset,
  getNominees,
  createNominee,
  deleteNominee,
  getActivity,
  logActivity,
  getOrCreateVaultKey,
  encryptSensitiveFields,
  decryptSensitiveFieldsArray,
} from '@silentwill/api';
import type { Asset, AssetCategory, Nominee, ActivityLog } from '@silentwill/api';
import {
  MOCK_ASSETS,
  MOCK_NOMINEES,
  MOCK_ACTIVITY,
  formatCurrency,
  getNetWorth,
  getTotalAssetValue,
  getTotalLiabilities,
} from '@/data/mock';

export { formatCurrency, getNetWorth, getTotalAssetValue, getTotalLiabilities };

function useVaultKey() {
  const { isDemo, session } = useAuth();
  const keyRef = useRef<CryptoKey | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isDemo || !session) {
      setReady(true);
      return;
    }
    getOrCreateVaultKey(supabase).then((key) => {
      keyRef.current = key;
      setReady(true);
    });
  }, [isDemo, session]);

  return { key: keyRef.current, ready };
}

export function useAssets(category?: AssetCategory) {
  const { isDemo, user } = useAuth();
  const { key, ready } = useVaultKey();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (isDemo) {
      const mock = category
        ? MOCK_ASSETS.filter((a) => a.category === category)
        : MOCK_ASSETS;
      setAssets(mock as unknown as Asset[]);
      setLoading(false);
      return;
    }
    if (!ready) return;
    setLoading(true);
    const { data } = category
      ? await getAssetsByCategory(supabase, category)
      : await getAssets(supabase);
    const decrypted = key && data ? await decryptSensitiveFieldsArray(key, data) : data;
    setAssets((decrypted ?? []) as Asset[]);
    setLoading(false);
  }, [isDemo, category, key, ready]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addAsset = useCallback(
    async (asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) => {
      if (isDemo) return { error: 'Cannot add assets in demo mode' };
      const encrypted = key ? await encryptSensitiveFields(key, asset) : asset;
      const { data, error } = await createAsset(supabase, encrypted);
      if (!error && data) {
        await logActivity(supabase, {
          user_id: user!.id,
          title: `New Asset Added: ${data.name}`,
          type: 'asset',
          icon: 'bank',
        });
        await refresh();
      }
      return { data, error: error?.message ?? null };
    },
    [isDemo, user, key, refresh],
  );

  const removeAsset = useCallback(
    async (id: string) => {
      if (isDemo) return { error: 'Cannot delete assets in demo mode' };
      const { error } = await deleteAsset(supabase, id);
      if (!error) await refresh();
      return { error: error?.message ?? null };
    },
    [isDemo, refresh],
  );

  return { assets, loading, refresh, addAsset, removeAsset };
}

export function useNominees() {
  const { isDemo, user } = useAuth();
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (isDemo) {
      setNominees(MOCK_NOMINEES as unknown as Nominee[]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await getNominees(supabase);
    setNominees(data ?? []);
    setLoading(false);
  }, [isDemo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addNominee = useCallback(
    async (nominee: Omit<Nominee, 'id' | 'created_at' | 'updated_at'>) => {
      if (isDemo) return { error: 'Cannot add nominees in demo mode' };
      const { data, error } = await createNominee(supabase, nominee);
      if (!error && data) {
        await logActivity(supabase, {
          user_id: user!.id,
          title: `Nominee Added: ${data.name}`,
          type: 'legacy',
          icon: 'person-add',
        });
        await refresh();
      }
      return { data, error: error?.message ?? null };
    },
    [isDemo, user, refresh],
  );

  const removeNominee = useCallback(
    async (id: string) => {
      if (isDemo) return { error: 'Cannot delete nominees in demo mode' };
      const { error } = await deleteNominee(supabase, id);
      if (!error) await refresh();
      return { error: error?.message ?? null };
    },
    [isDemo, refresh],
  );

  return { nominees, loading, refresh, addNominee, removeNominee };
}

export function useActivityLog() {
  const { isDemo } = useAuth();
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (isDemo) {
      setActivity(MOCK_ACTIVITY as unknown as ActivityLog[]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await getActivity(supabase);
    setActivity(data ?? []);
    setLoading(false);
  }, [isDemo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { activity, loading, refresh };
}
