export { createSupabaseClient } from './client';
export { signUpWithEmail, signInWithEmail, signInWithGoogle, signOut } from './auth';
export type { SupabaseClient, SupabaseClientOptions } from './client';
export type {
  Database,
  Asset,
  AssetCategory,
  AssetStatus,
  Nominee,
  ActivityLog,
  ActivityType,
} from './types';

export {
  getAssets,
  getAssetsByCategory,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
} from './services/assets';

export {
  getNominees,
  createNominee,
  updateNominee,
  deleteNominee,
} from './services/nominees';

export {
  getActivity,
  logActivity,
} from './services/activity';
