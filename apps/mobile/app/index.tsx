import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'idle' | 'signIn' | 'signUp';

export default function AuthScreen() {
  const router = useRouter();
  const auth = useAuth();
  const [mode, setMode] = useState<Mode>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.isLoading && (auth.session || auth.isDemo)) {
      router.replace('/(tabs)');
    }
  }, [auth.isLoading, auth.session, auth.isDemo]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setLoading(false);
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError('Please enter email and password');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: err } = await auth.signIn(email.trim(), password);
    setLoading(false);
    if (err) setError(err);
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      setError('Please enter email and password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: err } = await auth.signUp(email.trim(), password);
    setLoading(false);
    if (err) setError(err);
  };

  const handleDemoMode = () => {
    auth.enterDemoMode();
    router.replace('/(tabs)');
  };

  if (auth.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#4f6073" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 justify-center px-8">
          {/* Logo */}
          <View className="items-center mb-12">
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

          {mode === 'idle' ? (
            <>
              <View className="gap-3 mb-8">
                <Pressable
                  onPress={() => { resetForm(); setMode('signIn'); }}
                  className="h-14 rounded-xl bg-primary items-center justify-center flex-row gap-2"
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
                  onPress={() => { resetForm(); setMode('signUp'); }}
                  className="h-14 rounded-xl bg-surface-container-lowest items-center justify-center flex-row gap-2"
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

              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-outline-variant" />
                <Text className="mx-4 text-on-surface-variant text-sm" style={{ fontFamily: 'Inter' }}>
                  or
                </Text>
                <View className="flex-1 h-px bg-outline-variant" />
              </View>

              <Pressable
                onPress={() => auth.signInWithGoogle()}
                className="h-14 rounded-xl bg-surface-container-lowest items-center justify-center flex-row gap-3 mb-4"
              >
                <Text className="text-on-surface text-base" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  Continue with Google
                </Text>
              </Pressable>

              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-outline-variant" />
                <Text className="mx-4 text-on-surface-variant text-xs" style={{ fontFamily: 'Inter' }}>
                  or explore
                </Text>
                <View className="flex-1 h-px bg-outline-variant" />
              </View>

              <Pressable
                onPress={handleDemoMode}
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
            </>
          ) : (
            <>
              <Text
                className="text-2xl text-on-surface mb-6 text-center"
                style={{ fontFamily: 'Manrope_700Bold' }}
              >
                {mode === 'signIn' ? 'Welcome Back' : 'Create Account'}
              </Text>

              <View className="gap-3 mb-4">
                <TextInput
                  className="h-14 rounded-xl bg-surface-container-lowest px-4 text-on-surface text-base"
                  style={{ fontFamily: 'Inter' }}
                  placeholder="Email"
                  placeholderTextColor="#6b7b83"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  className="h-14 rounded-xl bg-surface-container-lowest px-4 text-on-surface text-base"
                  style={{ fontFamily: 'Inter' }}
                  placeholder="Password"
                  placeholderTextColor="#6b7b83"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                {mode === 'signUp' && (
                  <TextInput
                    className="h-14 rounded-xl bg-surface-container-lowest px-4 text-on-surface text-base"
                    style={{ fontFamily: 'Inter' }}
                    placeholder="Confirm Password"
                    placeholderTextColor="#6b7b83"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                )}
              </View>

              {error && (
                <Text
                  className="text-sm mb-4 text-center"
                  style={{ fontFamily: 'Inter', color: '#c45a4a' }}
                >
                  {error}
                </Text>
              )}

              <Pressable
                onPress={mode === 'signIn' ? handleSignIn : handleSignUp}
                disabled={loading}
                className="h-14 rounded-xl bg-primary items-center justify-center flex-row gap-2"
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text
                    className="text-on-primary text-base"
                    style={{ fontFamily: 'Inter_600SemiBold' }}
                  >
                    {mode === 'signIn' ? 'Sign In' : 'Create Account'}
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => { resetForm(); setMode('idle'); }}
                className="mt-4 items-center"
              >
                <Text
                  className="text-primary text-sm"
                  style={{ fontFamily: 'Inter_500Medium' }}
                >
                  Back
                </Text>
              </Pressable>
            </>
          )}
        </View>

        <View className="items-center pb-4">
          <Text className="text-on-surface-variant text-xs" style={{ fontFamily: 'Inter' }}>
            Secured with end-to-end encryption
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
