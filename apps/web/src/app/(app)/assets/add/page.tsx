'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  'Select Category',
  'Banking',
  'Real Estate',
  'Insurance',
  'Government Funds',
  'Stocks',
  'Mutual Funds',
  'Gold & Jewellery',
  'Cash',
  'Liabilities',
];

export default function AddAssetPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Select Category');
  const [value, setValue] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [institution, setInstitution] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    alert('Asset has been committed to your vault.');
    router.push('/assets');
  };

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
        <span>Assets</span>
        <span>›</span>
        <span className="text-primary font-medium">New Security Protocol</span>
      </div>

      <h1 className="text-3xl font-manrope font-bold text-on-surface mb-2">Add New Asset</h1>
      <p className="text-sm text-on-surface-variant mb-8 max-w-xl">
        Secure your legacy with precision. Provide detailed information to ensure a seamless
        transition of your digital and physical wealth. Nominees are managed at the vault level.
      </p>

      {/* Basic Information */}
      <div className="bg-surface-container-lowest rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-on-surface">Basic Information</h2>
            <p className="text-xs text-on-surface-variant">Define the core identification for this asset.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">Asset Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Primary Savings Vault"
              className="w-full h-11 px-4 rounded-lg bg-surface text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant"
            />
          </div>
          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-4 rounded-lg bg-surface text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">Estimated Total Value (INR)</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0.00"
            type="text"
            className="w-full h-11 px-4 rounded-lg bg-surface text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant"
          />
        </div>
      </div>

      {/* Detailed Metadata */}
      <div className="bg-surface-container-lowest rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-on-surface">Detailed Metadata</h2>
            <p className="text-xs text-on-surface-variant">Technical details for identification and legal access.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">Account Number / Reference</label>
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="XXXX-XXXX-XXXX"
              className="w-full h-11 px-4 rounded-lg bg-surface text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant"
            />
          </div>
          <div>
            <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">Institution Name</label>
            <input
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. SBI or HDFC Bank"
              className="w-full h-11 px-4 rounded-lg bg-surface text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant"
            />
          </div>
        </div>
      </div>

      {/* Access Instructions */}
      <div className="mb-8">
        <label className="block text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">Access Instructions / Private Notes</label>
        <div className="relative">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe where keys are kept or special instructions for executor..."
            rows={4}
            className="w-full p-4 rounded-lg bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant resize-none"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-on-surface-variant">
            <div className="w-2 h-2 rounded-full bg-status-secure" />
            Vault Heartbeat: Active
          </div>
        </div>
        <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          All notes are end-to-end encrypted and secured by zero-knowledge architecture.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-on-surface-variant hover:text-on-surface font-medium"
        >
          Cancel Changes
        </button>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 rounded-lg border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
            Save as Draft
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Secure Asset
          </button>
        </div>
      </div>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-8 py-4 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          AES-256 Bit
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-on-surface-variant" />
          Zero-Knowledge
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-on-surface-variant" />
          GDPR Compliant
        </span>
      </div>
    </div>
  );
}
