import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function AuthScreen() {
  const router = useRouter();

  const handleComingSoon = (feature: string) => {
    Alert.alert('Coming Soon', `${feature} will be available in the full release.`);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 justify-center px-8">
        {/* Logo & Branding */}
        <View className="items-center mb-16">
          <View className="w-20 h-20 rounded-2xl bg-vault-dark items-center justify-center mb-6">
            <MaterialIcons name="lock" size={36} color="#ffffff" />
          </View>
          <Text
            className="text-4xl text-on-surface mb-3"
            style={{ fontFamily: 'Manrope_700Bold', letterSpacing: -0.5 }}
          >
            SilentWill
          </Text>
          <Text
            className="text-base text-on-surface-variant text-center leading-6"
            style={{ fontFamily: 'Inter' }}
          >
            Your Digital Inheritance Vault
          </Text>
        </View>

        {/* Auth Buttons */}
        <View className="gap-3 mb-8">
          <Pressable
            onPress={() => handleComingSoon('Sign In')}
            className="h-14 rounded-xl bg-primary items-center justify-center flex-row gap-2 opacity-50"
          >
            <MaterialIcons name="login" size={20} color="#ffffff" />
            <Text
              className="text-on-primary text-base"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Sign In
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleComingSoon('Sign Up')}
            className="h-14 rounded-xl bg-surface-container-lowest items-center justify-center flex-row gap-2 opacity-50"
          >
            <MaterialIcons name="person-add" size={20} color="#4f6073" />
            <Text
              className="text-primary text-base"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-outline-variant" />
          <Text
            className="mx-4 text-on-surface-variant text-sm"
            style={{ fontFamily: 'Inter' }}
          >
            or
          </Text>
          <View className="flex-1 h-px bg-outline-variant" />
        </View>

        {/* Demo Mode CTA */}
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          className="h-14 rounded-xl bg-vault-dark items-center justify-center flex-row gap-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <MaterialIcons name="play-arrow" size={22} color="#ffffff" />
          <Text
            className="text-on-primary text-base"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            Try Demo Mode
          </Text>
        </Pressable>

        <Text
          className="text-center text-on-surface-variant text-xs mt-4 leading-5"
          style={{ fontFamily: 'Inter' }}
        >
          Explore SilentWill with sample data.{'\n'}No account required.
        </Text>
      </View>

      {/* Footer */}
      <View className="items-center pb-4">
        <Text
          className="text-on-surface-variant text-xs"
          style={{ fontFamily: 'Inter' }}
        >
          Secured with end-to-end encryption
        </Text>
      </View>
    </SafeAreaView>
  );
}
