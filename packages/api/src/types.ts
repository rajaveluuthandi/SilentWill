export type AssetCategory =
  | 'banking'
  | 'real-estate'
  | 'insurance'
  | 'government-funds'
  | 'stocks'
  | 'mutual-funds'
  | 'gold'
  | 'cash'
  | 'liabilities'
  | 'digital';

export type AssetStatus = 'linked' | 'appraised' | 'secured' | 'synced' | 'active' | 'pending';

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  category: AssetCategory;
  subcategory: string;
  value: number;
  currency: string;
  status: AssetStatus;
  institution?: string | null;
  account_number?: string | null;
  routing_number?: string | null;
  account_type?: string | null;
  location?: string | null;
  policy_number?: string | null;
  maturity_date?: string | null;
  nominee?: string | null;
  folio_number?: string | null;
  weight?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Nominee {
  id: string;
  user_id: string;
  name: string;
  relation: string;
  email: string;
  phone: string;
  status: 'verified' | 'pending';
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type ActivityType = 'secure' | 'asset' | 'legacy' | 'settings';

export interface ActivityLog {
  id: string;
  user_id: string;
  title: string;
  type: ActivityType;
  icon: string;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: Asset;
        Insert: Omit<Asset, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      nominees: {
        Row: Nominee;
        Insert: Omit<Nominee, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Nominee, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      activity_log: {
        Row: ActivityLog;
        Insert: Omit<ActivityLog, 'id' | 'created_at'>;
        Update: Partial<Omit<ActivityLog, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
};
