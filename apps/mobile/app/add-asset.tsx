import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  'Banking',
  'Real Estate',
  'Insurance',
  'Government Funds',
  'Stocks',
  'Mutual Funds',
  'Gold & Jewellery',
  'Cash',
  'Liabilities',
];

export default function AddAssetScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Banking');
  const [value, setValue] = useState('');
  const [institution, setInstitution] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  const handleSubmit = () => {
    Alert.alert(
      'Asset Added',
      `${name || 'New Asset'} has been committed to your vault.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-2">
          <MaterialIcons name="chevron-left" size={28} color="#2b3437" />
          <Text
            className="text-lg text-on-surface"
            style={{ fontFamily: 'Manrope_600SemiBold' }}
          >
            Add New Asset
          </Text>
        </Pressable>
        <View className="w-10 h-10 rounded-full bg-surface-container items-center justify-center">
          <MaterialIcons name="person" size={22} color="#4f6073" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View className="mx-5 mb-6 p-5 bg-surface-container rounded-card items-center">
          <MaterialIcons name="enhanced-encryption" size={36} color="#4f6073" />
          <Text
            className="text-xs text-on-surface-variant tracking-widest uppercase mt-3 mb-1"
            style={{ fontFamily: 'Inter_500Medium' }}
          >
            New Security Entry
          </Text>
          <Text
            className="text-base text-on-surface"
            style={{ fontFamily: 'Manrope_600SemiBold' }}
          >
            Vault Encryption Active
          </Text>
        </View>

        {/* Basic Information */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-1 h-5 bg-primary rounded-full" />
            <Text
              className="text-xs text-on-surface tracking-widest uppercase"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Basic Information
            </Text>
          </View>

          <Text className="text-sm text-on-surface-variant mb-2" style={{ fontFamily: 'Inter' }}>
            Asset Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Primary Savings Account"
            placeholderTextColor="#6b7b83"
            className="bg-surface-container-lowest rounded-xl px-4 h-12 text-sm text-on-surface mb-4"
            style={{ fontFamily: 'Inter' }}
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm text-on-surface-variant mb-2" style={{ fontFamily: 'Inter' }}>
                Category
              </Text>
              <Pressable
                onPress={() => setShowCategories(!showCategories)}
                className="bg-surface-container-lowest rounded-xl px-4 h-12 flex-row items-center justify-between"
              >
                <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter' }}>
                  {category}
                </Text>
                <MaterialIcons name="expand-more" size={20} color="#6b7b83" />
              </Pressable>
              {showCategories && (
                <View className="bg-surface-container-lowest rounded-xl mt-1 overflow-hidden">
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategories(false);
                      }}
                      className={`px-4 py-3 ${cat === category ? 'bg-primary-container/30' : ''}`}
                    >
                      <Text className="text-sm text-on-surface" style={{ fontFamily: 'Inter' }}>
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-sm text-on-surface-variant mb-2" style={{ fontFamily: 'Inter' }}>
                Est. Value (INR)
              </Text>
              <TextInput
                value={value}
                onChangeText={setValue}
                placeholder="0.00"
                placeholderTextColor="#6b7b83"
                keyboardType="numeric"
                className="bg-surface-container-lowest rounded-xl px-4 h-12 text-sm text-on-surface"
                style={{ fontFamily: 'Inter' }}
              />
            </View>
          </View>
        </View>

        {/* Detailed Metadata */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-1 h-5 bg-secondary rounded-full" />
            <Text
              className="text-xs text-on-surface tracking-widest uppercase"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Detailed Metadata
            </Text>
          </View>

          <View className="bg-surface-container-lowest rounded-xl p-4 gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="account-balance" size={18} color="#6b7b83" />
              <View className="flex-1">
                <Text className="text-xs text-on-surface-variant mb-1" style={{ fontFamily: 'Inter' }}>
                  Financial Institution
                </Text>
                <TextInput
                  value={institution}
                  onChangeText={setInstitution}
                  placeholder="Institution Name"
                  placeholderTextColor="#6b7b83"
                  className="text-sm text-on-surface h-8 p-0"
                  style={{ fontFamily: 'Inter' }}
                />
              </View>
            </View>
            <View className="h-px bg-surface-container" />
            <View className="flex-row items-center gap-3">
              <Text className="text-on-surface-variant text-lg" style={{ fontFamily: 'Inter_600SemiBold' }}>#</Text>
              <View className="flex-1">
                <Text className="text-xs text-on-surface-variant mb-1" style={{ fontFamily: 'Inter' }}>
                  Account Number
                </Text>
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="XXXX - XXXX - XXXX"
                  placeholderTextColor="#6b7b83"
                  className="text-sm text-on-surface h-8 p-0"
                  style={{ fontFamily: 'Inter' }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Access Instructions */}
        <View className="px-5 mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-1 h-5 bg-tertiary rounded-full" />
            <Text
              className="text-xs text-on-surface tracking-widest uppercase"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Access Instructions
            </Text>
          </View>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe where keys are kept, security phrases, or contact persons at the institution. This remains encrypted."
            placeholderTextColor="#6b7b83"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-surface-container-lowest rounded-xl p-4 text-sm text-on-surface min-h-[120px]"
            style={{ fontFamily: 'Inter' }}
          />
          <View className="flex-row items-center justify-end mt-2 gap-1">
            <MaterialIcons name="lock" size={12} color="#6b7b83" />
            <Text className="text-xs text-on-surface-variant" style={{ fontFamily: 'Inter' }}>
              Vault Level Security
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="px-5 mb-8 flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 h-14 rounded-xl bg-surface-container-lowest items-center justify-center"
          >
            <Text className="text-base text-on-surface" style={{ fontFamily: 'Inter_600SemiBold' }}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={handleSubmit}
            className="flex-[2] h-14 rounded-xl bg-vault-dark items-center justify-center flex-row gap-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <MaterialIcons name="check-circle" size={20} color="#ffffff" />
            <Text className="text-base text-on-primary" style={{ fontFamily: 'Inter_600SemiBold' }}>
              Commit to Vault
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
