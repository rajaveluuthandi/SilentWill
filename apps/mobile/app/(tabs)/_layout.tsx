import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4F46E5',
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#4F46E5',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'SilentWill',
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          headerTitle: 'About',
        }}
      />
    </Tabs>
  );
}
