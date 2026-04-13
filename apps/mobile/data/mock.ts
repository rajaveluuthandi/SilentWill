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
  name: string;
  category: AssetCategory;
  subcategory: string;
  value: number;
  currency: string;
  status: AssetStatus;
  institution?: string;
  accountNumber?: string;
  routingNumber?: string;
  accountType?: string;
  location?: string;
  policyNumber?: string;
  maturityDate?: string;
  nominee?: string;
  folioNumber?: string;
  weight?: string;
  notes?: string;
  createdAt: string;
}

export interface Nominee {
  id: string;
  name: string;
  relation: string;
  email: string;
  phone: string;
  status: 'verified' | 'pending';
  avatar?: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  timestamp: string;
  type: 'secure' | 'asset' | 'legacy' | 'settings';
  icon: string;
}

export const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    name: 'SBI Savings Account',
    category: 'banking',
    subcategory: 'Savings',
    value: 850000,
    currency: 'INR',
    status: 'linked',
    institution: 'State Bank of India',
    accountNumber: '****-****-0024',
    routingNumber: '****-5678',
    accountType: 'Savings',
    createdAt: '2022-10-15',
  },
  {
    id: '2',
    name: 'HDFC Current Account',
    category: 'banking',
    subcategory: 'Current',
    value: 1250000,
    currency: 'INR',
    status: 'linked',
    institution: 'HDFC Bank',
    accountNumber: '****-****-1187',
    accountType: 'Current',
    createdAt: '2023-01-20',
  },
  {
    id: '3',
    name: 'ICICI Fixed Deposit',
    category: 'banking',
    subcategory: 'Fixed Deposit',
    value: 2000000,
    currency: 'INR',
    status: 'secured',
    institution: 'ICICI Bank',
    accountNumber: '****-****-3345',
    accountType: 'Fixed Deposit',
    maturityDate: '2027-06-15',
    createdAt: '2023-03-10',
  },
  {
    id: '4',
    name: 'Apartment in Chennai',
    category: 'real-estate',
    subcategory: 'Residential',
    value: 8500000,
    currency: 'INR',
    status: 'appraised',
    location: 'T. Nagar, Chennai',
    notes: 'Survey No. 145/2A, 3BHK, 1450 sqft',
    createdAt: '2021-08-20',
  },
  {
    id: '5',
    name: 'Farm Land in Madurai',
    category: 'real-estate',
    subcategory: 'Agricultural',
    value: 3200000,
    currency: 'INR',
    status: 'appraised',
    location: 'Thirumangalam, Madurai',
    notes: 'Survey No. 78/1, 2.5 acres',
    createdAt: '2020-05-10',
  },
  {
    id: '6',
    name: 'LIC Jeevan Anand',
    category: 'insurance',
    subcategory: 'Life Insurance',
    value: 5000000,
    currency: 'INR',
    status: 'active',
    policyNumber: 'LIC-****-7821',
    maturityDate: '2035-12-01',
    nominee: 'Spouse',
    institution: 'LIC of India',
    createdAt: '2019-04-15',
  },
  {
    id: '7',
    name: 'Star Health Insurance',
    category: 'insurance',
    subcategory: 'Health Insurance',
    value: 1000000,
    currency: 'INR',
    status: 'active',
    policyNumber: 'SHI-****-4456',
    institution: 'Star Health',
    createdAt: '2022-01-01',
  },
  {
    id: '8',
    name: 'Employee PF',
    category: 'government-funds',
    subcategory: 'EPF',
    value: 1800000,
    currency: 'INR',
    status: 'synced',
    accountNumber: 'TN/CHN/*****/****',
    institution: 'EPFO',
    createdAt: '2018-06-01',
  },
  {
    id: '9',
    name: 'Public Provident Fund',
    category: 'government-funds',
    subcategory: 'PPF',
    value: 950000,
    currency: 'INR',
    status: 'synced',
    institution: 'SBI PPF',
    maturityDate: '2030-03-31',
    createdAt: '2015-04-01',
  },
  {
    id: '10',
    name: 'NPS Tier 1',
    category: 'government-funds',
    subcategory: 'NPS',
    value: 650000,
    currency: 'INR',
    status: 'synced',
    institution: 'PFRDA',
    createdAt: '2020-01-15',
  },
  {
    id: '11',
    name: 'Zerodha Portfolio',
    category: 'stocks',
    subcategory: 'Equities',
    value: 2400000,
    currency: 'INR',
    status: 'synced',
    institution: 'Zerodha',
    accountNumber: 'Demat: ****-****-7890',
    createdAt: '2021-02-10',
  },
  {
    id: '12',
    name: 'SBI Bluechip Fund',
    category: 'mutual-funds',
    subcategory: 'Equity MF',
    value: 750000,
    currency: 'INR',
    status: 'synced',
    institution: 'SBI MF',
    folioNumber: '****-7654',
    notes: 'SIP: ₹10,000/month',
    createdAt: '2022-06-01',
  },
  {
    id: '13',
    name: 'HDFC Mid Cap Fund',
    category: 'mutual-funds',
    subcategory: 'Equity MF',
    value: 450000,
    currency: 'INR',
    status: 'synced',
    institution: 'HDFC MF',
    folioNumber: '****-3210',
    notes: 'SIP: ₹5,000/month',
    createdAt: '2023-01-01',
  },
  {
    id: '14',
    name: 'Gold Jewellery',
    category: 'gold',
    subcategory: 'Physical Gold',
    value: 1200000,
    currency: 'INR',
    status: 'secured',
    weight: '150g approx',
    location: 'Bank locker - SBI T. Nagar',
    createdAt: '2019-11-01',
  },
  {
    id: '15',
    name: 'Sovereign Gold Bonds',
    category: 'gold',
    subcategory: 'SGB',
    value: 500000,
    currency: 'INR',
    status: 'synced',
    institution: 'RBI via SBI',
    weight: '50g equivalent',
    maturityDate: '2029-09-01',
    createdAt: '2021-09-01',
  },
  {
    id: '16',
    name: 'Cash Reserve',
    category: 'cash',
    subcategory: 'Physical Cash',
    value: 200000,
    currency: 'INR',
    status: 'secured',
    location: 'Home safe',
    createdAt: '2024-01-01',
  },
  {
    id: '17',
    name: 'Home Loan - HDFC',
    category: 'liabilities',
    subcategory: 'Home Loan',
    value: -3500000,
    currency: 'INR',
    status: 'active',
    institution: 'HDFC Bank',
    notes: 'EMI: ₹32,000/month, Remaining: 8 years',
    createdAt: '2021-08-20',
  },
  {
    id: '18',
    name: 'Car Loan - SBI',
    category: 'liabilities',
    subcategory: 'Vehicle Loan',
    value: -450000,
    currency: 'INR',
    status: 'active',
    institution: 'SBI',
    notes: 'EMI: ₹12,000/month, Remaining: 3 years',
    createdAt: '2023-06-01',
  },
];

export const MOCK_NOMINEES: Nominee[] = [
  {
    id: '1',
    name: 'Priya Rajavelu',
    relation: 'Spouse',
    email: 'priya@example.com',
    phone: '+91 98765 43210',
    status: 'verified',
  },
  {
    id: '2',
    name: 'Arun Rajavelu',
    relation: 'Son',
    email: 'arun@example.com',
    phone: '+91 87654 32109',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Kavitha Rajavelu',
    relation: 'Daughter',
    email: 'kavitha@example.com',
    phone: '+91 76543 21098',
    status: 'verified',
  },
];

export const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: '1',
    title: 'Identity Verified via Biometric Check',
    timestamp: '2h ago',
    type: 'secure',
    icon: 'fingerprint',
  },
  {
    id: '2',
    title: 'New Asset Added: ICICI Fixed Deposit',
    timestamp: '1d ago',
    type: 'asset',
    icon: 'bank',
  },
  {
    id: '3',
    title: 'Nominee Added: Kavitha Rajavelu',
    timestamp: '3d ago',
    type: 'legacy',
    icon: 'person-add',
  },
  {
    id: '4',
    title: 'Verification Interval Changed to 6mo',
    timestamp: '1w ago',
    type: 'settings',
    icon: 'refresh',
  },
  {
    id: '5',
    title: 'Asset Updated: SBI Bluechip Fund value',
    timestamp: '2w ago',
    type: 'asset',
    icon: 'pie-chart',
  },
  {
    id: '6',
    title: 'Nominee Verified: Priya Rajavelu',
    timestamp: '3w ago',
    type: 'legacy',
    icon: 'verified',
  },
  {
    id: '7',
    title: 'Vault Locked — Session Ended',
    timestamp: '1mo ago',
    type: 'secure',
    icon: 'lock',
  },
  {
    id: '8',
    title: 'New Asset Added: Sovereign Gold Bonds',
    timestamp: '1mo ago',
    type: 'asset',
    icon: 'diamond',
  },
];

export const CATEGORY_INFO: Record<
  AssetCategory,
  { label: string; icon: string; color: string }
> = {
  banking: { label: 'Banking', icon: 'account-balance', color: '#4f6073' },
  'real-estate': { label: 'Real Estate', icon: 'home', color: '#49636f' },
  insurance: { label: 'Policies', icon: 'shield', color: '#5a7a6b' },
  'government-funds': { label: 'Govt. Funds', icon: 'account-balance-wallet', color: '#4f6073' },
  stocks: { label: 'Stocks', icon: 'trending-up', color: '#49636f' },
  'mutual-funds': { label: 'Mutual Funds', icon: 'pie-chart', color: '#5a7a6b' },
  gold: { label: 'Gold', icon: 'diamond', color: '#d4a843' },
  cash: { label: 'Cash', icon: 'payments', color: '#2d8a5e' },
  liabilities: { label: 'Liabilities', icon: 'credit-card', color: '#c45a4a' },
  digital: { label: 'Digital', icon: 'devices', color: '#4f6073' },
};

// Helper to calculate totals
export function getTotalAssetValue(): number {
  return MOCK_ASSETS.reduce((sum, a) => sum + Math.max(0, a.value), 0);
}

export function getTotalLiabilities(): number {
  return Math.abs(MOCK_ASSETS.reduce((sum, a) => sum + Math.min(0, a.value), 0));
}

export function getNetWorth(): number {
  return MOCK_ASSETS.reduce((sum, a) => sum + a.value, 0);
}

export function getAssetsByCategory(category: AssetCategory): Asset[] {
  return MOCK_ASSETS.filter((a) => a.category === category);
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  MOCK_ASSETS.forEach((a) => {
    counts[a.category] = (counts[a.category] || 0) + 1;
  });
  return counts;
}

export function formatCurrency(value: number): string {
  const absValue = Math.abs(value);
  if (absValue >= 10000000) {
    return `₹${(absValue / 10000000).toFixed(2)} Cr`;
  }
  if (absValue >= 100000) {
    return `₹${(absValue / 100000).toFixed(2)} L`;
  }
  return `₹${absValue.toLocaleString('en-IN')}`;
}
