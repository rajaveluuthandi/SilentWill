import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  MOCK_ASSETS,
  MOCK_NOMINEES,
  Asset,
  AssetCategory,
  getNetWorth,
  formatCurrency,
  CATEGORY_INFO,
} from '../../data/mock';

const FILTER_TABS: { key: AssetCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'banking', label: 'Bank' },
  { key: 'real-estate', label: 'Real Estate' },
  { key: 'insurance', label: 'Policies' },
  { key: 'government-funds', label: 'Govt. Funds' },
  { key: 'stocks', label: 'Stocks' },
  { key: 'mutual-funds', label: 'MF' },
  { key: 'gold', label: 'Gold' },
  { key: 'liabilities', label: 'Liabilities' },
];

function StatusBadge({ status }: { status: string }) {
  return (
    <Text
      className="text-xs text-on-surface-variant capitalize"
      style={{ fontFamily: 'Inter' }}
    >
      {status}
    </Text>
  );
}

export default function AssetsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<AssetCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const netWorth = getNetWorth();
  const verifiedNominees = MOCK_NOMINEES.filter((n) => n.status === 'verified').length;

  const filteredAssets = MOCK_ASSETS.filter((a) => {
    const matchesFilter = activeFilter === 'all' || a.category === activeFilter;
    const matchesSearch =
      search === '' || a.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderAssetItem = ({ item }: { item: Asset }) => {
    const info = CATEGORY_INFO[item.category];
    return (
      <Pressable
        onPress={() => router.push(`/asset/${item.id}`)}
        className="flex-row items-center p-4 bg-surface-container-lowest rounded-card mb-3"
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: info.color + '15' }}
        >
          <MaterialIcons name={info.icon as any} size={22} color={info.color} />
        </View>
        <View className="flex-1">
          <Text
            className="text-sm text-on-surface"
            style={{ fontFamily: 'Inter_500Medium' }}
          >
            {item.name}
          </Text>
          <Text
            className="text-xs text-on-surface-variant mt-0.5"
            style={{ fontFamily: 'Inter' }}
          >
            {item.subcategory} {item.institution ? `• ${item.institution}` : ''}
          </Text>
        </View>
        <View className="items-end">
          <Text
            className="text-sm text-on-surface"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            {formatCurrency(item.value)}
          </Text>
          <StatusBadge status={item.status} />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
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

      {/* Total Legacy Value Card */}
      <View className="mx-5 mb-5 p-5 bg-vault-dark rounded-card">
        <Text
          className="text-xs text-white/60 tracking-widest uppercase mb-2"
          style={{ fontFamily: 'Inter_500Medium' }}
        >
          Total Legacy Value
        </Text>
        <View className="flex-row items-center gap-3 mb-3">
          <Text
            className="text-3xl text-white"
            style={{ fontFamily: 'Manrope_700Bold' }}
          >
            {formatCurrency(netWorth)}
          </Text>
          <View className="flex-row items-center bg-white/15 rounded-full px-2 py-1">
            <MaterialIcons name="trending-up" size={14} color="#ffffff" />
            <Text className="text-xs text-white ml-1" style={{ fontFamily: 'Inter_500Medium' }}>
              2.4%
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <View className="flex-row">
            {MOCK_NOMINEES.slice(0, 3).map((n, i) => (
              <View
                key={n.id}
                className="w-6 h-6 rounded-full bg-primary items-center justify-center"
                style={{ marginLeft: i > 0 ? -6 : 0, borderWidth: 1.5, borderColor: '#1a2332' }}
              >
                <Text className="text-white text-[8px]" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  {n.name[0]}
                </Text>
              </View>
            ))}
          </View>
          <Text className="text-xs text-white/70 ml-2" style={{ fontFamily: 'Inter' }}>
            {verifiedNominees} Nominees Verified
          </Text>
        </View>
      </View>

      {/* Search */}
      <View className="mx-5 mb-4 flex-row items-center bg-surface-container-lowest rounded-xl px-4 h-12">
        <MaterialIcons name="search" size={20} color="#6b7b83" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search legacy assets..."
          placeholderTextColor="#6b7b83"
          className="flex-1 ml-3 text-sm text-on-surface"
          style={{ fontFamily: 'Inter' }}
        />
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-5 mb-4"
        contentContainerStyle={{ gap: 8 }}
      >
        {FILTER_TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded-full ${
              activeFilter === tab.key
                ? 'bg-vault-dark'
                : 'bg-surface-container-lowest'
            }`}
          >
            <Text
              className={`text-sm ${
                activeFilter === tab.key ? 'text-white' : 'text-on-surface'
              }`}
              style={{ fontFamily: 'Inter_500Medium' }}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Asset List */}
      <View className="px-5 flex-row items-center justify-between mb-3">
        <Text
          className="text-lg text-on-surface"
          style={{ fontFamily: 'Manrope_600SemiBold' }}
        >
          Primary Assets
        </Text>
        <Text className="text-sm text-primary" style={{ fontFamily: 'Inter_500Medium' }}>
          Manage →
        </Text>
      </View>

      <FlatList
        data={filteredAssets}
        renderItem={renderAssetItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View className="flex-row items-center p-4 bg-surface-container-lowest rounded-card mt-2">
            <View className="w-3 h-3 rounded-full bg-status-secure mr-3" />
            <View>
              <Text
                className="text-xs text-on-surface uppercase tracking-wider"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Heartbeat Active
              </Text>
              <Text className="text-xs text-on-surface-variant" style={{ fontFamily: 'Inter' }}>
                Last check-in: Today at 08:42 AM
              </Text>
            </View>
          </View>
        }
      />

      {/* FAB */}
      <Pressable
        onPress={() => router.push('/add-asset')}
        className="absolute bottom-24 right-5 w-14 h-14 rounded-2xl bg-vault-dark items-center justify-center"
        style={({ pressed }) => ({
          opacity: pressed ? 0.85 : 1,
          shadowColor: '#1a2332',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        })}
      >
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </Pressable>
    </SafeAreaView>
  );
}
