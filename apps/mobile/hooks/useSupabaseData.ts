import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  getAssets,
  getAssetsByCategory,
  getAssetById,
  createAsset,
  deleteAsset,
  getNominees,
  createNominee,
  deleteNominee,
  getActivity,
  logActivity,
  getOrCreateVaultKey,
  encryptSensitiveFields,
  decryptSensitiveFields,
  decryptSensitiveFieldsArray,
} from '@silentwill/api';
import type { Asset, AssetCategory, Nominee, ActivityLog } from '@silentwill/api';
import {
  MOCK_ASSETS,
  MOCK_NOMINEES,
  MOCK_ACTIVITY,
  formatCurrency,
  CATEGORY_INFO,
} from '../data/mock';
import {
  getCachedAssets,
  cacheAssets,
  getCachedNominees,
  cacheNominees,
  getCachedActivity,
  cacheActivity,
  savePendingChange,
} from '../lib/database';

export { formatCurrency, CATEGORY_INFO };

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

    // Read from cache first (fast, offline-capable)
    try {
      const cached = await getCachedAssets();
      if (cached.length > 0) {
        const filtered = category ? cached.filter((a: any) => a.category === category) : cached;
        setAssets(filtered as Asset[]);
        setLoading(false);
      }
    } catch {}

    // Sync from Supabase in background
    try {
      const { data } = category
        ? await getAssetsByCategory(supabase, category)
        : await getAssets(supabase);
      const decrypted = key && data ? await decryptSensitiveFieldsArray(key, data) : data;
      const result = (decrypted ?? []) as Asset[];
      setAssets(result);
      if (!category && result.length > 0) {
        await cacheAssets(result);
      }
    } catch {}

    setLoading(false);
  }, [isDemo, category, key, ready]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addAsset = useCallback(
    async (asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) => {
      if (isDemo) return { error: 'Cannot add assets in demo mode' };
      const encrypted = key ? await encryptSensitiveFields(key, asset) : asset;
      try {
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
      } catch {
        // Offline: save as pending change
        await savePendingChange('assets', 'insert', asset);
        return { data: null, error: null };
      }
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

export function useAssetById(id: string) {
  const { isDemo } = useAuth();
  const { key, ready } = useVaultKey();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      const found = MOCK_ASSETS.find((a) => a.id === id) ?? null;
      setAsset(found as unknown as Asset | null);
      setLoading(false);
      return;
    }
    if (!ready) return;

    // Try cache first
    getCachedAssets().then((cached) => {
      const found = cached.find((a: any) => a.id === id);
      if (found) {
        setAsset(found as Asset);
        setLoading(false);
      }
    }).catch(() => {});

    // Then fetch fresh
    getAssetById(supabase, id).then(async ({ data }) => {
      const decrypted = key && data ? await decryptSensitiveFields(key, data) : data;
      setAsset(decrypted as Asset | null);
      setLoading(false);
    }).catch(() => {});
  }, [isDemo, id, key, ready]);

  return { asset, loading };
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

    // Cache first
    try {
      const cached = await getCachedNominees();
      if (cached.length > 0) {
        setNominees(cached as Nominee[]);
        setLoading(false);
      }
    } catch {}

    // Sync from Supabase
    try {
      const { data } = await getNominees(supabase);
      const result = (data ?? []) as Nominee[];
      setNominees(result);
      if (result.length > 0) await cacheNominees(result);
    } catch {}

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

    // Cache first
    try {
      const cached = await getCachedActivity();
      if (cached.length > 0) {
        setActivity(cached as ActivityLog[]);
        setLoading(false);
      }
    } catch {}

    // Sync from Supabase
    try {
      const { data } = await getActivity(supabase);
      const result = (data ?? []) as ActivityLog[];
      setActivity(result);
      if (result.length > 0) await cacheActivity(result);
    } catch {}

    setLoading(false);
  }, [isDemo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { activity, loading, refresh };
}
