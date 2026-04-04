import { WelcomePage } from '@silentwill/ui/src/WelcomePage.native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <WelcomePage
      onGetStarted={() => router.push('/about')}
      onLearnMore={() => router.push('/about')}
    />
  );
}
