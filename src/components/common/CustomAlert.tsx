import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import { typography } from '../../styles/typography';
import { dimensions } from '../../styles/dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: screenWidth } = Dimensions.get('window');

interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  buttons?: AlertButton[];
  icon?: string;
  iconColor?: string;
  onClose?: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
                                                          visible,
                                                          title,
                                                          message,
                                                          buttons = [{ text: '확인' }],
                                                          icon,
                                                          iconColor,
                                                          onClose,
                                                        }) => {
  const colors = useColors();

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  };

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case 'destructive':
        return {
          backgroundColor: colors.primary.coral,
          textColor: colors.text.white,
        };
      case 'cancel':
        return {
          backgroundColor: colors.background.cardSecondary,
          textColor: colors.text.secondary,
        };
      default:
        return {
          backgroundColor: colors.background.card,
          textColor: colors.text.primary,
        };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertContainer, { backgroundColor: colors.background.primary }]}>
          {icon && (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={icon}
                size={40}
                color={iconColor || colors.primary.coral}
              />
            </View>
          )}

          {title && (
            <Text style={[styles.title, { color: colors.text.primary }]}>
              {title}
            </Text>
          )}

          <Text style={[styles.message, { color: colors.text.secondary }]}>
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => {
              const buttonStyle = getButtonStyle(button.style);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    { backgroundColor: buttonStyle.backgroundColor },
                    buttons.length === 1 && styles.singleButton,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: buttonStyle.textColor },
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.xl,
  },
  alertContainer: {
    width: screenWidth - dimensions.spacing.xl * 2,
    maxWidth: 320,
    borderRadius: dimensions.borderRadius.xl,
    padding: dimensions.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: dimensions.spacing.lg,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    marginBottom: dimensions.spacing.md,
  },
  message: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: typography.sizes.md * 1.5,
    marginBottom: dimensions.spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: dimensions.spacing.md,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: dimensions.spacing.md,
    paddingHorizontal: dimensions.spacing.lg,
    borderRadius: dimensions.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  singleButton: {
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
});