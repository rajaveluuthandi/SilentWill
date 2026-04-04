'use client';

import { WelcomePage } from '@silentwill/ui';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <WelcomePage
      onGetStarted={() => router.push('/about')}
      onLearnMore={() => router.push('/about')}
    />
  );
}
