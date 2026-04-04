import React from 'react';
import { cn } from '@silentwill/utils';
import { Button } from './Button';
import { Text } from './Text';
import { Card } from './Card';

export interface WelcomePageProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

const features = [
  {
    title: 'Secure & Private',
    description: 'Your will and estate plans are encrypted and stored safely, accessible only by you and your designated contacts.',
  },
  {
    title: 'Cross-Platform',
    description: 'Access SilentWill from any device — web or mobile — with a consistent, seamless experience.',
  },
  {
    title: 'Simple & Guided',
    description: 'Step-by-step guidance helps you create, manage, and update your will without legal jargon.',
  },
];

export function WelcomePage({ onGetStarted, onLearnMore }: WelcomePageProps) {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <Text variant="h1" className="text-indigo-600">
          Welcome to SilentWill
        </Text>
        <Text variant="body" className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Plan for the future with confidence. SilentWill makes it simple to create, manage, and
          securely share your will — all in one place.
        </Text>
        <div className="mt-8 flex justify-center gap-4">
          <Button title="Get Started" onPress={onGetStarted} />
          <Button title="Learn More" variant="outline" onPress={onLearnMore} />
        </div>
      </section>

      <section>
        <Text variant="h2" className="text-center mb-8">
          Why SilentWill?
        </Text>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} title={feature.title}>
              <Text variant="body">{feature.description}</Text>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center py-8 border-t border-gray-200">
        <Text variant="caption">
          Your peace of mind, simplified.
        </Text>
      </section>
    </div>
  );
}
