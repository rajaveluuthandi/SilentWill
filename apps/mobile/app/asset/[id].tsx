import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAssetById, formatCurrency, CATEGORY_INFO } from '../../hooks/useSupabaseData';

export default function AssetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { asset, loading } = useAssetById(id);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#4f6073" />
      </SafeAreaView>
    );
  }

  if (!asset) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <Text className="text-on-surface-variant" style={{ fontFamily: 'Inter' }}>
          Asset not found
        </Text>
      </SafeAreaView>
    );
  }

  const a: any = asset;
  const info = CATEGORY_INFO[asset.category];
  const accountNumber = a.account_number ?? a.accountNumber;
  const routingNumber = a.routing_number ?? a.routingNumber;
  const accountType = a.account_type ?? a.accountType;
  const policyNumber = a.policy_number ?? a.policyNumber;
  const maturityDate = a.maturity_date ?? a.maturityDate;
  const folioNumber = a.folio_number ?? a.folioNumber;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1">
          <MaterialIcons name="chevron-left" size={28} color="#2b3437" />
        </Pressable>
        <Text
          className="text-lg text-on-surface"
          style={{ fontFamily: 'Manrope_600SemiBold' }}
        >
          SilentWill
        </Text>
        <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
          <MaterialIcons name="shield" size={18} color="#ffffff" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Vault Protected Badge */}
        <View className="items-center mb-4">
          <View className="flex-row items-center bg-primary-container/30 rounded-full px-4 py-2 gap-2">
            <MaterialIcons name="shield" size={14} color="#4f6073" />
            <Text
              className="text-xs text-primary tracking-wider uppercase"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Vault Protected
            </Text>
          </View>
        </View>

        {/* Asset Icon & Name */}
        <View className="items-center mb-6 px-5">
          <View
            className="w-20 h-20 rounded-2xl items-center justify-center mb-4"
            style={{ backgroundColor: info.color + '20' }}
          >
            <MaterialIcons name={info.icon as any} size={36} color={info.color} />
          </View>
          <Text
            className="text-2xl text-on-surface text-center"
            style={{ fontFamily: 'Manrope_700Bold' }}
          >
            {asset.name}
          </Text>
          <Text
            className="text-sm text-on-surface-variant mt-1"
            style={{ fontFamily: 'Inter' }}
          >
            {info.label} • Created {new Date(asset.created_at || asset.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </Text>
        </View>

        {/* Total Balance */}
        <View className="mx-5 mb-5 p-5 bg-surface-container-lowest rounded-card items-center">
          <Text
            className="text-xs text-on-surface-variant tracking-widest uppercase mb-2"
            style={{ fontFamily: 'Inter_500Medium' }}
          >
            Total Balance
          </Text>
          <Text
            className="text-3xl text-on-surface mb-2"
            style={{ fontFamily: 'Manrope_700Bold' }}
          >
            {formatCurrency(asset.value)}
          </Text>
          <View className="bg-surface-container rounded-full px-3 py-1">
            <Text className="text-xs text-on-surface-variant" style={{ fontFamily: 'Inter' }}>
              {asset.currency} • {accountType || asset.subcategory}
            </Text>
          </View>
        </View>

        {/* Account Details */}
        {(accountNumber || routingNumber || accountType) && (
          <View className="mx-5 mb-5 p-5 bg-surface-container-lowest rounded-card">
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-xs text-on-surface-variant tracking-widest uppercase"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Account Details
              </Text>
              <MaterialIcons name="info-outline" size={18} color="#6b7b83" />
            </View>
            {accountNumber && (
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-on-surface-variant" style={{ fontFamily: 'Inter' }}>
                  Account Number
                </Text>
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  {accountNumber}
                </Text>
              </View>
            )}
            {routingNumber && (
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-on-surface-variant" style={{ fontFamily: 'Inter' }}>
                  Routing Transit
                </Text>
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  {routingNumber}
                </Text>
              </View>
            )}
            {accountType && (
              <View className="flex-row justify-between">
                <Text className="text-sm text-on-surface-variant" style={{ fontFamily: 'Inter' }}>
                  Account Type
                </Text>
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  {accountType}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Additional Info */}
        {(policyNumber || maturityDate || asset.location || asset.weight || folioNumber) && (
          <View className="mx-5 mb-5 p-5 bg-surface-container-lowest rounded-card">
            <Text
              className="text-xs text-on-surface-variant tracking-widest uppercase mb-4"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Additional Information
            </Text>
            {policyNumber && (
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-on-surface-variant" style={{ fontFamily: 'Inter' }}>Policy Number</Text>
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter_600SemiBold' }}>{policyNumber}</Text>
              </View>
            )}
            {maturityDate && (
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-on-surface-variant" style={{ fontFamily: 'Inter' }}>Maturity Date</Text>
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter_600SemiBold' }}>{maturityDate}</Text>
              </View>
            )}
            {asset.location && (
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-on-surface-variant" style={{ fontFamily: 'Inter' }}>Location</Text>
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter_600SemiBold' }}>{asset.location}</Text>
              </View>
            )}
            {asset.weight && (
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-on-surface-variant" style={{ fontFamily: 'Inter' }}>Weight</Text>
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter_600SemiBold' }}>{asset.weight}</Text>
              </View>
            )}
            {folioNumber && (
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-on-surface-variant" style={{ fontFamily: 'Inter' }}>Folio Number</Text>
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter_600SemiBold' }}>{folioNumber}</Text>
              </View>
            )}
            {asset.nominee && (
              <View className="flex-row justify-between">
                <Text className="text-sm text-on-surface-variant" style={{ fontFamily: 'Inter' }}>Nominee</Text>
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter_600SemiBold' }}>{asset.nominee}</Text>
              </View>
            )}
          </View>
        )}

        {/* Status & Heartbeat */}
        <View className="flex-row gap-3 mx-5 mb-5">
          <View className="flex-1 p-4 bg-surface-container-lowest rounded-card items-center">
            <View className="w-10 h-10 rounded-xl bg-surface-container items-center justify-center mb-2">
              <MaterialIcons name="verified" size={20} color="#2d8a5e" />
            </View>
            <Text className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'Inter_600SemiBold' }}>
              Status
            </Text>
            <Text className="text-sm text-on-surface mt-0.5 capitalize" style={{ fontFamily: 'Inter_500Medium' }}>
              {asset.status}
            </Text>
          </View>
          <View className="flex-1 p-4 bg-surface-container-lowest rounded-card items-center">
            <View className="w-10 h-10 rounded-xl bg-surface-container items-center justify-center mb-2">
              <MaterialIcons name="favorite" size={20} color="#4f6073" />
            </View>
            <Text className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'Inter_600SemiBold' }}>
              Heartbeat
            </Text>
            <Text className="text-sm text-on-surface mt-0.5" style={{ fontFamily: 'Inter_500Medium' }}>
              Active
            </Text>
          </View>
        </View>

        {/* Notes */}
        {asset.notes && (
          <View className="mx-5 mb-5 p-5 bg-surface-container-lowest rounded-card">
            <Text className="text-xs text-on-surface-variant tracking-widest uppercase mb-3" style={{ fontFamily: 'Inter_600SemiBold' }}>
              Notes
            </Text>
            <Text className="text-sm text-on-surface leading-5" style={{ fontFamily: 'Inter' }}>
              {asset.notes}
            </Text>
          </View>
        )}

        {/* Compliance & Security */}
        <View className="px-5 mb-5">
          <Text className="text-base text-on-surface mb-3" style={{ fontFamily: 'Manrope_600SemiBold' }}>
            Compliance & Security
          </Text>
          <View className="gap-3">
            <View className="flex-row items-center p-4 bg-surface-container-lowest rounded-card">
              <View className="w-10 h-10 rounded-xl bg-surface-container items-center justify-center mr-3">
                <MaterialIcons name="description" size={18} color="#4f6073" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter_500Medium' }}>
                  Inheritance Certificate
                </Text>
                <Text className="text-xs text-on-surface-variant" style={{ fontFamily: 'Inter' }}>
                  Digitally Notarized • PDF
                </Text>
              </View>
              <MaterialIcons name="file-download" size={20} color="#6b7b83" />
            </View>
            <View className="flex-row items-center p-4 bg-surface-container-lowest rounded-card">
              <View className="w-10 h-10 rounded-xl bg-surface-container items-center justify-center mr-3">
                <MaterialIcons name="security" size={18} color="#4f6073" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter_500Medium' }}>
                  Privacy Agreement
                </Text>
                <Text className="text-xs text-on-surface-variant" style={{ fontFamily: 'Inter' }}>
                  Last updated Oct 2022
                </Text>
              </View>
              <MaterialIcons name="open-in-new" size={20} color="#6b7b83" />
            </View>
          </View>
        </View>

        {/* Archive */}
        <View className="items-center mb-8">
          <Pressable
            onPress={() => Alert.alert('Archive', 'This asset will be archived.')}
            className="flex-row items-center gap-2"
          >
            <MaterialIcons name="archive" size={18} color="#c45a4a" />
            <Text className="text-sm text-status-alert uppercase tracking-wider" style={{ fontFamily: 'Inter_600SemiBold' }}>
              Archive Asset
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
