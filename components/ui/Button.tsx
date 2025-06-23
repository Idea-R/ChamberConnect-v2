import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: object;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  iconLeft,
  iconRight,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return '#E5E7EB';
    
    switch (variant) {
      case 'primary':
        return '#2563EB';
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
        return 'transparent';
      case 'danger':
        return '#DC2626';
      default:
        return '#2563EB';
    }
  };
  
  const getBorderColor = () => {
    if (disabled) return '#E5E7EB';
    
    switch (variant) {
      case 'primary':
        return '#2563EB';
      case 'secondary':
        return '#E5E7EB';
      case 'outline':
        return '#D1D5DB';
      case 'danger':
        return '#DC2626';
      default:
        return '#2563EB';
    }
  };
  
  const getTextColor = () => {
    if (disabled) return '#9CA3AF';
    
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return '#2563EB';
      case 'outline':
        return '#4B5563';
      case 'danger':
        return '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };
  
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12 };
      case 'medium':
        return { paddingVertical: 10, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 12, paddingHorizontal: 20 };
      default:
        return { paddingVertical: 10, paddingHorizontal: 16 };
    }
  };
  
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 16;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          ...getPadding(),
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
              },
            ]}
          >
            {title}
          </Text>
          {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});