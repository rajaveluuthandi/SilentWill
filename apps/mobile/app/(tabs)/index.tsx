import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  MOCK_ASSETS,
  MOCK_NOMINEES,
  getCategoryCounts,
  getNetWorth,
  formatCurrency,
  CATEGORY_INFO,
} from '../../data/mock';

const CLUSTER_ITEMS = [
  { key: 'banking' as const, icon: 'account-balance' as const },
  { key: 'real-estate' as const, icon: 'home' as const },
  { key: 'insurance' as const, icon: 'shield' as const },
  { key: 'digital' as const, icon: 'devices' as const },
] as const;

export default function VaultScreen() {
  const router = useRouter();
  const netWorth = getNetWorth();
  const counts = getCategoryCounts();
  const verifiedNominees = MOCK_NOMINEES.filter((n) => n.status === 'verified').length;

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

        {/* Title */}
        <View className="px-5 mb-5">
          <Text
            className="text-xs text-on-surface-variant tracking-widest uppercase mb-1"
            style={{ fontFamily: 'Inter_500Medium' }}
          >
            SilentWill Dashboard
          </Text>
          <Text
            className="text-3xl text-on-surface"
            style={{ fontFamily: 'Manrope_700Bold', letterSpacing: -0.5 }}
          >
            Your Legacy
          </Text>
        </View>

        {/* Total Vault Value Card */}
        <View className="mx-5 mb-6 p-5 bg-surface-container-lowest rounded-card">
          <View className="flex-row items-center justify-between mb-3">
            <Text
              className="text-sm text-on-surface-variant"
              style={{ fontFamily: 'Inter' }}
            >
              Total Vault Value
            </Text>
            <MaterialIcons name="visibility-off" size={18} color="#6b7b83" />
          </View>
          <Text
            className="text-2xl text-on-surface mb-4"
            style={{ fontFamily: 'Manrope_700Bold' }}
          >
            {formatCurrency(netWorth)}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center">
              {MOCK_NOMINEES.slice(0, 2).map((n, i) => (
                <View
                  key={n.id}
                  className="w-7 h-7 rounded-full bg-vault-dark items-center justify-center"
                  style={{ marginLeft: i > 0 ? -8 : 0, borderWidth: 2, borderColor: '#fff' }}
                >
                  <Text className="text-white text-xs" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    {n.name.split(' ').map((w) => w[0]).join('')}
                  </Text>
                </View>
              ))}
              <View
                className="w-7 h-7 rounded-full bg-surface-container items-center justify-center"
                style={{ marginLeft: -8, borderWidth: 2, borderColor: '#fff' }}
              >
                <Text className="text-on-surface-variant text-xs">+</Text>
              </View>
            </View>
            <Text
              className="text-sm text-on-surface-variant"
              style={{ fontFamily: 'Inter' }}
            >
              {verifiedNominees} Nominees Verified
            </Text>
          </View>
        </View>

        {/* Asset Clusters */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className="text-lg text-on-surface"
              style={{ fontFamily: 'Manrope_600SemiBold' }}
            >
              Asset Clusters
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/assets')}>
              <Text
                className="text-sm text-primary"
                style={{ fontFamily: 'Inter_500Medium' }}
              >
                View All
              </Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap gap-3">
            {CLUSTER_ITEMS.map((item) => {
              const count = counts[item.key] || 0;
              const info = CATEGORY_INFO[item.key];
              return (
                <Pressable
                  key={item.key}
                  onPress={() => router.push('/(tabs)/assets')}
                  className="flex-1 min-w-[45%] p-4 bg-surface-container-lowest rounded-card"
                >
                  <View className="w-11 h-11 rounded-xl bg-surface-container items-center justify-center mb-3">
                    <MaterialIcons name={item.icon} size={22} color="#4f6073" />
                  </View>
                  <Text
                    className="text-sm text-on-surface-variant mb-1"
                    style={{ fontFamily: 'Inter' }}
                  >
                    {info.label}
                  </Text>
                  <Text
                    className="text-base text-on-surface"
                    style={{ fontFamily: 'Manrope_600SemiBold' }}
                  >
                    {count} {count === 1 ? 'Account' : 'Accounts'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Integrity Checks */}
        <View className="px-5 mb-6">
          <Text
            className="text-lg text-on-surface mb-4"
            style={{ fontFamily: 'Manrope_600SemiBold' }}
          >
            Integrity Checks
          </Text>
          <View className="gap-3">
            <View className="flex-row items-center p-4 bg-surface-container-lowest rounded-card">
              <View className="w-11 h-11 rounded-xl bg-surface-container items-center justify-center mr-3">
                <MaterialIcons name="lock" size={20} color="#4f6073" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-sm text-on-surface"
                  style={{ fontFamily: 'Inter_500Medium' }}
                >
                  Quantum Encryption Status
                </Text>
                <Text
                  className="text-xs text-on-surface-variant mt-0.5"
                  style={{ fontFamily: 'Inter' }}
                >
                  Vault keys updated 12h ago
                </Text>
              </View>
              <MaterialIcons name="verified" size={22} color="#2d8a5e" />
            </View>
            <View className="flex-row items-center p-4 bg-surface-container-lowest rounded-card">
              <View className="w-11 h-11 rounded-xl bg-surface-container items-center justify-center mr-3">
                <MaterialIcons name="people" size={20} color="#4f6073" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-sm text-on-surface"
                  style={{ fontFamily: 'Inter_500Medium' }}
                >
                  Nominee Verification
                </Text>
                <Text
                  className="text-xs text-on-surface-variant mt-0.5"
                  style={{ fontFamily: 'Inter' }}
                >
                  All {verifiedNominees} active heirs responded
                </Text>
              </View>
              <MaterialIcons name="verified" size={22} color="#2d8a5e" />
            </View>
          </View>
        </View>

        {/* Add Asset CTA */}
        <View className="px-5 mb-8">
          <Pressable
            onPress={() => router.push('/add-asset')}
            className="h-14 rounded-xl bg-vault-dark items-center justify-center flex-row gap-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <MaterialIcons name="add-circle-outline" size={22} color="#ffffff" />
            <Text
              className="text-on-primary text-base"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Add Asset to Vault
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
