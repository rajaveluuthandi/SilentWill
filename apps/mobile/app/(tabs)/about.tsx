import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@silentwill/ui/src/Text.native';
import { Card } from '@silentwill/ui/src/Card.native';

export default function AboutScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
        <Text variant="h1">About SilentWill</Text>
        <Card>
          <Text variant="body">
            SilentWill is a cross-platform monorepo demonstrating how to share code between
            an Expo React Native mobile app and a Next.js web app using Turborepo.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
