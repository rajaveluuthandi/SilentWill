import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button } from './Button.native';
import { Text } from './Text.native';
import { Card } from './Card.native';

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
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text variant="h1">Welcome to SilentWill</Text>
          <View style={styles.spacerSm} />
          <Text variant="body">
            Plan for the future with confidence. SilentWill makes it simple to create, manage, and
            securely share your will — all in one place.
          </Text>
          <View style={styles.spacerMd} />
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button title="Get Started" onPress={onGetStarted} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Learn More" variant="outline" onPress={onLearnMore} />
            </View>
          </View>
        </View>

        <View style={styles.spacerLg} />

        <View style={styles.section}>
          <Text variant="h2">Why SilentWill?</Text>
          <View style={styles.spacerMd} />
          {features.map((feature) => (
            <View key={feature.title} style={styles.cardWrapper}>
              <Card title={feature.title}>
                <Text variant="body">{feature.description}</Text>
              </Card>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text variant="caption">Your peace of mind, simplified.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  spacerSm: {
    height: 8,
  },
  spacerMd: {
    height: 16,
  },
  spacerLg: {
    height: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
  },
  section: {
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 16,
  },
});
