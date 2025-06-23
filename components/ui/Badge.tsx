import { StyleSheet, Text, View } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  style?: object;
}

export function Badge({ text, variant = 'default', style }: BadgeProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return '#DEF7EC';
      case 'warning':
        return '#FEF3C7';
      case 'error':
        return '#FEE2E2';
      default:
        return '#EBF5FF';
    }
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#D97706';
      case 'error':
        return '#DC2626';
      default:
        return '#2563EB';
    }
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: getTextColor() },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});