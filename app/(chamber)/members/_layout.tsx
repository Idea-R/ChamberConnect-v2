import { Stack } from 'expo-router';

export default function MembersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 18,
          color: '#1F2937',
        },
        headerTintColor: '#1F2937',
        headerBackVisible: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false // Will use tab header
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Member Details',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="add" 
        options={{ 
          title: 'Add Member',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="edit/[id]" 
        options={{ 
          title: 'Edit Member',
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
} 