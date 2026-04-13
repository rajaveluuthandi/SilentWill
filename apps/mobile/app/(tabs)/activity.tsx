import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { MOCK_ACTIVITY, ActivityLog } from '../../data/mock';

const TYPE_STYLE: Record<
  ActivityLog['type'],
  { bg: string; color: string; label: string }
> = {
  secure: { bg: '#e8f1ec', color: '#2d8a5e', label: 'Security' },
  asset: { bg: '#eef2f6', color: '#4f6073', label: 'Asset' },
  legacy: { bg: '#f4ecdc', color: '#a07b1f', label: 'Legacy' },
  settings: { bg: '#f1edf7', color: '#6b5a8a', label: 'Settings' },
};

const FILTERS: Array<'All' | 'Security' | 'Asset' | 'Legacy' | 'Settings'> = [
  'All',
  'Security',
  'Asset',
  'Legacy',
  'Settings',
];

export default function ActivityScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
          <View className="flex-row items-center gap-3">
            <MaterialIcons name="history" size={24} color="#4f6073" />
            <Text
              className="text-lg text-on-surface"
              style={{ fontFamily: 'Manrope_600SemiBold' }}
            >
              Recent Activity
            </Text>
          </View>
          <Pressable className="w-10 h-10 rounded-full bg-surface-container items-center justify-center">
            <MaterialIcons name="filter-list" size={22} color="#4f6073" />
          </Pressable>
        </View>

        {/* Title */}
        <View className="px-5 mb-4">
          <Text
            className="text-3xl text-on-surface"
            style={{ fontFamily: 'Manrope_700Bold', letterSpacing: -0.5 }}
          >
            Activity Log
          </Text>
          <Text
            className="text-base text-on-surface-variant mt-2 leading-6"
            style={{ fontFamily: 'Inter' }}
          >
            A timeline of every action across your vault — security, assets, and legacy events.
          </Text>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5"
          contentContainerStyle={{ gap: 8, paddingRight: 20 }}
        >
          {FILTERS.map((f, i) => (
            <Pressable
              key={f}
              className={`px-4 py-2 rounded-full ${
                i === 0 ? 'bg-primary' : 'bg-surface-container-lowest'
              }`}
            >
              <Text
                className={`text-xs ${i === 0 ? 'text-on-primary' : 'text-on-surface-variant'}`}
                style={{ fontFamily: 'Inter_500Medium' }}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Timeline */}
        <View className="px-5 mt-6 mb-8">
          {MOCK_ACTIVITY.map((item, idx) => {
            const style = TYPE_STYLE[item.type];
            const isLast = idx === MOCK_ACTIVITY.length - 1;
            return (
              <View key={item.id} className="flex-row">
                {/* Icon column with line */}
                <View className="items-center mr-4">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: style.bg }}
                  >
                    <MaterialIcons
                      name={item.icon as keyof typeof MaterialIcons.glyphMap}
                      size={20}
                      color={style.color}
                    />
                  </View>
                  {!isLast && (
                    <View className="w-px flex-1 bg-outline-variant my-1" />
                  )}
                </View>

                {/* Content */}
                <View className="flex-1 pb-6">
                  <Text
                    className="text-sm text-on-surface"
                    style={{ fontFamily: 'Inter_600SemiBold' }}
                  >
                    {item.title}
                  </Text>
                  <View className="flex-row items-center mt-1 gap-2">
                    <Text
                      className="text-xs uppercase tracking-wider"
                      style={{ fontFamily: 'Inter_500Medium', color: style.color }}
                    >
                      {style.label}
                    </Text>
                    <Text className="text-xs text-on-surface-variant">·</Text>
                    <Text
                      className="text-xs text-on-surface-variant"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {item.timestamp}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
