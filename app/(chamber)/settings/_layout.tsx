import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="appearance" />
    </Stack>
  );
} 