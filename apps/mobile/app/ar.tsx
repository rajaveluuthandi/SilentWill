import { useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAssets, formatCurrency } from '../hooks/useSupabaseData';
import { getARVaultView, isNativeModuleAvailable, isSupported } from '../modules/ar-vault';
import { arCategoryTotals, toARItems } from '../lib/arMapping';

export default function ARScreen() {
  const router = useRouter();
  const { assets } = useAssets();

  const items = useMemo(() => toARItems(assets), [assets]);
  const totals = useMemo(() => arCategoryTotals(assets).slice(0, 8), [assets]);

  // Resolved lazily: null in Expo Go, in the Simulator, and on any device
  // without ARKit world tracking. Never throws at import.
  const ARVaultView = getARVaultView();
  const supported = isSupported();

  return (
    <SafeAreaView className="flex-1 bg-vault-dark" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        <Text className="text-base text-white" style={{ fontFamily: 'Manrope_700Bold' }}>
          Your Legacy in AR
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {supported && ARVaultView ? (
        <View className="flex-1">
          <ARVaultView items={items} style={{ flex: 1 }} />

          {/* Legend: the scene shows proportion, so the real numbers live here. */}
          <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {totals.map((total) => (
                <View
                  key={total.category}
                  className="mr-2 rounded-xl bg-black/60 px-3 py-2"
                >
                  <Text
                    className="text-xs text-white/70"
                    style={{ fontFamily: 'Inter' }}
                  >
                    {total.label}
                  </Text>
                  <Text
                    className="text-sm text-white"
                    style={{ fontFamily: 'Manrope_700Bold' }}
                  >
                    {formatCurrency(total.value)}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <Text className="mt-3 text-center text-xs text-white/50" style={{ fontFamily: 'Inter' }}>
              Point at a flat surface. Heights show proportion, not absolute value.
            </Text>
          </View>
        </View>
      ) : (
        <Unsupported hasNativeModule={isNativeModuleAvailable()} />
      )}
    </SafeAreaView>
  );
}

function Unsupported({ hasNativeModule }: { hasNativeModule: boolean }) {
  // Two genuinely different causes with two different remedies, so name the one
  // that applies. Telling someone to buy a newer iPhone when they actually just
  // need a development build is worse than saying nothing.
  const reason = hasNativeModule
    ? 'This device does not support ARKit world tracking. An iPhone with an A12 chip or newer is required.'
    : 'AR needs a development build. It cannot run in Expo Go or the iOS Simulator, which have no ARKit.';

  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
        <MaterialIcons name="view-in-ar" size={32} color="#ffffff" />
      </View>
      <Text
        className="mb-2 text-center text-lg text-white"
        style={{ fontFamily: 'Manrope_700Bold' }}
      >
        AR unavailable here
      </Text>
      <Text
        className="text-center text-sm text-white/60"
        style={{ fontFamily: 'Inter' }}
      >
        {reason}
      </Text>
    </View>
  );
}
