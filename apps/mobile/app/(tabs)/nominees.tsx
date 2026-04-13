import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { MOCK_NOMINEES } from '../../data/mock';

export default function NomineesScreen() {
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

        {/* Mode Badge */}
        <View className="mx-5 mb-4 flex-row items-center bg-surface-container-lowest rounded-full px-4 py-3">
          <View className="w-2.5 h-2.5 rounded-full bg-status-secure mr-3" />
          <Text
            className="text-sm text-on-surface flex-1"
            style={{ fontFamily: 'Inter_500Medium' }}
          >
            Full Hidden Mode Active
          </Text>
          <MaterialIcons name="visibility-off" size={18} color="#6b7b83" />
        </View>

        {/* Title */}
        <View className="px-5 mb-2">
          <Text
            className="text-3xl text-on-surface"
            style={{ fontFamily: 'Manrope_700Bold', letterSpacing: -0.5 }}
          >
            Nominees
          </Text>
          <Text
            className="text-base text-on-surface-variant mt-2 leading-6"
            style={{ fontFamily: 'Inter' }}
          >
            Select the trusted individuals who will receive access to your vault after verification.
          </Text>
        </View>

        {/* Nominee List */}
        <View className="px-5 mt-6 gap-4">
          {MOCK_NOMINEES.map((nominee) => (
            <View
              key={nominee.id}
              className="flex-row items-center p-4 bg-surface-container-lowest rounded-card"
            >
              <View className="w-14 h-14 rounded-full bg-surface-container items-center justify-center mr-4">
                <Text
                  className="text-lg text-primary"
                  style={{ fontFamily: 'Manrope_600SemiBold' }}
                >
                  {nominee.name.split(' ').map((w) => w[0]).join('')}
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  className="text-base text-on-surface"
                  style={{ fontFamily: 'Inter_600SemiBold' }}
                >
                  {nominee.name}
                </Text>
                <View className="flex-row items-center mt-1 gap-1">
                  {nominee.status === 'verified' ? (
                    <>
                      <MaterialIcons name="verified" size={14} color="#2d8a5e" />
                      <Text
                        className="text-xs text-status-secure uppercase tracking-wider"
                        style={{ fontFamily: 'Inter_500Medium' }}
                      >
                        Verified
                      </Text>
                    </>
                  ) : (
                    <>
                      <MaterialIcons name="schedule" size={14} color="#d4a843" />
                      <Text
                        className="text-xs text-status-pending uppercase tracking-wider"
                        style={{ fontFamily: 'Inter_500Medium' }}
                      >
                        Pending
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <Pressable className="p-2">
                <MaterialIcons name="more-horiz" size={22} color="#6b7b83" />
              </Pressable>
            </View>
          ))}

          {/* Add Nominee */}
          <Pressable className="items-center justify-center p-6 rounded-card border-2 border-dashed border-outline-variant">
            <View className="w-12 h-12 rounded-full bg-surface-container items-center justify-center mb-3">
              <MaterialIcons name="person-add" size={24} color="#6b7b83" />
            </View>
            <Text
              className="text-sm text-on-surface-variant"
              style={{ fontFamily: 'Inter_500Medium' }}
            >
              Add backup nominee
            </Text>
          </Pressable>
        </View>

        {/* Info Card */}
        <View className="mx-5 mt-6 mb-8 p-5 bg-primary-container/30 rounded-card">
          <View className="flex-row items-start gap-3">
            <MaterialIcons name="info" size={20} color="#4f6073" />
            <Text
              className="flex-1 text-sm text-on-surface leading-5"
              style={{ fontFamily: 'Inter' }}
            >
              Nominees will only be granted access after your pre-defined inactivity period and
              manual identity verification.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
