'use client';

import { useState } from 'react';

const INTERVALS = [
  { months: 3, label: '3 Months', desc: 'High-frequency safety check for active digital estates.' },
  { months: 6, label: '6 Months', desc: 'Balanced security interval. Our most recommended setting.' },
  { months: 12, label: '1 Year', desc: 'Long-term preservation. Requires secondary contact verification.' },
];

export default function VerificationPage() {
  const [selectedInterval, setSelectedInterval] = useState(6);

  return (
    <div>
      <h1 className="text-3xl font-manrope font-bold text-on-surface mb-2">Verification Setup & Status</h1>
      <p className="text-sm text-on-surface-variant mb-8 max-w-2xl">
        Confirm your status regularly to ensure your assets are shared as planned. This process acts
        as a &quot;dead man&apos;s switch&quot; to trigger your digital inheritance protocols.
      </p>

      {/* Status Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Verification Status */}
        <div className="col-span-2 bg-surface-container-lowest rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-status-secure/10 text-status-secure uppercase tracking-wider">
              Active
            </span>
            <span className="text-xs text-on-surface-variant ml-auto">Last Checked: Oct 12, 2023</span>
          </div>
          <h2 className="text-2xl font-manrope font-bold text-on-surface mb-4">
            Verification Status: Confirmed
          </h2>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-sm text-on-surface-variant mb-1">Next Verification Due</p>
              <p className="text-lg font-semibold text-on-surface">January 12, 2024</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-manrope font-bold text-on-surface">91</p>
              <p className="text-sm text-on-surface-variant">days remaining</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '50%' }} />
          </div>
        </div>

        {/* Instant Check-in */}
        <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-on-surface mb-1">Instant Check-in</h3>
          <p className="text-xs text-on-surface-variant mb-4">
            Manually reset the countdown timer by verifying your identity now.
          </p>
          <button
            onClick={() => alert('Identity verified. Timer reset.')}
            className="w-full py-2.5 rounded-lg border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            Verify Now
          </button>
        </div>
      </div>

      {/* Verification Interval */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          <h3 className="text-xl font-manrope font-bold text-on-surface">Verification Interval</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {INTERVALS.map((interval) => (
            <button
              key={interval.months}
              onClick={() => setSelectedInterval(interval.months)}
              className={`p-5 rounded-xl text-left transition-all ${
                selectedInterval === interval.months
                  ? 'bg-primary-container/30 ring-2 ring-primary'
                  : 'bg-surface-container-lowest hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-manrope font-bold text-on-surface">{interval.label}</h4>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedInterval === interval.months ? 'border-primary' : 'border-outline-variant'
                }`}>
                  {selectedInterval === interval.months && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-4">{interval.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-manrope font-bold text-on-surface">How it works</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6">
            <p className="text-sm text-on-surface leading-relaxed">
              The verification system ensures your assets are only shared when absolutely necessary.
              If you fail to check in within your chosen interval, we initiate a multi-step
              &quot;Heartbeat Check&quot; via email, SMS, and your designated backup contacts.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6">
            <p className="text-sm text-on-surface leading-relaxed">
              If all verification attempts fail after a 30-day grace period, your &quot;Silent Will&quot;
              protocols will automatically activate, granting your beneficiaries access to your encrypted
              digital vaults and assets as you have defined them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
