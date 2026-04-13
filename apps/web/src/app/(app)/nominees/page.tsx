'use client';

import { MOCK_NOMINEES } from '@/data/mock';

export default function NomineesPage() {
  return (
    <div>
      <h1 className="text-3xl font-manrope font-bold text-on-surface mb-2">Vault-Level Nominees</h1>
      <p className="text-sm text-on-surface-variant mb-8 max-w-2xl">
        Your vault is protected by <strong className="text-on-surface">Full Hidden Mode</strong>. No data is disclosed to anyone until the final
        release protocol is triggered. Once triggered, all-or-nothing access is granted to your verified nominees.
      </p>

      {/* Dead-Man Switch Banner */}
      <div className="bg-surface-container-lowest rounded-xl p-6 mb-8 border-l-4 border-status-secure">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant uppercase tracking-wider mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-status-secure animate-pulse" />
          Vault Heartbeat Active
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-manrope font-bold text-on-surface mb-1">
              The &apos;Dead-Man Switch&apos; is armed.
            </h2>
            <p className="text-sm text-on-surface-variant max-w-lg">
              Upon 180 days of inactivity and failed verification attempts, the vault will transition from
              Hidden Mode to Inheritor Access. Your nominees listed below will then receive full access.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap">
            Adjust Inactivity Timer
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Verified Nominees */}
      <div className="bg-surface-container-lowest rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-manrope font-bold text-on-surface">Verified Nominees</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Individuals who will inherit full vault access upon trigger.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
            <span>+</span>
            Add Nominee
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-container">
              <th className="text-left px-4 py-3 text-xs text-on-surface-variant uppercase tracking-wider font-medium">Recipient</th>
              <th className="text-left px-4 py-3 text-xs text-on-surface-variant uppercase tracking-wider font-medium">Relationship</th>
              <th className="text-left px-4 py-3 text-xs text-on-surface-variant uppercase tracking-wider font-medium">Access Scope</th>
              <th className="text-left px-4 py-3 text-xs text-on-surface-variant uppercase tracking-wider font-medium">Status</th>
              <th className="text-right px-4 py-3 text-xs text-on-surface-variant uppercase tracking-wider font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_NOMINEES.map((nominee) => (
              <tr key={nominee.id} className="border-b border-surface-container last:border-0">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-vault-dark flex items-center justify-center text-white text-sm font-semibold">
                      {nominee.name.split(' ').map((w) => w[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{nominee.name}</p>
                      <p className="text-xs text-on-surface-variant">{nominee.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-on-surface">{nominee.relation}</td>
                <td className="px-4 py-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-primary/10 text-primary uppercase tracking-wider">
                    Full Vault
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${
                    nominee.status === 'verified' ? 'text-status-secure' : 'text-status-pending'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      nominee.status === 'verified' ? 'bg-status-secure' : 'bg-status-pending'
                    }`} />
                    {nominee.status === 'verified' ? 'Identity Verified' : 'Pending Invite'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="text-on-surface-variant hover:text-on-surface">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Section */}
      <div className="bg-surface-container-lowest rounded-xl p-6">
        <h3 className="text-base font-semibold text-on-surface mb-2">Understanding Full Hidden Mode</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          SilentWill operates on a zero-knowledge architecture. All visibility toggles are removed because{' '}
          <strong className="text-on-surface">Full Hidden Mode</strong> is the mandatory standard for vault security.
          No metadata, category names, or asset existence is revealed to nominees until the dead-man switch is triggered.
          Once active, nominees gain absolute access to all contents — there is no partial disclosure.
        </p>
      </div>
    </div>
  );
}
