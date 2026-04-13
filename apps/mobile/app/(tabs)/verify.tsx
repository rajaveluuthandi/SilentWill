import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const INTERVALS = [
  { months: 3, label: '3', sub: 'Months' },
  { months: 6, label: '6', sub: 'Months' },
  { months: 12, label: '12', sub: 'Months' },
];

export default function VerifyScreen() {
  const [selectedInterval, setSelectedInterval] = useState(6);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
          <View className="flex-row items-center gap-3">
            <MaterialIcons name="shield" size={24} color="#4f6073" />
            <Text
              className="text-lg text-on-surface"
              style={{ fontFamily: 'Manrope_600SemiBold' }}
            >
              Digital Curator
            </Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-surface-container items-center justify-center">
            <MaterialIcons name="person" size={22} color="#4f6073" />
          </View>
        </View>

        {/* Identity Status Card */}
        <View className="mx-5 mb-5 p-6 bg-surface-container-lowest rounded-card items-center">
          <View className="relative mb-4">
            <View className="w-16 h-16 rounded-2xl bg-primary-container/40 items-center justify-center">
              <MaterialIcons name="verified-user" size={32} color="#4f6073" />
            </View>
            <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-status-secure" />
          </View>
          <Text
            className="text-2xl text-on-surface mb-1"
            style={{ fontFamily: 'Manrope_700Bold' }}
          >
            Identity Confirmed
          </Text>
          <Text
            className="text-sm text-on-surface-variant"
            style={{ fontFamily: 'Inter' }}
          >
            SilentWill is active and secure
          </Text>

          <View className="mt-6 items-start w-full">
            <Text
              className="text-xs text-on-surface-variant tracking-widest uppercase mb-1"
              style={{ fontFamily: 'Inter_500Medium' }}
            >
              Next Verification
            </Text>
            <View className="flex-row items-end gap-1">
              <Text
                className="text-5xl text-on-surface"
                style={{ fontFamily: 'Manrope_700Bold' }}
              >
                91
              </Text>
              <Text
                className="text-lg text-on-surface-variant mb-2"
                style={{ fontFamily: 'Manrope_600SemiBold' }}
              >
                Days
              </Text>
            </View>
            <Text
              className="text-sm text-on-surface-variant"
              style={{ fontFamily: 'Inter' }}
            >
              Remaining until release alert
            </Text>
          </View>
        </View>

        {/* Verify Now Button */}
        <View className="mx-5 mb-6">
          <Pressable
            onPress={() => Alert.alert('Verified', 'Your identity has been confirmed. Timer reset.')}
            className="h-14 rounded-xl bg-vault-dark items-center justify-center flex-row gap-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <MaterialIcons name="fingerprint" size={22} color="#ffffff" />
            <Text
              className="text-on-primary text-base"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Verify Now
            </Text>
          </Pressable>
        </View>

        {/* Verification Interval */}
        <View className="px-5 mb-6">
          <Text
            className="text-lg text-on-surface mb-4"
            style={{ fontFamily: 'Manrope_600SemiBold' }}
          >
            Verification Interval
          </Text>
          <View className="flex-row gap-3">
            {INTERVALS.map((interval) => (
              <Pressable
                key={interval.months}
                onPress={() => setSelectedInterval(interval.months)}
                className={`flex-1 py-4 rounded-card items-center ${
                  selectedInterval === interval.months
                    ? 'bg-primary-container/50'
                    : 'bg-surface-container-lowest'
                }`}
              >
                <Text
                  className="text-2xl text-on-surface"
                  style={{ fontFamily: 'Manrope_700Bold' }}
                >
                  {interval.label}
                </Text>
                <Text
                  className="text-xs text-on-surface-variant uppercase tracking-wider mt-1"
                  style={{ fontFamily: 'Inter_500Medium' }}
                >
                  {interval.sub}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* How it works */}
        <View className="px-5 mb-6">
          <Text
            className="text-lg text-on-surface mb-4"
            style={{ fontFamily: 'Manrope_600SemiBold' }}
          >
            How it works
          </Text>

          <View className="p-5 bg-surface-container-lowest rounded-card mb-4">
            <View className="flex-row items-start gap-4">
              <View className="w-11 h-11 rounded-xl bg-surface-container items-center justify-center">
                <MaterialIcons name="autorenew" size={22} color="#4f6073" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-base text-on-surface mb-1"
                  style={{ fontFamily: 'Inter_600SemiBold' }}
                >
                  Dead-man's Switch
                </Text>
                <Text
                  className="text-sm text-on-surface-variant leading-5"
                  style={{ fontFamily: 'Inter' }}
                >
                  If you don't confirm your identity before the countdown ends, the vault assumes
                  the inheritance event has occurred.
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 p-4 bg-surface-container-lowest rounded-card">
              <View className="w-10 h-10 rounded-xl bg-surface-container items-center justify-center mb-3">
                <MaterialIcons name="notifications" size={20} color="#4f6073" />
              </View>
              <Text
                className="text-sm text-on-surface mb-1"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Alert Sequence
              </Text>
              <Text
                className="text-xs text-on-surface-variant leading-4"
                style={{ fontFamily: 'Inter' }}
              >
                We'll notify you via 4 channels starting 30 days before release.
              </Text>
            </View>
            <View className="flex-1 p-4 bg-surface-container-lowest rounded-card">
              <View className="w-10 h-10 rounded-xl bg-surface-container items-center justify-center mb-3">
                <MaterialIcons name="email" size={20} color="#4f6073" />
              </View>
              <Text
                className="text-sm text-on-surface mb-1"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Smart Release
              </Text>
              <Text
                className="text-xs text-on-surface-variant leading-4"
                style={{ fontFamily: 'Inter' }}
              >
                Nominees receive encrypted data via email after zero-hour verification failure.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
