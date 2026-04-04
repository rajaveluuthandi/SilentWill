import { Text, Card } from '@silentwill/ui';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <Text variant="h1">About SilentWill</Text>
      <Card>
        <Text variant="body">
          SilentWill is a cross-platform monorepo demonstrating how to share code between
          a Next.js web app and an Expo React Native mobile app using Turborepo.
        </Text>
      </Card>
    </div>
  );
}
