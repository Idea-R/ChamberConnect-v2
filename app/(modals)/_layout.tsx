import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="create-post" />
      <Stack.Screen name="service-request" />
      <Stack.Screen name="member-details" />
    </Stack>
  );
}