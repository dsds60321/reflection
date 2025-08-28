import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';
import { dimensions } from './dimensions';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  screenPadding: {
    paddingHorizontal: dimensions.spacing.md,
    paddingTop: dimensions.spacing.lg,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: dimensions.borderRadius.lg,
    padding: dimensions.spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    borderRadius: dimensions.borderRadius.xl,
    paddingVertical: dimensions.spacing.md,
    paddingHorizontal: dimensions.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.white,
  },
});