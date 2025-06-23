import { StyleSheet, Text, View } from 'react-native';
import { ReactNode } from 'react';

interface NotificationBadgeProps {
  children: ReactNode;
  count: number;
}

export function NotificationBadge({ children, count }: NotificationBadgeProps) {
  if (count <= 0) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {children}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
  },
});