import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '../../utils/auth';
import { Building2, Users, Settings, BarChart3, Calendar } from 'lucide-react-native';

export default function ChamberLayout() {
  const { isAuthenticated, currentChamber, user } = useAuth();

  // Redirect if not authenticated or no chamber selected
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!currentChamber) {
    return <Redirect href="/(auth)/chamber-select" />;
  }

  // Check if user has chamber admin privileges
  // TODO: Implement proper role checking from chamber_admins table
  const isAdmin = user?.chamberId === currentChamber.id;
  
  if (!isAdmin) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 90,
          paddingTop: 10,
          paddingBottom: 20,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter-Medium',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 18,
          color: '#1F2937',
        },
        headerTintColor: '#1F2937',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: `${currentChamber.name} - Dashboard`,
          tabBarIcon: ({ color, size }) => (
            <Building2 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'Members',
          headerTitle: 'Member Management',
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          headerTitle: 'Event Management',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          headerTitle: 'Chamber Analytics',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Chamber Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 